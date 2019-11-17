echo "ℹ️  Building upload archive..."

mkdir 'temp'
cp 'index.js' 'temp/index.js'
cp 'package.json' 'temp/package.json'
cp -r 'node_modules' 'temp/node_modules'

cd temp
zip -r ../lambda.zip *

rm -f -r 'temp'

echo "✅  Done"
