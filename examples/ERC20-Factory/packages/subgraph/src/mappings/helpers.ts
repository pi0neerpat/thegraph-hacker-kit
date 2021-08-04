import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Token, Transfer, Allowance, Balance, User } from '../types/schema';
import { TestTokenUpgradeable as ERC20 } from '../types/templates/TestTokenUpgradeable/TestTokenUpgradeable';

export function getToken(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress.toHexString());
  let erc20 = ERC20.bind(tokenAddress);
  if (token == null) {
    token = new Token(tokenAddress.toHexString());
    let symbol = erc20.try_symbol();
    let name = erc20.try_name();
    let decimals = erc20.try_decimals();
    token.symbol = symbol.reverted ? '' : symbol.value;
    token.name = name.reverted ? '' : name.value;
    token.decimals = decimals.reverted ? 0 : decimals.value;
  }
  let totalSupply = erc20.try_totalSupply();
  token.totalSupply = totalSupply.reverted
    ? BigInt.fromI32(0)
    : totalSupply.value;
  return token as Token;
}

export function getTransfer(txHash: Bytes): Transfer {
  let transfer = Transfer.load(txHash.toHexString());
  if (transfer == null) {
    transfer = new Transfer(txHash.toHexString());
  }
  return transfer as Transfer;
}

export function getAllowance(
  token: Address,
  owner: Address,
  spender: Address,
): Allowance {
  let allowanceId = token
    .toHexString()
    .concat('-')
    .concat(owner.toHexString())
    .concat('-')
    .concat(spender.toHexString());
  let allowance = Allowance.load(allowanceId);
  if (allowance == null) {
    allowance = new Allowance(allowanceId);
  }
  return allowance as Allowance;
}

export function getBalance(token: Address, owner: Address): Balance {
  let balanceId = token.toHexString().concat('-').concat(owner.toHexString());
  let balance = Balance.load(balanceId);
  if (balance == null) {
    balance = new Balance(balanceId);
    balance.owner = owner.toHexString();
    balance.token = token.toHexString();
  }
  let erc20 = ERC20.bind(token);
  let balanceInfo = erc20.try_balanceOf(owner);
  balance.balance = balanceInfo.reverted
    ? BigInt.fromI32(0)
    : balanceInfo.value;
  return balance as Balance;
}

export function getUser(address: Address, tokenAddress: Address): User {
  let user = User.load(address.toHexString());
  if (user == null) {
    user = new User(address.toHexString());
  }
  let balance = getBalance(tokenAddress, address);
  balance.save();
  return user as User;
}
