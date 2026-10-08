# Student Life & College Feedback System

A small MERN application for collecting student feedback. It includes a React/Vite form, an Express/Mongoose API, and an optional n8n webhook notification.

## Project structure

- `frontend/` — React form, responsive UI, and Axios API client.
- `backend/` — Express API, MongoDB connection, feedback model, routes, and controller.

## Requirements

- Node.js 18 or later and npm
- MongoDB running locally, or a MongoDB connection string

## Configure and run

1. Open a terminal in `backend/` and install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string. The example uses a local database. Set `N8N_WEBHOOK_URL` and `ADMIN_EMAIL` to enable the existing workflow and its admin email branch. `PORT` defaults to `5000`; `CLIENT_URL` defaults to `http://localhost:5173`. Existing setups using `MONGO_URI` continue to work.
3. Start the API from `backend/`: `npm run dev` (or `npm start`). It connects to MongoDB before listening.
4. In a second terminal, open `frontend/`, install dependencies with `npm install`, then run `npm run dev`.
5. Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The frontend uses `http://localhost:5000/api` by default. To use a different API base URL, create `frontend/.env` with `VITE_API_URL=http://localhost:5000/api` (Vite environment variables are public, so do not put secrets there).

## API

- `GET http://localhost:5000/api/feedback` — returns saved feedback, newest first.
- `POST http://localhost:5000/api/feedback` — validates and saves feedback, returning the saved document and timestamps.
- `GET http://localhost:5000/api/health` — API health check.

The API checks for an existing feedback record using the normalized email before saving. This is an application-level check; the MongoDB field does not use a unique index. `POST /api/feedback` is limited to 10 requests per IP every 15 minutes (in-memory, per backend process).

The backend calls n8n only after MongoDB saves a new feedback document. It sends the feedback fields, `createdAt`, `mongoId`, and `adminEmail` when configured. In n8n, keep the current student confirmation branch and connect a separate Gmail node from the webhook trigger for the admin notification; set its recipient to `{{ $json.body.adminEmail }}`. The student fields remain available as `{{ $json.body.email }}`, `{{ $json.body.studentName }}`, and `{{ $json.body.overallRating }}`.

Example `POST` JSON body for Postman or Thunder Client:

```json
{
  "studentName": "Alex Morgan",
  "email": "alex.morgan@example.edu",
  "semester": 4,
  "department": "CSE",
  "satisfaction": "Satisfied",
  "academicExperience": "The classes are engaging and the faculty are approachable.",
  "campusLife": "There are welcoming clubs and plenty of places to study.",
  "favoriteThing": "The supportive student community.",
  "improvements": "More quiet study spaces would be helpful.",
  "overallRating": 4
}
```

Send it as `Content-Type: application/json`. The browser form follows the same flow: React validates the required fields, Axios posts them to Express, Express validates again, Mongoose stores them in MongoDB, and the success response is displayed in the form.
