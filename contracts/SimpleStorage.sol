// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title HifadhiChain - SimpleStorage
/// @notice Stores one number on the blockchain.
contract SimpleStorage {
  // Kept permanently in the contract's storage.
  // "private" hides the name from other contracts only; i.e.,
  // all blockchain data is publicly readable.
  uint256 private storedNumber;

  // Written to the transaction log every time the number changes.
  event NumberChanged(uint256 oldNumber, uint256 newNumber, address changedBy);

  constructor() {
    storedNumber = 0;
  }

  // A free read: does not change the blockchain.
  function getStoredNumber() public view returns (uint256) {
    return storedNumber;
  }

  // A write: needs a signed transaction and gas.
  function setStoredNumber(uint256 _newNumber) public {
    uint256 oldNumber = storedNumber;
    storedNumber = _newNumber;
    emit NumberChanged(oldNumber, _newNumber, msg.sender);
  }
}
