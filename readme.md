# Pusher Auth Lambda

Lambda function for signing Pusher Channels auth tokens.

## Usage

The Lambda endpoint takes a JSON body:
```json
{
  "socket_id": "4478.11377481",
  "channel_name": "presence-367456",
  "role": "mic"
}
```

And returns a JSON response:

```json
{
    "channel_data": "{\"user_id\":\"mic\"}",
    "auth": "a14e71179e4decc11471:caf33df3fb21ca0f2f32edeb63203320b9704c95fa0882bb4a7d780d553bb829"
}
```

### Pusher API keys
Find your API keys on your Pusher project home page. 
They should be set as the following environment variables:

```
PUSHER_APP_ID
PUSHER_KEY
PUSHER_SECRET
PUSHER_CLUSTER
```

## Development

### Setting up
1. Install NPM and the AWS CLI
2. On the AWS Lambda console, create new function, noting its name, region and `ARN`
3. In the Lambda console for the function, attach it to AWS API Gateway, noting its public URL
4. In the AWS IAM Console, create an AWS CLI upload IAM profile as described in my article here, noting the profile name
5. In the Pusher console, create a new app, noting its `appId`, `key`, `secret` and `cluster`
6. Create a `.env` file with the following entries:

```bash
PUSHER_APP_ID=******
PUSHER_KEY=******************
PUSHER_SECRET=*****************
PUSHER_CLUSTER=ap2

LAMBDA_FUNCTION_NAME=my-function
LAMBDA_REGION=us-east-1
LAMBDA_IAM_UPLOAD_PROFILE=MY_UPLOAD_PROFILE
LAMBDA_API_GATEWAY_URL=https://my-api-gateway.execute-api.us-east-1.amazonaws.com/default/my-function
```

Your can now proceed with development:

```bash
npm install    # Install dependencies

npm run invoke # Invoke the function with `test_events/standard` event
npm run build  # Build the function ZIP file
npm run upload # Upload the new code to production
npm run deploy # Run `build` & `deploy` in a single step
```

When you're done, run `npm run deploy` to zip the code and upload it to Lambda.