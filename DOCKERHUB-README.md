<div align="center">

![x402proxy](web/images/x402proxy.png)

# 💰 x402proxy

Monetize any API with x402 payments. Plug-and-play proxy; no code changes required.

</div>

---

## What is it?

x402proxy is a lightweight proxy that verifies x402 payments before forwarding requests to your API. Protect any endpoint and start charging per-request in minutes.

## Key Features

- Multi-chain support (Ethereum, Base, Solana, and more)
- One-time payments with prices you control
- Global or per-route pricing
- Works with any x402 facilitator

## Quick Start

1) Download the starter config

```bash
curl -o custom-config.json https://raw.githubusercontent.com/zachalam/x402proxy/refs/heads/main/custom-config.json
```

2) Run the container (mount your config to /app/config.json)

```bash
docker run -p 8080:8080 \
  -v $(pwd)/custom-config.json:/app/config.json:ro \
  zachalam/x402proxy:latest
```

Your proxy will be available on port 8080 by default. The app exits if `/app/config.json` is missing.

## Configuration

The app reads configuration from `/app/config.json` inside the container.

Required fields:

- `facilitatorUrl`: The x402 facilitator URL
- `network`: Blockchain network (e.g. "base-sepolia")
- `paymentAddress`: Your wallet address to receive payments
- `defaultPrice`: Default price for all routes (overridable per route)
- `protectedEndpoints`: Map of protected routes → forward targets and optional price

Example:

```json
{
  "facilitatorUrl": "https://x402.org/facilitator",
  "network": "base-sepolia",
  "paymentAddress": "0x5629562956295629562956295629562956295629",
  "defaultPrice": "$0.05",
  "protectedEndpoints": {
    "GET /cat": { "forwardTo": "https://api.thecatapi.com/v1/images/search" }
  }
}
```

## Tags

- `latest`: latest stable build
- `<number>`: auto-incremented version per commit to main

## Environment

- Exposes port `8080` in the container. Map to your host with `-p`.

## Links

- GitHub: https://github.com/zachalam/x402proxy
- Issues: https://github.com/zachalam/x402proxy/issues


