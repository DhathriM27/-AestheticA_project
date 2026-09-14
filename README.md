# Mini Service Ticket Management System

A small full-stack service ticket application built with **React + Vite**, **Node.js + Express**, and **SQLite**.

## Highlights
- Ticket CRUD with REST API
- Server-side validation and meaningful HTTP status codes
- Search by title/customer
- Filter by status, priority, and customer
- Sorting and pagination
- Ticket detail view and status updates
- Responsive dashboard with loading/error/empty states
- SQLite database with automatic initialization
- API unit tests using Node's built-in test runner
- Clean separation of routes, controllers, and models

## Project structure
```text
student-project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express REST API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── migrations/
│   ├── tests/
│   ├── src/
│   └── package.json
├── package.json
└── README.md
```

## Requirements
- Node.js 20+
- npm 10+

## Quick start
From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Then open the Vite URL shown in the terminal (normally `http://localhost:5173`). The API runs on `http://localhost:5000`.

### Alternative: run separately
```bash
cd server
npm install
npm run dev
```

In another terminal:
```bash
cd client
npm install
npm run dev
```

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tickets` | List/search/filter tickets |
| GET | `/api/tickets/:id` | Get one ticket |
| POST | `/api/tickets` | Create ticket |
| PUT | `/api/tickets/:id` | Update ticket |
| DELETE | `/api/tickets/:id` | Delete ticket |
| GET | `/api/health` | Health check |

### List query parameters
- `status=Open`
- `priority=High`
- `customer=Acme`
- `search=printer`
- `sortBy=createdAt|priority|title|status`
- `sortOrder=asc|desc`
- `page=1`
- `limit=10`

Example:
```text
GET /api/tickets?status=Open&priority=High&search=login&page=1&limit=10
```

## Validation
The backend validates all incoming data. Valid priorities are `Low`, `Medium`, `High`; valid statuses are `Open`, `In Progress`, `Resolved`, `Closed`.

Invalid IDs return `400`, missing tickets return `404`, validation errors return `400`, successful creation returns `201`, and successful update/delete return `200`/`204`.

## Tests
```bash
cd server
npm test
```

The test suite covers validation, CRUD behavior, filtering, searching, and invalid IDs.

## Design decisions
- **SQLite** keeps setup fast and portable for a small assignment.
- **Synchronous SQLite model methods** are intentionally used for this small workload: they keep controller code easy to read and avoid unnecessary async complexity.
- Pagination is server-side so the UI never needs to load an unbounded ticket list.
- The frontend refreshes after mutations rather than duplicating server state, which keeps data consistent and the implementation maintainable.
