#!/bin/bash
set -e

# Configuration
REGISTRY="your-registry"  # Replace with your actual registry
VERSION=$(git describe --tags --always)
SERVICES=("backend" "webapp" "data-backend")

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🚀 Building and pushing all services..."
echo "Version: $VERSION"

# Function to build and push a service
build_and_push() {
    local service=$1
    echo -e "\n${GREEN}Building $service...${NC}"
    
    # Build the production image
    docker build \
        --target production \
        -t $REGISTRY/$service:latest \
        -t $REGISTRY/$service:$VERSION \
        ./apps/$service

    echo -e "${GREEN}Pushing $service...${NC}"
    docker push $REGISTRY/$service:latest
    docker push $REGISTRY/$service:$VERSION
}

# Build and push each service
for service in "${SERVICES[@]}"; do
    build_and_push $service
done

echo -e "\n${GREEN}✅ All services have been built and pushed successfully!${NC}" 