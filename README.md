# Pandey Care — Clinic Web App

A full-stack Next.js appointment booking and prescription management system built for Dr. Shivansh A. Pandey, MBBS.

## Features
- **Public Website:** Home, About, and Contact pages with responsive, animated design.
- **Patient Portal:** Sign up/login, book appointments (with real-time conflict checking), view past appointments, and download prescription PDFs.
- **Admin Dashboard (Doctor):** Manage weekly schedule, view daily appointments, write and generate prescription PDFs dynamically.
- **Communications:** Nodemailer integration for booking confirmations and a hybrid WhatsApp link integration for sharing prescriptions.
- **Security:** bcrypt password hashing, NextAuth JWT sessions, role-based middleware protection, and server-side Zod validation.

## Tech Stack
- **Framework:** Next.js 14 App Router + TypeScript
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** NextAuth.js v4 (credentials provider)
- **Styling:** Vanilla CSS with custom design system properties
- **PDF Generation:** `@react-pdf/renderer`

## Getting Started

### 1. Prerequisites
- Node.js >= 18
- MongoDB Atlas cluster URL
- (Optional) Gmail app password for SMTP
- (Optional) Meta Developer tokens for WhatsApp Cloud API

### 2. Environment Setup
Copy the template and fill in your variables:
```bash
cp .env.example .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Seed
Run the seed script to create the initial admin account (using credentials in `.env.local`):
```bash
npm run seed
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.
- **Admin Login:** Use the credentials configured in `.env.local`
- **Patient Login:** Click "Sign Up" from the top right to create a patient profile.
