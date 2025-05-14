#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "=== Installing Dependencies for Bikeshop Shipment Application ==="
echo ""

# Install PostgreSQL if not installed
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
  echo -e "  ${RED}PostgreSQL is not installed. Installing...${NC}"
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
  echo -e "  ${GREEN}PostgreSQL installed successfully.${NC}"
else
  echo -e "  ${GREEN}PostgreSQL is already installed.${NC}"
fi
echo ""

# Start PostgreSQL if not running
echo -e "${YELLOW}Starting PostgreSQL...${NC}"
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

# Install Node.js dependencies for backend
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment
npm install
if [ $? -eq 0 ]; then
  echo -e "  ${GREEN}Backend dependencies installed successfully.${NC}"
else
  echo -e "  ${RED}Failed to install backend dependencies.${NC}"
  exit 1
fi
echo ""

# Install Node.js dependencies for frontend
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment-storefront
npm install
if [ $? -eq 0 ]; then
  echo -e "  ${GREEN}Frontend dependencies installed successfully.${NC}"
else
  echo -e "  ${RED}Failed to install frontend dependencies.${NC}"
  exit 1
fi
echo ""

# Set up the database
echo -e "${YELLOW}Setting up the database...${NC}"
cd /workspace/Medusa-Bikeshop-Shipment
./setup-database.sh
if [ $? -eq 0 ]; then
  echo -e "  ${GREEN}Database setup completed successfully.${NC}"
else
  echo -e "  ${RED}Failed to set up the database.${NC}"
  exit 1
fi
echo ""

echo "=== All dependencies installed successfully! ==="
echo ""
echo "You can now start the application by running:"
echo "  ./start-all.sh"
echo ""
echo "Or check the status of the application by running:"
echo "  ./check-status.sh"
echo ""