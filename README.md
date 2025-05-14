# Medusa Bikeshop Shipment

A Medusa v2 application for managing shipments and payments for a bikeshop. This project provides a complete solution for tracking shipments, managing payment methods, and processing payments with Stripe.

## Features

- **Shipment Management**: Create, track, and manage shipments with status updates
- **Payment Method Management**: Allow users to add and manage multiple payment methods
- **Stripe Integration**: Process payments securely with Stripe
- **User Management**: Manage user accounts and authentication

## Project Structure

- `bikeshop-shipment/`: Medusa backend server
  - `src/modules/shipment/`: Shipment module with models, repository, and services
  - `src/modules/payment/`: Payment module with models, repository, and services
  - `src/api/routes/`: API routes for admin and store
  - `src/migrations/`: Database migrations
- `bikeshop-shipment-storefront/`: Next.js frontend application

## Quick Start

### Prerequisites

- Node.js v16 or later
- PostgreSQL
- Stripe account (for payment processing)

### Option 1: Automated Setup and Start

We provide several scripts to make setup and running the application easier:

```bash
# Install all dependencies and set up the database
chmod +x install-dependencies.sh
./install-dependencies.sh

# Start both the backend and frontend in development mode
chmod +x dev.sh
./dev.sh
```

### Option 2: Manual Setup

#### Setting Up the Database

```bash
# Run the database setup script
chmod +x setup-database.sh
./setup-database.sh
```

#### Starting the Backend

```bash
cd bikeshop-shipment
chmod +x start-server.sh
./start-server.sh
```

The server will be available at http://localhost:12000

#### Starting the Frontend

```bash
cd bikeshop-shipment-storefront
chmod +x start-storefront.sh
./start-storefront.sh
```

The storefront will be available at http://localhost:12001

### Option 3: Docker Setup

You can also run the application using Docker:

```bash
# Start the application in Docker
chmod +x docker-start.sh
./docker-start.sh
```

This will build and start the application in Docker containers. The server will be available at http://localhost:12000 and the storefront at http://localhost:12001.

### Additional Scripts

- `check-status.sh`: Check the status of the application components
- `cleanup.sh`: Clean up the application (remove node_modules, drop database, etc.)
- `dev.sh`: Start the application in development mode
- `prod.sh`: Start the application in production mode
- `test-api.sh`: Test the API endpoints
- `start-all.sh`: Start both the backend and frontend
- `docker-start.sh`: Start the application in Docker containers

## Development

### Environment Variables

Backend (bikeshop-shipment):
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

Frontend (bikeshop-shipment-storefront):
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:12000
PORT=12001
```

## Documentation

For detailed documentation, see [BIKESHOP.md](BIKESHOP.md).

## API Endpoints

### Shipment Endpoints

#### Admin Routes
- `GET /admin/shipments`: List all shipments
- `GET /admin/shipments/:id`: Get shipment by ID
- `POST /admin/shipments`: Create a new shipment
- `PUT /admin/shipments/:id`: Update a shipment
- `PUT /admin/shipments/:id/status`: Update shipment status
- `DELETE /admin/shipments/:id`: Delete a shipment

#### Store Routes
- `GET /store/shipments`: List shipments for the current user
- `GET /store/shipments/:id`: Get shipment by ID for the current user
- `POST /store/shipments`: Create a new shipment for the current user
- `PUT /store/shipments/:id`: Update a shipment for the current user
- `DELETE /store/shipments/:id`: Delete a shipment for the current user

### Payment Method Endpoints

#### Admin Routes
- `GET /admin/payment-methods`: List all payment methods
- `GET /admin/payment-methods/:id`: Get payment method by ID
- `DELETE /admin/payment-methods/:id`: Delete a payment method

#### Store Routes
- `GET /store/payment-methods`: List payment methods for the current user
- `GET /store/payment-methods/:id`: Get payment method by ID for the current user
- `POST /store/payment-methods`: Create a new payment method for the current user
- `PUT /store/payment-methods/:id`: Update a payment method for the current user
- `DELETE /store/payment-methods/:id`: Delete a payment method for the current user
- `PUT /store/payment-methods/:id/default`: Set a payment method as default

### Stripe Integration Endpoints

#### Store Routes
- `POST /store/stripe/setup-intent`: Create a setup intent for adding a payment method
- `GET /store/stripe/payment-methods/:customer_id`: List Stripe payment methods for a customer
- `POST /store/stripe/customers`: Create a Stripe customer
- `POST /store/stripe/payment-methods`: Add a Stripe payment method for a customer
- `DELETE /store/stripe/payment-methods`: Detach a Stripe payment method

## Testing

You can test the API endpoints using tools like Postman or curl. For example:

```bash
# Create a shipment
curl -X POST http://localhost:12000/store/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_number": "TRACK123456",
    "carrier": "FedEx",
    "shipping_address": "123 Main St, City, Country",
    "recipient_name": "John Doe",
    "recipient_email": "john@example.com",
    "recipient_phone": "+1234567890"
  }'

# List shipments
curl http://localhost:12000/store/shipments
```

## License

This project is licensed under the MIT License.