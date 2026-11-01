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

const isValidBook = (book) =>
  book !== null &&
  typeof book === "object" &&
  !Array.isArray(book) &&
  typeof book.title === "string" &&
  book.title.trim() !== "" &&
  typeof book.author === "string" &&
  book.author.trim() !== "" &&
  Number.isInteger(book.price) &&
  Number.isInteger(book.pages);

const getBookId = (id) => {
  if (!/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const bookId = Number(id);
  return Number.isSafeInteger(bookId) ? bookId : null;
};

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Welcome to Lab 2 Books API",
    endpoints: [
      "GET /books/",
      "GET /books/:bookId/",
      "POST /books/",
      "PUT /books/:bookId/",
      "DELETE /books/:bookId/"
    ]
  });
});

app.get("/books/", async (request, response, next) => {
  try {
    const books = await database.all("SELECT * FROM book");
    response.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

app.get("/books/:bookId/", async (request, response, next) => {
  try {
    const bookId = getBookId(request.params.bookId);
    if (bookId === null) {
      return response.status(400).json({ error: "bookId must be a positive integer." });
    }

    const book = await database.get("SELECT * FROM book WHERE id = ?", [bookId]);
    if (!book) {
      return response.status(404).json({ error: "Book not found." });
    }

    response.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

app.post("/books/", async (request, response, next) => {
  try {
    const { title, author, price, pages } = request.body || {};
    if (!isValidBook(request.body)) {
      return response.status(400).json({
        error: "Provide a non-empty title and author, and integer price and pages."
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

app.put("/books/:bookId/", async (request, response, next) => {
  try {
    const bookId = getBookId(request.params.bookId);
    if (bookId === null) {
      return response.status(400).json({ error: "bookId must be a positive integer." });
    }

    const { title, author, price, pages } = request.body || {};
    if (!isValidBook(request.body)) {
      return response.status(400).json({
        error: "Provide a non-empty title and author, and integer price and pages."
      });
    }

    const result = await database.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
      [title.trim(), author.trim(), price, pages, bookId]
    );
    if (result.changes === 0) {
      return response.status(404).json({ error: "Book not found." });
    }

    const updatedBook = await database.get("SELECT * FROM book WHERE id = ?", [bookId]);
    response.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
});

app.delete("/books/:bookId/", async (request, response, next) => {
  try {
    const bookId = getBookId(request.params.bookId);
    if (bookId === null) {
      return response.status(400).json({ error: "bookId must be a positive integer." });
    }

    const result = await database.run("DELETE FROM book WHERE id = ?", [bookId]);
    if (result.changes === 0) {
      return response.status(404).json({ error: "Book not found." });
    }

    response.status(200).json({ message: "Book deleted successfully.", bookId });
  } catch (error) {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  const statusCode = error.status || error.statusCode || 500;
  const message = statusCode < 500 ? error.message : "Internal server error.";
  response.status(statusCode).json({ error: message });
});

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
