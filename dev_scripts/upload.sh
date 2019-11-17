echo "🌀  Uploading..."

export $(cat .env | xargs)

aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --region=$LAMBDA_REGION --zip-file fileb://lambda.zip --profile $LAMBDA_IAM_UPLOAD_PROFILE

terminal-notifier -title 'Deploy PDF Lambda' -message '✅ Deploy Complete' -open $LAMBDA_API_GATEWAY_URL -appIcon './lambda.jpg'
echo '✅  Deployed function' $LAMBDA_FUNCTION_NAME 
echo 'Invoke it at ' $LAMBDA_API_GATEWAY_URL