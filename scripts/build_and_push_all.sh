#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🚀 Building and pushing all services..."

# Login to AWS ECR
aws ecr get-login-password --region $AWS_REGION | \
docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Function to build and push a service
build_and_push() {
    local service=$1
    local repo_var="ECR_BACAFE_$(echo $service | tr '[:lower:]' '[:upper:]' | tr '-' '_')_REPO_NAME"
    local repo_name=${!repo_var}
    
    echo -e "\n${GREEN}Building $service...${NC}"
    
    # Build the production image
    docker build \
        --platform linux/amd64 \
        --target production \
        -t $repo_name:latest \
        -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo_name:latest \
        ./apps/$service

    echo -e "${GREEN}Pushing $service...${NC}"
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo_name:latest
}

# Build and push each service
SERVICES=("backend" "webapp" "data-backend")
for service in "${SERVICES[@]}"; do
    build_and_push $service
done

echo -e "\n${GREEN}✅ All services have been built and pushed successfully!${NC}" 