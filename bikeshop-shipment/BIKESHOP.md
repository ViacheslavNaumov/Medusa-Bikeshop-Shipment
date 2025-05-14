# Bikeshop Shipment - Medusa v2 Project

A Medusa v2 project for a bikeshop shipping website with shipment tracking, payment methods, and Stripe integration.

## Features

- **Shipment Management**
  - Create, update, and track shipments
  - Shipment status tracking
  - Carrier information

- **Payment Methods**
  - Multiple payment methods per user
  - Default payment method selection
  - Secure storage of payment information

- **Stripe Integration**
  - Add and manage payment methods
  - Secure payment processing
  - Customer management

## API Endpoints

### Shipments

#### Store API

- `GET /store/shipments/:id` - Get shipment by ID
- `GET /store/shipments/tracking/:tracking_number` - Get shipment by tracking number

#### Admin API

- `GET /admin/shipments` - List all shipments
- `GET /admin/shipments/:id` - Get shipment by ID
- `POST /admin/shipments` - Create a new shipment
- `PUT /admin/shipments/:id` - Update a shipment
- `DELETE /admin/shipments/:id` - Delete a shipment

### Payment Methods

#### Store API

- `GET /store/payment-methods?user_id=xxx` - List payment methods for a user
- `GET /store/payment-methods/:id` - Get payment method by ID
- `POST /store/payment-methods` - Create a new payment method
- `POST /store/payment-methods/:id/default` - Set a payment method as default
- `PUT /store/payment-methods/:id` - Update a payment method
- `DELETE /store/payment-methods/:id` - Delete a payment method

#### Admin API

- `GET /admin/payment-methods` - List all payment methods
- `GET /admin/payment-methods/:id` - Get payment method by ID
- `POST /admin/payment-methods` - Create a new payment method
- `PUT /admin/payment-methods/:id` - Update a payment method
- `DELETE /admin/payment-methods/:id` - Delete a payment method

### Stripe Integration

- `POST /store/stripe/setup-intent` - Create a setup intent for adding a payment method
- `GET /store/stripe/payment-methods/:customer_id` - List Stripe payment methods for a customer
- `POST /store/stripe/customers` - Create a Stripe customer
- `POST /store/stripe/payment-methods/attach` - Attach a payment method to a customer
- `POST /store/stripe/payment-methods/detach` - Detach a payment method from a customer

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   cp .env.template .env
   ```
   
   Edit the `.env` file to add your Stripe API keys and other configuration.

3. Run migrations:
   ```
   npx medusa migrations run
   ```

4. Start the development server:
   ```
   npx medusa develop
   ```

## Storefront

The project includes a Next.js storefront that can be started with:

```
cd ../bikeshop-shipment-storefront
npm install
npm run dev
```

## Environment Variables

- `STRIPE_API_KEY` - Your Stripe secret API key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `DATABASE_URL` - PostgreSQL connection URL
- `MEDUSA_ADMIN_CORS` - CORS settings for admin API
- `MEDUSA_STORE_CORS` - CORS settings for store API