// SPDX-License-Identifier: MIT
import { Ownable } from "solady/src/auth/Ownable.sol";
import { SafeTransferLib } from "solady/src/utils/SafeTransferLib.sol";

pragma solidity ^0.8.21;

contract TipJar is Ownable {

    event TipReceived(address indexed sender, uint256 amount);

    constructor() {
        _initializeOwner(msg.sender);
    }

    function tip() external payable {
        require(msg.value > 0, "TipJar: No ether sent");
        emit TipReceived(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "TipJar: No balance to withdraw");
        SafeTransferLib.safeTransferAllETH(msg.sender);
    }

    receive() external payable {
        emit TipReceived(msg.sender, msg.value);
    }

}