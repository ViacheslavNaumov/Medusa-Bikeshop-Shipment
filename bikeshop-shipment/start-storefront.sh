#!/bin/bash

# Set environment variables
export NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:12000
export PORT=12001

# Navigate to the storefront directory
cd ../bikeshop-shipment-storefront

# Start Next.js storefront
echo "Starting Next.js storefront..."
npm run dev -- --port 12001 --hostname 0.0.0.0