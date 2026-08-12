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

## SCRUM-39 — Real-Time Train Tracking Application
- **Summary:** # Real-Time Train Tracking Application
- **Tables:** stations, routes, trains, schedules, location_logs, delay_alerts
- **Endpoints:**
- GET /api/v1/trains
- GET /api/v1/trains/{train_id}
- GET /api/v1/stations
- GET /api/v1/stations/{station_id}/schedules
- GET /api/v1/delays (+2 more)
- **Full spec:** https://bfsi-na-ai-engineering-v4.atlassian.net/wiki/spaces/SCRUM2/pages/6914051/SCRUM-39+Feature+Specification
