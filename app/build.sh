echo "Building Web ..."
rm -rf dist

npm run build
cp deploy.sh dist/