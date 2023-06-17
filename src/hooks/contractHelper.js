import { ethers } from "ethers";
import { simpleRpcProvider } from "./connectors";
import multicallAbi from '../json/multicall.json';
import { multicallAddress } from "./constant";


export const getContract =  (abi, address, library = undefined) => {
  const signerOrProvider = library ? library.getSigner() : simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getMulticallContract = () => {
  return getContract(multicallAbi, multicallAddress);
}

export const formatPrice = (num) => {
  //return parseFloat(num.toFixed(decimals)).toLocaleString();
  return new Intl.NumberFormat('ja-JP').format(parseFloat(num).toFixed(4));
}


