import { Interface } from 'ethers/lib/utils';
import multicallAbi from './multicall.json';
import stakeAbi from './tokenstake.json';
import tokenABi from './token.json';

export const multicallItf = new Interface(multicallAbi);
export const stakeItf = new Interface(stakeAbi);
export const tokenItf = new Interface(tokenABi);

