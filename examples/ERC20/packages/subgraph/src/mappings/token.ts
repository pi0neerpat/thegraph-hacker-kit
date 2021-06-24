import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
} from '../types/TestToken/ERC20';
import { getToken, getTransfer, getAllowance, getUser } from './helpers';

export function handleTransfer(event: TransferEvent): void {
  let txHash = event.transaction.hash;
  let timestamp = event.block.timestamp;
  let address = event.address;

  let token = getToken(address);
  token.save();

  let fromUser = getUser(event.params.from, address);
  fromUser.save();

  let toUser = getUser(event.params.to, address);
  toUser.save();

  let transfer = getTransfer(txHash);
  transfer.timestamp = timestamp;
  transfer.from = fromUser.id;
  transfer.to = toUser.id;
  transfer.value = event.params.value;
  transfer.token = token.id;
  transfer.save();
}

export function handleApproval(event: ApprovalEvent): void {
  let timestamp = event.block.timestamp;
  let address = event.address;

  let token = getToken(address);
  token.save();

  let ownerUser = getUser(event.params.owner, address);
  ownerUser.save();

  let spenderUser = getUser(event.params.spender, address);
  spenderUser.save();

  let allowance = getAllowance(
    address,
    event.params.owner,
    event.params.spender,
  );
  allowance.timestamp = timestamp;
  allowance.owner = ownerUser.id;
  allowance.spender = spenderUser.id;
  allowance.value = event.params.value;
  allowance.token = token.id;
  allowance.save();
}
