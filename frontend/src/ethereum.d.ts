// ──────────────────────────────────────────────────────────────────────────────
// Types for the wallet object a browser extension (MetaMask) injects into the
// page as window.ethereum. It follows the EIP-1193 standard: one request()
// method for calls, plus event subscription.
// ──────────────────────────────────────────────────────────────────────────────
import type { Eip1193Provider } from "ethers";

interface EthereumProvider extends Eip1193Provider {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    // ──────────────────────────────────────────────────────────────────────────
    // Optional: the property does not exist when no wallet is installed.
    // ──────────────────────────────────────────────────────────────────────────
    ethereum?: EthereumProvider;
  }
}
