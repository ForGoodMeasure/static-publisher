const apiGatewayRequest = context => ({
  "body": "",
  "requestContext": {},
  "queryStringParameters": {},
  "headers": {
    "Accept-Language": "en-US,en;q=0.8",
    "CloudFront-Viewer-Country": "US",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Upgrade-Insecure-Requests": "1",
    "X-Forwarded-Port": "443",
    "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
    "X-Forwarded-Proto": "https",
    "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
    "CloudFront-Is-Tablet-Viewer": "false",
    "Cache-Control": "max-age=0",
    "User-Agent": "Custom User Agent String",
    "CloudFront-Forwarded-Proto": "https",
    "Accept-Encoding": "gzip, deflate, sdch",
    "x-static-generator": "true"
  },
  "pathParameters": {},
  "httpMethod": "GET",
  "stageVariables": {
    "stage": "static",
    "resourceBase": "",
    "assetBase": ""
  },
  "path": context.path
});

module.exports = apiGatewayRequest;
