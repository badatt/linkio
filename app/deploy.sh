#!/bin/bash

echo "Updating frontend services..." 
echo "Deploying to $APP_DEPLOYMENT_BUCKET_NAME and clearing CloudFront $APP_CLOUDFRONT_ID cache..."

aws s3 cp . s3://$APP_DEPLOYMENT_BUCKET_NAME
aws cloudfront create-invalidation --distribution-id $APP_CLOUDFRONT_ID --paths "/*"
echo "✅ Frontend deployed successfully."