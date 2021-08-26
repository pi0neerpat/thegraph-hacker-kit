import { NewToken as NewTokenEvent } from '../types/TestTokenFactory/TestTokenFactory';
import { TestToken as TestTokenTemplate } from '../types/templates';
import { getToken } from './helpers';

export function handleNewToken(event: NewTokenEvent): void {
  let tokenAddress = event.params.token;

  TestTokenTemplate.create(tokenAddress);

  let token = getToken(tokenAddress);
  token.save();
}
