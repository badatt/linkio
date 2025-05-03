echo "Building Web ..."
rm -rf dist

npm run build:$BUILD_TARGET
cp deploy.sh dist/