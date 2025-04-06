echo "Updating backend services..."
echo "Function is available at $API_FUNCTION_ARN"

zip -rq build.zip ./*
aws lambda update-function-code --function-name $API_FUNCTION_ARN --zip-file fileb://build.zip

echo "Updating environment variables..."
NEW_ENV_VARS_TO_ADD=$(cat <<EOF
{
  "APP_NAME": "$APP_NAME",
  "GOOGLE_CAPTCHA_SECRET_KEY": "$GOOGLE_CAPTCHA_SECRET_KEY"
}
EOF
)

NEW_ENVVARS=$(
  aws lambda get-function-configuration \
    --function-name $API_FUNCTION_ARN \
    --query "Environment.Variables | merge(@, \`$NEW_ENV_VARS_TO_ADD\`)"
)
echo "New environment variables: $NEW_ENVVARS"
aws lambda update-function-configuration --function-name $API_FUNCTION_ARN --environment "{ \"Variables\": $NEW_ENVVARS }"