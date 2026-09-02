# Project Features

## SCRUM-205 - Customizable Password & Secure Key Generator with Authentication, Analytics, Local History & Bulk Export

### Feature Summary
Allows users to register an account, log in, generate customizable cryptographically secure passwords/keys with entropy analytics, export options, and session history.

### Key Features
- Password Length Customization (8 to 128 characters)
- Character Set Selection & Complexity Controls
- Cryptographically Secure Password Generation (Python secrets module)
- One-Click Secure Clipboard Copying
- Entropy & Crack-Time Calculator (NIST / zxcvbn)
- Local Session History (Zero-Persistence Vault)
- Batch / Bulk Generation & Export (.env, .csv, .json)
- Unified Tabbed Auth UI (Login & Signup Pages)
- User Self-Registration API Endpoint (POST /api/v1/auth/signup)
- Pydantic Validation Schemas & Data Layer (UserCreate, UserResponse, create_user CRUD)
