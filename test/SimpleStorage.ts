import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

// Numbers end in `n` because blockchain integers are JavaScript `BigInt` values.
describe("SimpleStorage", async function () {
  const { viem } = await network.getOrCreate();

  it("should start with zero", async function () {
    const s = await viem.deployContract("SimpleStorage");
    assert.equal(await s.read.getStoredNumber(), 0n);
  });
  it("should store a new number", async function () {
    const s = await viem.deployContract("SimpleStorage");
    await s.write.setStoredNumber([42n]);
    assert.equal(await s.read.getStoredNumber(), 42n);
  });
  it("should replace the previous number", async function () {
    const s = await viem.deployContract("SimpleStorage");
    await s.write.setStoredNumber([42n]);
    await s.write.setStoredNumber([100n]);
    assert.equal(await s.read.getStoredNumber(), 100n);
  });
  it("should emit NumberChanged", async function () {
    const s = await viem.deployContract("SimpleStorage");
    await viem.assertions.emit(s.write.setStoredNumber([7n]), s, "NumberChanged");
  });
});
