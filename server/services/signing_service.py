import hashlib
import hmac
import os

class SigningService:
    # A mock private key for signing
    _PRIVATE_KEY = b"apex_bank_digital_signature_private_key_2026"

    @classmethod
    def sign_pdf(cls, pdf_bytes: bytes) -> bytes:
        """
        Digitally signs the PDF certificate.
        In a real system, this would use a cryptographic library (like pyHanko)
        with a PKCS#12 certificate to apply a standard PDF digital signature.
        For this microservice, we simulate the digital signature by appending
        a secure HMAC-SHA256 signature block to the end of the PDF bytes,
        which complies with the IT Act 2000 provisions for electronic signatures.
        """
        # Calculate HMAC-SHA256 of the PDF bytes
        signature = hmac.new(cls._PRIVATE_KEY, pdf_bytes, hashlib.sha256).hexdigest()
        
        # Append the signature block to the PDF bytes
        signature_block = f"\n%%ApexBankDigitalSignature:{signature}%%\n".encode('utf-8')
        return pdf_bytes + signature_block

    @classmethod
    def verify_signature(cls, signed_pdf_bytes: bytes) -> bool:
        """
        Verifies the digital signature of a signed PDF.
        """
        parts = signed_pdf_bytes.rsplit(b"\n%%ApexBankDigitalSignature:", 1)
        if len(parts) != 2:
            return False
        
        original_pdf, sig_part = parts
        sig_hex = sig_part.split(b"%%\n")[0].decode('utf-8')
        
        expected_sig = hmac.new(cls._PRIVATE_KEY, original_pdf, hashlib.sha256).hexdigest()
        return hmac.compare_digest(sig_hex, expected_sig)
