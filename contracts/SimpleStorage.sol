// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// ──────────────────────────────────────────────────────────────────────────────
/// @title HifadhiChain - SimpleStorage
/// @notice Stores one number on the blockchain.
// ──────────────────────────────────────────────────────────────────────────────
contract SimpleStorage {
  // ────────────────────────────────────────────────────────────────────────────
  // STATE VARIABLE: Kept permanently in the contract's storage.
  // "private" hides the name from other contracts only; i.e., all blockchain
  // data is publicly readable.
  // ────────────────────────────────────────────────────────────────────────────
  uint256 private storedNumber;

  // ────────────────────────────────────────────────────────────────────────────
  // Writes old value, new value and caller address to the transaction log, for
  // frontends and block explorers. Executed on every event the number changes
  // ────────────────────────────────────────────────────────────────────────────
  event NumberChanged(uint256 oldNumber, uint256 newNumber, address changedBy);

  // ────────────────────────────────────────────────────────────────────────────
  // Runs once when the contract is deployed
  // ────────────────────────────────────────────────────────────────────────────
  constructor() {
    storedNumber = 0;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // READ: A free read: does not change the blockchain (hence the `view`).
  // ────────────────────────────────────────────────────────────────────────────
  function getStoredNumber() public view returns (uint256) {
    return storedNumber;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // WRITE: needs a signed transaction and gas.
  // ────────────────────────────────────────────────────────────────────────────
  function setStoredNumber(uint256 _newNumber) public {
    uint256 oldNumber = storedNumber;
    storedNumber = _newNumber;

    // ──────────────────────────────────────────────────────────────────────────
    // Fire the event with the inputs
    // ──────────────────────────────────────────────────────────────────────────
    emit NumberChanged(oldNumber, _newNumber, msg.sender);
  }
}
