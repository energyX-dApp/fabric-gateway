# CO2-API

**Node.js REST API for CO2 Chaincode (Hyperledger Fabric)**

This API lets organizations (Gov, Org1, Org2) interact with the `co2` chaincode on a Fabric network.
It’s built in **Node.js (ESM)** and ready to run both locally and via **Docker Compose**.

---

## Project Structure

```
co2-api/
│
├── server.js                # Entry point
├── .env                     # Environment variables
├── Dockerfile               # Container definition
├── docker-compose.yml       # For easy local deployment
│
└── src/
    ├── config.mjs           # Config loader (env, orgs, paths)
    ├── fabric.mjs           # Fabric gateway connection logic
    └── routes/
        ├── health.mjs       # /health route
        ├── allowances.mjs   # /allowances endpoints
        └── gov.mjs          # /gov endpoints
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
npm install
```

### Set environment variables

Create `.env` in the root:

```bash
PORT=8000
CHANNEL=mychannel
CHAINCODE=co2
DISCOVERY_AS_LOCALHOST=true
DEFAULT_ORG=Org1
```

### Start server

```bash
npm start
```

Visit:
[http://localhost:8000/health](http://localhost:8000/health)

---

## Run with Docker (Recommended)

### Build & Start

```bash
docker compose up --build -d
```

### Stop

```bash
docker compose down
```

### Logs

```bash
docker logs -f co2-api
```

### Check Health

```bash
curl http://localhost:8000/health
```

---

## Environment Variables

| Variable                 | Default   | Description                      |
| ------------------------ | --------- | -------------------------------- |
| `PORT`                   | 8000      | API server port                  |
| `CHANNEL`                | mychannel | Fabric channel name              |
| `CHAINCODE`              | co2       | Deployed chaincode name          |
| `DISCOVERY_AS_LOCALHOST` | true      | Use localhost for peer discovery |
| `DEFAULT_ORG`            | Org1      | Default org if not specified     |

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
| GET    | `/owners/:owner/balance`     | Get balance (in kg) for an owner      |
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
curl -s http://localhost:8000/owners/Org1MSP/balance | jq .
```

---

## Docker Notes

- The container mounts this repo at `/workspace` **read-only**.
- It also mounts your **`../test-network`** directory to access org MSPs and connection profiles.
- By default, `DISCOVERY_AS_LOCALHOST=true` (use `localhost` endpoints in profiles).
- If attaching to the same Docker network as your peers, set:

  ```bash
  DISCOVERY_AS_LOCALHOST=false
  ```

  and make sure connection profiles point to peer/orderer **container hostnames**.

---

## Common Issues

**❌ SyntaxError: Named export 'Gateway' not found**

> Fix: `@hyperledger/fabric-gateway` is CommonJS — use default import:

```js
import fabricGateway from "@hyperledger/fabric-gateway";
const { Gateway, signers, clients } = fabricGateway;
```

---

## Development Commands

```bash
# Run locally
npm start

# Run lint / checks
npm run lint

# Rebuild container (fresh)
docker compose build --no-cache
docker compose up -d
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
| Containerized | ✅ via Docker Compose |

---

Would you like me to include an optional section for **attaching this container to your Fabric network’s Docker bridge (e.g., `fabric_test` network)** so it can reach peers by container name instead of `localhost`? That’s useful if you plan to deploy it alongside Fabric peers.
