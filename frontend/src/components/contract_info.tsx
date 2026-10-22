import { CONTRACT_ADDRESS } from "../config.ts";

export default function ContractInfo() {
  return (
    <section aria-labelledby="contract-heading">
      <h2 id="contract-heading">Contract Address</h2>
      {/* <code> because an address is literal text. */}
      <p className="info">
        <code>{CONTRACT_ADDRESS || "Not configured"}</code>
      </p>
    </section>
  );
}
