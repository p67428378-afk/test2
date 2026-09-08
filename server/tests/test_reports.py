def test_summary_analytics(client, auth_headers):
    cats_res = client.get("/api/v1/categories", headers=auth_headers)
    cat_food = [c for c in cats_res.json() if "Food" in c["name"]][0]
    cat_trans = [c for c in cats_res.json() if "Transport" in c["name"]][0]
    cat_salary = [c for c in cats_res.json() if "Salary" in c["name"]][0]

    # Post Income
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 5000.0,
            "date": "2026-05-01",
            "transaction_type": "Income",
            "category_id": cat_salary["id"],
            "payment_method": "Bank Transfer",
            "description": "Salary May",
        },
    )
    # Post Expenses
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 1200.0,
            "date": "2026-05-05",
            "transaction_type": "Expense",
            "category_id": cat_food["id"],
            "payment_method": "Credit Card",
            "description": "Groceries & Dining",
        },
    )
    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 600.0,
            "date": "2026-05-10",
            "transaction_type": "Expense",
            "category_id": cat_trans["id"],
            "payment_method": "Credit Card",
            "description": "Gas & Metro",
        },
    )

    res = client.get(
        "/api/v1/reports/summary?start_date=2026-05-01&end_date=2026-05-31",
        headers=auth_headers,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total_income"] == 5000.0
    assert data["total_expense"] == 1800.0
    assert data["net_balance"] == 3200.0

    breakdown = data["category_breakdown"]
    assert len(breakdown) == 2
    # Food is 1200 / 1800 = 66.67%
    food_item = [b for b in breakdown if b["category_name"] == cat_food["name"]][0]
    assert food_item["amount"] == 1200.0
    assert food_item["percentage"] == round((1200.0 / 1800.0) * 100, 2)

    # Transport is 600 / 1800 = 33.33%
    trans_item = [b for b in breakdown if b["category_name"] == cat_trans["name"]][0]
    assert trans_item["amount"] == 600.0
    assert trans_item["percentage"] == round((600.0 / 1800.0) * 100, 2)


def test_export_csv_report(client, auth_headers):
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[0]["id"]

    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 75.0,
            "date": "2026-05-12",
            "transaction_type": "Expense",
            "category_id": cat_id,
            "payment_method": "Credit Card",
            "description": "Export Test Expense",
        },
    )

    res = client.get(
        "/api/v1/reports/export?format=csv&start_date=2026-05-01&end_date=2026-05-31",
        headers=auth_headers,
    )
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    assert (
        "attachment; filename=expense_report.csv" in res.headers["content-disposition"]
    )
    csv_text = res.text
    assert "EXPENSE TRACKER FINANCIAL REPORT" in csv_text
    assert "Financial Summary" in csv_text
    assert "Export Test Expense" in csv_text


def test_export_pdf_report(client, auth_headers):
    cats_res = client.get("/api/v1/categories?type=Expense", headers=auth_headers)
    cat_id = cats_res.json()[0]["id"]

    client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "amount": 88.0,
            "date": "2026-05-14",
            "transaction_type": "Expense",
            "category_id": cat_id,
            "payment_method": "Cash",
            "description": "PDF Test Expense",
        },
    )

    res = client.get(
        "/api/v1/reports/export?format=pdf&start_date=2026-05-01&end_date=2026-05-31",
        headers=auth_headers,
    )
    assert res.status_code == 200
    assert "application/pdf" in res.headers["content-type"]
    assert (
        "attachment; filename=expense_report.pdf" in res.headers["content-disposition"]
    )
    content = res.content
    assert len(content) > 0
    assert content.startswith(b"%PDF")


def test_export_invalid_format(client, auth_headers):
    res = client.get("/api/v1/reports/export?format=docx", headers=auth_headers)
    assert res.status_code == 400
    assert "detail" in res.json()
