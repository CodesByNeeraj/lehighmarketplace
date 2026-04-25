# Lehigh Marketplace

Lehigh Marketplace is a dedicated peer to peer platform designed specifically for the Lehigh University community. It solves the problem of students relying on scattered GroupMe chats or unsafe public sites to buy and sell items. The app allows students to list items like study materials, textbooks, and electronics in a secure environment. It uses a verification system to ensure only people with a Lehigh email address can participate. This builds trust and safety for on campus exchanges.

---

## Project Overview

**Lehigh Marketplace** is a web application that lets Lehigh University students list items for sale, browse available listings, message sellers, and save favorites, all within a trusted, Lehigh-only community. Registration is restricted to `@lehigh.edu` email addresses, verified via OTP.

---

## Team Members & Roles

| Name | Role |
|---|---|
| Neeraj Lakshmanan | Fullstack Developer, Product Manager 2 |
| Thi Tran | Product Manager 1 |

---

## Application Features

### How the project meets each requirement

**User Accounts & Roles**
- Students register with a verified `@lehigh.edu` email and receive a JWT on login
- Admins have a separate login and can view/delete any listing
- Role-based access control enforced on all protected routes (`STUDENT` vs `ADMIN`)

**Database**
- PostgreSQL database hosted on [Neon](https://neon.com/) (serverless)
- Managed via Prisma ORM with the following models: `Student`, `StudentProfile`, `Listing`, `SavedListing`, `Conversation`, `Message`, `Admin`, `VerificationCode`, `Waitlist`
- Custom Built Prisma Firewall enabled for database-level security (rate limiting, audit logs, query protection)

**Interactive UI**
- Browse listings with ease
- Instagram style messaging between buyers and sellers
- Image upload from device with instant preview
- Search and filter listings dynamically
- Forms for registration, login, listing creation, profile editing, and password reset

**New Library or Framework (Not Covered in Class)**
- **Prisma ORM** — Used for all database access with a type-safe schema, migrations, and the Neon serverless adapter
- **Cloudinary SDK** — Used for cloud-based image storage and delivery

**Internal REST API**
- Full RESTful API built with Express, used by the React frontend for all data operations:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new student |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/reset-password` | Reset password via OTP |
| GET | `/api/profile/:id` | Get student profile |
| PUT | `/api/profile/:id` | Update student profile |
| GET | `/api/listings` | Get all listings |
| POST | `/api/listings` | Create a listing |
| PUT | `/api/listings/:id` | Update a listing |
| DELETE | `/api/listings/:id` | Delete a listing |
| POST | `/api/listings/:id/save` | Save a listing |
| DELETE | `/api/listings/:id/unsave` | Unsave a listing |
| GET | `/api/messages/:conversationId` | Get messages in a conversation |
| POST | `/api/messages` | Send a message |
| POST | `/api/upload/upload-image` | Upload an image to Cloudinary |
| POST | `/api/admin/login` | Admin login |
| DELETE | `/api/admin/listings/:id` | Admin delete a listing |

**External REST API**
- **Google Weather API** — fetches live weather conditions for Bethlehem, PA (Lehigh's campus coordinates: `40.6054, -75.3772`) and displays them on the homepage

---
## Installation & Setup

### Published Live @ https://lehighmarketplace.vercel.app/landing

### Prerequisites to run locally

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Cloudinary](https://cloudinary.com) account
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for sending OTP emails
- A [Google Cloud](https://console.cloud.google.com) project with the Weather API enabled

### 1. Clone the repository

```bash
git clone https://github.com/CodesByNeeraj/lehighmarketplace.git
cd lehighmarketplace
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Configure environment variables

Create `server/.env`:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
GOOGLE_MAPS_API_KEY=your_google_weather_api_key
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5002/api
```

### 4. Run database migrations

```bash
cd server
npx prisma migrate dev
```

### 5. Start the development servers

```bash
# Terminal 1 — backend
cd server
node index.js

# Terminal 2 — frontend
cd client
npm run dev
```

The app runs at `http://localhost:5173`. The API runs at `http://localhost:5002`.

---

## API Keys & External Services

| Service | Purpose | Where to get it |
|---|---|---|
| Neon | PostgreSQL database | [neon.tech](https://neon.tech) |
| Cloudinary | Image uploads & storage | [cloudinary.com](https://cloudinary.com) → Dashboard |
| Gmail App Password | Sending OTP emails | Google Account → Security → App Passwords |
| Google Weather API | Live campus weather | [Google Cloud Console](https://console.cloud.google.com) → Weather API |

---

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon (serverless PostgreSQL)
- **Images:** Cloudinary

All environment variables listed above must be added to the respective Render (server) and Vercel (client) environment settings.
