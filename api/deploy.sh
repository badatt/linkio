#!/bin/bash

echo "Updating backend services..."
echo "Function is available at $API_FUNCTION_ARN"

zip -rq build.zip ./*
aws lambda update-function-code --function-name $API_FUNCTION_ARN --zip-file fileb://build.zip

NEW_ENV_VARS_TO_ADD=$(jq -n \
  --arg AppName "$APP_NAME" \
  --arg CaptchaKey "$GOOGLE_CAPTCHA_SECRET_KEY" \
  --arg AllowedOrigins "$ALLOWED_ORIGINS" \
  --arg FirebaseProjectId "$FIREBASE_PROJECT_ID" \
  --arg FirebaseClientEmail "$FIREBASE_CLIENT_EMAIL" \
  --arg FirebasePrivateKey "$FIREBASE_PRIVATE_KEY" \
  '{
    AppName: $AppName,
    GoogleCaptchaSecretKey: $CaptchaKey,
    AllowedOrigins: $AllowedOrigins,
    FirebaseProjectId: $FirebaseProjectId,
    FirebaseClientEmail: $FirebaseClientEmail,
    FirebasePrivateKey: $FirebasePrivateKey,
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