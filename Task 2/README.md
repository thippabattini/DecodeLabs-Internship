# MERN Backend API

A RESTful backend API built with **Node.js**, **Express**, and **MongoDB**. It handles task management with input validation, structured JSON responses, and server-side business logic.

---

## Features

- REST API with **GET** and **POST** endpoints (plus PUT/DELETE for full CRUD)
- JSON request/response handling
- Input validation using `express-validator` and Mongoose schemas
- MongoDB Atlas
- Centralized error handling middleware
- Automated API test script

---

## Tech Stack

| Layer      | Technology        |
|------------|-------------------|
| Runtime    | Node.js           |
| Framework  | Express.js        |
| Database   | MongoDB           |
| ODM        | Mongoose          |
| Validation | express-validator |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account **or** local MongoDB installation

---

## Installation

1. **Clone or download the project**

   ```bash
   cd e:\DecodeLabs\task
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and update it with your MongoDB connection string:

   ```bash
   copy .env.example .env
   ```

   Edit `.env`:

   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mern_api?retryWrites=true&w=majority
   NODE_ENV=development
   ```

4. **MongoDB Atlas setup** (if using cloud)

   - Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - **Database Access** → create a database user
   - **Network Access** → add your IP (or `0.0.0.0/0` for development)
   - **Connect** → copy the connection string and paste it into `.env`
   - Replace `<username>`, `<password>`, and add `/mern_api` as the database name

---

## Running the Project

**Development mode** (auto-restarts on file changes):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

When the server starts successfully, you will see:

```
MongoDB connected
Server running on port 5000
```

**Verify all endpoints:**

```bash
npm run test:api
```

---

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/health`      | Health check       |
| GET    | `/api/tasks`       | Get all tasks      |
| GET    | `/api/tasks/:id`   | Get task by ID     |
| POST   | `/api/tasks`       | Create a new task  |
| PUT    | `/api/tasks/:id`   | Update a task      |
| DELETE | `/api/tasks/:id`   | Delete a task      |

### Query filters (GET `/api/tasks`)

| Parameter   | Values                    | Example                        |
|-------------|---------------------------|--------------------------------|
| `completed` | `true` or `false`         | `/api/tasks?completed=false`   |
| `priority`  | `low`, `medium`, `high`   | `/api/tasks?priority=high`     |

---

## Request & Response Examples

### Health check

**Request:**

```http
GET /api/health
```

**Response (200):**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-06-08T10:00:00.000Z"
}
```

### Create a task

**Request:**

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Learn Express",
  "description": "Build a REST API",
  "priority": "high"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "title": "Learn Express",
    "description": "Build a REST API",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z"
  }
}
```

### Get all tasks

**Request:**

```http
GET /api/tasks
```

**Response (200):**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "title": "Learn Express",
      "description": "Build a REST API",
      "completed": false,
      "priority": "high"
    }
  ]
}
```

### Validation error

**Request** (missing required `title`):

```http
POST /api/tasks
Content-Type: application/json

{}
```

**Response (400):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

### Task field validation rules

| Field         | Rules                                              |
|---------------|----------------------------------------------------|
| `title`       | Required, max 100 characters                       |
| `description` | Optional, max 500 characters                       |
| `completed`   | Optional, boolean                                  |
| `priority`    | Optional, one of: `low`, `medium`, `high`          |

---

## Project Structure

```
mern-backend-api/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── taskController.js  # Request handlers
│   ├── middleware/
│   │   ├── validate.js        # Validation middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   └── taskRoutes.js      # API routes + validation rules
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── scripts/
│   └── test-api.js            # API verification script
├── .env.example               # Environment variable template
├── package.json
└── README.md
```

---

## NPM Scripts

| Command          | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start server with nodemon (dev mode) |
| `npm start`      | Start server (production)            |
| `npm run test:api` | Run end-to-end API tests           |

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `MONGODB_URI is not defined` | Create `.env` from `.env.example` |
| `authentication failed` | Check username/password in `.env` |
| `IP not whitelisted` | Add your IP in Atlas → Network Access |
| `ECONNREFUSED 127.0.0.1:27017` | Start local MongoDB or switch to Atlas URI |
| `EADDRINUSE port 5000` | Another process is using port 5000 — change `PORT` in `.env` |

---

## License

MIT
