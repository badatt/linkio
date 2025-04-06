#!/bin/bash

set -euo pipefail

echo "Updating backend services..."
echo "Function is available at $API_FUNCTION_ARN"

echo GOOGLE_CAPTCHA_SECRET_KEY=$GOOGLE_CAPTCHA_SECRET_KEY
echo GOOGLE_CAPTCHA_SECRET_KEY length=${#GOOGLE_CAPTCHA_SECRET_KEY}
echo APP_NAME=$APP_NAME
echo API_FUNCTION_ARN=$API_FUNCTION_ARN

zip -rq build.zip ./*
aws lambda update-function-code --function-name $API_FUNCTION_ARN --zip-file fileb://build.zip

NEW_ENV_VARS_TO_ADD=$(jq -n \
  --arg appName "$APP_NAME" \
  --arg captchaKey "$GOOGLE_CAPTCHA_SECRET_KEY" \
  '{
    APP_NAME: $appName,
    GOOGLE_CAPTCHA_SECRET_KEY: $captchaKey
  }')

echo "📦 Merging new environment variables into existing Lambda config..."
NEW_ENV_VARS=$(aws lambda get-function-configuration \
  --function-name "$API_FUNCTION_ARN" \
  --query "Environment.Variables | merge(@, \`${NEW_ENV_VARS_TO_ADD}\`)" \
  --output json)
echo "New environment variables: $NEW_ENV_VARS"

echo "🔧 Updating Lambda Environment Variables..."
aws lambda update-function-configuration --function-name $API_FUNCTION_ARN --environment "{ \"Variables\": $NEW_ENV_VARS }"
echo "✅ Lambda environment updated successfully."