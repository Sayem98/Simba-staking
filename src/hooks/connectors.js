import { InjectedConnector } from "@web3-react/injected-connector";
import { BscConnector } from '@binance-chain/bsc-connector';


import { ethers } from "ethers";
import Web3 from "web3";

// export const CHAIN_ID = 56;
// test net
export const CHAIN_ID = 97;
export const infura_Id = "84842078b09946638c03157f83405213";

export const getRpcUrl = () => {
  return {
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    56: 'https://bsc-dataseed.binance.org/',
    3:"https://ropsten.infura.io/v3/84842078b09946638c03157f83405213"
  }[CHAIN_ID]
}

export const RPC_URLS = {
  56: "https://bsc-dataseed.binance.org/",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  3:"https://ropsten.infura.io/v3/84842078b09946638c03157f83405213"
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 2, 4, 3 ,56, 97, 31337, 43114, 250, 137, 25, 42161]
})

export const bscwallet = new BscConnector({
  supportedChainIds: [1, 2, 4, 3 ,56, 97, 31337, 43114, 250, 137, 25, 42161] // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
})


export const web3 = new Web3(getRpcUrl());
export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(getRpcUrl());
