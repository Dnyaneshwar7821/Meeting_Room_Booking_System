# Meeting Room Booking UI

React/Vite frontend for the Meeting Room Booking System.

## Features

- Admin and employee login flows
- Role-protected routes
- Admin dashboards, user management, room management, and booking review
- Employee dashboard, room browsing, booking creation, and personal bookings
- Loading skeletons and retry states for production latency
- Room status styling for available, reserved, and in-use rooms

## Setup

```bash
npm install
npm run dev
```

Create `.env.local`:

```text
VITE_API_URL=http://localhost:8080
```

For Vercel production:

```text
VITE_API_URL=https://your-render-backend.onrender.com
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Production Notes

- Vercel environment variable changes require a redeploy.
- Do not include `/health`, `/api`, or endpoint paths in `VITE_API_URL`.
- The backend must include the Vercel URL in `CORS_ALLOWED_ORIGINS`.
