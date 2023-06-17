export const trimAddress = (addr) => {
  return `${addr.substring(0, 6) }...${addr.substring(addr.length - 4)}`;
}

//mainnet
// export const multicallAddress = "0x2cc8fe3e04d7b1edaeb42e2e73f78c4cac074116";
// export const tokenStakingAddress = "0x812B887D1d64bfCF65939770fEaD783f3653e9C8"; 
// export const tokenAddress = "0xc8f3d57935ec7f48bcc73eb31c355dbcdfb48361";


//bsc Testnet

export const multicallAddress = "0x18359D62ecDA61b8D5d8db374ba4A3821091ce12";
export const tokenStakingAddress = "0x2Af24BBD8e7162ee275839cF402D9822Af21DDfe"; 
export const tokenAddress = "0x496EEe3872cF3204a06614975e4cf13cF03Db593";

//Ropsten 

// export const multicallAddress = "0x2cc8fe3e04d7b1edaeb42e2e73f78c4cac074116";
// export const tokenStakingAddress = "0x0cbce003f2acc48f834898b051aa9484c154554d"   
// export const tokenAddress = "0xc8f3d57935ec7f48bcc73eb31c355dbcdfb48361";
