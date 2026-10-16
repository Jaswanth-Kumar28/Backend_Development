/**
 * ============================================================================
 * Lab 1: Node.js and Express Server
 * Course: Backend Development Fundamentals - Year II Term II
 * Student Name: Cicetty Jaswanth Kumar
 * Registration Number: 252U1R9026
 * Section: CSE-GEN-AI-2A-304
 * Faculty: Joel Prashanth D
 * ============================================================================
 *
 * --- Requirement 3: Demonstration of Basic Node.js HTTP Server ---
 * The built-in 'http' module can be used to create a plain web server as follows:
 *
 * const http = require("http");
 * const server = http.createServer((req, res) => {
 *   res.writeHead(200, { "Content-Type": "text/plain" });
 *   res.end("Hello");
 * });
 * server.listen(3000, () => {
 *   console.log("HTTP server running on port 3000");
 * });
 *
 * ============================================================================
 * --- Requirement 4 & 5: Express Implementation ---
 * Below is the complete Express version implementing all required routes & 404.
 * ============================================================================
 */

const express = require("express");
const app = express();

const PORT = 3000;

// Middleware to parse JSON bodies (good practice for Express APIs)
app.use(express.json());

/**
 * Route: GET /
 * Description: Returns a welcome message.
 */
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Backend Development Fundamentals - Lab 1 Server!");
});

/**
 * Route: GET /about
 * Description: Returns JSON containing student name and section.
 */
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "Cicetty Jaswanth Kumar",
    registrationNumber: "252U1R9026",
    section: "CSE-GEN-AI-2A-304"
  });
});

/**
 * Route: GET /time
 * Description: Returns the current date and time using new Date().
 */
app.get("/time", (req, res) => {
  res.status(200).send(new Date().toString());
});

/**
 * Requirement 6: 404 Handler for any unknown routes.
 * Any unmatched URL returns a 404 status code and an appropriate message.
 */
app.use((req, res) => {
  res.status(404).send("404 Not Found: The requested route does not exist.");
});

// Start Express server listening on port 3000
const PORT_NUMBER = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT_NUMBER, () => {
    console.log(`Server running on http://localhost:${PORT_NUMBER}`);
  });
}

module.exports = app;