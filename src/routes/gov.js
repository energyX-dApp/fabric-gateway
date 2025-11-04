// src/routes/gov.mjs
import express from "express";
import { getContractFor } from "../fabric.js";

const router = express.Router();

// Create and revoke allowances
router.post("/allowances", async (req, res) => {
  const org = "Gov";
  const { id, owner, totalKg, note } = req.body || {};
  if (!id || !owner || !totalKg)
    return res.status(400).json({ error: "id, owner, totalKg required" });

  let gateway, client;
  try {
    const result = await getContractFor(org);
    gateway = result.gateway;
    client = result.client;
    const contract = result.contract;
    await contract.submitTransaction(
      "CreateAllowance",
      id,
      owner,
      String(totalKg),
      String(note || "")
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

router.post("/allowances/:id/revoke", async (req, res) => {
  const org = "Gov";
  const { reason } = req.body || {};
  let gateway, client;
  try {
    const result = await getContractFor(org);
    gateway = result.gateway;
    client = result.client;
    const contract = result.contract;
    await contract.submitTransaction(
      "RevokeAllowance",
      req.params.id,
      String(reason || "")
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

export default router;
