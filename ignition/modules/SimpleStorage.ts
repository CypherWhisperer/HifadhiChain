// ──────────────────────────────────────────────────────────────────────────────
// ignition/modules/SimpleStorage.ts:
// - Defines How the Contract (contracts/Simplestorage.sol) Is Deployed
// - Ignition modules are declarative: they defing what to deploy, and Ignition
// - works out how, tracks progress and avoids duplicate deployments with
// - the same module being reused for every network (local | live (sepolia))
// ──────────────────────────────────────────────────────────────────────────────
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
export default buildModule("SimpleStorageModule", (m) => {
   const simpleStorage = m.contract("SimpleStorage");
   return { simpleStorage };
});
