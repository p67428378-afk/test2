
from datetime import date
from sqlalchemy.orm import Session
from backend.app.models.transaction import Transaction
from backend.app.schemas.statement import Statement
from fastapi.responses import StreamingResponse
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import openpyxl

def get_transactions(db: Session, account_number: str, start_date: date, end_date: date):
    return db.query(Transaction).filter(
        Transaction.account_number == account_number,
        Transaction.date >= start_date,
        Transaction.date <= end_date
    ).all()

def generate_pdf_statement(statement: Statement):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, f"Statement for Account: {statement.account_number}")
    p.drawString(100, 735, f"Period: {statement.start_date} to {statement.end_date}")
    p.drawString(100, 700, f"Opening Balance: {statement.opening_balance}")
    p.drawString(100, 685, f"Closing Balance: {statement.closing_balance}")
    y = 650
    for t in statement.transactions:
        p.drawString(100, y, f"{t.date} - {t.description} - {t.type}: {t.amount}")
        y -= 15
    p.showPage()
    p.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=statement.pdf"})

def generate_excel_statement(statement: Statement):
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = "Bank Statement"
    sheet.append(["Account Number", statement.account_number])
    sheet.append(["Period", f"{statement.start_date} to {statement.end_date}"])
    sheet.append(["Opening Balance", statement.opening_balance])
    sheet.append(["Closing Balance", statement.closing_balance])
    sheet.append(["Date", "Description", "Type", "Amount"])
    for t in statement.transactions:
        sheet.append([t.date, t.description, t.type, t.amount])
    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": "attachment; filename=statement.xlsx"})

def populate_db(db: Session):
    if db.query(Transaction).count() == 0:
        transactions = [
            Transaction(id="1", account_number="1234567890", date=date(2023, 1, 5), description="Salary", amount=5000, type="credit"),
            Transaction(id="2", account_number="1234567890", date=date(2023, 1, 10), description="Rent", amount=1500, type="debit"),
            Transaction(id="3", account_number="1234567890", date=date(2023, 1, 15), description="Groceries", amount=200, type="debit"),
            Transaction(id="4", account_number="1234567890", date=date(2023, 1, 25), description="Freelance Payment", amount=1000, type="credit"),
        ]
        db.add_all(transactions)
        db.commit()
