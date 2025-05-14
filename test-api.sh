#!/bin/bash

# Set the base URL
BASE_URL="http://localhost:12000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to make API requests and display results
function test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4

  echo -e "${YELLOW}Testing: ${description}${NC}"
  echo -e "  ${method} ${endpoint}"
  
  if [ -n "$data" ]; then
    echo -e "  Data: ${data}"
    response=$(curl -s -X ${method} ${BASE_URL}${endpoint} \
      -H "Content-Type: application/json" \
      -d "${data}")
  else
    response=$(curl -s -X ${method} ${BASE_URL}${endpoint})
  fi
  
  if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}Success!${NC}"
    echo -e "  Response: ${response:0:100}..."
  else
    echo -e "  ${RED}Failed!${NC}"
    echo -e "  Error: $response"
  fi
  echo ""
}

echo "=== Testing Shipment API ==="

# Test shipment endpoints
test_endpoint "POST" "/store/shipments" '{
  "tracking_number": "TRACK123456",
  "carrier": "FedEx",
  "shipping_address": "123 Main St, City, Country",
  "recipient_name": "John Doe",
  "recipient_email": "john@example.com",
  "recipient_phone": "+1234567890"
}' "Create a shipment"

test_endpoint "GET" "/store/shipments" "" "List shipments"

# Test payment method endpoints
echo "=== Testing Payment Method API ==="

test_endpoint "POST" "/store/payment-methods" '{
  "provider": "stripe",
  "provider_id": "pm_test_123456",
  "card_last4": "4242",
  "card_brand": "visa",
  "card_exp_month": "12",
  "card_exp_year": "2025"
}' "Create a payment method"

test_endpoint "GET" "/store/payment-methods" "" "List payment methods"

# Test Stripe integration endpoints
echo "=== Testing Stripe Integration API ==="

test_endpoint "POST" "/store/stripe/customers" '{
  "email": "customer@example.com",
  "name": "Test Customer"
}' "Create a Stripe customer"

test_endpoint "POST" "/store/stripe/setup-intent" '{
  "customer_id": "cus_test_123456"
}' "Create a setup intent"

echo "API testing completed!"