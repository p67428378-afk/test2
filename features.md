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
