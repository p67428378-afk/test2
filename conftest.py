import sqlalchemy
from sqlalchemy.pool import StaticPool

original_create_engine = sqlalchemy.create_engine

def patched_create_engine(*args, **kwargs):
    if len(args) > 0 and args[0] == "sqlite:///:memory:":
        kwargs["poolclass"] = StaticPool
    elif kwargs.get("url") == "sqlite:///:memory:":
        kwargs["poolclass"] = StaticPool
    return original_create_engine(*args, **kwargs)

sqlalchemy.create_engine = patched_create_engine
