#!/bin/bash

# Set environment variables
export MEDUSA_ADMIN_CORS=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,http://localhost:12000,http://localhost:12001
export STORE_CORS=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,http://localhost:12000,http://localhost:12001
export PORT=12000
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa-bikeshop
export DATABASE_TYPE=postgres
export STRIPE_API_KEY=sk_test_your_stripe_key
export STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Check if PostgreSQL is running
pg_isready -h localhost -p 5432 -U postgres
if [ $? -ne 0 ]; then
  echo "Starting PostgreSQL..."
  sudo service postgresql start
  sleep 2
fi

# Create database if it doesn't exist
psql -h localhost -p 5432 -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'medusa-bikeshop'" | grep -q 1 || psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE \"medusa-bikeshop\""

# Change to the server directory
cd bikeshop-shipment

# Start the Medusa server
echo "Starting Medusa server on port 12000..."
npm run start