from typing import Dict, Any
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from server.models import Group, Expense


class SettlementService:
    @staticmethod
    def calculate_group_settlements(db: Session, group_id: str) -> Dict[str, Any]:
        group = (
            db.query(Group)
            .options(
                joinedload(Group.members),
                joinedload(Group.expenses).joinedload(Expense.splits),
            )
            .filter(Group.id == group_id)
            .first()
        )

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Group with ID {group_id} not found.",
            )

        balances_cents: Dict[str, int] = {m.id: 0 for m in group.members}

        # Calculate net balances from all expenses in the group
        for expense in group.expenses:
            payer_id = expense.payer_id
            if payer_id in balances_cents:
                total_cents = int(round(float(expense.total_amount) * 100))
                balances_cents[payer_id] += total_cents

            for split in expense.splits:
                if split.member_id in balances_cents:
                    split_cents = int(round(float(split.computed_amount) * 100))
                    balances_cents[split.member_id] -= split_cents

        # Build balances list
        balances_list = []
        debtors = []  # list of [member_id, name, amount_cents_owed]
        creditors = []  # list of [member_id, name, amount_cents_due]

        for member in group.members:
            net_cents = balances_cents.get(member.id, 0)
            net_balance = round(net_cents / 100.0, 2)
            balances_list.append(
                {
                    "member_id": member.id,
                    "member_name": member.name,
                    "net_balance": net_balance,
                }
            )

            if net_cents < 0:
                debtors.append(
                    {
                        "member_id": member.id,
                        "name": member.name,
                        "amount": abs(net_cents),
                    }
                )
            elif net_cents > 0:
                creditors.append(
                    {
                        "member_id": member.id,
                        "name": member.name,
                        "amount": net_cents,
                    }
                )

        # Greedy settlement simplification
        settlements_list = []

        while debtors and creditors:
            # Sort descending by amount
            debtors.sort(key=lambda x: x["amount"], reverse=True)
            creditors.sort(key=lambda x: x["amount"], reverse=True)

            d = debtors[0]
            c = creditors[0]

            settle_cents = min(d["amount"], c["amount"])
            settle_amount = round(settle_cents / 100.0, 2)

            if settle_amount > 0:
                settlements_list.append(
                    {
                        "from_member": d["name"],
                        "to_member": c["name"],
                        "amount": settle_amount,
                        "from_member_id": d["member_id"],
                        "to_member_id": c["member_id"],
                    }
                )

            d["amount"] -= settle_cents
            c["amount"] -= settle_cents

            if d["amount"] == 0:
                debtors.pop(0)
            if c["amount"] == 0:
                creditors.pop(0)

        return {
            "group_id": group.id,
            "balances": balances_list,
            "settlements": settlements_list,
        }
