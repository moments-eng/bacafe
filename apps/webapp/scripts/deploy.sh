#!/bin/bash

set -e  # Exit on error

echo "Starting deployment to ECS..."

# Update ECS service to force new deployment
aws ecs update-service \
  --cluster $ECS_CLUSTER_NAME \
  --service $ECS_SERVICE_NAME \
  --force-new-deployment \
  --region $AWS_REGION

echo "Waiting for service to stabilize..."

# Wait for the service to stabilize
aws ecs wait services-stable \
  --cluster $ECS_CLUSTER_NAME \
  --services $ECS_SERVICE_NAME \
  --region $AWS_REGION

if [ $? -eq 0 ]; then
  echo "Deployment completed successfully!"
  
  # Get the deployment status
  aws ecs describe-services \
    --cluster $ECS_CLUSTER_NAME \
    --services $ECS_SERVICE_NAME \
    --region $AWS_REGION \
    --query 'services[0].deployments[0].status' \
    --output text
else
  echo "Deployment failed to stabilize"
  
  # Get the failed tasks info
  aws ecs describe-services \
    --cluster $ECS_CLUSTER_NAME \
    --services $ECS_SERVICE_NAME \
    --region $AWS_REGION \
    --query 'services[0].events[0:5]' \
    --output text
    
  exit 1
fi 