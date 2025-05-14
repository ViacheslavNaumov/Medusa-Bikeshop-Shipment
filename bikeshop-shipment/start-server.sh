#!/bin/bash

# Start PostgreSQL if not running
pg_isready -q
if [ $? -ne 0 ]; then
  echo "Starting PostgreSQL..."
  sudo service postgresql start
  
  # Wait for PostgreSQL to start
  echo "Waiting for PostgreSQL to start..."
  for i in {1..10}; do
    pg_isready -q && break
    echo "Waiting for PostgreSQL to start... ($i/10)"
    sleep 2
  done

  if ! pg_isready -q; then
    echo "PostgreSQL failed to start. Exiting."
    exit 1
  fi
  
  echo "PostgreSQL started successfully."
fi

# Check if database exists, if not create it
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "medusa-bikeshop-shipment"; then
  echo "Creating database 'medusa-bikeshop-shipment'..."
  sudo -u postgres psql -c "CREATE DATABASE \"medusa-bikeshop-shipment\";"
  
  # Create user if it doesn't exist
  if ! sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='postgres'" | grep -q 1; then
    echo "Creating user 'postgres'..."
    sudo -u postgres psql -c "CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';"
  fi
  
  # Grant privileges
  echo "Granting privileges to user 'postgres' on database 'medusa-bikeshop-shipment'..."
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"medusa-bikeshop-shipment\" TO postgres;"
fi

# Set environment variables
export DATABASE_URL=postgres://postgres:postgres@localhost/medusa-bikeshop-shipment
export STRIPE_API_KEY=sk_test_example
export STRIPE_WEBHOOK_SECRET=whsec_example
export JWT_SECRET=supersecret
export COOKIE_SECRET=supersecret
export STORE_CORS=http://localhost:8000,http://localhost:12001,https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://app.all-hands.dev
export ADMIN_CORS=http://localhost:5173,http://localhost:9000,http://localhost:12000,https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://app.all-hands.dev
export AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,http://localhost:12000,http://localhost:12001,https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://app.all-hands.dev
export PORT=12000
export MEDUSA_ADMIN_CORS=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://app.all-hands.dev
export MEDUSA_ADMIN_BACKEND_URL=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev

# Run migrations
echo "Running database migrations..."
npx medusa migrations run

# Start Medusa server
echo "Starting Medusa server on port $PORT..."
npx medusa develop --port $PORT --host 0.0.0.0