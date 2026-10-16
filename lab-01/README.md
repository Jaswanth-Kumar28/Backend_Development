# Lab 1: Node.js and Express Server

## Student Details

- **Name:** Cicetty Jaswanth Kumar
- **Registration Number:** 252U1R9026
- **Section:** CSE-GEN-AI-2A-304
- **Course:** Backend Development Fundamentals
- **Lab Number:** 01

## Live Link

**Deployment URL:** [https://backend-development.vercel.app/](https://backend-development.vercel.app/)

## Objective

To set up a Node.js project, create a basic HTTP server using the built-in `http` module, and build an Express server with multiple routes and appropriate HTTP status codes.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- npm
- Visual Studio Code

## Project Structure

```text
lab-01/
├── screenshots/
│   ├── home.png
│   ├── about.png
│   ├── time.png
│   └── 404.png
├── server-http.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher) and npm installed
- Visual Studio Code or another code editor

### Steps to Run

1. Clone the repository or download the project.
2. Open the `lab-01` folder in your terminal:

   ```bash
   cd lab-01
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the Express server:

   ```bash
   node server.js
   ```

   *(or run via npm script)*:

   ```bash
   npm start
   ```

5. Open the following URL in your browser:

   [http://localhost:3000](http://localhost:3000)

### Run the Basic HTTP Server

To run the server implemented using Node.js's built-in `http` module:

```bash
node server-http.js
```

*(or run via npm script)*:

```bash
npm run start:http
```

> **Note:** Stop the running server with `Ctrl + C` before starting another server on the same port to avoid port collision errors (`EADDRINUSE`).

## Endpoints

| Method | Endpoint | Description | Expected Status |
|:---:|:---:|:---|:---:|
| GET | `/` | Returns a welcome message | 200 OK |
| GET | `/about` | Returns student name, registration number, and section as JSON | 200 OK |
| GET | `/time` | Returns the current date and time using `new Date()` | 200 OK |
| GET | `/anything` | Catch-all handler for unknown/undefined routes | 404 Not Found |

The `/anything` path is an example of an unknown route. Any undefined path returns a 404 response.

## Screenshots

### 1. Home Route

Displays the welcome message.

![Home route response](screenshots/home.png)

### 2. About Route

Displays the student's name, registration number, and section in JSON format.

![About route response](screenshots/about.png)

### 3. Time Route

Displays the current date and time.

![Time route response](screenshots/time.png)

### 4. Unknown Route (404 Handler)

Displays the 404 Page Not Found response.

![404 route response](screenshots/404.png)

## HTTP Status Codes

- **200 OK:** The request was successful and the resource was returned.
- **404 Not Found:** The requested route or resource does not exist on the server.

## Viva Questions

### 1. What is the difference between `package.json` and `node_modules`?

`package.json` stores project metadata, scripts, and dependency definitions (committed to version control). `node_modules` contains the physical installed library packages downloaded by npm (ignored via `.gitignore`).

### 2. What does `app.listen()` do?

`app.listen()` binds and starts the Express server, making it listen for incoming HTTP connections on the specified port number (e.g., port 3000).

### 3. What do `request` and `response` represent?

- `request` (`req`): Contains information about the incoming HTTP request from the client (headers, URL, query parameters, body).
- `response` (`res`): Used to send data, headers, and HTTP status codes back to the client.

### 4. What are the key fields in `package.json`?

- `name`: Package identifier (`lab-01`).
- `version`: Current version following semantic versioning (`1.0.0`).
- `main`: Primary entry point file (`server.js`).
- `scripts`: Custom CLI shortcut commands (`start`, `start:http`).
- `dependencies`: Hash map of third-party modules required to run the application (`express`).

## Problems Faced and Solutions

1. **Port Collision (`EADDRINUSE: address already in use :::3000`):**
   - *Problem:* Running `node server.js` exited with code 1 because port 3000 was already bound by an existing Node.js process.
   - *Solution:* Located the process using `Get-NetTCPConnection` in PowerShell and stopped it using `Stop-Process` before re-running the server.

2. **404 Middleware Placement:**
   - *Problem:* If 404 middleware is placed before defined routes, it intercepts all incoming requests.
   - *Solution:* Registered `app.use(...)` at the very end of the file after all defined route handlers so that only unmatched routes trigger 404.

3. **Vercel Serverless Function Compatibility:**
   - *Problem:* Standard Express apps only call `app.listen(3000)`. When deploying to Vercel, the serverless environment requires the Express application instance itself to be exported.
   - *Solution:* Added `module.exports = app;` to `server.js` so Vercel can import and serve the handler as a serverless function without errors.

## Git and Repository Notes

- The `.gitignore` file excludes `node_modules/` and `.env`.
- The `node_modules/` directory must never be committed to Git.
- Screenshots are stored in the `screenshots/` directory.
- The project is organized within the course repository under `lab-01/`.
