AI-Assisted Job Application Tracker

Overview
A lightweight Kanban app for managing job applications. Paste a job description, the AI extracts key fields (company, role, skills) and generates a few resume bullet suggestions. The goal is a focused, practical mini project rather than a full product.

Run locally
1. Backend
- cd server
- npm install
- npm run dev

2. Frontend
- cd client
- npm install
- npm run dev

3. Open http://localhost:5173

Environment variables
- Copy server/.env.example to server/.env
- Copy client/.env.example to client/.env
- There is also a root .env.example for convenience (optional)

Key design choices
- React Query over Redux to keep setup minimal.
- AI logic lives in a server-side service layer, not in route handlers.
- Drag and drop uses native HTML5 events to avoid extra dependencies.

What I learned
- JWT auth is straightforward but adds integration overhead.
- Gemini JSON responses are helpful, though occasional malformed output needs handling.
- Drag and drop in React is more nuanced than expected.

Planned improvements
- Stronger form validation and clearer error states.
- A more cohesive visual design.
- Search and filtering on the board.
- More resilient handling of AI parsing failures.

Known rough edges
- Failed server updates after drag-and-drop do not roll back the UI.
- The AI parser can sometimes leave fields blank.
