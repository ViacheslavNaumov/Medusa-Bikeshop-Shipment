#!/bin/bash

# Set environment variables
export NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export MEDUSA_BACKEND_URL=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export PORT=12001
export NEXT_PUBLIC_BASE_URL=https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export REVALIDATE_SECRET=supersecret

# Allow CORS and iframes
export NEXT_PUBLIC_ALLOW_IFRAME=true
export NEXT_PUBLIC_ALLOW_CORS=true

# Create or update next.config.js to allow all hosts
cat > ../next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  server: {
    host: '0.0.0.0',
    allowedHosts: ['work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev', 'app.all-hands.dev'],
  },
  images: {
    domains: [
      "medusa-public-images.s3.eu-west-1.amazonaws.com",
      "localhost",
      "work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev",
      "work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev",
    ],
  },
  transpilePackages: ["@medusajs/ui", "@medusajs/icons"],
}

module.exports = nextConfig
EOL

# Start Next.js storefront with proper host settings
echo "Starting Next.js storefront on port 12001..."
npm run dev -- -p 12001 --hostname 0.0.0.0