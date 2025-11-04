// config.mjs
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT || 8000;
export const CHANNEL = process.env.CHANNEL || "mychannel";
export const CHAINCODE = process.env.CHAINCODE || "co2-cha";
export const DISCOVERY_AS_LOCALHOST =
  String(process.env.DISCOVERY_AS_LOCALHOST || "true").toLowerCase() === "true";

export const REPO_ROOT = process.env.REPO_ROOT
  ? path.resolve(process.env.REPO_ROOT)
  : path.resolve(__dirname, "..");

export const TEST_NETWORK = path.join(REPO_ROOT, "test-network");
export const ORGS_DIR = path.join(
  TEST_NETWORK,
  "organizations",
  "peerOrganizations"
);

export const ORG_MAP = {
  Org1: {
    mspId: "Org1MSP",
    ccp: path.join(ORGS_DIR, "org1.example.com", "connection-org1.json"),
    userDir: path.join(
      ORGS_DIR,
      "org1.example.com",
      "users",
      "Admin@org1.example.com",
      "msp"
    ),
  },
  Org2: {
    mspId: "Org2MSP",
    ccp: path.join(ORGS_DIR, "org2.example.com", "connection-org2.json"),
    userDir: path.join(
      ORGS_DIR,
      "org2.example.com",
      "users",
      "Admin@org2.example.com",
      "msp"
    ),
  },
  Gov: {
    mspId: "GovMSP",
    ccp: path.join(ORGS_DIR, "gov.example.com", "connection-gov.json"),
    userDir: path.join(
      ORGS_DIR,
      "gov.example.com",
      "users",
      "Admin@gov.example.com",
      "msp"
    ),
  },
};
