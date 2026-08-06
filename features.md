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

## SCRUM-649 — Health Habits Learning Platform for Kids

### Feature Summary
Health Habits Learning Platform for Kids

### User Stories
# Health Habits Learning Platform for Kids

**Objective:**  
Provide an engaging, gamified health habit learning web application that empowers children to build healthy daily routines through interactive lessons and streak tracking.  
Ensure a COPPA-compliant, safe digital environment with parental consent controls and full-stack backend persistence.

**Key Features:**
- Interactive Kid-Friendly Dashboard with daily health habit tracking (nutrition, exercise, hygiene, sleep)
- Gamified Reward & Streak System with dynamic visual badges and progress milestones
- Educational Content & Interactive Lessons with fun quizzes and habit challenges
- Parental Consent & COPPA Security Controls for verifiable authorization and data protection
- RESTful API Backend & Database Persistence for real-time progress saving and cross-device sync

---

**Description:**  
As a **young learner (child) and parent**,  
I want **an interactive, gamified web platform to learn and log healthy daily habits with parental oversight**,  
So that **children can build lifelong healthy routines in a safe, fun, and privacy-compliant digital environment**.

---

**Acceptance Criteria:**

- **Interactive Health Habit Dashboard (Frontend):**
  - **Explanation**: The client interface must render a vibrant, kid-friendly dashboard displaying daily habit categories (Nutrition, Physical Activity, Personal Hygiene, and Rest/Sleep) with interactive completion toggles.
  - **Example**: A child clicks the "Drank 4 Glasses of Water" habit card; the UI updates instantly with a playful animation and play sound, marking today's habit as complete.
  - **Edge Cases**: Network disconnect during habit logging triggers an offline retry queue and notifies the user with a friendly error toast.

- **Daily Habit Tracking & Streak Engine (Backend & Integration):**
  - **Explanation**: The backend API must calculate active streaks and completion histories per user per habit, automatically updating streak length based on consecutive daily logs.
  - **Example**: If a user logs brushing teeth on Monday, Tuesday, and Wednesday, the streak count API returns `streak_length: 3` with an `active_streak: true` status.
  - **Edge Cases**: Logging a habit across midnight/timezone boundaries checks the user's localized date window to prevent breaking active streaks unfairly.

- **Gamification, Points & Badge Rewards (Full-Stack):**
  - **Explanation**: Completing habits and lessons awards points and unlocks achievement badges, stored in PostgreSQL and rendered dynamically on the child's profile.
  - **Example**: Reaching 100 habit points unlocks the "Health Hero" badge, displaying a celebratory modal on the frontend and saving the award timestamp in the database.
  - **Edge Cases**: Attempting to claim reward points for the same habit log twice in a single day is rejected with an HTTP 400 validation error.

- **Parental Consent & COPPA Compliance Controls (Security & Admin):**
  - **Explanation**: Registration for users under 13 requires verifiable parental consent before personal progress data is collected or displayed publicly.
  - **Example**: A parent completes account setup via email confirmation link, authorizing child profile creation and toggling data sharing preferences.
  - **Edge Cases**: Unverified accounts are restricted to read-only guest lesson mode with local non-persisted progress until parental verification succeeds.

- **RESTful API & Database Persistence (Backend Infrastructure):**
  - **Explanation**: FastAPI endpoints under `/api/v1/habits` and `/api/v1/users` handle user authentication, habit logging, and lesson progress using UUID v4 keys.
  - **Example**: `POST /api/v1/habits/logs` accepts `{ "habit_id": "uuid", "completed_at": "2026-05-18T10:00:00Z" }` and responds with HTTP 201 Created and updated score payload.
  - **Edge Cases**: Database connection timeouts during peak traffic fail gracefully with HTTP 503 and standard `{ "detail": "Service temporarily unavailable" }` JSON response.

---

**Technical Requirements:**

- **Architecture & Tech Stack (Constitution v1.0.0 Compliance)**:
  - **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.x, PostgreSQL (Production) / SQLite in-memory (Tests), pytest, RESTful endpoints (`/api/v1/`).
  - **Frontend**: React 18, Vite, Tailwind CSS, lucide-react icons, react-router-dom, axios client.
  - **Directory Structure**: Backend in `server/`, Frontend in `client/`.
- **API Contracts & Data Schemas**:
  - `GET /api/v1/habits/` - List available habit categories and daily goals.
  - `POST /api/v1/habits/logs` - Record habit completion with timestamp.
  - `GET /api/v1/users/{user_id}/streaks` - Fetch current streak lengths and unlocked badges.
  - `POST /api/v1/auth/parental-consent` - Verify parental authorization.
- **Privacy & Security**:
  - Strictly COPPA-compliant data minimization; no third-party tracking scripts.
  - Passwords hashed with bcrypt; JWT authentication with 5-minute TTL inter-agent / standard session tokens for web UI.

### Acceptance Criteria
- Interactive Health Habit Dashboard (Frontend)
- Daily Habit Tracking & Streak Engine (Backend & Integration)
- Gamification, Points & Badge Rewards (Full-Stack)
- Parental Consent & COPPA Compliance Controls (Security & Admin)
- RESTful API & Database Persistence (Backend Infrastructure)

### Backend Tasks
- None specified

### Frontend Tasks
- None specified

### Database Changes
Not yet authored.

### API Endpoints
- `GET /api/v1/habits/` — List habit categories and goals
- `POST /api/v1/habits/logs` — Record habit completion
- `GET /api/v1/users/{user_id}/streaks` — Get user streak & unlocked badges
- `POST /api/v1/auth/parental-consent` — Verify parental consent

### UI Components
Not yet authored.

### Test Coverage
Not yet authored.

### Deployment Notes
Not yet authored.
