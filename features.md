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

## SCRUM-43 — Laundry Management Platform End-to-End Service Core

### Feature Summary
Laundry Management Platform End-to-End Service Core

### User Stories
# Laundry Management Platform End-to-End Service Core

**Objective:**
Provide an end-to-end Laundry Management Platform that enables customers to schedule pickups, track garment progress through washing stages, optimize driver delivery routes, and process secure payments.
Streamline operations for customers, laundry operators, and delivery drivers while maintaining real-time status visibility across the entire service lifecycle.

**Key Features:**
- Customer Pickup & Delivery Scheduling: Interactive selection of pickup/delivery time slots and service types.
- Garment & Washing Stage Tracking: Real-time multi-stage status updates (Received, Sorting, Washing, Drying, Ironing, Ready, Out for Delivery).
- Delivery Route Optimization: Automated driver stop sequencing based on location proximity and scheduled time windows.
- Integrated Stripe Payment Processing: Automated invoice calculation, secure Stripe Checkout, and webhook settlement sync.
- Administrative & Operator Portal: Centralized dashboard for managing orders, garment processing workflows, and driver assignments.

**Description:**
As a customer and laundry platform administrator,  
I want an integrated platform to schedule garment pickups, monitor laundry processing stages, manage optimized driver delivery routes, and execute secure online payments,  
So that laundry operations run efficiently with full transparency, minimal operational friction, and reliable automated payment fulfillment.

**Acceptance Criteria:**

- **Customer Pickup & Delivery Scheduling:**
  - **Explanation:** Customers can create an account, select laundry service types (Wash & Fold, Dry Cleaning, Ironing Only), specify garment counts or estimated weights, and schedule preferred pickup and delivery time windows.
  - **Example:** A customer selects "Wash & Fold", chooses a pickup window of 09:00 - 11:00 AM tomorrow, and confirms the request, generating an order with status `SCHEDULED_FOR_PICKUP`.
  - **Edge Cases:** If a requested pickup window is fully booked or outside operating hours, the system prevents selection and displays available alternative time slots.

- **Garment Processing & Washing Stage Tracking:**
  - **Explanation:** Laundry staff can update order status and advance garments through lifecycle stages (`Received`, `Sorting`, `Washing`, `Drying`, `Ironing`, `Ready_for_Delivery`), updating the customer's order tracking timeline in real time.
  - **Example:** Staff updates order #1002 from `Washing` to `Drying` in the operator portal; the customer's tracking dashboard immediately reflects the updated stage with a UTC timestamp.
  - **Edge Cases:** If a garment is flagged as requiring special care during sorting, the order status transitions to `SPECIAL_PROCESSING` and notifies the customer.

- **Driver Delivery Route Optimization:**
  - **Explanation:** The system aggregates scheduled pickups and drop-offs for a target zone and time window, generating an optimal sequenced route for drivers to minimize travel time and distance.
  - **Example:** A driver assigned to Zone 1 receives a sequenced itinerary of 5 stops ordered by optimal geographical route, updating stop statuses (`En Route`, `Picked Up`, `Delivered`).
  - **Edge Cases:** If a driver marks a pickup attempt as "Customer Unavailable", the system reschedules the window and dynamically adjusts the remaining driver route.

- **Payment Processing & Invoice Settlement:**
  - **Explanation:** Customers view itemized billing based on service selection and actual garment weight/count, then settle charges securely via Stripe Checkout. Payment webhooks automatically sync transaction status.
  - **Example:** Upon garment weighing, an invoice for $35.00 is generated. The customer completes Stripe Checkout, triggering a `checkout.session.completed` webhook that updates payment status to `PAID`.
  - **Edge Cases:** If payment fails or is declined, the order transitions to `PAYMENT_PENDING`, preventing final delivery dispatch until payment is completed.

**Technical Requirements:**
- **Backend Architecture:** FastAPI RESTful API (`/api/v1/orders`, `/api/v1/pickups`, `/api/v1/routes`, `/api/v1/payments`) built with Python 3.11, SQLAlchemy 2.x, and PostgreSQL database.
- **Frontend Architecture:** React 18 single-page application built with Vite and Tailwind CSS, providing responsive customer tracking and administrative management portals.
- **Payment Gateway:** Stripe Checkout API integration with signature-verified webhooks (`/api/v1/payments/stripe/webhook`).
- **Data Model & Standards:** Models for `users`, `orders`, `garment_stages`, `driver_routes`, and `payments` utilizing UUID v4 primary keys and ISO 8601 UTC timestamps (`created_at`, `updated_at`).
- **Security & Standards:** JWT Bearer authentication, CORS middleware configured for `http://localhost:5173`, and standardized error response formats (`{"detail": "..."}`).

### Acceptance Criteria
- Customer Pickup & Delivery Scheduling: Account creation, service selection (Wash & Fold, Dry Cleaning, Ironing Only), pickup/delivery scheduling, handle full/unavailable time slots.
- Garment Processing & Washing Stage Tracking: Order lifecycle transitions (Received, Sorting, Washing, Drying, Ironing, Ready_for_Delivery), real-time timeline updates with UTC timestamps, special care handling.
- Driver Delivery Route Optimization: Sequenced itineraries for drivers based on proximity and time windows, stop status updates (En Route, Picked Up, Delivered), customer unavailable retry routing.
- Payment Processing & Invoice Settlement: Itemized invoicing based on weight/count, Stripe Checkout integration, webhook settlement sync, payment failure pending state.

### Backend Tasks
- None specified

### Frontend Tasks
- None specified

### Database Changes
Not yet authored.

### API Endpoints
- `POST /api/v1/auth/register` — Register a new user account.
- `POST /api/v1/auth/login` — Authenticate credentials and issue JWT access token.
- `POST /api/v1/orders` — Create a new laundry order.
- `GET /api/v1/orders/{order_id}` — Retrieve detailed order status, invoice, and timeline.
- `PATCH /api/v1/orders/{order_id}/stage` — Update garment processing stage.
- `GET /api/v1/routes/driver/{driver_id}` — Retrieve optimized route itinerary.
- `PATCH /api/v1/routes/stops/{stop_id}` — Update driver stop status.
- `POST /api/v1/payments/checkout-session` — Generate Stripe Checkout session URL.
- `POST /api/v1/payments/stripe/webhook` — Handle signature-verified Stripe webhooks.

### UI Components
Not yet authored.

### Test Coverage
Not yet authored.

### Deployment Notes
Not yet authored.
