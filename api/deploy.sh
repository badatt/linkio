echo "Updating backend services..."
echo "Function is available at $API_FUNCTION_ARN"

echo GOOGLE_CAPTCHA_SECRET_KEY=$GOOGLE_CAPTCHA_SECRET_KEY
echo APP_NAME=$APP_NAME
echo API_FUNCTION_ARN=$API_FUNCTION_ARN

zip -rq build.zip ./*
aws lambda update-function-code --function-name $API_FUNCTION_ARN --zip-file fileb://build.zip

echo "Updating environment variables..."
# Get current env vars
EXISTING_ENV_VARS=$(aws lambda get-function-configuration \
    --function-name "$API_FUNCTION_ARN" \
    --query 'Environment.Variables' \
    --output json)

# Merge with new ones using jq
NEW_ENV_VARS=$(jq -n \
    --argjson existing "$EXISTING_ENV_VARS" \
    --arg env1 "$APP_NAME" \
    --arg env2 "$GOOGLE_CAPTCHA_SECRET_KEY" \
    '$existing + {
        APP_NAME: $env1,
        GOOGLE_CAPTCHA_SECRET_KEY: $env2
    }'
)
echo "New environment variables: $NEW_ENV_VARS"

echo "🔧 Updating Lambda Environment Variables..."
aws lambda update-function-configuration --function-name $API_FUNCTION_ARN --environment "{ \"Variables\": $NEW_ENV_VARS }"