// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TestToken is ERC20 {
    constructor() ERC20('Test Token', 'TEST') {
        console.log('Deploying TestToken');
    }

    function mint(address account, uint256 amount) external {
        console.log("Minting '%s' to '%s'", amount, account);
        _mint(account, amount);
    }
}
