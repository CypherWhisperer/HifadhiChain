import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  // The toolbox plugin provides viem, the node:test runner and Ignition.
  plugins: [hardhatToolboxViem],
  solidity: {
    version: "0.8.28",
    // Compile with the npm-provided solc (JS/WASM) instead of a downloaded native binary.
    path: new URL("./node_modules/solc/soljson.js", import.meta.url).pathname,
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
});
