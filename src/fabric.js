// src/fabric.mjs
import fs from "fs";
import path from "path";
import fabricGateway from "@hyperledger/fabric-gateway";
import crypto from "crypto";
import * as grpc from "@grpc/grpc-js";
const { connect, signers } = fabricGateway;

import {
  ORG_MAP,
  CHANNEL,
  CHAINCODE,
  DISCOVERY_AS_LOCALHOST,
} from "./config.js";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readFirstFile(dir) {
  const files = fs.readdirSync(dir);
  if (!files || files.length === 0) throw new Error(`No files in ${dir}`);
  return path.join(dir, files[0]);
}

export async function getContractFor(orgKey) {
  const org = ORG_MAP[orgKey];
  if (!org)
    throw new Error(
      `Unknown org '${orgKey}'. Use one of: ${Object.keys(ORG_MAP).join(", ")}`
    );

  const ccp = readJson(org.ccp);
  const certPath = readFirstFile(path.join(org.userDir, "signcerts"));
  const keyPath = readFirstFile(path.join(org.userDir, "keystore"));

  const cert = fs.readFileSync(certPath);
  const privateKeyPem = fs.readFileSync(keyPath);

  const identity = { mspId: org.mspId, credentials: cert };
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = signers.newPrivateKeySigner(privateKey);

  const peerName = Object.keys(ccp.peers)[0];
  const peer = ccp.peers[peerName];
  let peerEndpoint = peer.url;
  if (DISCOVERY_AS_LOCALHOST) {
    peerEndpoint = peerEndpoint.replace(/:\/\/([^:]+):/, "://localhost:");
  }

  const tlsRootCert = Buffer.from(peer.tlsCACerts.pem);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  const serverNameOverride =
    peer.grpcOptions?.["ssl-target-name-override"] || peerName;
  const client = new grpc.Client(peerEndpoint, tlsCredentials, {
    "grpc.ssl_target_name_override": serverNameOverride,
    "grpc.default_authority": serverNameOverride,
  });

  const gateway = await connect({ client, identity, signer });

  const network = gateway.getNetwork(CHANNEL);
  const contract = network.getContract(CHAINCODE);

  return { gateway, contract, client };
}

export function getOrgFromReq(req, fallback = "Org1") {
  return (req.headers["x-org"] || req.query.org || fallback).trim();
}
