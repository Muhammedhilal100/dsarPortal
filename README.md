# DSAR Portal - Privacy Request Management System

A comprehensive web application for managing Data Subject Access Requests (DSAR) under GDPR and CCPA. The system allows companies to create branded portals, receive requests, and manage compliance workflows.

## 🚀 Getting Started

## 1. Prerequisites

- Node.js 18+
- PostgreSQL Database
- Stripe Account (for subscription features)

## 2. Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/dsar_db"

# Authentication (NextAuth.js)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="pass-secret" # Generate using: openssl rand -base64 32

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```


## 3. Installation & Database Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Initialize Database:**
    Generate the Prisma client and push the schema to your database.
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

3.  **Seed Database (Create Admin):**
    Populate the database with the initial admin account.
    ```bash
    node prisma/seed.js
    ```

## 4. Running the Application

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 💳 Stripe Setup & Webhook Testing

To handle subscriptions properly, you need to configure Stripe Webhooks locally.

1.  **Install Stripe CLI:**
    Follow the official guide: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

2.  **Login to Stripe:**
    ```bash
    stripe login
    ```

3.  **Forward Webhooks:**
    Listen for events and forward them to your local API route.
    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```

4.  **Get Webhook Secret:**
    The CLI will output a webhook secret (starting with `whsec_`). Copy this value into your `.env` file as `STRIPE_WEBHOOK_SECRET`.

---

## 🔐 Test Credentials

### **Admin Account** (Created via Seed)
*   **Email:** `admin@dsar.com`
*   **Password:** `admin123`
*   **Role:** Full system access (Approve/Reject companies, Global view)

### **Owner Account** (Manual Setup)
To test the "Company Owner" flow:
1.  Go to the `/register` page (or click "Get Started").
2.  Sign up with a new email (e.g., `owner@company.com`).
3.  **Note:** By default, new accounts have the standard user role until they register a company.
4.  Log in with the new account.
5.  Complete the "Register Company" form on the dashboard.
6.  **Log in as Admin** (`admin@dsar.com`) to **APPROVE** the new company.
7.  Log back in as the Owner to access the full portal features.

---

## 🛠 Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Database:** PostgreSQL + Prisma ORM
*   **Styling:** Tailwind CSS + Lucide Icons
*   **Auth:** NextAuth.js v5
*   **Payments:** Stripe
