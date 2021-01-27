# Webhook Demo

# Initial setup

1. `npm install` to install dependencies
2. `nx affected:build --all` to build application
3. `docker-compose up` to setup the containers and network

# Test

API Gateway is running on `http://localhost:80`. You can check if it is working with `GET /health-check`.

Register a webhook with:
```
POST /subscription/register
{
	"url": "http://example.com",
	"secret": "<JWT token>"
}
 ```

Trigger sending webhooks with:
```
POST /subscription/trigger
{
	"message": "Hello world!"
}
 ```
