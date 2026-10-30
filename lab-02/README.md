# Lab 2: SQLite database and CRUD routes

**Course:** Backend Development Fundamentals
**Year/Term:** Year II Term II
**Content week:** Week 2 (slots 6–12)
**Module:** SQLite and relational database operations
**Name:** Cicetty Jaswanth Kumar
**Registration number:** 252U1R9026
**Section:** CSE Gen-AI 304 S24
**Live link:** Not deployed. See [Deployment](#deployment).

## Objective

Connect an Express server to a SQLite database and expose create, read, update, and delete operations over HTTP.

## Install and run

From a terminal opened in `lab-02/`, install the dependencies and start the development server:

```bash
npm install
npm run dev
```

`nodemon` restarts the server when files change. To run without automatic restarts, use `npm start`. The API listens at `http://localhost:3000` by default. Set the optional `PORT` environment variable to use another port. No environment variables are required.

The database is `books.db` in this folder. Initialization opens SQLite, creates the `book` table if needed, and inserts ten sample books only when the table is empty. The server starts after database initialization succeeds. The database file is included in the repository so its data can be inspected.

| Column | Type |
|---|---|
| `id` | INTEGER PRIMARY KEY |
| `title` | TEXT |
| `author` | TEXT |
| `price` | INTEGER |
| `pages` | INTEGER |

## API endpoints

Base URL: `http://localhost:3000`

| Method | Path | Description |
|---|---|---|
| GET | `/books/` | Return all books. |
| GET | `/books/:bookId/` | Return the book with the specified ID. |
| POST | `/books/` | Create a book. |
| PUT | `/books/:bookId/` | Replace the specified book's details. |
| DELETE | `/books/:bookId/` | Delete the specified book. |

POST and PUT expect JSON with non-empty `title` and `author` strings and integer `price` and `pages` values. Queries that use request data are parameterized. Successful responses use status codes 200 (GET, PUT, DELETE) and 201 (POST); invalid IDs or bodies return 400, and valid IDs for missing books return 404.

## Postman test checklist

Start the server, then send these requests to `http://localhost:3000`:

| Test | Method and path | Expected result |
|---|---|---|
| List books | `GET /books/` | 200 and ten initial books |
| Get a book | `GET /books/1/` | 200 and book 1 |
| Create a book | `POST /books/` | 201 and the created book |
| Update a book | `PUT /books/1/` | 200 and the updated book |
| Delete a book | `DELETE /books/1/` | 200 and a deletion confirmation |
| Missing book | `GET /books/987654321/` | 404 |
| Invalid ID | `GET /books/not-an-id/` | 400 |
| Update missing book | `PUT /books/987654321/` | 404 |
| Delete missing book | `DELETE /books/987654321/` | 404 |
| Invalid create body | `POST /books/` with invalid or incomplete JSON fields | 400 |

For POST, select **Body → raw → JSON** and use:

```json
{
  "title": "Test Book",
  "author": "Test Author",
  "price": 500,
  "pages": 300
}
```

For PUT, use `PUT /books/1/` with:

```json
{
  "title": "Updated Test Book",
  "author": "Updated Author",
  "price": 600,
  "pages": 350
}
```

After POST, PUT, and DELETE, inspect `books.db` to confirm that the changes persisted. If the SQLite CLI is installed, run these commands from `lab-02/`:

```text
sqlite3 books.db "SELECT * FROM book;"
sqlite3 books.db "SELECT COUNT(*) FROM book;"
```

Compare the CLI results with the API responses. The SQLite CLI is a separate tool and is not installed by this project.

## Screenshots

No Postman or database screenshots have been captured yet. Save genuine screenshots in `screenshots/` and replace the checklist/template below with the actual files; do not report a screenshot as present until it has been added.

- [ ] Successful GET all, GET one, POST, PUT, and DELETE responses
- [ ] Useful error responses
- [ ] SQLite database contents

Required README image-reference format (add the corresponding real image before using each reference):

```markdown
![Postman GET all books response](screenshots/get-all-books.png)
![Postman GET one book response](screenshots/get-one-book.png)
![Postman POST book response](screenshots/post-book.png)
![Postman PUT book response](screenshots/put-book.png)
![Postman DELETE book response](screenshots/delete-book.png)
![SQLite book table](screenshots/database-view.png)
```

## Problems faced and solutions

- The server must not accept requests before SQLite is ready, so initialization awaits the database connection and table setup before listening.
- Sample rows should not be duplicated on each restart, so they are inserted only when the table is empty.
- Invalid IDs and request bodies are rejected with 400; valid IDs without matching records return 404.

## Viva topics

- **Why await the database call?** To ensure initialization and dependent database operations complete before the next step, including starting the server.
- **What is SQL injection, and how do placeholders help?** SQL injection is the alteration of a query through untrusted input. Placeholders bind input as values rather than SQL syntax.
- **When is PUT used instead of POST?** PUT updates/replaces a resource at a known URL; POST commonly creates a resource in a collection.

## Deployment

**Status: Not deployed; no live URL is available yet.** Deployment requires choosing a hosting provider and completing its account/project setup. Before publishing, configure the service to run `npm start` and provide persistent storage for `books.db`; an ephemeral deployment filesystem may lose database changes on restart or redeployment. After deployment, add and verify the public URL here. If deployment is unavailable, include real Postman screenshots for every endpoint above.
