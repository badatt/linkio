rm -rf build
rm -rf dist
rm -rf node_modules
mkdir build

npm install
npm run build

cp -r dist/* build/
cp -r node_modules build/
cp package.json build/
cp package-lock.json build/