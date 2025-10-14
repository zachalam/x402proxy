# x402proxy

**x402proxy lets you accept x402 payments for any API.**

## Why use x402proxy?

In order for an API to accept x402 payments, changes need to be made to the underlying API. This means installing new packages/dependencies and altering how the API request logic works. This may be undesirable for many applications (e.g., unmaintained legacy APIs, APIs that depend on API keys, etc.).

**x402proxy lets you start accepting x402 payments for any API without modifying the API functionality.** The service creates an entirely separate namespace of routes, allowing your existing API to run unchanged.

The entire package can run independently, bypassing the need for a 3rd party.

## Architecture

x402proxy is comprised of **2 services**:

- **Node.js Proxy Server**: Running on a Node.js 22 Docker image with Express. It utilizes the well-tested `http-proxy-middleware` package to proxy requests.
- **x402-rs**: A Rust implementation of an x402 payment facilitator.

Together, these two services sit between a requester (e.g., client, application, system, etc.) and an API.

## How it works

```
[Client] → [x402proxy] → [Your API]
              ↓
         [x402-rs]
```

1. Client makes a request to x402proxy
2. x402proxy handles payment processing via x402-rs
3. Once payment is verified, x402proxy forwards the request to your API
4. Your API responds normally, and x402proxy returns the response to the client

## Features

- ✅ **Zero API modifications required**
- ✅ **Independent deployment**
- ✅ **Route rewriting support**
- ✅ **Configurable pricing per endpoint**
- ✅ **Multi-network support**
- ✅ **Docker containerized**

## 30 Second Quickstart

### 1. Configure the Facilitator
Modify `./.copy.x402rs` - this holds the facilitator configuration:
- Add `EVM_PRIVATE_KEY` for signing transactions
- Add RPC endpoints for any blockchains you wish to support (e.g., `RPC_URL_BASE`)

### 2. Configure the Proxy
Modify `./settings.json` - this holds the proxy configuration:
- Update the `defaultPaymasterAddress` property to receive payments at this address
- By default, the service requests payment in USDC

### 3. Run the Service
```bash
sh make.sh
```

That's it! Your x402proxy is now running and ready to accept payments.




