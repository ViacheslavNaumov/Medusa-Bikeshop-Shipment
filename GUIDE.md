# Bikeshop Shipment Application Guide

This guide provides detailed instructions for setting up, running, and extending the Bikeshop Shipment application.

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [API Documentation](#api-documentation)
6. [Extending the Application](#extending-the-application)
7. [Troubleshooting](#troubleshooting)

## Introduction

The Bikeshop Shipment application is built using Medusa v2, a headless commerce platform. It provides functionality for tracking shipments, managing payment methods, and integrating with Stripe for payment processing.

### Key Features

- **Shipment Management**: Create, track, and manage shipments with status updates
- **Payment Method Management**: Allow users to add and manage multiple payment methods
- **Stripe Integration**: Process payments securely with Stripe
- **User Management**: Manage user accounts and authentication

## Architecture Overview

The application follows a modular architecture with clear separation of concerns:

### Backend (Medusa Server)

- **Modules**: Self-contained units with models, repositories, and services
  - `shipment`: Handles shipment tracking and management
  - `payment`: Handles payment method management and Stripe integration
- **API Routes**: RESTful endpoints for interacting with the application
  - `admin`: Routes for administrative operations
  - `store`: Routes for customer-facing operations
- **Migrations**: Database schema changes

### Frontend (Next.js Storefront)

- **Pages**: React components for different views
- **Components**: Reusable UI elements
- **Hooks**: Custom React hooks for data fetching and state management
- **API**: Client-side API calls to the Medusa server

## Installation

### Prerequisites

- Node.js v16 or later
- PostgreSQL
- Stripe account (for payment processing)

### Step 1: Clone the Repository

```bash
git clone https://github.com/ViacheslavNaumov/Medusa-Bikeshop-Shipment.git
cd Medusa-Bikeshop-Shipment
```

### Step 2: Set Up the Database

Run the database setup script:

```bash
chmod +x setup-database.sh
./setup-database.sh
```

This script will:
- Start PostgreSQL if it's not running
- Create the `medusa-bikeshop-shipment` database
- Create a PostgreSQL user with the necessary permissions

### Step 3: Install Dependencies

Install dependencies for both the backend and frontend:

```bash
# Install backend dependencies
cd bikeshop-shipment
npm install

# Install frontend dependencies
cd ../bikeshop-shipment-storefront
npm install
```

### Step 4: Configure Environment Variables

Create `.env` files for both the backend and frontend:

Backend (bikeshop-shipment/.env):
```
DATABASE_URL=postgres://postgres:postgres@localhost/medusa-bikeshop-shipment
STRIPE_API_KEY=your_stripe_api_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
STORE_CORS=http://localhost:8000,http://localhost:12001
ADMIN_CORS=http://localhost:5173,http://localhost:9000,http://localhost:12000
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,http://localhost:12000,http://localhost:12001
PORT=12000
```

Frontend (bikeshop-shipment-storefront/.env):
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:12000
PORT=12001
```

## Running the Application

### Option 1: Run Everything at Once

Use the provided script to start both the backend and frontend:

```bash
chmod +x start-all.sh
./start-all.sh
```

### Option 2: Run Backend and Frontend Separately

#### Start the Backend

```bash
cd bikeshop-shipment
chmod +x start-server.sh
./start-server.sh
```

The server will be available at http://localhost:12000

#### Start the Frontend

```bash
cd bikeshop-shipment-storefront
chmod +x start-storefront.sh
./start-storefront.sh
```

The storefront will be available at http://localhost:12001

## API Documentation

### Shipment Endpoints

#### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/shipments | List all shipments |
| GET | /admin/shipments/:id | Get shipment by ID |
| POST | /admin/shipments | Create a new shipment |
| PUT | /admin/shipments/:id | Update a shipment |
| PUT | /admin/shipments/:id/status | Update shipment status |
| DELETE | /admin/shipments/:id | Delete a shipment |

#### Store Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /store/shipments | List shipments for the current user |
| GET | /store/shipments/:id | Get shipment by ID for the current user |
| POST | /store/shipments | Create a new shipment for the current user |
| PUT | /store/shipments/:id | Update a shipment for the current user |
| DELETE | /store/shipments/:id | Delete a shipment for the current user |

### Payment Method Endpoints

#### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/payment-methods | List all payment methods |
| GET | /admin/payment-methods/:id | Get payment method by ID |
| DELETE | /admin/payment-methods/:id | Delete a payment method |

#### Store Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /store/payment-methods | List payment methods for the current user |
| GET | /store/payment-methods/:id | Get payment method by ID for the current user |
| POST | /store/payment-methods | Create a new payment method for the current user |
| PUT | /store/payment-methods/:id | Update a payment method for the current user |
| DELETE | /store/payment-methods/:id | Delete a payment method for the current user |
| PUT | /store/payment-methods/:id/default | Set a payment method as default |

### Stripe Integration Endpoints

#### Store Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /store/stripe/setup-intent | Create a setup intent for adding a payment method |
| GET | /store/stripe/payment-methods/:customer_id | List Stripe payment methods for a customer |
| POST | /store/stripe/customers | Create a Stripe customer |
| POST | /store/stripe/payment-methods | Add a Stripe payment method for a customer |
| DELETE | /store/stripe/payment-methods | Detach a Stripe payment method |

## Extending the Application

### Adding a New Module

1. Create the module structure:
```
src/modules/your-module/
├── models/
│   ├── your-model.ts
│   └── index.ts
├── repository/
│   ├── your-model.repository.ts
│   └── index.ts
├── services/
│   ├── your-model.service.ts
│   └── index.ts
└── index.ts
```

2. Register the module in `src/modules/index.ts`

3. Create API routes in `src/api/routes/admin/` and `src/api/routes/store/`

4. Register the routes in `src/api/routes/admin/index.ts` and `src/api/routes/store/index.ts`

### Creating a Migration

```bash
npx medusa migrations create create-your-table
```

Then edit the migration file in `src/migrations/`.

### Adding a New API Endpoint

1. Create a route handler in the appropriate directory:
```typescript
// src/api/routes/store/your-module/route-handlers.ts
import { Request, Response } from "express"
import YourService from "../../../../modules/your-module/services/your-service"

export async function yourHandler(req: Request, res: Response) {
  const yourService: YourService = req.scope.resolve("yourService")
  const result = await yourService.yourMethod()
  return res.json({ result })
}
```

2. Create a route file:
```typescript
// src/api/routes/store/your-module/index.ts
import { Router } from "express"
import { wrapHandler } from "@medusajs/medusa"
import { yourHandler } from "./route-handlers"

const router = Router()

export default router

router.get("/", wrapHandler(yourHandler))
```

3. Register the route in `src/api/routes/store/index.ts`:
```typescript
import yourModuleRoutes from "./your-module"
router.use("/your-module", yourModuleRoutes)
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Check if PostgreSQL is running:
```bash
sudo service postgresql status
```

2. Verify the database exists:
```bash
sudo -u postgres psql -l
```

3. Check the database connection string in your environment variables.

### API Errors

If you encounter API errors:

1. Check the server logs for error messages.

2. Verify that the request is properly formatted.

3. Check that the required parameters are provided.

### Authentication Issues

If you encounter authentication issues:

1. Check that the JWT_SECRET and COOKIE_SECRET environment variables are set.

2. Verify that the CORS settings are correct.

3. Check that the user is properly authenticated.

### Stripe Integration Issues

If you encounter Stripe integration issues:

1. Verify that the Stripe API key is correct.

2. Check that the Stripe webhook secret is correct.

3. Verify that the Stripe customer ID is valid.

## Conclusion

This guide provides a comprehensive overview of the Bikeshop Shipment application. For more detailed information, refer to the [Medusa documentation](https://docs.medusajs.com/) and the [Stripe documentation](https://stripe.com/docs).