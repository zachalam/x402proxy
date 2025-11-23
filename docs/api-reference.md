# API Reference

## Endpoints

### Health Check

Check if the service is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T12:00:00.000Z",
  "uptime": 3600
}
```

**Example:**
```bash
curl http://localhost:8080/health
```

---

### Root

Get service information.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "x402proxy is running",
  "repository": "https://github.com/zachalam/x402proxy",
  "website": "https://x402proxy.org"
}
```

---

### Protected Endpoints

All endpoints defined in `protectedEndpoints` require x402 payment verification.

**Flow:**
1. Client makes request to protected endpoint
2. `x402-express` middleware verifies payment
3. If payment verified, request is proxied to `forwardTo` URL
4. Response from proxied API is returned to client

**Example:**
```bash
# Request to protected endpoint
curl http://localhost:8080/cat

# If payment not verified:
# Returns 402 Payment Required with payment instructions

# If payment verified:
# Proxies to forwardTo URL and returns response
```

---

## Response Codes

| Code | Description |
|------|-------------|
| `200` | Success - Payment verified and request proxied |
| `402` | Payment Required - Payment not verified |
| `502` | Bad Gateway - Proxy request failed |
| `500` | Internal Server Error - Application error |

## Headers

### Request Headers

The following headers are forwarded to the proxied API:

- `content-type`
- `authorization`
- `x-requested-with`
- `accept`
- `user-agent`

### Response Headers

The following headers are forwarded from the proxied API:

- `content-type`
- `content-encoding`
- `cache-control`
- `etag`
- `last-modified`

## Error Responses

### Payment Required (402)

```json
{
  "error": "Payment Required",
  "message": "Payment verification failed..."
}
```

### Proxy Error (502)

```json
{
  "error": "Failed to forward request",
  "message": "Error message",
  "details": {}
}
```

