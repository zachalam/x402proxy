# x402proxy

**Monetize Any API in Minutes** • Automatically accept x402 Payments • Simple Config, Zero Code Changes Required

![x402proxy](images/x402proxy.png)

---

## What is x402proxy?

x402proxy is a **plug-and-play proxy** that automatically accepts x402 payments. Set it up in minutes in front of any existing API and start selling one-time access. Use a simple config file to customize which endpoints to monetize and set your prices.

## Quick Start

Get up and running in under 60 seconds:

1. **Download the starter config**
   ```bash
   curl -o custom-config.json https://raw.githubusercontent.com/zachalam/x402proxy/refs/heads/main/custom-config.json
   ```

2. **Run with Docker**
   ```bash
   docker run -p 8080:8080 \
     -v $(pwd)/custom-config.json:/app/config.json:ro \
     ghcr.io/zachalam/x402proxy:latest
   ```

3. **That's it!** Your instance of x402proxy is now running and accepting x402 payments. 🎉

## Key Features

- 🌐 **Multi-chain support** - Works with Ethereum, Base, Solana, and more
- 💰 **Direct payments** - Paywall any URL; payment straight to your wallet
- 🏗️ **Flexible pricing** - Set one-time global or per-route pricing
- 🔌 **Plug & play** - Works with any standard x402 facilitator
- ⚡ **60 Second Setup** - Two commands. No complex configuration
- 🛡️ **Production Ready** - Dockerized, multi-architecture support, runs as non-root user

## How It Works

**Simple architecture, powerful results.** Clients make requests, payments are verified via x402 facilitator, and your API gets protected automatically.

1. **Set your rules** - A single config file lets you set pricing and rules to monetize your API
2. **Run x402proxy** - Set your config and start accepting payments immediately
3. **Start Monetizing** - End users pay per use to access your API functionality

---

Ready to get started? Check out the [Installation Guide](installation.md) or browse the [Configuration](configuration.md) section.

