// routes/allowances.mjs
import express from "express";
import { getContractFor, getOrgFromReq } from "../fabric.js";

const router = express.Router();

function tryParseJsonOrCsvBytes(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (_) {
    // maybe it's a CSV of byte values like "91,123,34,..."
    const maybeCsv = text.trim();
    if (/^\d+(,\d+)*$/.test(maybeCsv)) {
      try {
        const arr = maybeCsv.split(",").map((n) => Number(n.trim()));
        const str = Buffer.from(Uint8Array.from(arr)).toString("utf8");
        return { ok: true, value: JSON.parse(str) };
      } catch (e2) {
        return { ok: false, error: String(e2.message || e2), raw: text };
      }
    }
    return { ok: false, error: "not-json", raw: text };
  }
}

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
    const parsed = tryParseJsonOrCsvBytes(text);
    if (parsed.ok) return res.json(parsed.value);
    return res.json({ parseError: parsed.error, data: parsed.raw ?? text });
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
    const parsed = tryParseJsonOrCsvBytes(text);
    if (parsed.ok) return res.json(parsed.value);
    return res.json({ parseError: parsed.error, data: parsed.raw ?? text });
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
