#!/bin/bash

# Set environment variables
export NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export PORT=12001

# Change to the storefront directory
cd bikeshop-shipment-storefront

# Create .env.local file
cat > .env.local << EOL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
NEXT_PUBLIC_BASE_URL=https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
REVALIDATE_SECRET=your-revalidate-secret
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_test_publishable_key
EOL

# Start the Next.js storefront
echo "Starting Next.js storefront on port 12001..."
npm run dev -- -p 12001 --hostname 0.0.0.0