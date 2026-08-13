import os
import json
import base64
import hashlib
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

# Secret key for AES encryption / SHA-256 HMAC (32 bytes)
SECRET_KEY = (
    os.getenv("TICKET_ENCRYPTION_KEY", "super-secret-festival-key-32bytes!!")
    .encode("utf-8")[:32]
    .ljust(32, b"0")
)


def generate_sha256_hash(data: str) -> str:
    """Generate SHA-256 signature hash for ticket payload verification."""
    return hashlib.sha256(
        (data + SECRET_KEY.decode("utf-8")).encode("utf-8")
    ).hexdigest()


def encrypt_qr_payload(ticket_code: str, tier: str = "General Admission") -> str:
    """Encrypt ticket info using AES-256-CBC and return base64 string with signature."""
    payload_data = json.dumps({"code": ticket_code, "tier": tier})
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(payload_data.encode("utf-8")) + padder.finalize()

    iv = os.urandom(16)
    cipher = Cipher(
        algorithms.AES(SECRET_KEY), modes.CBC(iv), backend=default_backend()
    )
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    encrypted_b64 = base64.b64encode(iv + ciphertext).decode("utf-8")
    sig = generate_sha256_hash(encrypted_b64)
    return f"{encrypted_b64}.{sig}"


def decrypt_and_extract_ticket_code(qr_payload: str) -> str:
    """
    Extract ticket_code from qr_payload.
    Supports:
    1. Base64 encrypted string format ("<encrypted>.<sig>")
    2. JSON string (e.g. '{"ticket_code": "T-99881"}')
    3. Plain code string (e.g. "T-99881")
    """
    if not qr_payload:
        raise ValueError("Empty QR payload")

    # Case 1: Encrypted token with signature
    if "." in qr_payload and not qr_payload.startswith("{"):
        parts = qr_payload.rsplit(".", 1)
        if len(parts) == 2:
            encrypted_b64, sig = parts
            expected_sig = generate_sha256_hash(encrypted_b64)
            if sig == expected_sig:
                try:
                    raw = base64.b64decode(encrypted_b64)
                    iv, ciphertext = raw[:16], raw[16:]
                    cipher = Cipher(
                        algorithms.AES(SECRET_KEY),
                        modes.CBC(iv),
                        backend=default_backend(),
                    )
                    decryptor = cipher.decryptor()
                    padded = decryptor.update(ciphertext) + decryptor.finalize()
                    unpadder = padding.PKCS7(128).unpadder()
                    data_str = (unpadder.update(padded) + unpadder.finalize()).decode(
                        "utf-8"
                    )
                    data = json.loads(data_str)
                    return data.get("code") or data.get("ticket_code") or qr_payload
                except Exception:
                    pass

    # Case 2: JSON payload
    if qr_payload.startswith("{"):
        try:
            data = json.loads(qr_payload)
            code = data.get("ticket_code") or data.get("code") or data.get("ticket_id")
            if code:
                return str(code)
        except Exception:
            pass

    # Case 3: Plain string code
    return qr_payload.strip()
