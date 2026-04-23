# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.application import Application  # noqa
from app.models.credit_card import CreditCard  # noqa
