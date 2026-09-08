from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session, joinedload

from server.database import get_db
from server.models import User, Transaction
from server.schemas import AnalyticsSummary, CategoryBreakdownItem
from server.auth import get_current_user
from server.services.report_generator import generate_csv_report, generate_pdf_report

router = APIRouter()


def _compute_summary_data(
    current_user: User,
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> dict:
    query = (
        db.query(Transaction)
        .options(joinedload(Transaction.category))
        .filter(Transaction.user_id == current_user.id)
    )

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.order_by(Transaction.date.asc()).all()

    total_income = sum(t.amount for t in transactions if t.transaction_type == "Income")
    total_expense = sum(
        t.amount for t in transactions if t.transaction_type == "Expense"
    )
    net_balance = total_income - total_expense

    # Group expenses by category
    expense_by_cat = {}
    for t in transactions:
        if t.transaction_type == "Expense":
            cat_name = t.category.name if t.category else "Uncategorized"
            expense_by_cat[cat_name] = expense_by_cat.get(cat_name, 0.0) + t.amount

    category_breakdown = []
    for cat_name, amt in expense_by_cat.items():
        pct = round((amt / total_expense * 100), 2) if total_expense > 0 else 0.0
        category_breakdown.append(
            {
                "category_name": cat_name,
                "amount": round(amt, 2),
                "percentage": pct,
            }
        )

    # Sort categories by amount descending
    category_breakdown.sort(key=lambda x: x["amount"], reverse=True)

    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net_balance": round(net_balance, 2),
        "category_breakdown": category_breakdown,
        "transactions": transactions,
    }


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(
    start_date: Optional[date] = Query(
        None, description="Start date filter YYYY-MM-DD"
    ),
    end_date: Optional[date] = Query(None, description="End date filter YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = _compute_summary_data(current_user, db, start_date, end_date)
    return AnalyticsSummary(
        total_income=data["total_income"],
        total_expense=data["total_expense"],
        net_balance=data["net_balance"],
        category_breakdown=[
            CategoryBreakdownItem(**item) for item in data["category_breakdown"]
        ],
    )


@router.get("/export")
def export_report(
    format: str = Query("csv", description="Export format: 'csv' or 'pdf'"),
    start_date: Optional[date] = Query(
        None, description="Start date filter YYYY-MM-DD"
    ),
    end_date: Optional[date] = Query(None, description="End date filter YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    format_lower = format.lower()
    if format_lower not in ["csv", "pdf"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported export format. Supported formats are 'csv' and 'pdf'",
        )

    data = _compute_summary_data(current_user, db, start_date, end_date)
    transactions = data["transactions"]

    if format_lower == "csv":
        csv_content = generate_csv_report(transactions, data)
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=expense_report.csv"},
        )
    else:
        pdf_bytes = generate_pdf_report(
            transactions,
            data,
            start_date=str(start_date) if start_date else None,
            end_date=str(end_date) if end_date else None,
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=expense_report.pdf"},
        )
