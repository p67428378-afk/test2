from server.compatibility import is_backward_compatible


def test_add_optional_field_with_default():
    old_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "user_id", "type": "string"},
        ],
    }
    new_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "user_id", "type": "string"},
            {"name": "session_id", "type": ["null", "string"], "default": None},
        ],
    }
    is_compat, err = is_backward_compatible(old_schema, new_schema)
    assert is_compat is True
    assert err is None


def test_add_required_field_without_default():
    old_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    new_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "user_id", "type": "string"},
        ],
    }
    is_compat, err = is_backward_compatible(old_schema, new_schema)
    assert is_compat is False
    assert "does not have a default value" in err


def test_remove_optional_field():
    old_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "session_id", "type": ["null", "string"], "default": None},
        ],
    }
    new_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    is_compat, err = is_backward_compatible(old_schema, new_schema)
    assert is_compat is True
    assert err is None


def test_remove_required_field():
    old_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [
            {"name": "event_id", "type": "string"},
            {"name": "user_id", "type": "string"},
        ],
    }
    new_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    is_compat, err = is_backward_compatible(old_schema, new_schema)
    assert is_compat is False
    assert "Only optional fields can be removed" in err


def test_field_type_change():
    old_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "string"}],
    }
    new_schema = {
        "type": "record",
        "name": "UserEvent",
        "namespace": "com.example",
        "fields": [{"name": "event_id", "type": "int"}],
    }
    is_compat, err = is_backward_compatible(old_schema, new_schema)
    assert is_compat is False
    assert "type changed" in err
