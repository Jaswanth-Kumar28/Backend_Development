# Lab 3: REST API, query parameters, validation, debugging

**Course:** Backend Development Fundamentals  
**Year/Term:** Year II Term II  
**Content week:** Week 3 (slots 13–19)  
**Module:** RESTful API development and validation  
**Name:** Cicetty Jaswanth Kumar  
**Registration number:** 252U1R9026  
**Section:** CSE Gen-AI 304 S24  
**GitHub Repository:** [https://github.com/Jaswanth-Kumar28/Backend_Development](https://github.com/Jaswanth-Kumar28/Backend_Development)  
**Live link:** Pending Render deployment. See [Deployment](#deployment).

---

## Objective

Transform the Lab 2 CRUD service into a complete, robust RESTful API featuring:
- Resource-oriented URLs using plural nouns (`/books`).
- Multi-criteria querying: title search (`search_q`), price range filtering (`min_price`, `max_price`), column sorting (`order_by`, `order`), and pagination (`limit`, `offset`).
- Strict request body validation with descriptive error messages.
- Consistent JSON error response structures (`{ "message": "..." }`).
- Proper HTTP status codes for every success and error scenario.
- Investigation and resolution of common backend bugs (port conflicts, import path mismatches, table typos, and unhandled async operations).

---

## Technologies Used

- **Node.js** (v18+)
- **Express.js** (v5)
- **SQLite3** (`sqlite3` v6.0.1) & **Async SQLite Driver** (`sqlite` v5.1.1)
- **Nodemon** (v3, developer environment auto-reloading)

---

## Project Structure

```text
lab-03/
├── .gitignore            # Ignores node_modules/ and environment files
├── package.json          # Project manifest, dependencies, and start scripts
├── package-lock.json     # Exact dependency tree
├── app.js                # Express application, SQL queries, routes, and validation
├── books.db              # SQLite database file containing the book table
├── screenshots/          # Verification screenshots from Postman
└── README.md             # Complete Lab 3 documentation and viva guide
```

---

## Installation & How to Run Locally

### 1. Prerequisites
Ensure Node.js (v18 or higher) and npm are installed on your system.

### 2. Setup
Navigate into the `lab-03` directory and install dependencies:
```bash
cd lab-03
npm install
```

### 3. Running the Server
- **Development mode (with auto-restart on file change):**
  ```bash
  npm run dev
  ```
- **Standard production mode:**
  ```bash
  npm start
  ```

The server binds to `http://localhost:3000` by default. An alternate port can be specified using the `PORT` environment variable (e.g. `PORT=4000 npm start`).

---

## Database Information

The application utilizes an embedded SQLite database stored in `books.db`.

### Table Schema: `book`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for each book record |
| `title` | `TEXT` | `NOT NULL` | Title of the book |
| `author` | `TEXT` | `NOT NULL` | Author of the book |
| `price` | `INTEGER` | `NOT NULL` | Price in INR |
| `pages` | `INTEGER` | `NOT NULL` | Number of pages |

### Database Initialization
Upon server startup, `initializeDBAndServer()` executes:
1. Opens `books.db` using `sqlite3.Database`.
2. Creates the `book` table via `CREATE TABLE IF NOT EXISTS book (...)`.
3. Checks existing record count; if empty, it automatically seeds 10 sample books (`The Hobbit`, `Pride and Prejudice`, `To Kill a Mockingbird`, etc.).
4. Starts the Express HTTP listener once the database connection and schema are confirmed.

---

## API Endpoints & Route Reference

Base URL (Local): `http://localhost:3000`

| Method | Endpoint | Query Parameters | Description | Status Codes |
|---|---|---|---|---|
| `GET` | `/` | None | API welcome message and route directory | `200 OK` |
| `GET` | `/books` | `search_q`, `min_price`, `max_price`, `order_by`, `order`, `limit`, `offset` | Retrieve books with filtering, sorting, and pagination | `200 OK`, `400 Bad Request` |
| `GET` | `/books/:bookId` | None | Retrieve a single book by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/books` | None | Create a new book record | `201 Created`, `400 Bad Request` |
| `PUT` | `/books/:bookId` | None | Update an existing book record | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/books/:bookId` | None | Delete a book record by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |

---

## Query Parameters (`GET /books`)

All query parameters are optional and can be combined:

1. `search_q` (string, default: `""`): Partial case-insensitive title search via SQL `title LIKE ?`.
2. `min_price` (number): Minimum price filter (`price >= ?`).
3. `max_price` (number): Maximum price filter (`price <= ?`).
4. `order_by` (string, default: `"id"`): Column to sort by. Whitelisted fields: `id`, `title`, `author`, `price`, `pages`.
5. `order` (string, default: `"ASC"`): Sorting direction. Allowed values: `ASC`, `DESC`.
6. `limit` (integer, default: `10`): Number of books per page (must be > 0).
7. `offset` (integer, default: `0`): Number of books to skip (must be >= 0).

---

## Example Requests & Responses

### 1. Welcome Endpoint
- **Request:** `GET http://localhost:3000/`
- **Response (`200 OK`):**
  ```json
  {
    "message": "Welcome to Lab 3 REST API",
    "endpoints": [
      "GET /books?search_q=&order_by=&order=&limit=&offset=&min_price=&max_price=",
      "GET /books/:bookId",
      "POST /books",
      "PUT /books/:bookId",
      "DELETE /books/:bookId"
    ]
  }
  ```

### 2. Search & Price Range Filtering
- **Request:** `GET http://localhost:3000/books?search_q=Hobbit&min_price=300&max_price=500`
- **Response (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "title": "The Hobbit",
      "author": "J. R. R. Tolkien",
      "price": 450,
      "pages": 310
    }
  ]
  ```

### 3. Sorting & Pagination
- **Request:** `GET http://localhost:3000/books?order_by=price&order=DESC&limit=2&offset=0`
- **Response (`200 OK`):**
  ```json
  [
    {
      "id": 6,
      "title": "The Book Thief",
      "author": "Markus Zusak",
      "price": 500,
      "pages": 584
    },
    {
      "id": 10,
      "title": "The Da Vinci Code",
      "author": "Dan Brown",
      "price": 480,
      "pages": 489
    }
  ]
  ```

### 4. Create Book (Validation & Success)
- **Invalid Request (Missing Title):**
  `POST http://localhost:3000/books`
  ```json
  { "author": "Tester", "price": 250, "pages": 100 }
  ```
  **Response (`400 Bad Request`):**
  ```json
  { "message": "Title is required and must be a non-empty string." }
  ```
- **Valid Request:**
  `POST http://localhost:3000/books`
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 650,
    "pages": 464
  }
  ```
  **Response (`201 Created`):**
  ```json
  {
    "id": 11,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 650,
    "pages": 464
  }
  ```

### 5. Missing Resource (`404 Not Found`)
- **Request:** `GET http://localhost:3000/books/9999`
- **Response (`404 Not Found`):**
  ```json
  { "message": "Book not found." }
  ```

---

## Postman Verification Screenshots

The following screenshots verify each endpoint running locally in Postman and returning the expected HTTP status codes and response bodies:

### 1. API Welcome Endpoint (`GET /`)
![API Welcome](screenshots/01-welcome.png)

### 2. GET All Books (`GET /books`)
![Get All Books](screenshots/02-get-books.png)

### 3. Search & Price Filter (`GET /books?search_q=Hobbit&min_price=300&max_price=500`)
![Search and Filter](screenshots/03-search-filter.png)

### 4. Sorting & Pagination (`GET /books?order_by=price&order=DESC&limit=5&offset=0`)
![Sorting and Pagination](screenshots/04-sort-pagination.png)

### 5. Validation Error - Missing Title (`POST /books`)
![Validation Error](screenshots/05-validation-error.png)

### 6. Successful Book Creation (`POST /books` → 201 Created)
![Create Book](screenshots/06-create-book.png)

### 7. Individual Book Retrieval (`GET /books/1`)
![Get Single Book](screenshots/07-get-single-book.png)

### 8. Book Update (`PUT /books/1`)
![Update Book](screenshots/08-update-book.png)

### 9. Book Deletion (`DELETE /books/1`)
![Delete Book](screenshots/09-delete-book.png)

### 10. Missing Resource Error (`GET /books/9999` → 404 Not Found)
![Not Found Error](screenshots/10-not-found.png)

---

## Debugging Exercise & Troubleshooting

During backend development, five critical classes of errors were investigated and resolved:

1. **Port Conflict (`EADDRINUSE`):**
   - *Problem:* Occurs when the desired port (3000) is already claimed by another process or zombie server.
   - *Fix:* Use dynamic environment fallback (`process.env.PORT || 3000`) and verify existing port usage using `netstat -ano | findstr :3000` before restarting.
2. **Module Import Path Mismatch:**
   - *Problem:* Mistyping package specifiers (e.g. `require("./sqlite")` instead of `require("sqlite")`) throws `MODULE_NOT_FOUND`.
   - *Fix:* Distinguish between local modules (`./path`) and npm dependencies (`package-name`).
3. **Table Name Typo (`no such table`):**
   - *Problem:* Querying `books` instead of `book` (singular) causes SQLite runtime syntax errors.
   - *Fix:* Enforced a single, consistent table definition (`book`) across all SQL statements.
4. **Missing `await` on Database Operations:**
   - *Problem:* Forgetting `await` on asynchronous calls (e.g. `database.all(...)`) returns pending Promise objects rather than query results.
   - *Fix:* Every SQLite call is properly awaited inside `async` route handlers.
5. **SQL Injection Vulnerabilities in Sorting:**
   - *Problem:* SQL column names cannot be parameterized using `?` placeholders. Directly interpolating `req.query.order_by` exposes the database to injection.
   - *Fix:* Implemented strict whitelist validation against `["id", "title", "author", "price", "pages"]` before query construction.

---

## Viva Questions & Answers

1. **What is the difference between a query parameter and a path parameter?**
   - *Path parameters* (`/books/:bookId`) identify a specific resource in the hierarchy.
   - *Query parameters* (`/books?search_q=Hobbit&order_by=price`) modify, filter, sort, or paginate the collection without altering the resource endpoint itself.
2. **What does statelessness mean in RESTful API design?**
   - Every request from the client must contain all the information necessary for the server to process it. The server does not store client session context between requests.
3. **Which status code is used for bad client input vs a missing record?**
   - `400 Bad Request`: Used when input data is malformed, missing required fields, or violates validation rules.
   - `404 Not Found`: Used when the client requests a valid endpoint structure but the specific resource identifier does not exist in the database.

---

## Deployment

**Status: Ready for Render Web Service deployment.**

### Render Configuration Settings:
- **Repository:** `Backend_Development`
- **Branch:** `main`
- **Root Directory:** `lab-03`
- **Build Command:** `npm ci`
- **Start Command:** `npm start`
- **Port:** Handled dynamically via `process.env.PORT`.

Live Application URL: *(To be updated after Render deployment)*
