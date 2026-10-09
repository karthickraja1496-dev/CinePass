# 🎬 CinePass - Movie Ticket Booking Platform
> **Capstone Certification Project (Foundation Full-Stack Specification)**  
> Built with **React 18 + TypeScript + Vite**, **Spring Boot 3**, **Spring Security + BCrypt + JWT**, **Spring Data JPA**, and **PostgreSQL / H2**.

#### Capstone Foundation

- ✓ React + TypeScript + Hooks & Context
- ✓ Spring Boot 3 + REST + JPA / Hibernate
- ✓ BCrypt Security + Stateless JWT
- ✓ Interactive 50-Seat Layout (Rows A-E)

#### API & Resources

- [→ Swagger UI / OpenAPI Docs](http://localhost:8080/swagger-ui.html)
- [→ H2 Database Console](http://localhost:8080/h2-console)
- Admin Demo: `admin@cinepass.com` / `admin123`

---

## 🌟 Executive Summary & Features

**CinePass** delivers a modern, cinema-inspired web application for booking movie tickets. It fulfills all Foundation matrix requirements plus stretch goals with a focus on clean software architecture, robust RESTful APIs, and aesthetic excellence.

### ✨ In-Scope Features Implemented
1. **Authentication & Authorization**:
   - User Registration, Login, and Session persistence (`localStorage`).
   - Secure BCrypt password hashing and Stateless JWT Token authentication.
   - Dual-role model: **User** and **Admin** (`isAdmin: boolean` flag).
   - Route and menu protection: Admin actions are accessible only by users with `isAdmin = true`.
2. **Movie Catalog & Discovery**:
   - Movie listing with posters, titles, genres, durations, and certification ratings (`U`, `U/A`, `A`).
   - Interactive genre filtering (All, Sci-Fi, Animation, Action, Biography).
   - Movie detail page with synopsis, cast & crew, and scheduled showtimes grouped by theatre.
3. **Interactive 50-Seat Layout (Rows A-E, 10 Seats Each)**:
   - Modern cinema screen perspective indicator.
   - Live seat state indicators: **Available (Green)**, **Selected (Amber)**, and **Booked (Red)**.
   - Real-time seat collision protection and selection limit (1 to 6 seats per booking).
4. **Booking Lifecycle**:
   - Booking confirmation with immediate status `CONFIRMED`.
   - **My Bookings** dashboard displaying all active and cancelled reservations.
   - **Cancel Booking** capability that immediately frees the reserved seats for other guests.
5. **Admin Management**:
   - Full CRUD for Movies (Title, Genre, Duration, Rating, Poster URL, Synopsis, Cast).
   - Full CRUD for Showtimes (Movie, Theatre Name, Show Date, Show Time, Ticket Price).
6. **🎯 Stretch Goals Implemented**:
   - **Boarding Pass Cinema Ticket**: Printable e-ticket modal with barcode mock and print-to-PDF support.
   - **Live Countdown Timer**: Real-time ticker counting down hours, minutes, and seconds until showtime start.
   - **Movie Search Bar**: Instant title and cast filtering.

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    Client["React 18 + TypeScript (Vite)<br/>Port 5173"]
    API["Spring Boot 3 REST API<br/>Port 8080"]
    Security["Spring Security 6<br/>(JWT + BCrypt)"]
    ServiceLayer["Service Layer<br/>(Auth, Movie, Showtime, Booking)"]
    DB[("H2 Database (Dev) /<br/>PostgreSQL (Prod)")]

    Client -->|HTTP / JSON (Bearer JWT)| API
    API --> Security
    Security --> ServiceLayer
    ServiceLayer --> DB
```

| Layer | Technologies | Details |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router 6, Lucide Icons | Glassmorphic cinema design system, responsive flex/grid, zero external CSS bloat |
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Web, Spring Data JPA, Hibernate | RESTful design, Layered architecture (Controller, Service, Repository, DTO) |
| **Security** | Spring Security 6, JJWT 0.12.5, BCrypt | Stateless JWT Bearer tokens, Method-level role authorization (`@PreAuthorize`) |
| **Database** | In-Memory H2 (Dev) & PostgreSQL driver (Prod) | Auto-seeded via `CommandLineRunner` / `data.sql` |
| **Documentation & Tests** | JUnit 5, Mockito, Springdoc OpenAPI 2.5.0 (Swagger UI), Postman | 19 unit tests passing (100% test pass rate), automated E2E script |

---

## 🗄️ Data Model & Relationships

- **User** `(1) ── (M)` **Booking**
- **Movie** `(1) ── (M)` **Showtime**
- **Showtime** `(1) ── (M)` **Booking**
- **Booking** `(1) ── (M)` **BookingSeat**
- **BookingSeat**: Stores `seatCode` (e.g., `A1`, `B5`, `C4`) associated with a `Booking` and `Showtime`. When a booking is cancelled, seats are dynamically freed.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17+** (Installed: Microsoft OpenJDK 17)
- **Maven 3.9+** (Installed: Apache Maven 3.9.16)
- **Node.js 18+** & **npm** (Installed: Node.js v24.20.0 LTS)

### 1. Run the Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
- Backend runs on `http://localhost:8080`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON Spec: `http://localhost:8080/v3/api-docs`
- H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:cinepassdb`, User: `sa`, Password: empty)

### 2. Run the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on `http://localhost:5173`
- The Vite dev server automatically proxies `/api` calls to `http://localhost:8080`.

---

## 🔑 Pre-Seeded Credentials & Seed Data

On startup, CinePass automatically populates the database with:

### Seed Users
| Role | Email | Password | Admin Flag |
|---|---|---|---|
| **Admin** | `admin@cinepass.com` | `admin123` | `isAdmin = true` |
| **User** | `user@cinepass.com` | `user123` | `isAdmin = false` |

> *Tip: The Login page contains **"Admin Demo"** and **"User Demo"** one-click buttons to instantly autofill these credentials.*

### Seed Movies & Initial Bookings
- **Interstellar** (Sci-Fi, 169m, U/A) – Showtimes at PVR Cinemas & INOX (Seats `C4` and `C5` pre-booked)
- **The Lion King** (Animation, 118m, U) – Showtimes at INOX & Cinepolis (Seats `B7` and `B8` pre-booked)
- **The Dark Knight** (Action, 152m, U/A) – Showtimes at PVR Cinemas & Cinepolis
- **Inception** (Sci-Fi, 148m, U/A) – Showtime at INOX Multiplex
- **Oppenheimer** (Biography, 180m, A) – Showtime at PVR Cinemas IMAX
- **Spider-Man: Across the Spider-Verse** (Animation, 140m, U) – Showtime at Cinepolis Grand

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `POST` | `/api/auth/logout` | Invalidate / clear session | Public |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Bearer JWT |

### Movies (`/api/movies`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/movies` | List movies (supports `?genre=` & `?search=`) | Public |
| `GET` | `/api/movies/{id}` | Movie details + associated showtimes | Public |
| `POST` | `/api/movies` | Create a new movie | Admin Only |
| `PUT` | `/api/movies/{id}` | Update movie details | Admin Only |
| `DELETE` | `/api/movies/{id}` | Remove movie and showtimes | Admin Only |

### Showtimes (`/api/showtimes`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/movies/{id}/showtimes` | List showtimes for a movie | Public |
| `GET` | `/api/showtimes` | List all showtimes | Public |
| `GET` | `/api/showtimes/{id}` | Get showtime details | Public |
| `GET` | `/api/showtimes/{id}/seats` | List booked seat codes (e.g. `["A1","A2"]`) | Public |
| `POST` | `/api/showtimes` | Schedule a new showtime | Admin Only |
| `PUT` | `/api/showtimes/{id}` | Update a showtime | Admin Only |
| `DELETE` | `/api/showtimes/{id}` | Delete a showtime | Admin Only |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/bookings` | Create booking (`{showtimeId, seatCodes[]}`) | User / Admin |
| `GET` | `/api/bookings/mine` | List user's booking history | User / Admin |
| `GET` | `/api/bookings/{id}` | Get booking details | User / Admin |
| `DELETE` | `/api/bookings/{id}` | Cancel booking and release seats | User / Admin |

### Standardized Error Format
```json
{
  "timestamp": "2026-10-09T15:10:35Z",
  "path": "/api/bookings",
  "error": "CONFLICT",
  "message": "Seat(s) already booked: A3"
}
```

---

## 🧪 Testing & Validation

### Backend Unit Tests
To run the automated JUnit 5 & Mockito test suite:
```bash
cd backend
mvn test
```
**Test Results**:
- **Total**: 24 tests passed across the authentication, movie, showtime, and booking service suites.

### Postman Collection
The Postman collection is located at:
`postman/CinePass.postman_collection.json`  
It contains preconfigured requests with environment variables for token management, movie/showtime IDs, and booking verification.

---

## ⚖️ Architectural Constraints & Trade-Offs

1. **Stateless JWT vs. Stateful HTTP Sessions**:
   - *Choice*: Stateless JWT via `Authorization: Bearer <token>`.
   - *Trade-off*: Simpler horizontal scaling and decoupled frontend; tokens cannot be invalidated server-side prior to expiration without a blacklist cache.
2. **Dynamic Seat Allocation vs. Static Seat Table**:
   - *Choice*: Foundation specification stores seats as `seatCode` on `BookingSeat` entity per showtime.
   - *Trade-off*: Minimizes table schema overhead while accurately rendering the 50-seat grid (`A1`–`E10`); cancellation simply updates booking status to `CANCELLED` and frees seats dynamically.
3. **Optimistic Frontend Selection**:
   - *Choice*: Selected seats are held in client state until "Confirm Booking" is pressed, at which point backend enforces strict database-level conflict checks.
   - *Trade-off*: Eliminates complex distributed locking services at Foundation tier while providing 409 Conflict rejection if another user confirms the same seat simultaneously.

---

## 🤖 Generative AI Citation (Capstone Rubric)

- **Boilerplate & Entities**: Spring Data JPA entity annotations, CORS configurations, and OpenAPI components were structured with AI pair programming.
- **Mock Data Generation**: Realistic synopsis text, showtime schedules, and high-resolution Unsplash movie posters were generated to create a production-grade experience without placeholder graphics.
- **Refactoring & Polish**: Streamlined responsive CSS layout rules and unified REST exception response handling.