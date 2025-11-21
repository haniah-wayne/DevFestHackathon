CampusForge — MVP scaffold
===========================

This workspace contains a minimal MVP scaffold for CampusForge: a platform to connect Michigan companies with university classes, labs, and students.

What I added
- Backend: `backend/` — Express API (auth, projects, classes, submissions), lowdb JSON store, file uploads, AI parsing stub.
- Frontend: `frontend/` — minimal Vite + React scaffold with a landing page and placeholders.

Quick setup (Windows PowerShell)

- Backend

```powershell
cd .\backend
npm install
cp .env.example .env
# Edit .env to set a secure JWT_SECRET if you plan to use this beyond local testing
npm run dev
```

- Frontend

```powershell
cd ..\frontend
npm install
npm run dev
```

API highlights
- `POST /api/auth/register` — register (role: student, professor require `.edu` email for MVP)
- `POST /api/auth/login` — login returns JWT
- `GET /api/projects` and `POST /api/projects` — create/list projects
- `POST /api/submissions/:projectId` — submit files (form-data `files`)
- `POST /api/ai/parse` — AI parsing stub (replace with IBM watsonx integration later)

Next steps I can take
- Add front-end pages for login/register, student dashboard, project view and submission UI.
- Add role-based middleware and protect endpoints with JWT.
- Integrate IBM watsonx for AI parsing/evaluation when credentials are available.

If you want, I can: run the project, add JWT middleware, or implement the student UI next. Which should I do?

Frontend-only mode (backend removed)
----------------------------------

This repository has been converted to a frontend-only MVP. The original Express backend was removed. The frontend now uses a localStorage-backed mock API so the site is fully functional in the browser without any server.

Key notes:
- The mock API lives in `frontend/src/utils/api.js` and implements the endpoints used by the UI (`/auth/*`, `/projects`, `/classes`, `/submissions`, `/ai/parse`).
- Data (users, classes, projects, submissions) is stored in browser `localStorage` under `cf_mock_db`.
- File uploads are mocked in the browser (file metadata saved to localStorage).
- AI features remain disabled by default; they can be toggled in the UI by setting `VITE_USE_AI=true` in Netlify (if later connecting to a real AI backend).

Netlify deployment (frontend)
---------------------------

The frontend is ready to be hosted as a static site on Netlify. It uses `HashRouter` so client-side routing works without special redirect rules.

1. In Netlify, create a new site (GitHub/Git provider) and point it to this repository.
2. In the Site settings > Build & deploy, set the build command and publish directory or rely on `netlify.toml` included in the repo.

Build command:

```
npm --prefix frontend run build
```

Publish directory:

```
frontend/dist
```

3. Environment variables (Site > Deploys > Environment > Environment variables):

- `VITE_API_URL` — set to the public URL of your backend API (e.g., `https://api.yoursite.com`).
- `VITE_USE_AI` — leave as `false` for safe deployments. Set to `true` only after securely deploying the backend with `USE_AI=true` and credentials.

Notes about the backend:
- The backend in `backend/` is a Node/Express app and cannot be hosted directly on Netlify as a long-running server. For production, deploy the backend to a server or platform that supports persistent servers or serverless functions (examples: Render, Fly, Railway, Heroku, AWS Elastic Beanstalk, or convert to Netlify Functions).
- After you deploy the backend, update `VITE_API_URL` in Netlify to point to the backend's base URL (e.g., `https://api.example.com`).

Safety and AI:
- AI calls are disabled by default. On the backend `USE_AI` defaults to `false`. To enable AI features you must set `USE_AI=true` in the backend environment and set `VITE_USE_AI=true` in the Netlify environment. You also need to add secure credentials for IBM watsonx in the backend (not stored in the repo).

Troubleshooting:
- If you want to use BrowserRouter later, add a `_redirects` file forwarding all paths to `/index.html`, or configure Netlify rewrite rules. For now `HashRouter` avoids that need.

If you want, I can: deploy the frontend to Netlify for you (requires repo access) or prepare a recommended backend deployment and a minimal `netlify.toml` + `functions/` example to host API routes as serverless functions.

