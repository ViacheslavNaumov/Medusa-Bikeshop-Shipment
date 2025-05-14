#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "=== Running Tests for Bikeshop Shipment Application ==="
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

# Set environment variables
export DATABASE_URL=postgres://postgres:postgres@localhost/medusa-bikeshop-shipment-test
export STRIPE_API_KEY=sk_test_example
export STRIPE_WEBHOOK_SECRET=whsec_example
export JWT_SECRET=supersecret
export COOKIE_SECRET=supersecret
export NODE_ENV=test

# Create test database if it doesn't exist
echo -e "${YELLOW}Creating test database...${NC}"
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "medusa-bikeshop-shipment-test"; then
  sudo -u postgres psql -c "CREATE DATABASE \"medusa-bikeshop-shipment-test\";"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"medusa-bikeshop-shipment-test\" TO postgres;"
  echo -e "  ${GREEN}Test database created successfully.${NC}"
else
  echo -e "  ${GREEN}Test database already exists.${NC}"
fi
echo ""

# Run backend tests
echo -e "${YELLOW}Running backend tests...${NC}"
cd /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment
npm test
if [ $? -eq 0 ]; then
  echo -e "  ${GREEN}Backend tests passed.${NC}"
else
  echo -e "  ${RED}Backend tests failed.${NC}"
  exit 1
fi
echo ""

# Run frontend tests
echo -e "${YELLOW}Running frontend tests...${NC}"
cd /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment-storefront
npm test
if [ $? -eq 0 ]; then
  echo -e "  ${GREEN}Frontend tests passed.${NC}"
else
  echo -e "  ${RED}Frontend tests failed.${NC}"
  exit 1
fi
echo ""

echo -e "${GREEN}=== All tests passed! ===${NC}"
echo ""