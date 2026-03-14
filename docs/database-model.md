# Database Modeling: Tool Rental Management System

## Overview
This document outlines the database schema for the Tool Rental Management System. The application is designed for a small tools shop to manage inventory, track rentals, and handle payments efficiently. The database model will be implemented using PostgreSQL and Prisma ORM in the future.

## Entity Relationship Diagram (ERD)

```text
Customer (1) ---- (N) Rentals
Rentals  (1) ---- (N) RentalItems
Tools    (1) ---- (N) RentalItems
Rentals  (1) ---- (N) Payments
```

### Explanation of Relationships:
* **One Customer can have many Rentals**: A customer might rent tools multiple times across different days.
* **One Tool can appear in many RentalItems**: A single tool type (e.g., "Jali") can be rented repeatedly across different rental transactions.
* **One Rental can contain multiple tools (via RentalItems)**: A single rental transaction from a customer might involve multiple different tools (e.g., 5 Jali and 1 Stand).
* **One Rental can have payment records**: Payments (advance, final balance) are associated closely with the overall rental transaction. 

---

## Entity Descriptions and Table Structures

### 1. Tools
Stores information about each tool type available in the shop.
* `id` (String/UUID, Primary Key)
* `name` (String): e.g., Jali, Stand, Dimsa
* `totalQuantity` (Int): Total physical count owned by the shop
* `availableQuantity` (Int): Count currently in the shop (available to rent)
* `dailyPrice` (Float): Rental cost per day
* `imageUrl` (String, Optional): Cloudinary URL of the tool's photo
* `createdAt` (DateTime)
* `updatedAt` (DateTime)

### 2. Customers
Stores customer information securely for accountability.
* `id` (String/UUID, Primary Key)
* `name` (String)
* `mobile` (String): Unique identifier/contact number
* `village` (String): Location/address of the customer
* `photoUrl` (String, Optional): Cloudinary URL of the customer's photo for verification
* `createdAt` (DateTime)
* `updatedAt` (DateTime)

### 3. Rentals
Tracks individual rental transactions.
* `id` (String/UUID, Primary Key)
* `customerId` (String, Foreign Key to Customers)
* `startDate` (DateTime): The exact day the tools were taken
* `expectedDays` (Int): How long the customer plans to keep the tools
* `status` (Enum: `ACTIVE`, `RETURNED`, `OVERDUE`)
* `advanceAmount` (Float): Amount paid upfront
* `totalAmount` (Float, Optional): Final calculated total upon return
* `returnedAt` (DateTime, Optional): System sets this when tools are returned
* `createdAt` (DateTime)
* `updatedAt` (DateTime)

### 4. RentalItems
Tracks the specific tools and quantities taken out inside a specific rental transaction.
* `id` (String/UUID, Primary Key)
* `rentalId` (String, Foreign Key to Rentals)
* `toolId` (String, Foreign Key to Tools)
* `quantity` (Int): Number of tools of this specific type taken
* `returnedQuantity` (Int): To track partial returns if a customer brings back 3 out of 5 items early
* `dailyPriceSnapshot` (Float): Historical lock on the daily price (if prices change in the future, past rentals remain unaffected)

### 5. Payments
Tracks all financial events for accountability.
* `id` (String/UUID, Primary Key)
* `rentalId` (String, Foreign Key to Rentals)
* `amount` (Float)
* `type` (Enum: `ADVANCE`, `FINAL_SETTLEMENT`, `LATE_FEE`)
* `paymentMethod` (Enum: `CASH`, `UPI`, `CARD`)
* `createdAt` (DateTime)

### 6. ActivityLogs (Optional)
Audit log to track administrative actions taken by the shop owner for security and history.
* `id` (String/UUID, Primary Key)
* `action` (String): e.g., "RENTAL_CREATED", "TOOL_RETURNED", "INVENTORY_ADDED"
* `description` (String): e.g., "Rented 5 Jali to John from Village X"
* `userId` (String, Foreign Key if multi-admin is ever supported)
* `createdAt` (DateTime)

---

## Future Scalability Improvements
* **Multi-Store Support**: Adding a `storeId` to entities if the local business expands to multiple physical shops.
* **Partial Returns Accounting**: The `returnedQuantity` field in `RentalItems` already paves the way for complex return tracking where a user returns 5 stands today and 5 tomorrow.
* **Dynamic Pricing Models**: A separate table for seasonal pricing or bulk-discount rates based on customer tiers (e.g., frequent renters get 5% off).
* **Auth & Roles**: Implementing NextAuth.js with multi-user roles like `ADMIN` and `CLERK` for store employees.
