import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as snarkjs from "snarkjs";
import { ethers } from "ethers";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const proofName = process.argv[2];
  if (!proofName) {
    throw new Error("Usage: node scripts/submit_proof_hedera.js <proof filename in artifacts/batch/proofs>");
  }

  const proofFile = JSON.parse(
    fs.readFileSync(path.join(root, "artifacts/batch/proofs", proofName), "utf8")
  );
  const deployment = JSON.parse(
    fs.readFileSync(path.join(root, "artifacts/deployment/hedera_testnet.json"), "utf8")
  );
  const registryArtifact = JSON.parse(
    fs.readFileSync(path.join(root, "artifacts/contracts_compiled/ZKPVerifierRegistryBytesV2.json"), "utf8")
  );

  const calldata = await snarkjs.groth16.exportSolidityCallData(proofFile.proof, proofFile.publicSignals);
  const [a, b, c, input] = JSON.parse("[" + calldata + "]");

  const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256[2]", "uint256[2][2]", "uint256[2]", "uint256[6]"],
    [a, b, c, input]
  );

  const rpcUrl = process.env.HEDERA_TESTNET_RPC_URL || "https://testnet.hashio.io/api";
  const privateKey = process.env.OPERATOR_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Set OPERATOR_PRIVATE_KEY in your environment (see .env.example)");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const registry = new ethers.Contract(deployment.registry, registryArtifact.abi, wallet);

  console.log(`Submitting ${proofName} to registry at ${deployment.registry}`);
  const tx = await registry.verifyEncoded(encoded);
  console.log("Tx sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Confirmed in block:", receipt.blockNumber, "status:", receipt.status);
}

main().catch((e) => {
  console.error("FAILED:", e.shortMessage || e.message || e);
  process.exit(1);
});
