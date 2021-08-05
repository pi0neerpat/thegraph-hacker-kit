// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';

contract TestToken is ERC20Upgradeable {
    constructor() initializer {}

    function init(string calldata name, string calldata symbol)
        external
        initializer
    {
        console.log(
            'Deploying TestToken with name: %s and symbol: %s',
            name,
            symbol
        );
        __ERC20_init(name, symbol);
    }

    function mint(address account, uint256 amount) external {
        console.log("Minting '%s' to '%s'", amount, account);
        _mint(account, amount);
    }
}
