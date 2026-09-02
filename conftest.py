import os

os.environ["TESTING"] = "true"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from server.conftest import client, db, setup_test_db  # noqa: F401
