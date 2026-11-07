# Backend Development Fundamentals - Term 2

**Student Name:** Cicetty Jaswanth Kumar  
**Registration Number:** 252U1R9026  
**Section:** CSE-GEN-AI-2A-304  
**Course:** Backend Development Fundamentals, Year II Term II  

---

## Repository Structure

```text
Backend-Term-2/
├── lab-01/
│   ├── package.json
│   ├── server.js
│   ├── server-http.js
│   ├── screenshots/
│   │   ├── home.png
│   │   ├── about.png
│   │   ├── time.png
│   │   └── not-found.png
│   └── README.md
│
├── lab-02/
│   ├── package.json
│   ├── app.js
│   ├── books.db
│   ├── screenshots/
│   │   ├── get-all-books.png
│   │   ├── get-one-book.png
│   │   ├── post-book.png
│   │   ├── put-book.png
│   │   ├── delete-book.png
│   │   └── database-view.png
│   └── README.md
│
├── lab-03/
│   ├── package.json
│   ├── app.js
│   ├── books.db
│   ├── screenshots/
│   │   ├── 01-welcome.png
│   │   ├── 02-get-books.png
│   │   ├── 03-search-filter.png
│   │   ├── 04-sort-pagination.png
│   │   ├── 05-validation-error.png
│   │   ├── 06-create-book.png
│   │   ├── 07-get-single-book.png
│   │   ├── 08-update-book.png
│   │   ├── 09-delete-book.png
│   │   └── 10-not-found.png
│   └── README.md
│
└── README.md
```

---

## Labs Overview

### [Lab 1: Node.js and Express Server](./lab-01/)
- **Description:** Basic HTTP server using native `http` module and an Express.js server providing routing, JSON responses, timestamp generation, and 404 handling.
- **Technologies:** Node.js, Express.js, JavaScript (CommonJS)
- **Live Deployment:** [https://backend-development.vercel.app](https://backend-development.vercel.app)
- **Endpoints:**
  - `GET /` — Welcome message
  - `GET /about` — Student information
  - `GET /time` — Server date & time
  - `GET /*` — 404 Route Not Found handler

### [Lab 2: SQLite Database and CRUD Routes](./lab-02/)
- **Description:** Express REST API connected to an SQLite database implementing full CRUD operations (Create, Read, Update, Delete) with parameterized SQL queries, error handling, and data validation.
- **Technologies:** Node.js, Express.js, SQLite3 (`sqlite3`), `sqlite`
- **Live Deployment:** [https://backend-development-0lch.onrender.com](https://backend-development-0lch.onrender.com)
- **Endpoints:**
  - `GET /` — Welcome message & API index
  - `GET /books/` — Retrieve all books
  - `GET /books/:bookId/` — Retrieve single book by ID
  - `POST /books/` — Create a new book
  - `PUT /books/:bookId/` — Update an existing book
  - `DELETE /books/:bookId/` — Delete a book by ID

### [Lab 3: REST API, Query Parameters, Validation, Debugging](./lab-03/)
- **Description:** Advanced REST API supporting partial title search (`search_q`), price range filtering (`min_price`, `max_price`), column sorting (`order_by`, `order`), pagination (`limit`, `offset`), and comprehensive request body validation.
- **Technologies:** Node.js, Express.js, SQLite3 (`sqlite3`), `sqlite`
- **Live Deployment:** Pending Render Web Service deployment
- **Endpoints:**
  - `GET /` — Welcome message & route directory
  - `GET /books` — Books collection with search, price filters, sorting, and pagination
  - `GET /books/:bookId` — Retrieve single book by ID
  - `POST /books` — Create a new book with validation
  - `PUT /books/:bookId` — Update an existing book with validation
  - `DELETE /books/:bookId` — Delete a book by ID

---

## Quick Start

### Running Lab 1 Locally
```bash
cd lab-01
npm install
npm start
```

### Running Lab 2 Locally
```bash
cd lab-02
npm install
npm start
```

### Running Lab 3 Locally
```bash
cd lab-03
npm install
npm start
```
