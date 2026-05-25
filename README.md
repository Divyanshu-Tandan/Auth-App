# Auth-App

A full-stack authentication system built with Node.js/Express, MongoDB, React, and Vite featuring JWT authentication, email verification, password reset, admin dashboard, and React Portal-based modal architecture.

---

## Tech Stack

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Bcrypt
* Nodemailer
* Cookie Parser
* CORS
* Dotenv

### Frontend

* React + Vite
* React Router DOM
* Axios
* Tailwind CSS
* Lucide React

---

## Core Features

### Authentication

* User Registration
* User Login & Logout
* JWT Authentication with httpOnly Cookies
* Email Verification (OTP)
* Forgot/Reset Password

### Admin Dashboard

* View All Users
* Update User Roles
* Delete Users
* Role-Based Access Control

### Modal System

* Reusable React Portal Modal
* ESC Key Close
* Click Outside to Close
* Body Scroll Lock
* Smooth Animations
* No z-index conflicts

---

## Backend Architecture

### Main Components

* `config/db.js` → MongoDB connection
* `models/user.js` → User schema
* `middleware/auth.middleware.js` → JWT verification
* `middleware/admin.middleware.js` → Admin protection
* `routes/auth.routes.js` → Auth & admin routes
* `config/mail.js` → Email service

### Main API Routes

* `POST /api/users/register`
* `POST /api/users/login`
* `POST /api/users/logout`
* `POST /api/users/verify-email`
* `POST /api/users/forgot-password`
* `POST /api/users/reset-password`
* `GET /api/users/getAllUsers`
* `PUT /api/users/:id/role`
* `DELETE /api/users/:id`

---

## Frontend Architecture

### Main Components

* `Navbar.jsx`
* `Modal.jsx`
* `LogoutModal.jsx`
* `DeleteModal.jsx`
* `AdminPanel.jsx`

### Modal Architecture

Uses `createPortal()` to render modals into `document.body`, preventing navbar overlay and z-index issues.

---

## Authentication Flow

### Register

User registers → password hashed → user stored in MongoDB → OTP email sent.

### Login

User logs in → JWT generated → stored in httpOnly cookie → frontend authenticated.

### Logout

Logout modal opens → backend clears cookie → frontend clears user state.

### Admin Delete

Admin clicks delete → confirmation modal opens → backend deletes user → table refreshes.

---

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend

```env
PORT=5000
URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

---

## Security Features

* Password Hashing with Bcrypt
* JWT Authentication
* Secure httpOnly Cookies
* CORS Protection
* Email Verification
* Password Reset Tokens

---

## Summary

A production-ready authentication system with secure backend APIs, responsive frontend UI, admin dashboard, and scalable React Portal-based modal architecture.
