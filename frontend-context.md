# Job Tracker — Frontend Context

## My role & how I want help
Same mentor approach as backend — I build, you review/hint/explain. Styling: I make a pass myself first, then you suggest improvements (don't lecture full Tailwind basics).

## Stack
React + Vite (JS, not TS), Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no PostCSS), react-router-dom (createBrowserRouter + Outlet pattern), axios, lucide-react icons.

## Project structure
```
frontend/src/
├── pages/         Login, Register, Dashboard, CreateApplication, EditApplication
├── components/    Navbar
├── layout/        Root.jsx (renders Navbar + Outlet, hides Navbar on /login,/register via useLocation)
├── context/        AuthContext.jsx (token state, login/register/logout functions)
├── routes/         AppRoutes.jsx, ProtectedRoutes.jsx (Outlet-based auth gate)
├── utils/           api.js (axios instance, baseURL from env, request interceptor attaches Bearer token from localStorage)
├── App.jsx          (just RouterProvider)
└── main.jsx          (wraps App in AuthProvider)
```

## Key established patterns
- `.env` (committed) = production Render URL; `.env.local` (gitignored, matches `*.local`) = localhost:8000 override for local dev
- Vite env vars need `VITE_` prefix, accessed via `import.meta.env.VITE_API_BASE_URL`
- Auth: login uses `URLSearchParams` + form-urlencoded content-type (backend expects OAuth2PasswordRequestForm); register/applications use plain JSON
- Token stored in localStorage under key "token", read by axios interceptor automatically
- ProtectedRoutes wraps Dashboard/CreateApplication/EditApplication as nested routes with shared Outlet
- Every form: controlled inputs, inline error state (not early-return, so form stays visible on error), proper id/htmlFor pairs
- Password show/hide toggle (Eye/EyeOff from lucide-react) on Login and Register (shared toggle for password+confirmPassword on Register — intentional choice)
- Dashboard: table layout (not cards), status shown as color-coded badge via getStatusClasses() helper switch statement, hover on `<tr>` not `<td>`
- Delete: separate `deleteError` state from page-load `error` state (so a failed delete doesn't blank the whole page)
- Edit page: useEffect fetches existing data on mount via useParams id, pre-fills form state
- Pagination/search/filter: search + statusFilter + page state, sent via axios `params` object, useEffect re-runs on their change, Next button disabled via `applications.length < pageSize` (Option A — simple, no total-count endpoint yet)

## Status: DEPLOYED & WORKING
- Live on Vercel, connected to live Render backend
- CORS configured on backend to allow the Vercel domain URL (not deployment-hash URL, no trailing slash)
- Full CRUD + auth flow tested end-to-end in production

## Deferred / not yet built
- Show real backend validation error messages (currently generic "Registration failed" etc.) — extract from `err.response?.data?.detail`
- Password requirement hints/live checklist on Register form
- Debouncing on search input (not yet needed since no live-search-as-you-type built yet)
- Pagination total-count (Option B — currently using simpler length-based Option A)

## NEXT UP: Resume/CV upload — backend is now FULLY COMPLETE and ready to integrate

Backend built and tested (see backend-context.md for full detail). The two endpoints you need:

- **`POST /applications/{application_id}/resume`** — upload a resume. Requires `multipart/form-data`, not JSON. Field name expected server-side is `file` (FastAPI `UploadFile`). Returns `{"resume_url": "..."}` on success (this is an internal storage path, not a usable link — don't try to render it directly as a link/image src).
- **`GET /applications/{application_id}/resume`** — get a temporary signed URL to actually view/download the file. Returns `{"signed_url": "https://..."}`. This URL expires after 300 seconds (5 min) — do NOT cache/store it, fetch it fresh every time the user wants to view the resume (e.g. on button click, not on page load).
- **`GET /applications` and `GET /applications/{id}`** now also include `resume_url` in their response bodies (`null` if no resume uploaded yet, otherwise the internal storage path string) — useful for conditionally showing "Upload Resume" vs "Replace Resume" / "View Resume" in the UI.

### What needs building on frontend side (not started)

1. **File input** on CreateApplication and/or EditApplication forms (decide: is resume upload part of the create/edit flow, or a separate action after the application already exists? Backend is a separate endpoint by design, so either UX works — think through which feels better before building).
2. **Switching that specific submission to multipart/form-data** — this will differ from your existing JSON-based create/edit submissions, likely needs a separate axios call (probably using `FormData` in JS) rather than reusing your existing JSON-posting pattern.
3. **"View Resume" action** (e.g. on Dashboard row, or a detail view) — on click, call the signed-url GET endpoint, then open/redirect to that URL (e.g. `window.open(signed_url)`) — remember it's short-lived, so this must be an on-demand fetch-then-open, not something fetched once and reused.
4. **Conditional UI** based on whether `resume_url` is null or not (from the list/detail response) — e.g. show "No resume uploaded" vs a "View Resume" button.
5. Decide error/loading states for upload (e.g. large file, wrong file type — backend bucket restricts to PDF/~5-10MB, but consider whether to validate client-side too for better UX before hitting the server).

Nothing built yet on this — starting fresh next session on this feature.