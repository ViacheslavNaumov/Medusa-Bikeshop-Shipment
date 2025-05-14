#!/bin/bash

# Run the database setup script
echo "Setting up the database..."
./setup-database.sh

# Start the Medusa server in the background
echo "Starting Medusa server..."
cd bikeshop-shipment
./start-server.sh &
SERVER_PID=$!

# Wait for the server to start
echo "Waiting for Medusa server to start..."
sleep 10

# Start the Next.js storefront in the background
echo "Starting Next.js storefront..."
cd ../bikeshop-shipment-storefront
./start-storefront.sh &
STOREFRONT_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping services..."
  kill $SERVER_PID
  kill $STOREFRONT_PID
  echo "Services stopped."
  exit 0
}

# Register the cleanup function for when the script is terminated
trap cleanup SIGINT SIGTERM

echo "Both services are running."
echo "Medusa server: https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev (port 12000)"
echo "Next.js storefront: https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev (port 12001)"
echo "Press Ctrl+C to stop all services."

# Keep the script running
wait