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

## SCRUM-650 — Library Management System: Book & Member Management, Borrowing, Fines & Reminders

### Feature Summary
Library Management System: Book & Member Management, Borrowing, Fines & Reminders

### User Stories
# Library Management System: Book & Member Management, Borrowing, Fines & Reminders

**Objective:**  
Provide a comprehensive Library Management System that enables librarians to manage inventory and user accounts while empowering members to search, borrow, and return books seamlessly.  
The system automates overdue fine calculations and scheduled due-date reminders to improve library efficiency and member engagement.

**Key Features:**  
- **Book & Member Management:** Full CRUD capabilities for librarians to handle book cataloging and member profiles.  
- **Catalog Search & Availability:** Real-time search by title, author, category, or ISBN with copy-level tracking.  
- **Borrowing & Return Processing:** Automated check-out and check-in workflows with status tracking.  
- **Overdue Fine Calculation:** Automatic daily fine computation for late returns based on configurable daily rates.  
- **Due-Date & Overdue Notifications:** Automated reminder alerts sent prior to due dates and upon overdue status.  

**Description:**  
As a Librarian and Library Member,  
I want a centralized web application to manage books, track member borrowings, search the catalog, calculate overdue fines, and receive timely due-date reminders,  
So that library operations run efficiently, books are returned on time, and members have a seamless borrowing experience.

---

### **Acceptance Criteria:**

1. **Book & Member Inventory Management (Librarian Admin):**  
   - **Explanation:** Librarians can create, view, update, and soft-delete book records (Title, Author, ISBN, Category, Total Copies, Available Copies) and member profiles (Name, Email, Phone, Membership Status) through an administrative dashboard.  
   - **Example:** A librarian adds "The Great Gatsby" with ISBN `9780743273565` and 5 copies. The system initializes Available Copies to 5 and sets status to "Available".  
   - **Edge Cases:** Attempting to delete or deactivate a book with active loans is blocked with a validation error until all copies are returned.

2. **Catalog Search & Book Borrowing:**  
   - **Explanation:** Members can search the catalog using search terms (Title, Author, Genre, ISBN) and filter by availability. Members can check out available books, creating a loan record with a 14-day borrowing duration and updating availability.  
   - **Example:** A member searches for "Python", selects an available copy, and clicks "Borrow". The system sets the due date to 14 days from today and decrements available copies from 3 to 2.  
   - **Edge Cases:** When available copies equal 0, the "Borrow" button is disabled. Concurrent checkout attempts on the last copy are processed atomically to prevent negative copy counts.

3. **Book Return & Overdue Fine Calculation:**  
   - **Explanation:** Librarians or members can initiate book returns. The system compares the return timestamp with the due date. If overdue, it computes fines at a standard rate of $0.50 per overdue day and records the fine against the member's account.  
   - **Example:** A book due on Oct 1st is returned on Oct 5th (4 days late). The system automatically records a $2.00 fine ($0.50 × 4 days) on the member's profile.  
   - **Edge Cases:** Returns on or before the due date result in $0 fine. A configurable maximum fine cap (e.g., $15.00 or book replacement cost) limits cumulative daily accruals.

4. **Automated Due-Date & Overdue Reminders:**  
   - **Explanation:** A scheduled background process checks active loans daily and sends notification reminders to members 48 hours and 24 hours prior to the due date, as well as an immediate alert when a book becomes overdue.  
   - **Example:** For a loan due Friday at 5:00 PM, an email reminder is automatically dispatched on Wednesday and Thursday.  
   - **Edge Cases:** If a book is returned before a scheduled reminder executes, remaining reminders for that specific loan are automatically cancelled.

5. **Full-Stack REST API & User Interface Integration:**  
   - **Explanation:** The React 18 + Tailwind CSS frontend interacts with FastAPI RESTful endpoints (`/api/v1/books`, `/api/v1/members`, `/api/v1/loans`, `/api/v1/fines`) using Axios, with standard HTTP status codes, structured error payloads, and list pagination (`skip`, `limit`).  
   - **Example:** GET `/api/v1/books?skip=0&limit=10` returns a JSON array of 10 book objects with HTTP 200 OK.  
   - **Edge Cases:** Network disconnects or API error responses (e.g., 404, 500) trigger user-friendly toast notifications on the UI rather than breaking the application state.

---

### **Technical Requirements:**
- **Backend Stack:** Python 3.11, FastAPI, SQLAlchemy 2.x, PostgreSQL (Production) / SQLite (Tests).  
- **Frontend Stack:** React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router.  
- **Database Schema:** Tables for `books`, `members`, `loans` (`borrowed_at`, `due_date`, `returned_at`), and `fines` (`amount`, `status`, `paid_at`).  
- **Background Tasks:** Fast API BackgroundTasks or scheduled worker for daily reminder processing.  
- **API Endpoints:** RESTful routes following `/api/v1/{resource}` conventions.

### Acceptance Criteria
- 1. Book & Member Inventory Management (Librarian Admin): CRUD for books and members.
- 2. Catalog Search & Book Borrowing: Real-time search and 14-day checkout.
- 3. Book Return & Overdue Fine Calculation: Automatic fine calculation at $0.50/day.
- 4. Automated Due-Date & Overdue Reminders: Scheduled reminders at 48h, 24h, and on overdue.
- 5. Full-Stack REST API & User Interface Integration: React 18 + FastAPI integration via /api/v1.

### Backend Tasks
- None specified

### Frontend Tasks
- None specified

### Database Changes
Not yet authored.

### API Endpoints
- `GET /api/v1/books` — List & search books with pagination
- `POST /api/v1/books` — Create a new book entry
- `GET /api/v1/books/{id}` — Get detailed book info
- `PUT /api/v1/books/{id}` — Update book details
- `DELETE /api/v1/books/{id}` — Soft-delete a book record
- `GET /api/v1/members` — List members with pagination
- `POST /api/v1/members` — Register new member profile
- `POST /api/v1/loans/checkout` — Borrow an available book copy
- `POST /api/v1/loans/{id}/return` — Process book return & compute fine
- `GET /api/v1/fines/member/{member_id}` — Retrieve member fine history
- `POST /api/v1/fines/{id}/pay` — Pay/settle accrued fine

### UI Components
Not yet authored.

### Test Coverage
Not yet authored.

### Deployment Notes
Not yet authored.
