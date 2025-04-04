mkdir build
cp -r src/* build/
cp package.json build/
cp package-lock.json build/

cd build
npm install --omit=dev