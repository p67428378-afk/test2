from sqlalchemy.orm import Session
from server.app.models import GuardrailRule, ScenarioModel


class GuardrailException(Exception):
    def __init__(self, message: str):
        self.message = message


def evaluate_guardrails(
    scenario: ScenarioModel, db: Session, override: bool = False
) -> str:
    """
    Evaluates active guardrail rules for the given scenario model.
    Returns guardrails status string ('PASSED' or 'PASSED_WITH_OVERRIDE') or raises GuardrailException.
    """
    rules = db.query(GuardrailRule).filter(GuardrailRule.is_active == True).all()

    violations = []

    # Check Private Brand Share >= 25.0%
    for rule in rules:
        if (
            rule.rule_name == "MIN_PRIVATE_BRAND_SHARE"
            or rule.metric_key == "private_brand_mix_pct"
        ):
            if (
                rule.operator == ">="
                and scenario.projected_private_brand_pct < rule.threshold_value
            ):
                violations.append(
                    f"Private Brand Share {scenario.projected_private_brand_pct}% is below minimum threshold of {rule.threshold_value}%."
                )

        if (
            rule.rule_name == "MAX_SHELF_CAPACITY"
            or rule.metric_key == "shelf_capacity_impact_pct"
        ):
            if (
                rule.operator == "<="
                and scenario.shelf_capacity_impact_pct > rule.threshold_value
            ):
                violations.append(
                    f"Shelf Capacity Impact {scenario.shelf_capacity_impact_pct}% exceeds maximum threshold of {rule.threshold_value}%."
                )

    if violations:
        if override:
            return "PASSED_WITH_OVERRIDE"
        raise GuardrailException(f"Guardrail Check Failed: {' '.join(violations)}")

    return "PASSED"
