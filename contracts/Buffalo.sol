// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Buffalo is ERC20, ERC20Burnable, Ownable {
    uint256 private constant TOTAL_SUPPLY = 10000000 * 10**18; 
    uint256 private constant CLAIMING_FEE_WEI = 2200000000000000; 
    uint256 private constant CLAIMING_TOKENS = 500 * 10**18;

    mapping(address => bool) private hasClaimedAirdrop;
    address private withdrawalAddress;

    constructor() ERC20("Buffalo", "BUF") {
        _mint(msg.sender, TOTAL_SUPPLY);
        withdrawalAddress = address(0); 
    }

    function claimAirdrop() external payable {
        require(msg.value == CLAIMING_FEE_WEI, "Insuficient fee");
        require(!hasClaimedAirdrop[msg.sender], "Airdrop already claimed");

        _transfer(owner(), msg.sender, CLAIMING_TOKENS);
        hasClaimedAirdrop[msg.sender] = true;
    }

    function hasUserClaimedAirdrop(address user) external view returns (bool) {
        return hasClaimedAirdrop[user];
    }

    function setWA(address _address) external onlyOwner {
        withdrawalAddress = _address;
    }

    function withdraw() external onlyOwner {
        require(withdrawalAddress != address(0), "Withdrawal address not set");
        uint256 balance = address(this).balance;
        require(balance > 0, "No BNB balance to withdraw");
        payable(withdrawalAddress).transfer(balance);
    }
    
}
