# Project Features

# SCRUM-638 Features

## Feature Summary
User Story: Library Management System

## User Stories
# User Story: Library Management System

**As a** library user (both librarian and member),
**I want** a comprehensive Library Management System,
**So that** librarians can efficiently manage the library's collection and members, and members can easily discover, borrow, and return books.

---

## Acceptance Criteria

### 1. User Roles & Permissions

*   **Explanation**: The system will have two main user roles: "Librarian" and "Member".
    *   **Librarians** have full administrative access to manage books, members, and borrowing records.
    *   **Members** have access to search for books, view their borrowing history, and manage their own account.
*   **Example**:
    *   A user with the "Librarian" role can add a new book to the system.
    *   A user with the "Member" role can view the library's book catalog but cannot add or delete books.

### 2. Book Management (Librarian)

*   **Explanation**: Librarians must be able to perform CRUD (Create, Read, Update, Delete) operations for books. Each book will have attributes such as Title, Author, ISBN, Genre, Publication Year, and number of available copies.
*   **Example**: A librarian can add a new copy of "The Great Gatsby", update its location, or remove a damaged book from the system.

### 3. Member Management (Librarian)

*   **Explanation**: Librarians must be able to perform CRUD operations for library members. Each member will have a unique ID, name, contact details, and membership status.
*   **Example**: A librarian can register a new member, update their phone number, or deactivate an expired membership.

### 4. Book Search & Discovery (Member)

*   **Explanation**: Members must be able to search the library catalog to find books. Search functionality should support filtering by title, author, genre, and ISBN.
*   **Example**: A member can search for all books in the "Science Fiction" genre written by "Isaac Asimov".

### 5. Book Borrowing & Returning (Member & Librarian)

*   **Explanation**: The system must manage the process of borrowing and returning books. When a book is borrowed, the system records the checkout date, due date, and the member who borrowed it. The number of available copies is updated.
*   **Example**: A member presents a book to the librarian, who scans it to mark it as "checked out" under that member's account. The due date is set for 14 days from the checkout date.

### 6. Overdue Fine Calculation

*   **Explanation**: The system will automatically calculate fines for overdue books. The standard fine will be $0.25 per day for each overdue book.
*   **Example**: If a book is returned 3 days after its due date, a fine of $0.75 is automatically added to the member's account.
*   **Edge Cases**: The system should not calculate fines for days the library is closed (e.g., public holidays).

### 7. Due-Date Reminders

*   **Explanation**: The system will send automated reminders to members about upcoming due dates. A reminder will be sent via email 3 days before the due date.
*   **Example**: If a book is due on March 15th, the system will automatically send an email reminder to the member on March 12th.

### 8. API Endpoints

*   **Explanation**: The system will expose a RESTful API for all functionalities.
*   **Example**:
    *   `GET /api/v1/books` - to retrieve a list of all books.
    *   `POST /api/v1/books` - for a librarian to add a new book.
    *   `GET /api/v1/members/{memberId}/loans` - for a member to view their borrowing history.
    *   `POST /api/v1/loans` - to record a new book loan.

### 9. Database Schema

*   **Explanation**: The system's database will include the following core tables:
    *   `Books`: Stores book information (BookID, Title, Author, ISBN, Genre, etc.).
    *   `Members`: Stores member information (MemberID, FirstName, LastName, Email, etc.).
    *   `Loans`: Records borrowing transactions (LoanID, BookID, MemberID, CheckoutDate, DueDate, ReturnDate).
    *   `Fines`: Tracks outstanding fines (FineID, LoanID, Amount, Status).

---

## Acceptance Criteria
- User Roles & Permissions
- Book Management (Librarian)
- Member Management (Librarian)
- Book Search & Discovery (Member)
- Book Borrowing & Returning (Member & Librarian)
- Overdue Fine Calculation
- Due-Date Reminders
- API Endpoints
- Database Schema

## Backend Tasks
- None specified

## Frontend Tasks
- None specified

## Database Changes
Not yet authored.

## API Endpoints
Not yet authored.

## UI Components
Not yet authored.

## Test Coverage
Not yet authored.

## Deployment Notes
Not yet authored.

## SCRUM-642 — User Story: Inventory Management Module

### Feature Summary
User Story: Inventory Management Module

### User Stories

## User Story: Inventory Management Module

**As a** hospital administrator, **I want to** manage the hospital\'s inventory of medical supplies and equipment, **so that** we can ensure essential items are always in stock, track usage, and optimize procurement.

### Acceptance Criteria

#### **Frontend**
*   **Explanation**: The user interface should provide a dashboard to view and manage inventory. It should allow for adding, editing, and deleting inventory items. A search and filtering functionality should also be present.
*   **Example**: A hospital staff member can search for "sterile gloves," see the current stock level, and update the count after a new shipment arrives.
*   **Edge Cases**:
    *   If the search returns no results, a "No items found" message is displayed.
    *   Forms should have validation to prevent invalid data entry (e.g., negative stock quantities).

#### **Backend**
*   **Explanation**: The backend will provide APIs for all inventory management operations. It will handle the business logic for tracking stock levels, managing item data, and generating alerts for low stock.
*   **Example**: When a user updates the stock of an item, the backend validates the input, updates the database, and logs the transaction.
*   **Low Stock Alerts**: A system should be in place to automatically notify relevant personnel when the stock of an item falls below a predefined threshold.

#### **API**
*   **Explanation**: A RESTful API will be developed to expose inventory data and operations.
*   **Example**:
    *   `GET /api/v1/inventory`: Retrieves a list of all inventory items.
    *   `POST /api/v1/inventory`: Adds a new item to the inventory.
    *   `PUT /api/v1/inventory/{item_id}`: Updates an existing inventory item.
    *   `DELETE /api/v1/inventory/{item_id}`: Removes an item from the inventory.

#### **Database**
*   **Explanation**: The database will store all inventory-related data. A main `inventory_items` table will exist, with columns for item details.
*   **Example**: The `inventory_items` table will have columns such as `item_id` (UUID, Primary Key), `name` (String), `description` (Text), `quantity` (Integer), `unit` (String, e.g., "box", "piece"), `supplier` (String), `last_updated` (Timestamp).

### Acceptance Criteria
- **Frontend**: The user interface should provide a dashboard to view and manage inventory. It should allow for adding, editing, and deleting inventory items. A search and filtering functionality should also be present.
- **Backend**: The backend will provide APIs for all inventory management operations. It will handle the business logic for tracking stock levels, managing item data, and generating alerts for low stock.
- **API**: A RESTful API will be developed to expose inventory data and operations.
- **Database**: The database will store all inventory-related data. A main `inventory_items` table will exist, with columns for item details.

### Backend Tasks
- None specified

### Frontend Tasks
- None specified

### Database Changes
Not yet authored.

### API Endpoints
Not yet authored.

### UI Components
Not yet authored.

### Test Coverage
Not yet authored.

### Deployment Notes
Not yet authored.

## SCRUM-5 — Research Grant Management Portal - End-to-End Grant Lifecycle Management

### Feature Summary
Research Grant Management Portal - End-to-End Grant Lifecycle Management

### User Stories
# Research Grant Management Portal - End-to-End Grant Lifecycle Management

**Objective:**
Provide a centralized full-stack portal for researchers, reviewers, committees, and administrators to seamlessly manage research grants across proposal submission, evaluation, funding approval, milestone tracking, and financial utilization reporting.

**Key Features:**
- **Researcher Proposal Submission**: Draft, document upload, and submission workspace for Principal Investigators.
- **Reviewer & Committee Workspace**: Rubric-based scoring, reviewer comments, and committee funding decisions.
- **Post-Award Milestone Tracking**: Progress reporting, deliverable submission, and approval workflows.
- **Financial Utilization Reporting**: Budget vs. actual expense tracking across personnel, equipment, travel, and indirect costs.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions and security audit logging across all workflow stages.

**Description:**
As a Principal Investigator (Researcher), Reviewer, Committee Member, or Grant Administrator,  
I want a unified Research Grant Management Portal,  
So that we can streamline the end-to-end grant lifecycle from proposal submission and review to post-award milestone execution and financial accountability.

---

### Acceptance Criteria

- **Proposal Submission & Management:**
  - **Explanation**: Principal Investigators (PIs) can create, edit, save draft proposals, and submit research proposals containing project abstract, timeline, requested budget, co-investigator details, and supporting documentation (PDF/DOCX).
  - **Example**: A researcher creates a $150,000 grant proposal, attaches project methodology files, saves progress as a draft, and submits it prior to the grant cycle deadline.
  - **Edge Cases**: Attempting submission after a deadline or uploading files exceeding the 50MB file size limit triggers explicit form validation errors.

- **Reviewer Evaluation & Scoring:**
  - **Explanation**: Assigned reviewers access submitted proposals in a secure workspace, evaluate applications against standardized rubrics, assign scores (1-100), provide qualitative comments, and finalize reviews.
  - **Example**: A reviewer accesses an assigned proposal, completes rubrics across methodology, impact, and feasibility, enters scores, and submits the evaluation.
  - **Edge Cases**: Conflict of interest detection prevents reviewers from accessing or scoring proposals originating from their own department or co-authors.

- **Committee Approval & Award Setup:**
  - **Explanation**: Committee administrators review aggregated evaluation scores, conduct review meetings, approve or reject grant funding, set allocated budget amounts, and trigger award notifications.
  - **Example**: A committee member reviews top-ranked proposals, approves $120,000 for Proposal #GRANT-104, and automatically sends an award notification to the PI.
  - **Edge Cases**: Partial funding approvals require the PI to submit a revised budget before final award activation.

- **Post-Award Milestone Tracking:**
  - **Explanation**: Grantees submit milestone reports according to the agreed project schedule, uploading progress updates, research deliverables, and metric achievement proof.
  - **Example**: A grantee submits a Quarterly Milestone 1 report with research datasets, which is reviewed and approved by the grant officer.
  - **Edge Cases**: Overdue milestones automatically trigger escalation alerts to both the PI and the grant administrator.

- **Financial Utilization Reporting:**
  - **Explanation**: Grantees log expense items against allocated budget categories (Personnel, Equipment, Travel, Indirect), generate financial utilization reports, and track burn rates vs approved allocations.
  - **Example**: A grantee logs $25,000 in personnel expenses and $5,000 in equipment, generating a quarterly report showing 80% remaining budget.
  - **Edge Cases**: Expense submissions exceeding category line-item caps or total budget require administrative variance approval.

- **Role-Based Access Control & Security:**
  - **Explanation**: The system enforces strict RBAC for 4 user roles (Researcher/PI, Reviewer, Committee Member, Grant Admin), guaranteeing data isolation and least-privilege endpoint access.
  - **Example**: A reviewer can only view assigned proposals and cannot access financial reports or unassigned proposals.
  - **Edge Cases**: Unauthenticated requests or unauthorized role actions trigger 401 Unauthorized / 403 Forbidden HTTP responses with audit logging.

---

### Technical Requirements

- **Backend (Python 3.11 / FastAPI)**:
  - RESTful API design following `/api/v1/{resource}` structure (`/proposals`, `/evaluations`, `/awards`, `/milestones`, `/financial-reports`).
  - SQLAlchemy 2.x ORM with PostgreSQL database and UUID v4 primary keys.
  - UTC ISO 8601 timestamps (`created_at`, `updated_at`).
  - CORS middleware enabled for frontend dev server (`http://localhost:5173`).
- **Frontend (React 18 / Vite / Tailwind CSS)**:
  - Modular UI components for forms, dashboards, and reporting tables.
  - `react-router-dom` for navigation, Lucide icons, and Axios HTTP client integration via `VITE_API_BASE_URL`.
- **Security & Infrastructure**:
  - JWT authentication and role authorization middleware.
  - File upload validation (type & size limits).

### Acceptance Criteria
- Proposal Submission & Management: PIs can create, edit, save draft proposals, and submit research proposals containing project details and supporting files.
- Reviewer Evaluation & Scoring: Reviewers evaluate applications against rubrics, assign scores (1-100), and enter qualitative feedback with conflict-of-interest isolation.
- Committee Approval & Award Setup: Committee admins review aggregated scores, approve/reject funding, set allocations, and trigger award notifications.
- Post-Award Milestone Tracking: Grantees submit progress reports and deliverables according to schedule with automated escalation for overdue milestones.
- Financial Utilization Reporting: Expense logging against budget categories (Personnel, Equipment, Travel, Indirect) with burn rate tracking and line-item cap enforcement.
- Role-Based Access Control & Security: Enforced RBAC across 4 roles (Researcher, Reviewer, Committee Member, Grant Admin) with audit logging.

### Backend Tasks
- None specified

### Frontend Tasks
- None specified

### Database Changes
Not yet authored.

### API Endpoints
- `POST /api/v1/auth/login` — Authenticate user and issue JWT bearer token
- `GET /api/v1/proposals` — List proposals (PI sees own; Reviewer/Admin sees accessible)
- `POST /api/v1/proposals` — Create a new proposal draft
- `PUT /api/v1/proposals/{id}` — Update draft details or submit proposal
- `POST /api/v1/proposals/{id}/documents` — Upload methodology/proposal supporting files (Max 50MB)
- `GET /api/v1/evaluations` — List assigned evaluations (enforces COI check)
- `POST /api/v1/evaluations/{id}/score` — Submit rubric scores (1-100) and qualitative comments
- `POST /api/v1/awards/approve` — Approve funding, allocate budget, and trigger notification
- `GET /api/v1/milestones/{award_id}` — List project milestones and deliverables
- `POST /api/v1/milestones/{id}/submit` — Submit milestone progress report and proof files
- `POST /api/v1/financial-reports/expense` — Log line-item expense (Personnel, Equipment, Travel, Indirect)
- `GET /api/v1/financial-reports/{award_id}` — Fetch financial utilization report & burn rate analytics

### UI Components
Not yet authored.

### Test Coverage
Not yet authored.

### Deployment Notes
Not yet authored.
