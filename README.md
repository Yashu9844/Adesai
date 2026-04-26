# Sri Sai Baba Tool Rental Management System

A production-grade, mobile-first operations and point-of-sale platform built for Sri Sai Baba Tool Rentals. The app centralizes inventory, rentals, returns, and payments so staff can run the shop from a phone or tablet without losing control of physical assets or money flow.

## What This App Is

- A single system for the shop to track tools, customers, rentals, returns, and payments.
- Designed for fast, on-counter workflows with minimal typing and clear status signals.
- Built as a web app that also ships as an Android app via Capacitor.

## Who Uses It

- Owner/Manager: oversees daily revenue, overdue rentals, inventory status, and audit logs.
- Staff: creates rentals, returns items, and records payments throughout the day.

## Daily Workflow (User Manual)

### 1) Sign In

1. Open the login screen.
2. Enter the admin password.
3. On success, the app redirects to the dashboard and stores an `admin-session` cookie.

### 2) Dashboard

- Review today's totals and active rental count.
- Check low-inventory and overdue flags.
- Use the activity log to confirm every change is recorded.

### 3) Inventory

- Add new tool models (name, daily price, quantity, and photo).
- Add or remove individual tool units as stock changes.
- Verify each unit status before starting a rental.

### 4) Create a Rental

1. Pick or create a customer.
2. Select tool models and assign specific units.
3. Set rental days, deposit, and payment method.
4. Confirm the rental to lock the pricing snapshot.

### 5) Active Rentals and Returns

- Use the active rentals list to find a customer.
- Return items one by one or in batches.
- The system calculates total days, applies deposits, and computes final balance.

### 6) History and Payments

- Review completed rentals.
- See payment history and final settlements.
- Use this screen for audits and dispute resolution.

## Business Rules (How the System Thinks)

- Inventory is tracked at two levels: tool models and individual tool units.
- A rental can include multiple tool models and multiple units per model.
- Each rental keeps a price snapshot to preserve history even if prices change later.
- Status transitions are strict: available -> rented -> returned (or maintenance/lost).
- Every important action is logged in `ActivityLog` for accountability.

## Data Model Overview

Key entities and relationships are documented in [docs/database-model.md](docs/database-model.md). The live schema centers around:

- `Tool` and `ToolItem` (model vs. physical unit)
- `Customer`
- `Rental`, `RentalItem`, and `RentalItemDetail`
- `Payment`
- `ActivityLog`

## Design System

The documented design system lives in [docs/design-system.md](docs/design-system.md). It defines the mobile-first UI rules, spacing, and color system used across the app.

## Tech Stack

- Frontend: Next.js 16 (App Router), React 19
- Styling: Tailwind CSS v4
- State: Zustand
- ORM/DB: Prisma 5 + PostgreSQL
- Media: Cloudinary
- Mobile: Capacitor 7 for Android

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL
- Cloudinary account (only needed for tool photos)
- Android Studio (only needed for mobile builds)

### Install and Run

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/tool_rental"
ADMIN_PASSWORD="change-this-in-production"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Notes:

- If `ADMIN_PASSWORD` is missing, the login uses the fallback `admin123` for local development only. Change it for any real deployment.
- `CLOUDINARY_*` is required only if you upload tool photos.

### Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run cap:sync
npm run cap:open
```

## Android Build (Capacitor)

```bash
npm run build
npm run cap:sync
npm run cap:open
```

## Operations and Security

- Access is protected by a lightweight admin password gate.
- Sessions are stored in an `admin-session` cookie.
- All critical operations emit `ActivityLog` records for audit trails.

## Troubleshooting

- Login fails: confirm `ADMIN_PASSWORD` in `.env` and restart the dev server.
- Prisma errors: run `npx prisma generate` and `npx prisma db push` again.
- Android sync fails: make sure Android SDKs are installed and `cap:sync` succeeds.

---

Maintained for Sri Sai Baba Tool Rentals.
