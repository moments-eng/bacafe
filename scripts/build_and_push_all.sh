#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if an app name was provided
APP_NAME=$1

echo "🚀 Building and pushing services..."
if [ -n "$APP_NAME" ]; then
    echo "Building specific app: $APP_NAME"
fi

# Login to AWS ECR
aws ecr get-login-password --region $AWS_REGION | \
docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Function to build and push a service
build_and_push() {
    local service=$1
    local repo_var="ECR_BACAFE_$(echo $service | tr '[:lower:]' '[:upper:]' | tr '-' '_')_REPO_NAME"
    local repo_name=${!repo_var}
    
    echo -e "\n${GREEN}Building $service...${NC}"
    
    # Set target based on service
    local target="production"
    if [ "$service" = "webapp" ]; then
        target="runner"
    fi
    
    # Build the production image
    docker build \
        --platform linux/amd64 \
        --target $target \
        -t $repo_name:latest \
        -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo_name:latest \
        ./apps/$service

    echo -e "${GREEN}Pushing $service...${NC}"
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$repo_name:latest
}

# Define available services
SERVICES=("backend" "webapp" "data-backend")

# If an app name is provided, validate and build only that app
if [ -n "$APP_NAME" ]; then
    if [[ ! " ${SERVICES[@]} " =~ " ${APP_NAME} " ]]; then
        echo "Error: Invalid app name. Available apps are: ${SERVICES[*]}"
        exit 1
    fi
    build_and_push "$APP_NAME"
else
    # Build and push each service
    for service in "${SERVICES[@]}"; do
        build_and_push $service
    done
fi

echo -e "\n${GREEN}✅ Build and push completed successfully!${NC}" 