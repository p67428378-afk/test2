from typing import List, Dict, Any
from sqlalchemy.orm import Session
from server.models import Group, Expense, ExpenseSplit, SettlementTransaction
from server.schemas import ExpenseSplitInput


def calculate_splits(
    split_type: str, total_amount: float, splits_input: List[ExpenseSplitInput]
) -> List[Dict[str, Any]]:
    """Calculate individual share amounts and percentages based on split type."""
    n = len(splits_input)
    if n == 0:
        raise ValueError("At least one split participant is required.")

    total_cents = int(round(total_amount * 100))
    results = []

    if split_type == "EQUAL":
        base_cents = total_cents // n
        remainder = total_cents % n

        for i, split in enumerate(splits_input):
            share_cents = base_cents + (1 if i < remainder else 0)
            share_amount = round(share_cents / 100.0, 2)
            pct = round((share_amount / total_amount) * 100.0, 2)
            results.append({
                "member_id": split.member_id,
                "share_amount": share_amount,
                "percentage": pct,
            })

    elif split_type == "EXACT":
        sum_allocated = 0.0
        for split in splits_input:
            if split.share_amount is None or split.share_amount < 0:
                raise ValueError(f"Valid share_amount is required for member {split.member_id} in EXACT split.")
            sum_allocated += split.share_amount

        if abs(sum_allocated - total_amount) > 0.01:
            raise ValueError(
                f"Sum of exact shares (${sum_allocated:.2f}) must equal total amount (${total_amount:.2f})."
            )

        for split in splits_input:
            pct = round((split.share_amount / total_amount) * 100.0, 2)
            results.append({
                "member_id": split.member_id,
                "share_amount": round(split.share_amount, 2),
                "percentage": pct,
            })

    elif split_type == "PERCENTAGE":
        sum_pct = 0.0
        for split in splits_input:
            if split.percentage is None or split.percentage < 0:
                raise ValueError(f"Valid percentage is required for member {split.member_id} in PERCENTAGE split.")
            sum_pct += split.percentage

        if abs(sum_pct - 100.0) > 0.1:
            raise ValueError(f"Sum of percentages ({sum_pct:.2f}%) must equal 100%.")

        allocated_cents = 0
        raw_splits = []
        for split in splits_input:
            cents = int(round((split.percentage / 100.0) * total_cents))
            allocated_cents += cents
            raw_splits.append((split.member_id, cents, split.percentage))

        # Adjust penny discrepancy on the first item if rounding caused diff
        diff = total_cents - allocated_cents
        if diff != 0 and raw_splits:
            first_m, first_c, first_p = raw_splits[0]
            raw_splits[0] = (first_m, first_c + diff, first_p)

        for m_id, cents, pct in raw_splits:
            results.append({
                "member_id": m_id,
                "share_amount": round(cents / 100.0, 2),
                "percentage": round(pct, 2),
            })
    else:
        raise ValueError(f"Unsupported split type: {split_type}")

    return results


def calculate_group_balances(db: Session, group_id: str) -> Dict[str, Any]:
    """Calculate net balances and simplified debt matrix for all members in a group."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise ValueError(f"Group with id '{group_id}' not found.")

    members = group.members
    balances = {m.id: 0.0 for m in members}
    member_names = {m.id: m.name for m in members}

    # 1. Aggregate expenses
    expenses = db.query(Expense).filter(Expense.group_id == group_id).all()
    for exp in expenses:
        if exp.payer_id in balances:
            balances[exp.payer_id] += exp.total_amount
        for split in exp.splits:
            if split.member_id in balances:
                balances[split.member_id] -= split.share_amount

    # 2. Aggregate settlements
    settlements = db.query(SettlementTransaction).filter(SettlementTransaction.group_id == group_id).all()
    for st in settlements:
        if st.payer_id in balances:
            balances[st.payer_id] += st.amount
        if st.payee_id in balances:
            balances[st.payee_id] -= st.amount

    # Format net balances
    net_balances = [
        {
            "member_id": m_id,
            "member_name": member_names.get(m_id, "Unknown"),
            "net_balance": round(bal, 2),
        }
        for m_id, bal in balances.items()
    ]

    # 3. Simplify debts (greedy settlement algorithm)
    debtors = []
    creditors = []
    for m_id, bal in balances.items():
        rounded_bal = round(bal, 2)
        if rounded_bal < -0.005:
            debtors.append({"id": m_id, "name": member_names[m_id], "amount": -rounded_bal})
        elif rounded_bal > 0.005:
            creditors.append({"id": m_id, "name": member_names[m_id], "amount": rounded_bal})

    simplified_settlements = []
    while debtors and creditors:
        debtors.sort(key=lambda x: x["amount"], reverse=True)
        creditors.sort(key=lambda x: x["amount"], reverse=True)

        d = debtors[0]
        c = creditors[0]

        transfer = round(min(d["amount"], c["amount"]), 2)
        if transfer > 0.005:
            simplified_settlements.append({
                "from_member_id": d["id"],
                "from_member_name": d["name"],
                "to_member_id": c["id"],
                "to_member_name": c["name"],
                "amount": transfer,
            })

            d["amount"] = round(d["amount"] - transfer, 2)
            c["amount"] = round(c["amount"] - transfer, 2)

        if d["amount"] <= 0.005:
            debtors.pop(0)
        if c["amount"] <= 0.005:
            creditors.pop(0)

    return {
        "group_id": group_id,
        "net_balances": net_balances,
        "simplified_settlements": simplified_settlements,
    }
