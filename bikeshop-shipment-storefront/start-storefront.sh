#!/bin/bash

# Set environment variables
export NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export PORT=12001
export NEXT_PUBLIC_BASE_URL=https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export REVALIDATE_SECRET=supersecret

# Allow CORS and iframes
export NEXT_PUBLIC_ALLOW_IFRAME=true
export NEXT_PUBLIC_ALLOW_CORS=true

# Start Next.js storefront with proper host settings
echo "Starting Next.js storefront on port 12001..."
npm run dev -- -p 12001 --hostname 0.0.0.0