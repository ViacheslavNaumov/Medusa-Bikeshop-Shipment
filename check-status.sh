#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "=== Bikeshop Shipment Application Status ==="
echo ""

# Check PostgreSQL status
echo -e "${YELLOW}Checking PostgreSQL status...${NC}"
if pg_isready -q; then
  echo -e "  ${GREEN}PostgreSQL is running.${NC}"
else
  echo -e "  ${RED}PostgreSQL is not running.${NC}"
  echo -e "  Run 'sudo service postgresql start' to start PostgreSQL."
fi
echo ""

# Check if database exists
echo -e "${YELLOW}Checking database...${NC}"
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "medusa-bikeshop-shipment"; then
  echo -e "  ${GREEN}Database 'medusa-bikeshop-shipment' exists.${NC}"
else
  echo -e "  ${RED}Database 'medusa-bikeshop-shipment' does not exist.${NC}"
  echo -e "  Run './setup-database.sh' to create the database."
fi
echo ""

# Check if Medusa server is running
echo -e "${YELLOW}Checking Medusa server...${NC}"
if curl -s http://localhost:12000/health | grep -q "ok"; then
  echo -e "  ${GREEN}Medusa server is running.${NC}"
else
  echo -e "  ${RED}Medusa server is not running.${NC}"
  echo -e "  Run './bikeshop-shipment/start-server.sh' to start the server."
fi
echo ""

# Check if Next.js storefront is running
echo -e "${YELLOW}Checking Next.js storefront...${NC}"
if curl -s http://localhost:12001 > /dev/null; then
  echo -e "  ${GREEN}Next.js storefront is running.${NC}"
else
  echo -e "  ${RED}Next.js storefront is not running.${NC}"
  echo -e "  Run './bikeshop-shipment-storefront/start-storefront.sh' to start the storefront."
fi
echo ""

echo "=== Environment Variables ==="
echo ""

# Check environment variables
echo -e "${YELLOW}Checking environment variables...${NC}"
if [ -z "$DATABASE_URL" ]; then
  echo -e "  ${RED}DATABASE_URL is not set.${NC}"
else
  echo -e "  ${GREEN}DATABASE_URL is set.${NC}"
fi

if [ -z "$STRIPE_API_KEY" ]; then
  echo -e "  ${RED}STRIPE_API_KEY is not set.${NC}"
else
  echo -e "  ${GREEN}STRIPE_API_KEY is set.${NC}"
fi

if [ -z "$JWT_SECRET" ]; then
  echo -e "  ${RED}JWT_SECRET is not set.${NC}"
else
  echo -e "  ${GREEN}JWT_SECRET is set.${NC}"
fi

if [ -z "$COOKIE_SECRET" ]; then
  echo -e "  ${RED}COOKIE_SECRET is not set.${NC}"
else
  echo -e "  ${GREEN}COOKIE_SECRET is set.${NC}"
fi
echo ""

echo "=== Quick Start ==="
echo ""
echo "To start the application, run:"
echo "  ./start-all.sh"
echo ""
echo "Or start the components separately:"
echo "  ./bikeshop-shipment/start-server.sh"
echo "  ./bikeshop-shipment-storefront/start-storefront.sh"
echo ""