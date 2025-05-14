# Bikeshop Shipment Application

This is a Medusa v2 application for managing shipments and payments for a bikeshop. The application provides functionality for tracking shipments, managing payment methods, and integrating with Stripe for payment processing.

## Features

### Shipment Management
- Create new shipments with tracking information
- List all shipments
- Get shipment details by ID
- Update shipment status and tracking information
- Delete shipments

### Payment Method Management
- Add multiple payment methods per user
- List all payment methods for a user
- Set default payment method
- Update payment method information
- Delete payment methods

### Stripe Integration
- Create Stripe customers
- Add payment methods via Stripe
- Manage payment methods with Stripe
- Process payments with Stripe

## Project Structure

The project is organized into modules, each with its own models, repositories, and services:

### Shipment Module
- `src/modules/shipment/models/shipment.ts`: Shipment entity with tracking fields
- `src/modules/shipment/repository/shipment.repository.ts`: Repository with custom query methods
- `src/modules/shipment/services/shipment.service.ts`: Service with CRUD operations

### Payment Module
- `src/modules/payment/models/payment-method.ts`: PaymentMethod entity
- `src/modules/payment/repository/payment-method.repository.ts`: Repository with custom query methods
- `src/modules/payment/services/payment-method.service.ts`: Service with CRUD operations
- `src/modules/payment/services/stripe-integration.service.ts`: Service for Stripe-specific operations

### API Routes
- `src/api/routes/store/shipments/`: Store API routes for shipment tracking
- `src/api/routes/admin/shipments/`: Admin API routes for shipment management
- `src/api/routes/store/payment-methods/`: Store API routes for payment methods
- `src/api/routes/admin/payment-methods/`: Admin API routes for payment method management
- `src/api/routes/store/stripe/`: Store API routes for Stripe integration

## API Endpoints

### Shipment Endpoints

#### Admin Routes
- `GET /admin/shipments`: List all shipments
- `GET /admin/shipments/:id`: Get shipment by ID
- `POST /admin/shipments`: Create a new shipment
- `PUT /admin/shipments/:id`: Update a shipment
- `DELETE /admin/shipments/:id`: Delete a shipment

#### Store Routes
- `GET /store/shipments`: List shipments for the current user
- `GET /store/shipments/:id`: Get shipment by ID for the current user

### Payment Method Endpoints

#### Admin Routes
- `GET /admin/payment-methods`: List all payment methods
- `GET /admin/payment-methods/:id`: Get payment method by ID
- `POST /admin/payment-methods`: Create a new payment method
- `PUT /admin/payment-methods/:id`: Update a payment method
- `DELETE /admin/payment-methods/:id`: Delete a payment method

#### Store Routes
- `GET /store/payment-methods`: List payment methods for the current user
- `GET /store/payment-methods/:id`: Get payment method by ID for the current user
- `POST /store/payment-methods`: Create a new payment method for the current user
- `PUT /store/payment-methods/:id`: Update a payment method for the current user
- `DELETE /store/payment-methods/:id`: Delete a payment method for the current user

### Stripe Integration Endpoints

#### Store Routes
- `POST /store/stripe/setup-intent`: Create a setup intent for adding a payment method
- `GET /store/stripe/payment-methods`: List Stripe payment methods for the current user
- `POST /store/stripe/payment-methods`: Add a Stripe payment method for the current user
- `DELETE /store/stripe/payment-methods/:id`: Delete a Stripe payment method for the current user

## Getting Started

### Prerequisites
- Node.js v16 or later
- PostgreSQL
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ViacheslavNaumov/Medusa-Bikeshop-Shipment.git
cd Medusa-Bikeshop-Shipment
```

2. Install dependencies:
```bash
cd bikeshop-shipment
npm install
```

3. Set up environment variables:
```
DATABASE_URL=postgres://postgres:postgres@localhost/medusa-bikeshop-shipment
STRIPE_API_KEY=your_stripe_api_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
```

4. Run migrations:
```bash
npx medusa migrations run
```

5. Start the server:
```bash
./start-server.sh
```

6. Start the storefront:
```bash
./start-storefront.sh
```

## Development

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

## Deployment

For production deployment, set the following environment variables:

```
NODE_ENV=production
DATABASE_URL=your_production_database_url
STRIPE_API_KEY=your_production_stripe_api_key
STRIPE_WEBHOOK_SECRET=your_production_stripe_webhook_secret
JWT_SECRET=your_production_jwt_secret
COOKIE_SECRET=your_production_cookie_secret
```

## License

This project is licensed under the MIT License.