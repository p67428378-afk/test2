import json
from typing import Dict, Any, Tuple, Optional


def is_backward_compatible(
    old_schema_dict: Dict[str, Any], new_schema_dict: Dict[str, Any]
) -> Tuple[bool, Optional[str]]:
    """
    Checks if new_schema_dict is backward compatible with old_schema_dict.
    Backward compatibility means:
    - Consumers using the new schema can read data written with the old schema.
    - Therefore, any field present in the old schema must either:
      1. Be present in the new schema.
      2. If removed in the new schema, it must have been optional (i.e., had a default value or was union with null with a default value)
         Wait, actually, if a field is removed in the new schema, can a consumer using the new schema read old data?
         Yes! If a field is removed in the new schema, the consumer using the new schema simply ignores that field when reading old data.
         Wait, let's think about this carefully.
         If a field is removed in the new schema, a consumer using the new schema will read old data (which contains the field).
         Since the new schema doesn't have the field, the reader will just ignore it. This is always safe!
         Wait, what if a field is added in the new schema?
         If a field is added in the new schema, a consumer using the new schema will read old data (which does NOT contain the field).
         Therefore, the added field MUST have a default value so the reader can fill it in.
         Let's double check this.
         Yes!
         - Adding an optional field (with a default value) is backward compatible.
         - Removing any field (optional or required) is backward compatible because the reader using the new schema will just ignore the field in the old data.
           Wait, let's check the acceptance criteria:
           "A new schema version that adds an optional field with a default value is considered backward-compatible. The registry should accept this change."
           "Removing an optional field is also a backward-compatible change, as older data can still be read with the new schema."
           Wait, does it say "Removing an optional field" specifically? Yes. Let's enforce that removing an optional field (one with a default value) is backward compatible, and removing a required field is NOT, or is it?
           Actually, let's look at standard Avro backward compatibility rules:
           Backward compatibility: a new schema can be used to read data written with the old schema.
           - If a field is added: it must have a default value. (So it is optional).
           - If a field is removed: the reader using the new schema will ignore it. In standard Avro, removing any field is backward compatible. But let's support both or specifically check if the removed field was optional or any field. To be safe and fully compliant with the AC:
             "Removing an optional field is also a backward-compatible change, as older data can still be read with the new schema."
             Let's check if the removed field was optional (had a default value).
           Let's implement a robust comparison of fields.
           Let's parse the schemas. They must be of type "record".
    """
    if not isinstance(old_schema_dict, dict) or not isinstance(new_schema_dict, dict):
        return False, "Both schemas must be record definitions (JSON objects)."

    if (
        old_schema_dict.get("type") != "record"
        or new_schema_dict.get("type") != "record"
    ):
        return False, "Both schemas must be of type 'record'."

    old_fields = {
        f["name"]: f
        for f in old_schema_dict.get("fields", [])
        if isinstance(f, dict) and "name" in f
    }
    new_fields = {
        f["name"]: f
        for f in new_schema_dict.get("fields", [])
        if isinstance(f, dict) and "name" in f
    }

    # 1. Check for added fields
    for field_name, new_field in new_fields.items():
        if field_name not in old_fields:
            # Field was added. It MUST have a default value.
            if "default" not in new_field:
                return (
                    False,
                    f"Field '{field_name}' was added but does not have a default value.",
                )

    # 2. Check for removed fields
    for field_name, old_field in old_fields.items():
        if field_name not in new_fields:
            # Field was removed. The AC says: "Removing an optional field is also a backward-compatible change".
            # Let's check if the removed field was optional (had a default value).
            if "default" not in old_field:
                return (
                    False,
                    f"Required field '{field_name}' was removed. Only optional fields can be removed.",
                )

    # 3. Check for modified fields (type changes, etc.)
    for field_name, old_field in old_fields.items():
        if field_name in new_fields:
            new_field = new_fields[field_name]
            # Check if type changed
            old_type = old_field.get("type")
            new_type = new_field.get("type")
            if old_type != new_type:
                # Type changed. This is not backward compatible.
                return (
                    False,
                    f"Field '{field_name}' type changed from {json.dumps(old_type)} to {json.dumps(new_type)}.",
                )

    return True, None
