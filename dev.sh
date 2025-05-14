#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "=== Starting Bikeshop Shipment Application in Development Mode ==="
echo ""

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
pg_isready -q
if [ $? -ne 0 ]; then
  echo -e "  ${RED}PostgreSQL is not running. Starting...${NC}"
  sudo service postgresql start
  sleep 2
  if pg_isready -q; then
    echo -e "  ${GREEN}PostgreSQL started successfully.${NC}"
  else
    echo -e "  ${RED}Failed to start PostgreSQL. Please check the logs.${NC}"
    exit 1
  fi
else
  echo -e "  ${GREEN}PostgreSQL is already running.${NC}"
fi
echo ""

# Check if database exists
echo -e "${YELLOW}Checking database...${NC}"
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "medusa-bikeshop-shipment"; then
  echo -e "  ${RED}Database 'medusa-bikeshop-shipment' does not exist. Creating...${NC}"
  ./setup-database.sh
  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}Database setup completed successfully.${NC}"
  else
    echo -e "  ${RED}Failed to set up the database.${NC}"
    exit 1
  fi
else
  echo -e "  ${GREEN}Database 'medusa-bikeshop-shipment' exists.${NC}"
fi
echo ""

# Set environment variables
export DATABASE_URL=postgres://postgres:postgres@localhost/medusa-bikeshop-shipment
export STRIPE_API_KEY=sk_test_example
export STRIPE_WEBHOOK_SECRET=whsec_example
export JWT_SECRET=supersecret
export COOKIE_SECRET=supersecret
export STORE_CORS=http://localhost:8000,http://localhost:12001,https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export ADMIN_CORS=http://localhost:5173,http://localhost:9000,http://localhost:12000,https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,http://localhost:12000,http://localhost:12001,https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev,https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export PORT=12000
export NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export NEXT_PUBLIC_BASE_URL=https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev
export REVALIDATE_SECRET=supersecret
export NEXT_PUBLIC_ALLOW_IFRAME=true
export NEXT_PUBLIC_ALLOW_CORS=true

# Start the Medusa server in development mode
echo -e "${YELLOW}Starting Medusa server in development mode...${NC}"
cd /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment
npx medusa migrations run
npx medusa develop --host 0.0.0.0 &
SERVER_PID=$!

# Wait for the server to start
echo -e "  ${YELLOW}Waiting for Medusa server to start...${NC}"
sleep 10
echo -e "  ${GREEN}Medusa server started on port 12000.${NC}"
echo ""

# Start the Next.js storefront in development mode
echo -e "${YELLOW}Starting Next.js storefront in development mode...${NC}"
cd /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment-storefront
npm run dev -- -p 12001 --hostname 0.0.0.0 &
STOREFRONT_PID=$!

# Wait for the storefront to start
echo -e "  ${YELLOW}Waiting for Next.js storefront to start...${NC}"
sleep 10
echo -e "  ${GREEN}Next.js storefront started on port 12001.${NC}"
echo ""

# Function to handle script termination
function cleanup {
  echo -e "${YELLOW}Stopping services...${NC}"
  kill $SERVER_PID
  kill $STOREFRONT_PID
  echo -e "${GREEN}Services stopped.${NC}"
  exit 0
}

# Register the cleanup function for when the script is terminated
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}=== Bikeshop Shipment Application is running in development mode! ===${NC}"
echo ""
echo "Medusa server: https://work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev (port 12000)"
echo "Next.js storefront: https://work-2-jafetlshqwpgxbpj.prod-runtime.all-hands.dev (port 12001)"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Keep the script running
wait