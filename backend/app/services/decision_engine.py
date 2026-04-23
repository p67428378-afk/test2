from app.schemas.applicant import ApplicantCreate

def get_decision(applicant: ApplicantCreate):
    credit_score = applicant.credit_score
    annual_income = applicant.annual_income
    employment_status = applicant.employment_status

    if credit_score < 600:
        return "Rejected", None, "Your application has been rejected due to a low credit score."

    if credit_score >= 700 and annual_income >= 50000 and employment_status == "Employed":
        decision = "Approved"
        message = "Congratulations! Your application has been approved."
        credit_limit = assign_credit_limit(credit_score, annual_income)
        return decision, credit_limit, message

    if 600 <= credit_score < 700 and annual_income < 50000:
        return "Referred", None, "Your application has been referred for manual review."

    # Default to referred for other cases
    return "Referred", None, "Your application has been referred for manual review."

def assign_credit_limit(credit_score: int, annual_income: float):
    if credit_score >= 750 and annual_income >= 100000:
        return 10000.0
    elif credit_score >= 700 and annual_income >= 75000:
        return 5000.0
    elif credit_score >= 700 and annual_income >= 50000:
        return 2500.0
    elif credit_score >= 650 and annual_income >= 50000:
        return 2500.0
    else:
        return 1000.0  # Default lowest limit for approved applications
