import { useEffect, useState } from "react"
import { useMulticallContract } from "./useContracts";
import { stakeItf, tokenItf, multicallItf } from "../json/interface";
import { tokenStakingAddress, tokenAddress, multicallAddress } from './constant';
import { CHAIN_ID } from "./connectors";
import { useWeb3React } from '@web3-react/core';



const calls = [
  [tokenStakingAddress, stakeItf.encodeFunctionData('totalStakedSoFar')],
  [tokenStakingAddress, stakeItf.encodeFunctionData('maxStakeAmount')],
  [tokenStakingAddress, stakeItf.encodeFunctionData('minStakeAmount')],
  [tokenStakingAddress, stakeItf.encodeFunctionData('generationTime')],
  [tokenStakingAddress, stakeItf.encodeFunctionData('totalStakers')]
];

export const useCommonStats = (update) => {
  const [stats, setStats] = useState({
    totalStaked: 0,
    totalStakers: 0,
    maxStakeAmount: 0,
    minStakeAmount: 0,
    generationTime: 0

  })

  const mc = useMulticallContract();

  useEffect(() => {
    const fetch = async () => {

      const [, data] = await mc.aggregate(calls);


      setStats({
        totalStaked: stakeItf.decodeFunctionResult('totalStakedSoFar', data[0])[0].toString() / Math.pow(10, 18),
        maxStakeAmount: stakeItf.decodeFunctionResult('maxStakeAmount', data[1])[0].toString() / Math.pow(10, 18),
        minStakeAmount: stakeItf.decodeFunctionResult('minStakeAmount', data[2])[0].toString() / Math.pow(10, 18),
        generationTime: stakeItf.decodeFunctionResult('generationTime', data[3])[0].toString(),
        totalStakers: stakeItf.decodeFunctionResult('generationTime', data[4])[0].toString()
      });
    }

    if (mc) {
      fetch();
    }
    else {
      setStats({
        totalStaked: 0,
        totalStakers: 0,
        maxStakeAmount: 0,
        minStakeAmount: 0,
        generationTime: 0
      })
    }
  }, [mc, update]);

  return stats;
}

export const useAccountStats = (updater) => {
  const context = useWeb3React();
  const { chainId, account } = context;
  const [stats, setStats] = useState({
    balance: 0,
    bnb_balance: 0,
    isApprove: false,
    userstaked: 0,
    stakeStart: 0,
    seeReward: 0,
    totalunstaked: 0,
    userTotalDeduction: 0,
    userTotalRecievable: 0,
    unstakeable: 0

  });

  const mc = useMulticallContract();

  useEffect(() => {
    const fetch = async () => {
      const calls = [
        [tokenAddress, tokenItf.encodeFunctionData('balanceOf', [account])],
        [multicallAddress, multicallItf.encodeFunctionData('getEthBalance', [account])],
        [tokenAddress, tokenItf.encodeFunctionData('allowance', [account, tokenStakingAddress])],
        [tokenStakingAddress, stakeItf.encodeFunctionData('userStakedAmount', [account])],
        [tokenStakingAddress, stakeItf.encodeFunctionData('seeReward', [account])],
        [tokenStakingAddress, stakeItf.encodeFunctionData('userUnstakedAmount', [account])],
        [tokenStakingAddress, stakeItf.encodeFunctionData('userTotalDeduction', [account])],
        [tokenStakingAddress, stakeItf.encodeFunctionData('userTotalRecievable', [account])],
        [tokenStakingAddress, stakeItf.encodeFunctionData('unstakeable', [account])]
      ];


      const [, data] = await mc.aggregate(calls);


      console.log(data);

      setStats({
        balance: tokenItf.decodeFunctionResult('balanceOf', data[0])[0].toString() / Math.pow(10, 18),
        bnb_balance: multicallItf.decodeFunctionResult('getEthBalance', data[1])[0].toString() / Math.pow(10, 18),
        isApprove: tokenItf.decodeFunctionResult('allowance', data[2])[0].toString() / Math.pow(10, 18),
        userstaked: stakeItf.decodeFunctionResult('userStakedAmount', data[3])[0].toString() / Math.pow(10, 18),
        seeReward: stakeItf.decodeFunctionResult('seeReward', data[4])[0].toString() / Math.pow(10, 18),
        totalunstaked: stakeItf.decodeFunctionResult('userUnstakedAmount', data[5])[0].toString() / Math.pow(10, 18),
        userTotalDeduction: stakeItf.decodeFunctionResult('userTotalDeduction', data[6])[0].toString() / Math.pow(10, 18),
        userTotalRecievable: stakeItf.decodeFunctionResult('userTotalRecievable', data[7])[0].toString() / Math.pow(10, 18),
        unstakeable: stakeItf.decodeFunctionResult('unstakeable', data[8])[0].toString() / Math.pow(10, 18)
      });
    }

    if (mc && account && chainId === CHAIN_ID) {
      fetch();
    }
    else {
      setStats({
        balance: 0,
        bnb_balance: 0,
        isApprove: false,
        userstaked: 0,
        seeReward: 0,
        stakeStart: 0,
        totalunstaked: 0,
        userTotalDeduction: 0,
        userTotalRecievable: 0,
        unstakeable: 0
      })
    }

  }, [mc, account, updater, chainId]);

  return stats;
}
