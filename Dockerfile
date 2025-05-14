FROM node:18-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Set working directory
WORKDIR /app

# Copy package.json files
COPY bikeshop-shipment/package*.json ./bikeshop-shipment/
COPY bikeshop-shipment-storefront/package*.json ./bikeshop-shipment-storefront/

# Install dependencies
RUN cd bikeshop-shipment && npm install
RUN cd bikeshop-shipment-storefront && npm install

# Copy application code
COPY bikeshop-shipment ./bikeshop-shipment
COPY bikeshop-shipment-storefront ./bikeshop-shipment-storefront
COPY *.sh ./

# Make scripts executable
RUN chmod +x *.sh

# Set environment variables
ENV DATABASE_URL=postgres://postgres:postgres@postgres/medusa-bikeshop-shipment
ENV STRIPE_API_KEY=sk_test_example
ENV STRIPE_WEBHOOK_SECRET=whsec_example
ENV JWT_SECRET=supersecret
ENV COOKIE_SECRET=supersecret
ENV STORE_CORS=http://localhost:8000,http://localhost:12001
ENV ADMIN_CORS=http://localhost:5173,http://localhost:9000,http://localhost:12000
ENV AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,http://localhost:12000,http://localhost:12001
ENV PORT=12000
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:12000
ENV NEXT_PUBLIC_BASE_URL=http://localhost:12001
ENV REVALIDATE_SECRET=supersecret
ENV NEXT_PUBLIC_ALLOW_IFRAME=true
ENV NEXT_PUBLIC_ALLOW_CORS=true

# Expose ports
EXPOSE 12000 12001

# Start the application
CMD ["./dev.sh"]