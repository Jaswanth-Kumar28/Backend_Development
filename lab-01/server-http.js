/**
 * ============================================================================
 * Lab 1: Node.js and Express Server - Part 1: Built-in HTTP Server
 * Student Name: Cicetty Jaswanth Kumar
 * Registration Number: 252U1R9026
 * Section: CSE-GEN-AI-1A-104
 * Faculty: Joel Prashanth D
 * ============================================================================
 */

const http = require("http");

const PORT = 3000;

const server = http.createServer((request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    response.end("Hello");
});

server.listen(PORT, () => {
    console.log(`HTTP server running at http://localhost:${PORT}`);
});
