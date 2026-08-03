# SCRUM-643 Features

## Feature Summary
User Story: Browse and Discover Computer Components

## User Stories
### **User Story: Browse and Discover Computer Components**

**As a customer,** I want to easily browse and search for a wide variety of computer parts on the website **so that** I can find the specific components I need for my build, whether I'm a casual builder or a high-end enthusiast.

---

### **Acceptance Criteria**

#### **1. Frontend (UI/UX)**
*   **Explanation:** The user interface should provide a clear and intuitive way to navigate through product categories. A prominent search bar should be available on all pages.
*   **Example:** A user lands on the homepage and sees a navigation bar with categories like "CPUs," "Motherboards," "Memory (RAM), " "Storage (SSD, HDD), " "Graphics Cards, " etc. They can click on any category to see a list of products.
*   **Edge Cases:** If a category is empty, the website should display a message like "No products found in this category" instead of a blank page.

#### **2. Product Search Functionality**
*   **Explanation:** Users must be able to search for products by name, brand, or category. The search should be fast and return relevant results.
*   **Example:** A user types "Nvidia RTX 4080" into the search bar and the website displays all available models of the RTX 4080 graphics card.
*   **Edge Cases:** If a search query returns no results, the website should display a "No results found" message and perhaps offer suggestions for other products.

#### **3. Product Listings Page**
*   **Explanation:** When a user navigates to a category or performs a search, the website should display a grid or list of products with key information.
*   **Example:** The "Graphics Cards" page shows a grid of GPUs, each with a product image, name, brand, price, and a "View Details" button.
*   **Sub-headings:**
    *   **Filtering and Sorting:** Users should be able to filter products by brand, price range, and other relevant attributes. They should also be able to sort products by price (low to high, high to low) and popularity.

#### **4. Backend Logic**
*   **Explanation:** The backend will manage the product catalog, including all product information, categories, and inventory levels. It will provide the data to the frontend via an API.
*   **Example:** When a user requests the "CPUs" category page, the backend queries the database for all products in the "CPUs" category and returns the data to the frontend.
*   **Database Schema:**
    *   A `products` table with columns for `id`, `name`, `description`, `price`, `brand`, `category_id`, `stock_quantity`, `image_url`, `created_at`, and `updated_at`.
    *   A `categories` table with columns for `id`, `name`, and `description`.

#### **5. API Endpoints**
*   **Explanation:** A set of RESTful API endpoints will be created to handle product and category data.
*   **Example:**
    *   `GET /api/v1/products`: Returns a list of all products, with support for filtering and pagination.
    *   `GET /api/v1/products/{product_id}`: Returns the details of a specific product.
    *   `GET /api/v1/categories`: Returns a list of all product categories.
    *   `GET /api/v1/categories/{category_id}/products`: Returns a list of all products in a specific category.

## Acceptance Criteria
- The user interface should provide a clear and intuitive way to navigate through product categories.
- Users must be able to search for products by name, brand, or category.
- The website should display a grid or list of products with key information.
- The backend will manage the product catalog, including all product information, categories, and inventory levels.
- A set of RESTful API endpoints will be created to handle product and category data.

## Backend Tasks
- .env.example
- README.md
- server/__init__.py
- server/main.py
- server/models.py
- server/database.py
- server/requirements.txt
- server/test_main.py

## Frontend Tasks
- client/.env.example
- client/.env
- client/package.json
- client/index.html
- client/vite.config.js
- client/tailwind.config.js
- client/postcss.config.js
- client/src/index.css
- client/src/main.jsx
- client/src/setup.js
- client/src/components/layout/TopNavBar.jsx
- client/src/components/common/Button.jsx
- client/src/components/common/Badge.jsx
- client/src/components/product/ProductCard.jsx
- client/src/components/product/FilterPanel.jsx
- client/src/pages/Homepage.jsx
- client/src/pages/ProductListingsPage.jsx
- client/src/pages/ProductDetailPage.jsx
- client/src/services/api.js

## Database Changes
**tables**:
  - {"name": "categories", "columns": [{"name": "id", "type": "UUID", "primary_key": true, "nullable": false, "default": "gen_random_uuid()"}, {"name": "name", "type": "VARCHAR(255)", "primary_key": false, "nullable": false, "unique": true}, {"name": "description", "type": "TEXT", "primary_key": false, "nullable": true}, {"name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "primary_key": false, "nullable": false, "default": "NOW()"}, {"name": "updated_at", "type": "TIMESTAMP WITH TIME ZONE", "primary_key": false, "nullable": false, "default": "NOW()"}]}
  - {"name": "products", "columns": [{"name": "id", "type": "UUID", "primary_key": true, "nullable": false, "default": "gen_random_uuid()"}, {"name": "name", "type": "VARCHAR(255)", "primary_key": false, "nullable": false}, {"name": "description", "type": "TEXT", "primary_key": false, "nullable": true}, {"name": "price", "type": "NUMERIC(10, 2)", "primary_key": false, "nullable": false}, {"name": "brand", "type": "VARCHAR(100)", "primary_key": false, "nullable": false}, {"name": "stock_quantity", "type": "INTEGER", "primary_key": false, "nullable": false, "default": "0"}, {"name": "image_url", "type": "VARCHAR(2048)", "primary_key": false, "nullable": true}, {"name": "category_id", "type": "UUID", "primary_key": false, "nullable": false, "foreign_key": "categories.id"}, {"name": "created_at", "type": "TIMESTAMP WITH TIME ZONE", "primary_key": false, "nullable": false, "default": "NOW()"}, {"name": "updated_at", "type": "TIMESTAMP WITH TIME ZONE", "primary_key": false, "nullable": false, "default": "NOW()"}]}
**relationships**:
  - products.category_id -> categories.id (many-to-one)

## API Endpoints
- `GET /api/v1/products` — Get a paginated list of all products. Supports filtering by brand, price range, and category, and sorting by price.
- `GET /api/v1/products/{product_id}` — Get the full details for a single product by its UUID.
- `GET /api/v1/categories` — Get a list of all product categories.
- `GET /api/v1/categories/{category_id}` — Get details for a single category.
- `GET /api/v1/categories/{category_id}/products` — Get a paginated list of all products within a specific category.

## UI Components
Not yet authored.

## Test Coverage
Not yet authored.

## Deployment Notes
Not yet authored.
