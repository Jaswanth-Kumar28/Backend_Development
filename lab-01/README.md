# Lab 1: Node.js and Express Server

## Student details

- **Name:** Cicetty Jaswanth Kumar
- **Registration number:** 252U1R9026
- **Section:** CSE-GEN-AI-2A-304
- **Course:** Backend Development Fundamentals, Year II Term II

## Objective

Create a basic HTTP server with Node.js's built-in `http` module and an Express server with routes and appropriate HTTP status codes.

## Technologies

- Node.js and npm
- Express.js
- JavaScript

## Implementation and routes

`server-http.js` demonstrates a plain Node.js HTTP server. `server.js` implements the Express application:

| Method | Path | Description | Status |
|---|---|---|---|
| GET | `/` | Returns a welcome message. | 200 |
| GET | `/about` | Returns the student's details as JSON. | 200 |
| GET | `/time` | Returns the current date and time. | 200 |
| GET | Any unmatched path | Returns a not-found message. | 404 |

## Run locally

Open a terminal in `lab-01/`, install dependencies, and start Express:

```bash
npm install
npm start
```

The server listens on port 3000 by default; `PORT` can override it. To run the built-in HTTP server instead, use `npm run start:http` (port 3000).

## Testing and evidence

Open `http://localhost:3000/`, `/about`, `/time`, and an unknown path in a browser or API client. Screenshots of the responses are stored in [`screenshots/`](./screenshots/).

The Express application is deployed at [https://backend-development.vercel.app/](https://backend-development.vercel.app/).
