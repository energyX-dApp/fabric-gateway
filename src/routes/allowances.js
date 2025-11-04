// routes/allowances.mjs
import express from "express";
import { getContractFor, getOrgFromReq } from "../fabric.js";

const router = express.Router();

// List all allowances
router.get("/", async (req, res) => {
  const org = getOrgFromReq(req);
  let gateway, client;
  try {
    const result = await getContractFor(org);
    gateway = result.gateway;
    client = result.client;
    const contract = result.contract;
    const resultBytes = await contract.evaluateTransaction(
      "QueryAllAllowances"
    );
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    const text = resultBytes.toString();
    try {
      res.json(JSON.parse(text));
    } catch (parseErr) {
      res.json({ parseError: String(parseErr.message || parseErr), data: text });
    }
  } catch (e) {
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    res.status(500).json({ error: e.message });
  }
});

// Read one allowance
router.get("/:id", async (req, res) => {
  const org = getOrgFromReq(req);
  let gateway, client;
  try {
    const result = await getContractFor(org);
    gateway = result.gateway;
    client = result.client;
    const contract = result.contract;
    const resultBytes = await contract.evaluateTransaction(
      "ReadAllowance",
      req.params.id
    );
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    const text = resultBytes.toString();
    try {
      res.json(JSON.parse(text));
    } catch (parseErr) {
      res.json({ parseError: String(parseErr.message || parseErr), data: text });
    }
  } catch (e) {
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    res.status(500).json({ error: e.message });
  }
});

// Transfer allowance
router.post("/:id/transfer", async (req, res) => {
  const org = getOrgFromReq(req);
  const { newOwner } = req.body || {};
  if (!newOwner) return res.status(400).json({ error: "newOwner required" });

  let gateway, client;
  try {
    const result = await getContractFor(org);
    gateway = result.gateway;
    client = result.client;
    const contract = result.contract;
    await contract.submitTransaction(
      "TransferAllowance",
      req.params.id,
      newOwner
    );
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    res.json({ ok: true });
  } catch (e) {
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    res.status(500).json({ error: e.message });
  }
});

// Consume allowance
router.post("/:id/consume", async (req, res) => {
  const org = getOrgFromReq(req);
  const { amountKg } = req.body || {};
  if (!amountKg) return res.status(400).json({ error: "amountKg required" });

  let gateway, client;
  try {
    const result = await getContractFor(org);
    gateway = result.gateway;
    client = result.client;
    const contract = result.contract;
    await contract.submitTransaction(
      "ConsumeAllowance",
      req.params.id,
      String(amountKg)
    );
    await gateway.close();
    await client.close();
    res.json({ ok: true });
  } catch (e) {
    if (gateway) await gateway.close().catch(() => {});
    if (client) await client.close().catch(() => {});
    res.status(500).json({ error: e.message });
  }
});

// Get balance for owner
router.get("/owner/:owner/balance", async (req, res) => {
  const org = getOrgFromReq(req);
  let gateway, client;
  try {
    const result = await getContractFor(org);
    gateway = result.gateway;
    client = result.client;
    const contract = result.contract;
    const resultBytes = await contract.evaluateTransaction(
      "GetBalanceForOwner",
      req.params.owner
    );
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    res.json({
      owner: req.params.owner,
      balanceKg: Number(resultBytes.toString()),
    });
  } catch (e) {
    if (gateway) {
      try {
        gateway.close && gateway.close();
      } catch (_) {}
    }
    if (client) {
      try {
        client.close && client.close();
      } catch (_) {}
    }
    res.status(500).json({ error: e.message });
  }
});

export default router;
