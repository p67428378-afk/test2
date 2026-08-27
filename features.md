# Project Features

## SCRUM-177 - Tip Calculator with Custom Tip Percentages and Bill Splitting

### Feature Summary
A tip calculator application enabling users to enter bill totals, select preset or custom tip percentages, split costs across multiple people, and view accurate per-person and overall totals.

### Key Features
- Positive bill amount input with standard preset tip buttons (10%, 15%, 18%, 20%) and custom percentage input (0% to 100%)
- Bill splitting across multiple people (default: 1) with per-person tip, per-person total, total tip, and total bill calculations rounded to standard currency decimal places
- Full-Stack REST calculation endpoint (POST /api/v1/calculate-tip) using Pydantic schema validation
- Responsive React + Tailwind CSS interface featuring a reset button and clean formatting
