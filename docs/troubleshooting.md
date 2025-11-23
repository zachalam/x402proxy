# Troubleshooting

## Common Issues

### Container Exits Immediately

**Problem:** Container starts then immediately exits.

**Solution:**
- Ensure config file is mounted to `/app/config.json`
- Check config file syntax (must be valid JSON)
- View logs: `docker logs x402proxy`

### SSL Certificate Errors

**Problem:** `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` or `unable to get local issuer certificate`

**Solutions:**

1. **Mount custom CA certificate:**
   ```bash
   docker run -p 8080:8080 \
     -v $(pwd)/custom-config.json:/app/config.json:ro \
     -v $(pwd)/ca-cert.pem:/app/CA_CERT:ro \
     ghcr.io/zachalam/x402proxy:latest
   ```

2. **Disable SSL verification (development only):**
   ```bash
   docker run -p 8080:8080 \
     -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
     -v $(pwd)/custom-config.json:/app/config.json:ro \
     ghcr.io/zachalam/x402proxy:latest
   ```

### Payment Not Verified

**Problem:** Requests are proxied before payment is made.

**Check:**
- Verify `x402-express` version in logs
- Ensure `protectedEndpoints` paths match request paths (without HTTP method)
- Check facilitator URL is correct and accessible
- Review payment middleware logs

### Proxy Request Fails

**Problem:** Payment verified but proxy request returns error.

**Check:**
- Verify `forwardTo` URL is correct and accessible
- Check target API accepts the request method
- Review network connectivity from container
- Check axios error logs in container output

### Port Already in Use

**Problem:** `Error: bind: address already in use`

**Solution:**
- Use a different port: `-p 4020:8080`
- Stop the service using port 8080
- Check what's using the port: `lsof -i :8080`

## Debugging

### Enable Verbose Logging

View detailed logs:

```bash
docker logs -f x402proxy
```

### Test Configuration

Validate your config file:

```bash
# Check JSON syntax
cat custom-config.json | jq .

# Test endpoint registration
curl http://localhost:8080/health
```

### Network Debugging

Test connectivity from container:

```bash
docker exec -it x402proxy bash
curl https://api.example.com
```

## Getting Help

- **GitHub Issues**: [https://github.com/zachalam/x402proxy/issues](https://github.com/zachalam/x402proxy/issues)
- **Documentation**: Check other sections for detailed guides
- **Logs**: Always include relevant logs when reporting issues

