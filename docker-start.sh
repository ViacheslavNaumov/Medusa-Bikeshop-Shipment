#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo "=== Starting Bikeshop Shipment Application in Docker ==="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Docker is not installed. Please install Docker and try again.${NC}"
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
  exit 1
fi

# Build and start the Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
docker-compose up --build -d

# Check if the containers are running
echo -e "${YELLOW}Checking if containers are running...${NC}"
if docker-compose ps | grep -q "bikeshop"; then
  echo -e "${GREEN}Containers are running successfully.${NC}"
else
  echo -e "${RED}Failed to start containers. Please check the logs.${NC}"
  docker-compose logs
  exit 1
fi

echo -e "${GREEN}=== Bikeshop Shipment Application is running in Docker! ===${NC}"
echo ""
echo "Medusa server: http://localhost:12000"
echo "Next.js storefront: http://localhost:12001"
echo ""
echo "To stop the application, run:"
echo "  docker-compose down"
echo ""
echo "To view the logs, run:"
echo "  docker-compose logs -f"
echo ""