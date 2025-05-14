#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "=== Cleaning up Bikeshop Shipment Application ==="
echo ""

# Stop any running processes
echo -e "${YELLOW}Stopping running processes...${NC}"
pkill -f "medusa develop" || true
pkill -f "next dev" || true
echo -e "  ${GREEN}Processes stopped.${NC}"
echo ""

# Clean up node_modules
echo -e "${YELLOW}Cleaning up node_modules...${NC}"
read -p "Do you want to remove node_modules directories? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment/node_modules
  rm -rf /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment-storefront/node_modules
  echo -e "  ${GREEN}node_modules directories removed.${NC}"
else
  echo -e "  ${YELLOW}Skipping node_modules removal.${NC}"
fi
echo ""

# Clean up database
echo -e "${YELLOW}Cleaning up database...${NC}"
read -p "Do you want to drop the database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  sudo -u postgres psql -c "DROP DATABASE IF EXISTS \"medusa-bikeshop-shipment\";"
  echo -e "  ${GREEN}Database dropped.${NC}"
else
  echo -e "  ${YELLOW}Skipping database drop.${NC}"
fi
echo ""

# Clean up logs
echo -e "${YELLOW}Cleaning up logs...${NC}"
rm -f /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment/*.log
rm -f /workspace/Medusa-Bikeshop-Shipment/bikeshop-shipment-storefront/*.log
echo -e "  ${GREEN}Logs removed.${NC}"
echo ""

echo "=== Cleanup completed! ==="
echo ""
echo "To reinstall the application, run:"
echo "  ./install-dependencies.sh"
echo ""