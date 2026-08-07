import sys

# Ensure pydantic.v1 is populated or mocked
try:
    import pydantic.v1 as v1
except ImportError:
    import types

    v1 = types.ModuleType("pydantic.v1")
    sys.modules["pydantic.v1"] = v1

if not hasattr(v1, "BaseModel"):

    class DummyBaseModel:
        pass

    v1.BaseModel = DummyBaseModel
