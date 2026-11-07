const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
const databasePath = path.join(__dirname, "books.db");
let database;

app.use(express.json());

const sampleBooks = [
  { title: "The Hobbit", author: "J. R. R. Tolkien", price: 450, pages: 310 },
  { title: "Pride and Prejudice", author: "Jane Austen", price: 350, pages: 432 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", price: 400, pages: 336 },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 300, pages: 180 },
  { title: "The Alchemist", author: "Paulo Coelho", price: 320, pages: 208 },
  { title: "The Book Thief", author: "Markus Zusak", price: 500, pages: 584 },
  { title: "The Kite Runner", author: "Khaled Hosseini", price: 420, pages: 371 },
  { title: "Jane Eyre", author: "Charlotte Brontë", price: 380, pages: 532 },
  { title: "The Little Prince", author: "Antoine de Saint-Exupéry", price: 250, pages: 96 },
  { title: "The Da Vinci Code", author: "Dan Brown", price: 480, pages: 489 }
];

// Helper to validate positive integer IDs from path parameters
const getBookId = (id) => {
  if (!/^[1-9]\d*$/.test(id)) {
    return null;
  }
  const bookId = Number(id);
  return Number.isSafeInteger(bookId) ? bookId : null;
};

// Root route: API Welcome & route index
app.get("/", (request, response) => {
  response.status(200).json({
    message: "Welcome to Lab 3 REST API",
    endpoints: [
      "GET /books?search_q=&order_by=&order=&limit=&offset=&min_price=&max_price=",
      "GET /books/:bookId",
      "POST /books",
      "PUT /books/:bookId",
      "DELETE /books/:bookId"
    ]
  });
});

// GET /books - Retrieve books with search, filter, sort, and pagination
app.get("/books", async (request, response, next) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price
    } = request.query;

    const allowedOrderBy = ["id", "title", "author", "price", "pages"];
    const normalizedOrderBy = order_by.toLowerCase();
    if (!allowedOrderBy.includes(normalizedOrderBy)) {
      return response.status(400).json({
        message: `Invalid order_by field. Allowed fields: ${allowedOrderBy.join(", ")}.`
      });
    }

    const normalizedOrder = order.toUpperCase();
    if (normalizedOrder !== "ASC" && normalizedOrder !== "DESC") {
      return response.status(400).json({
        message: "Invalid order direction. Allowed values: ASC, DESC."
      });
    }

    const parsedLimit = Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      return response.status(400).json({
        message: "limit must be a positive integer."
      });
    }

    const parsedOffset = Number(offset);
    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return response.status(400).json({
        message: "offset must be a non-negative integer."
      });
    }

    const conditions = ["title LIKE ?"];
    const queryParams = [`%${search_q}%`];

    if (min_price !== undefined) {
      const parsedMin = Number(min_price);
      if (Number.isNaN(parsedMin) || parsedMin < 0) {
        return response.status(400).json({
          message: "min_price must be a valid non-negative number."
        });
      }
      conditions.push("price >= ?");
      queryParams.push(parsedMin);
    }

    if (max_price !== undefined) {
      const parsedMax = Number(max_price);
      if (Number.isNaN(parsedMax) || parsedMax < 0) {
        return response.status(400).json({
          message: "max_price must be a valid non-negative number."
        });
      }
      conditions.push("price <= ?");
      queryParams.push(parsedMax);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sqlQuery = `
      SELECT * FROM book
      ${whereClause}
      ORDER BY ${normalizedOrderBy} ${normalizedOrder}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parsedLimit, parsedOffset);

    const books = await database.all(sqlQuery, queryParams);
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

// GET /books/:bookId - Retrieve a single book by ID
app.get("/books/:bookId", async (request, response, next) => {
  try {
    const bookId = getBookId(request.params.bookId);
    if (bookId === null) {
      return response.status(400).json({ message: "bookId must be a positive integer." });
    }

    const book = await database.get("SELECT * FROM book WHERE id = ?", [bookId]);
    if (!book) {
      return response.status(404).json({ message: "Book not found." });
    }

    response.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

// POST /books - Create a new book
app.post("/books", async (request, response, next) => {
  try {
    const { title, author, price, pages } = request.body || {};

    if (!title || typeof title !== "string" || title.trim() === "") {
      return response.status(400).json({
        message: "Title is required and must be a non-empty string."
      });
    }

    if (!author || typeof author !== "string" || author.trim() === "") {
      return response.status(400).json({
        message: "Author is required and must be a non-empty string."
      });
    }

    if (price === undefined || typeof price !== "number" || Number.isNaN(price) || price < 0) {
      return response.status(400).json({
        message: "Price is required and must be a valid non-negative number."
      });
    }

    if (pages === undefined || !Number.isInteger(pages) || pages <= 0) {
      return response.status(400).json({
        message: "Pages is required and must be a positive integer."
      });
    }

    const result = await database.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
      [title.trim(), author.trim(), price, pages]
    );

    const newBook = await database.get("SELECT * FROM book WHERE id = ?", [result.lastID]);
    response.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
});

// PUT /books/:bookId - Update an existing book
app.put("/books/:bookId", async (request, response, next) => {
  try {
    const bookId = getBookId(request.params.bookId);
    if (bookId === null) {
      return response.status(400).json({ message: "bookId must be a positive integer." });
    }

    const { title, author, price, pages } = request.body || {};

    if (!title || typeof title !== "string" || title.trim() === "") {
      return response.status(400).json({
        message: "Title is required and must be a non-empty string."
      });
    }

    if (!author || typeof author !== "string" || author.trim() === "") {
      return response.status(400).json({
        message: "Author is required and must be a non-empty string."
      });
    }

    if (price === undefined || typeof price !== "number" || Number.isNaN(price) || price < 0) {
      return response.status(400).json({
        message: "Price is required and must be a valid non-negative number."
      });
    }

    if (pages === undefined || !Number.isInteger(pages) || pages <= 0) {
      return response.status(400).json({
        message: "Pages is required and must be a positive integer."
      });
    }

    const result = await database.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
      [title.trim(), author.trim(), price, pages, bookId]
    );

    if (result.changes === 0) {
      return response.status(404).json({ message: "Book not found." });
    }

    const updatedBook = await database.get("SELECT * FROM book WHERE id = ?", [bookId]);
    response.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
});

// DELETE /books/:bookId - Delete a book by ID
app.delete("/books/:bookId", async (request, response, next) => {
  try {
    const bookId = getBookId(request.params.bookId);
    if (bookId === null) {
      return response.status(400).json({ message: "bookId must be a positive integer." });
    }

    const result = await database.run("DELETE FROM book WHERE id = ?", [bookId]);
    if (result.changes === 0) {
      return response.status(404).json({ message: "Book not found." });
    }

    response.status(200).json({ message: "Book deleted successfully.", bookId });
  } catch (error) {
    next(error);
  }
});

// Centralized error handling middleware
app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }
  const statusCode = error.status || error.statusCode || 500;
  const message = statusCode < 500 ? error.message : "Internal server error.";
  response.status(statusCode).json({ message });
});

// Database initialization and server startup
async function initializeDBAndServer() {
  database = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  await database.exec(`
    CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY,
      title TEXT,
      author TEXT,
      price INTEGER,
      pages INTEGER
    )
  `);

  const bookCount = await database.get("SELECT COUNT(*) AS count FROM book");
  if (bookCount.count === 0) {
    for (const book of sampleBooks) {
      await database.run(
        "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
        [book.title, book.author, book.price, book.pages]
      );
    }
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

initializeDBAndServer().catch((error) => {
  console.error("Could not initialize the database or start the server:", error);
  process.exitCode = 1;
});

