# Meeting Room Booking System

A full-stack meeting room booking platform for admins and employees. Admins manage users, rooms, and booking approvals; employees browse room availability, create bookings, and track their own reservations.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Spring Boot 3, Spring Security, JWT, Spring Data JPA
- Database: MySQL-compatible database, tested for TiDB Cloud
- Deployment: Vercel frontend, Render backend

## Key Features

- Role-based login for system admin, admin, and employee users
- JWT-secured API access
- Admin user and meeting room management
- Employee booking workflow with conflict prevention
- Booking approval, rejection, and cancellation
- Live room status: available, reserved today, booked in use
- Dashboard metrics and charts with loading and error states
- Export support for booking reports

## Project Structure

```text
Meeting_Room_Booking_System/
  MeetingRoomBookingSystem/      Spring Boot backend
  meeting-room-booking-UI/       React/Vite frontend
  render.yaml                    Render backend blueprint
  RENDER_DEPLOYMENT.md           Render, Vercel, and TiDB deployment notes
```

## Local Setup

### Backend

```bash
cd MeetingRoomBookingSystem
./mvnw spring-boot:run
```

Default local backend:

```text
http://localhost:8080
```

### Frontend

```bash
cd meeting-room-booking-UI
npm install
npm run dev
```

Create `meeting-room-booking-UI/.env.local`:

```text
VITE_API_URL=http://localhost:8080
```

## Required Environment Variables

### Backend

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET
CORS_ALLOWED_ORIGINS
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
APP_TIME_ZONE=Asia/Kolkata
```

### Frontend

```text
VITE_API_URL=https://your-render-backend.onrender.com
```

## Room Status Rules

- `Available`: no approved booking is active or scheduled later today
- `Reserved Today`: approved booking starts later today
- `Booked - In Use`: current time is between an approved booking's start and end time
- After the end time passes, the room becomes available again unless another booking applies

Production status calculations use `APP_TIME_ZONE`, defaulting to `Asia/Kolkata`.

## Verification

Frontend:

```bash
cd meeting-room-booking-UI
npm run lint
npm run build
```

Backend:

```bash
cd MeetingRoomBookingSystem
./mvnw test
```

Health check:

```text
GET /health
```

Expected response:

```json
{"status":"ok"}
```
