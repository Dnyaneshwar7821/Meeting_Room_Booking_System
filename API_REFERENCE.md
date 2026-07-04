# API Reference

Base URL:

```text
http://localhost:8080
```

Production uses the Render backend URL.

## Health

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | Backend health check |

## Users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/users/admin-login` | Public | Admin login |
| POST | `/users/employee-login` | Public | Employee login |
| POST | `/users/login` | Public | Generic login |
| POST | `/users/set-password` | Public | Set first password |
| POST | `/users/add-user` | Admin | Create admin or employee |
| GET | `/users/get-all-users` | Admin | List visible users |
| GET | `/users/get-user-by-id/{id}` | Admin | Get user by id |
| PUT | `/users/update-user-by-id/{id}` | Admin | Update user |
| DELETE | `/users/delete-user/{id}` | Admin | Delete user |

## Rooms

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/rooms/add-room` | Admin | Create meeting room |
| GET | `/rooms/get-all-rooms` | Authenticated | List rooms |
| GET | `/rooms/get-room-by-id/{id}` | Authenticated | Get room by id |
| PUT | `/rooms/update-room-by-id/{id}` | Admin | Update room |
| DELETE | `/rooms/delete-room-by-id/{id}` | Admin | Delete room |

## Bookings

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/bookings/create-booking` | Admin or Employee | Create booking request |
| GET | `/bookings/get-all-bookings` | Admin | List visible bookings |
| GET | `/bookings/get-booking-by-id/{id}` | Admin | Get booking by id |
| PUT | `/bookings/approve-booking/{id}` | Admin | Approve booking |
| PUT | `/bookings/reject-booking/{id}` | Admin | Reject booking |
| DELETE | `/bookings/cancel-booking/{id}` | Authenticated | Cancel allowed booking |
| GET | `/bookings/user/{userId}` | Admin or owning employee | List user bookings |
| GET | `/bookings/booked-rooms` | Authenticated | Current occupied room ids |
| GET | `/bookings/room-status` | Authenticated | Today room status list |

## Authorization

Authenticated requests require:

```text
Authorization: Bearer <jwt-token>
```

## Room Status Values

```text
AVAILABLE
RESERVED
IN_USE
```

`/bookings/room-status` returns only rooms that are reserved or in use. The frontend treats missing rooms as `AVAILABLE`.
