# CO2-API

**Node.js REST API for CO2 Chaincode (Hyperledger Fabric)**

This API lets organizations (Gov, Org1, Org2) interact with the `co2` chaincode on a Fabric network.
It’s built in **Node.js (ESM)** and can run locally or in a single Docker container.

---

## Project Structure

```
fabric-gateway/
│
├── server.js                # Entry point
├── .env                     # Environment variables
├── Dockerfile               # Container definition
│
└── src/
    ├── config.js            # Config loader (env, orgs, paths)
    ├── fabric.js            # Fabric gateway connection logic
    └── routes/
        ├── health.js        # /health route
        ├── allowances.js    # /allowances endpoints
        └── gov.js           # /gov endpoints
```

---

## Prerequisites

Before running, ensure you have:

- The **Fabric test network** up (`test-network`)
- The **Gov org** added and joined
- The **chaincode** `co2` committed and instantiated on channel `mychannel`

(Refer to your `CO2-Network-3org-Setup.md` for setup details)

---

## Local Run (without Docker)

### Install dependencies

```bash
npm ci
```

### Set environment variables

Create `.env` in the root (example):

```bash
PORT=8000
CHANNEL=mychannel
CHAINCODE=co2-cha
DISCOVERY_AS_LOCALHOST=false
DEFAULT_ORG=Org1

# Point REPO_ROOT so code finds your test-network at $REPO_ROOT/test-network
# e.g. if your network is at /root/energyX_network/test-network set:
REPO_ROOT=/root/energyX_network

# MongoDB Atlas connection (example)
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority&appName=<app>
```

### Start server

```bash
npm start
```

Visit:
[http://localhost:8000/health](http://localhost:8000/health)

---

## Run with Docker (single container)

Build the image:
```bash
docker build -t co2-api .
```

Run (mount your test-network and set REPO_ROOT=/ so app resolves /test-network):
```bash
docker run -d --name co2-api \
  -p 8000:8000 \
  --env-file .env \
  -e REPO_ROOT=/ \
  -v /absolute/path/to/test-network:/test-network:ro \
  co2-api
```

Logs / health:
```bash
docker logs -f co2-api
curl http://localhost:8000/health
```

---

## Environment Variables

| Variable                 | Default   | Description                      |
| ------------------------ | --------- | -------------------------------- |
| `PORT`                   | 8000      | API server port                  |
| `CHANNEL`                | mychannel | Fabric channel name              |
| `CHAINCODE`              | co2-cha   | Deployed chaincode name          |
| `DISCOVERY_AS_LOCALHOST` | false     | Use localhost for peer discovery |
| `DEFAULT_ORG`            | Org1      | Default org if not specified     |
| `REPO_ROOT`              | repo root | Base path that contains test-network |

---

## API Usage

Default org for requests is **Org1**.
You can override it via:

- HTTP Header: `x-org: Org1|Org2|Gov`
- or Query Param: `?org=Org2`

### Endpoints

| Method | Endpoint                     | Description                           |
| ------ | ---------------------------- | ------------------------------------- |
| GET    | `/health`                    | Health check                          |
| GET    | `/allowances`                | List all allowances                   |
| GET    | `/allowances/:id`            | Read a single allowance               |
| GET    | `/owner/:owner/balance`      | Get balance (in kg) for an owner      |
| POST   | `/gov/allowances`            | Create new allowance (Gov only)       |
| POST   | `/allowances/:id/transfer`   | Transfer ownership (Owner/Gov)        |
| POST   | `/allowances/:id/consume`    | Consume part of allowance (Owner/Gov) |
| POST   | `/gov/allowances/:id/revoke` | Revoke allowance (Gov only)           |

---

## Example Usage

### Create Allowance (Gov)

```bash
curl -s -X POST http://localhost:8000/gov/allowances \
  -H 'Content-Type: application/json' \
  -d '{"id":"A1","owner":"Org1MSP","totalKg":1000,"note":"mint"}'
```

### List Allowances (Org1)

```bash
curl -s http://localhost:8000/allowances -H 'x-org: Org1' | jq .
```

### Consume Allowance (Org1)

```bash
curl -s -X POST http://localhost:8000/allowances/A1/consume \
  -H 'Content-Type: application/json' -H 'x-org: Org1' \
  -d '{"amountKg": 50}'
```

### Get Balance

```bash
curl -s http://localhost:8000/owner/Org1MSP/balance | jq .
```

---

## Networking Notes (Fabric peers)

- If your connection profiles (CCP) have peer URLs like `grpcs://peer0.org1.example.com:7051` and your peers run in Docker, set `DISCOVERY_AS_LOCALHOST=false` and ensure your client host can reach those hostnames (e.g., by joining the same Docker network or adding host mappings).
- If your CCP uses `localhost:7051` published ports on the host, set `DISCOVERY_AS_LOCALHOST=true`.

---

## Common Issues

**Fabric Gateway client setup**

- We parse CCP peer URLs and pass only `host:port` to gRPC.
- TLS is configured via `@grpc/grpc-js`.
- Signer is created from the PEM key using `crypto.createPrivateKey(...)`.

---

## Development Commands

```bash
# Run locally
npm start

# Rebuild container
docker build -t co2-api .
docker run -d --name co2-api -p 8000:8000 --env-file .env -e REPO_ROOT=/ -v /abs/path/test-network:/test-network:ro co2-api
```

---

## Summary

| Feature       | Description           |
| ------------- | --------------------- |
| Language      | Node.js (ESM, v20+)   |
| Blockchain    | Hyperledger Fabric    |
| API           | REST (Express)        |
| Chaincode     | `co2`                 |
| Network       | `mychannel`           |
| Default Org   | `Org1`                |
| Port          | 8000                  |
| Containerized | ✅ via Dockerfile     |

---

The API auto-decodes chaincode responses that return CSV byte lists (e.g., `91,123,34,...`) back into JSON.
