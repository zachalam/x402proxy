# Usage Examples

## Basic API Proxy

Protect a simple GET endpoint:

```json
{
  "protectedEndpoints": {
    "GET /cat": {
      "forwardTo": "https://api.thecatapi.com/v1/images/search"
    }
  }
}
```

**Usage:**
```bash
curl http://localhost:8080/cat
# Returns payment request, then proxies to the API after payment
```

## Multiple Endpoints

Protect multiple endpoints with different prices:

```json
{
  "defaultPrice": "$0.05",
  "protectedEndpoints": {
    "GET /cat": {
      "forwardTo": "https://api.thecatapi.com/v1/images/search"
    },
    "GET /premium-data": {
      "price": "$0.50",
      "forwardTo": "https://api.example.com/premium"
    },
    "POST /generate": {
      "price": "$0.25",
      "forwardTo": "https://api.example.com/generate"
    }
  }
}
```

## AI API Monetization

Monetize AI generation endpoints:

```json
{
  "protectedEndpoints": {
    "POST /generate-image": {
      "price": "$0.10",
      "forwardTo": "https://api.openai.com/v1/images/generations"
    },
    "POST /generate-text": {
      "price": "$0.05",
      "forwardTo": "https://api.openai.com/v1/chat/completions"
    }
  }
}
```

## Data API Access

Sell access to valuable datasets:

```json
{
  "protectedEndpoints": {
    "GET /financial-data": {
      "price": "$1.00",
      "forwardTo": "https://api.finance.com/v1/data"
    },
    "GET /market-data": {
      "price": "$0.75",
      "forwardTo": "https://api.markets.com/v1/quotes"
    }
  }
}
```

## Endpoint Without Proxy

Return a simple "paid" status without proxying:

```json
{
  "protectedEndpoints": {
    "GET /status": {
      "price": "$0.01"
      // No forwardTo - just returns { "paid": true }
    }
  }
}
```

## Testing

Test your endpoints:

```bash
# Health check (no payment required)
curl http://localhost:8080/health

# Protected endpoint (requires payment)
curl http://localhost:8080/cat
```

