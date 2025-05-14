#!/bin/bash

# Start PostgreSQL service
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

# Create database if it doesn't exist
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "medusa-bikeshop-shipment"; then
  echo "Creating database 'medusa-bikeshop-shipment'..."
  sudo -u postgres psql -c "CREATE DATABASE \"medusa-bikeshop-shipment\";"
  echo "Database created successfully."
else
  echo "Database 'medusa-bikeshop-shipment' already exists."
fi

# Create user if it doesn't exist
if ! sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='postgres'" | grep -q 1; then
  echo "Creating user 'postgres'..."
  sudo -u postgres psql -c "CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';"
  echo "User created successfully."
else
  echo "User 'postgres' already exists."
fi

# Grant privileges
echo "Granting privileges to user 'postgres' on database 'medusa-bikeshop-shipment'..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"medusa-bikeshop-shipment\" TO postgres;"
echo "Privileges granted successfully."

echo "Database setup completed successfully."