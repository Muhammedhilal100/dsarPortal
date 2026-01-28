# Machine Test: “DSAR Portal”

## Goal
Build a small SaaS-style app with:
- 3 user types: Admin, Company Owner, End User  
- Company registration + Admin approval  
- Unique public company URL (no login required)  
- End user DSAR submission form  
- Visibility + actions on DSAR requests for Admin & Company Owner  
- Subscription for Company Owners that keeps the public page active  

## Timebox
6 to 8 hours max (prioritise core flows over polish)

## Tech Requirements

### Must Use
- Next.js (App Router preferred) + TypeScript  
- A DB (choose one): PostgreSQL / SQLite / Supabase DB (Bonus)  
- Auth (choose one): NextAuth, Supabase (Bonus) OR simple credentials-based auth  
- Subscriptions (Mock/Checkout + Webhook) (Stripe preferred)

### Optional (Nice)
- Tailwind/Shadcn UI  
- Zod for validation  
- Server Actions / API routes  
- Role-based middleware  

---

## User Roles & Permissions

### Admin
- Can view all companies and all DSAR requests  
- Can approve/reject company registrations  
- Can set company status: approved, rejected, pending  
- Can view subscription status  

### Company Owner
- Can sign up / log in  
- Can create and manage their company profile  
- Can see DSAR requests submitted to their company  
- Can update DSAR request status (e.g. mark as “In Progress / Completed”)  
- Must have an active Stripe subscription to keep their public URL active  

### End User (No login)
- Accesses the company's public page via a unique URL  
- Views company details + selected representation (EU/UK)  
- Can submit DSAR: name, phone, email, request text  

---

## Core Functional Requirements (MVP)

### 1) Company Owner Signup/Login
- Basic authentication for Owners  
- After logging in, the owner sees the Owner Dashboard  
- The owner can submit company registration details:
  - Company name  
  - Company Logo  
  - Company Details (address, email, number, etc.)  
  - #Employees (number)  
  - Field of work/service (string)  
  - Representation region: EU and/or UK  
- The company starts as **pending**

### 2) Admin Review
Admin dashboard page:
- List companies with pending status  
- Admin can approve or reject a company  
- Once approved:
  - System generates a unique public slug (example: `acme-ltd-8f3a`)  
  - Public URL becomes: `/c/[slug]`

### 3) Public Company Page (No Login)
Route: `/c/[slug]`

Shows:
- Company name and logo  
- Company information  
- Field of work/service  
- #Employees  
- Representation region(s)  

CTA: **Submit DSAR**

DSAR Form fields:
- Name  
- Email  
- Phone  
- Document uploads  
- Request details (textarea)

On submit:
- Save DSAR to the DB linked to that company  
- Show success state  

### 4) DSAR Management for Admin + Owner
- Admin: view all DSAR requests  
- Owner: view only their company DSAR requests  
- Pagination/filtering on DSAR list  
- Each DSAR has:
  - status: open, in_progress, in_review, closed  
  - created timestamp  

Actions:
- Owner can change status and contact requested users  
- Admin can change status and contact requested users  

---

## Subscription Requirements

### Purpose
A company’s public page is active only if:
- company is approved  
- AND owner has an active subscription (active or trialing)  

Stripe Flow (Optional + Bonus)
- Owner dashboard has “Subscribe” button  
- Clicking opens Stripe Checkout for a subscription price  
- After payment:
  - Webhook updates subscription status in DB  

Public page behavior:
- If company approved but subscription inactive:
  - Public URL loads but shows:
    - “This company’s DSAR portal is currently inactive”
  - Hide/disable DSAR form  
- If subscription active:
  - DSAR form enabled  

Minimum Stripe implementation expected:
- Checkout Session creation endpoint/server action  
- Webhook endpoint handles events like:
  - checkout.session.completed  
  - customer.subscription.created/updated/deleted  

Persist:
- stripeCustomerId  
- stripeSubscriptionId  
- subscriptionStatus  

---

## Suggested Data Model

### User
- id  
- email  
- passwordHash (or NextAuth provider)  
- role: admin | owner  
- createdAt  

### Company
- id  
- ownerId  
- name  
- Company info fields including logo  
- employeesCount  
- field  
- representation: EU | UK | EU_UK  
- status: pending | approved | rejected  
- slug (nullable until approved)  
- stripeCustomerId (nullable)  
- stripeSubscriptionId (nullable)  
- subscriptionStatus: inactive | trialing | active | canceled | past_due  
- createdAt  

### DsarRequest
- id  
- companyId  
- requesterName  
- requesterEmail  
- requesterPhone  
- requestText  
- status: open | in_progress | in_review | closed  
- createdAt  

---

## Pages / Routes Expected

### Owner
- /auth/login (and optionally register)  
- /owner dashboard  
  - company details + status  
  - subscribe button + subscription status  
  - list DSAR requests  

### Admin
- /admin  
  - pending companies list  
  - approve/reject actions  
  - list DSAR requests (all)  

### Public
- /c/[slug] public company page + DSAR form  

---

## Acceptance Criteria Checklist

### Functional
- Role-based access works (owner can’t access admin)  
- Owner can register company and see pending status  
- Admin can approve → slug generated → public URL works  
- End user can submit DSAR without login  
- DSAR visible to owner and admin  
- DSAR status can be updated  
- Stripe subscription activates company portal  
- If subscription inactive → DSAR submission disabled  

### Engineering
- Clean TypeScript, reasonable folder structure  
- Validation on inputs (client/server)  
- Proper error states  
- Minimal but clear UI  

### Bonus (Do if time)
Pick any 2:
- Email notification stub when DSAR created  
- Soft delete or audit logs for status changes  
- Rate limiting / spam protection on DSAR form  
- Admin can impersonate viewing the public page state  

---

## Deliverables
1. GitHub repo (or zipped project)  
2. README.md with:
   - Setup steps  
   - Env variables  
   - DB migrate/seed steps  
   - Stripe setup + webhook testing instructions  
   - Test admin + owner credentials  
3. Deployed URL (optional)