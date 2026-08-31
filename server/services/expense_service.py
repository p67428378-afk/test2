from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from typing import List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from server.models import Group, Expense, ExpenseSplit
from server.schemas import ExpenseCreate


class ExpenseService:
    @staticmethod
    def calculate_splits(
        total_amount: float,
        split_type: str,
        splits_data: List[Dict[str, Any]],
        payer_id: str,
    ) -> List[Dict[str, Any]]:
        if total_amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Total expense amount must be greater than zero.",
            )

        if not splits_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one participant split must be provided.",
            )

        member_ids = [s["member_id"] for s in splits_data]
        if len(member_ids) != len(set(member_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate participant found in split allocations.",
            )

        split_type_normalized = split_type.upper()
        num_splits = len(splits_data)
        total_cents = int(round(total_amount * 100))
        computed_splits = []

        if split_type_normalized == "EQUAL":
            base_cents = total_cents // num_splits
            remainder_cents = total_cents % num_splits

            for i, split in enumerate(splits_data):
                extra = 1 if i < remainder_cents else 0
                allocated_cents = base_cents + extra
                computed_amount = allocated_cents / 100.0
                split_val = round(100.0 / num_splits, 2)
                computed_splits.append(
                    {
                        "member_id": split["member_id"],
                        "split_value": split_val,
                        "computed_amount": computed_amount,
                    }
                )

        elif split_type_normalized == "PERCENTAGE":
            total_percent = sum(
                float(s.get("split_value", 0.0) or 0.0) for s in splits_data
            )
            if abs(total_percent - 100.0) > 0.05:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Split percentages sum to {round(total_percent, 2)}%, but must equal 100%.",
                )

            running_cents = 0
            for split in splits_data:
                pct = float(split.get("split_value", 0.0) or 0.0)
                if pct < 0:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Percentage split cannot be negative.",
                    )
                # Compute cents based on total_cents and percentage
                cents = int(
                    Decimal(str(total_cents * pct / 100.0)).quantize(
                        Decimal("1"), rounding=ROUND_HALF_UP
                    )
                )
                running_cents += cents
                computed_splits.append(
                    {
                        "member_id": split["member_id"],
                        "split_value": round(pct, 2),
                        "computed_amount": cents / 100.0,
                    }
                )

            # Reconcile penny difference if any
            penny_diff = total_cents - running_cents
            if penny_diff != 0 and computed_splits:
                first_cents = (
                    int(round(computed_splits[0]["computed_amount"] * 100)) + penny_diff
                )
                computed_splits[0]["computed_amount"] = first_cents / 100.0

        elif split_type_normalized == "FIXED":
            total_fixed = sum(
                float(s.get("split_value", 0.0) or 0.0) for s in splits_data
            )
            if abs(total_fixed - total_amount) > 0.01:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Fixed split amounts sum to {round(total_fixed, 2)}, but must equal total expense amount {total_amount}.",
                )

            for split in splits_data:
                val = float(split.get("split_value", 0.0) or 0.0)
                if val < 0:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Fixed split amount cannot be negative.",
                    )
                computed_splits.append(
                    {
                        "member_id": split["member_id"],
                        "split_value": round(val, 2),
                        "computed_amount": round(val, 2),
                    }
                )

            # Reconcile penny difference if floating point rounding slight mismatch
            sum_computed = round(sum(s["computed_amount"] for s in computed_splits), 2)
            diff = round(total_amount - sum_computed, 2)
            if diff != 0 and computed_splits:
                computed_splits[0]["computed_amount"] = round(
                    computed_splits[0]["computed_amount"] + diff, 2
                )

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid split type '{split_type}'. Supported: EQUAL, PERCENTAGE, FIXED.",
            )

        return computed_splits

    @staticmethod
    def create_expense(db: Session, expense_data: ExpenseCreate) -> Expense:
        group = db.query(Group).filter(Group.id == expense_data.group_id).first()
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Group with ID {expense_data.group_id} not found.",
            )

        member_ids_in_group = {m.id for m in group.members}
        if expense_data.payer_id not in member_ids_in_group:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payer ID {expense_data.payer_id} is not a member of group {expense_data.group_id}.",
            )

        splits_dicts = [
            {"member_id": s.member_id, "split_value": s.split_value}
            for s in expense_data.splits
        ]
        for s in splits_dicts:
            if s["member_id"] not in member_ids_in_group:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Participant ID {s['member_id']} is not a member of group {expense_data.group_id}.",
                )

        calculated_splits = ExpenseService.calculate_splits(
            total_amount=expense_data.total_amount,
            split_type=expense_data.split_type,
            splits_data=splits_dicts,
            payer_id=expense_data.payer_id,
        )

        expense_date = expense_data.expense_date or datetime.now(timezone.utc)
        expense = Expense(
            group_id=expense_data.group_id,
            title=expense_data.title,
            total_amount=expense_data.total_amount,
            payer_id=expense_data.payer_id,
            category=expense_data.category or "General",
            split_type=expense_data.split_type.upper(),
            expense_date=expense_date,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(expense)
        db.flush()

        for split_info in calculated_splits:
            split_record = ExpenseSplit(
                expense_id=expense.id,
                member_id=split_info["member_id"],
                split_value=split_info["split_value"],
                computed_amount=split_info["computed_amount"],
                created_at=datetime.now(timezone.utc),
            )
            db.add(split_record)

        return expense
