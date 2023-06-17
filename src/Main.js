import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core';
import { useCommonStats, useAccountStats } from './hooks/useStats';
import { formatPrice, getContract } from './hooks/contractHelper';
import stakeAbi from './json/tokenstake.json';
import tokenAbi from './json/token.json';
import { tokenAddress, tokenStakingAddress } from './hooks/constant';
import Button from 'react-bootstrap-button-loader';
import { CHAIN_ID, web3 } from './hooks/connectors';
import { parseEther } from '@ethersproject/units';
import { toast } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';
import { ethers } from 'ethers';



export default function Main() {
    const context = useWeb3React();
    const { account, library, chainId } = context;
    const [updater, setUpdater] = useState(new Date());
    const stats = useCommonStats(updater);
    const accStats = useAccountStats(updater);
    

    const [amount, setAmount] = useState(0);
    const [unamount, setUnamount] = useState(0);
    const [error_msg, setError_msg] = useState('');
    const [error_msg2, setError_msg2] = useState('');
    const [btndisabled, setBtndisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wloading, setWloading] = useState(false);
    const [cloading, setCloading] = useState(false);
    const [sconfirm, setSconfirm] = useState(false);
    const [sconfirmation, setSconfirmation] = useState(false);
    const [unconfirm, setUnconfirm] = useState(false);
    const [unconfirmation, setUnconfirmation] = useState(false);
    const [wiconfirm, setWiconfirm] = useState(false);
    const [wiconfirmation, setWiconfirmation] = useState(false);

    const handleChangeAmount = (e) => {
        setAmount(e.target.value);
        setBtndisabled(true);

        if (isNaN(e.target.value)) {
            setError_msg('please enter valid amount');
            setBtndisabled(true);
        }

        else if (parseFloat(e.target.value) === 0 || e.target.value === '') {
            setError_msg('amount must be greater than zero');
            setBtndisabled(true);
        }
        else if (parseFloat(e.target.value) < parseFloat(stats.minStakeAmount) || parseFloat(e.target.value) > parseFloat(100000)) {
            setError_msg(`You can stake amount between ${stats.minStakeAmount} and 100000 !`);
            setBtndisabled(true);
        }
        else {
            setError_msg('');
            setBtndisabled(false);
        }
        return;
    }

    const handleChangeUnstakeAmount = (e) => {
        setUnamount(e.target.value);


        if (isNaN(e.target.value)) {
            setError_msg2('please enter valid amount');

        }

        else if (parseFloat(e.target.value) === 0 || e.target.value === '') {
            setError_msg2('amount must be greater than zero');

        }
        else if (parseFloat(e.target.value) < parseFloat(stats.minStakeAmount) || parseFloat(e.target.value) > parseFloat(100000)) {
            setError_msg2(`You can stake amount between ${stats.minStakeAmount} and 100000 !`);

        }
        else {
            setError_msg2('');

        }
        return;
    }

    const handleMaxAmount = (e) => {
        e.preventDefault();
        if (parseFloat(accStats.balance) < 0) {
            setAmount(0);
            setBtndisabled(true);
            setError_msg('amount must be greater than zero')
        }
        else if (parseFloat(accStats.balance) < parseFloat(stats.minStakeAmount) || parseFloat(accStats.balance) > parseFloat(100000)) {
            setAmount(Math.floor(accStats.balance))
            setBtndisabled(true);
            setError_msg(`You can stake amount between ${stats.minStakeAmount} and 100000 !`)
        }
        else {
            setAmount(Math.floor(accStats.balance));
            setBtndisabled(false);
            setError_msg('');
        }
    }

    const handleMaxUnstakeAmount = (e) => {
        e.preventDefault();
        if (parseFloat(accStats.unstakeable) <= 0) {
            setUnamount(0);
            setError_msg2('amount must be greater than zero')
        }

        else {
            setUnamount(accStats.unstakeable.toFixed(2));
            setBtndisabled(false);
            setError_msg2('');
        }
    }

    const handleApprove = async (e) => {
        e.preventDefault();
        if (account) {
            if (chainId === CHAIN_ID) {
                try {
                    setLoading(true);
                    let tokenContract = getContract(tokenAbi, tokenAddress, library);
                    let amount = parseEther('10000000000000000000000000000000000000000').toString();
                    let tx = await tokenContract.approve(tokenStakingAddress, amount, { 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 15000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation 👌',
                        }
                    )

                    var interval = setInterval(async function () {
                        var receipt = await web3.eth.getTransactionReceipt(tx.hash);
                        if (receipt != null) {
                            clearInterval(interval)
                            if (receipt.status === true) {
                                toast.success('success ! your last transaction is success👍');
                                setUpdater(new Date());
                                setLoading(false);

                            }
                            else if (receipt.status === false) {
                                toast.error('error ! Your last transaction is failed.');
                                setUpdater(new Date());
                                setLoading(false);

                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setUpdater(new Date());
                                setLoading(false);

                            }
                        }
                    }, 5000);

                }
                catch (err) {
                    typeof err.reason !== 'undefined' ? toast.error(err.reason) : toast.error(err.message);
                    setLoading(false);
                }
            }
            else {
                toast.error('Please select Smart Chain Network !');
                setLoading(false);
            }

        }
        else {
            toast.error('Please Connect Wallet!');
            setLoading(false);
        }
    }

    const handleStake = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSconfirm(true);
        try {
            if (amount > 0 && !isNaN(e.target.value)) {
                if (parseFloat(amount) >= parseFloat(stats.minStakeAmount) && parseFloat(amount) <= parseFloat(100000)) {
                    if (account) {
                        if (chainId === CHAIN_ID) {
                            if (parseFloat(accStats.balance) >= parseFloat(amount)) {

                                let stakeContract = getContract(stakeAbi, tokenStakingAddress, library);
                                let stakeAmount = ethers.utils.parseUnits(amount.toString(), 18);
                                let tx = await stakeContract.stake(stakeAmount, { 'from': account });
                                const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 15000));
                                toast.promise(
                                    resolveAfter3Sec,
                                    {
                                        pending: 'Waiting for confirmation 👌',
                                    }
                                )

                                var interval = setInterval(async function () {
                                    var receipt = await web3.eth.getTransactionReceipt(tx.hash);
                                    if (receipt != null) {
                                        clearInterval(interval)
                                        if (receipt.status === true) {
                                            toast.success('success ! your last transaction is success 👍');
                                            setUpdater(new Date());
                                            setLoading(false);
                                            setSconfirmation(true);

                                        }
                                        else if (receipt.status === false) {
                                            toast.error('error ! Your last transaction is failed.');
                                            setUpdater(new Date());
                                            setLoading(false);
                                            setSconfirm(false);

                                        }
                                        else {
                                            toast.error('error ! something went wrong.');
                                            setUpdater(new Date());
                                            setLoading(false);
                                            setSconfirm(false);

                                        }
                                    }
                                }, 5000);
                            }
                            else {
                                toast.error('you don\'t have enough balance !');
                                setLoading(false);
                                setSconfirm(false);
                            }

                        }
                        else {
                            toast.error('Please select Smart Chain Network !');
                            setLoading(false);
                            setSconfirm(false);
                        }
                    }
                    else {
                        toast.error('Please Connect Wallet!');
                        setLoading(false);
                        setSconfirm(false);
                    }
                }
                else {
                    toast.error(`You can stake amount between ${stats.minStakeAmount} and 100000 !`);
                    setLoading(false);
                    setSconfirm(false);
                }
            }
            else {
                toast.error('Please Enter Valid Amount !');
                setSconfirm(false);
                setLoading(false);
            }
        }
        catch (err) {
            typeof err.reason !== 'undefined' ? toast.error(err.reason) : toast.error(err.message);
            setSconfirm(false);
            setLoading(false);
        }
    }

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setWloading(true);
        setUnconfirm(true);
        try {

            if (unamount > 0) {

                if (chainId === CHAIN_ID) {
                    let stakeContract = getContract(stakeAbi, tokenStakingAddress, library);
                    let unstakeAmount = ethers.utils.parseUnits(unamount.toString(), 18);
                    let tx = await stakeContract.unstake(unstakeAmount, { 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 15000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation 👌',
                        }
                    )

                    var interval = setInterval(async function () {
                        var receipt = await web3.eth.getTransactionReceipt(tx.hash);
                        if (receipt != null) {
                            clearInterval(interval)
                            if (receipt.status === true) {
                                toast.success('success ! your last transaction is success 👍');
                                setUpdater(new Date());
                                setWloading(false);
                                setUnconfirmation(true);

                            }
                            else if (receipt.status === false) {
                                toast.error('error ! Your last transaction is failed.');
                                setUpdater(new Date());
                                setWloading(false);
                                setUnconfirm(false);

                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setUpdater(new Date());
                                setWloading(false);
                                setUnconfirm(false);

                            }
                        }
                    }, 5000);

                }
                else {
                    toast.error('Please select Smart Chain Network !');
                    setWloading(false);
                    setUnconfirm(false);
                }
            }
            else {
                toast.error('unstake amount must be greater than zero !');
                setWloading(false);
                setUnconfirm(false);
            }


        }
        catch (err) {
            console.log(err.message);
            typeof err.reason !== 'undefined' ? toast.error(err.reason) : toast.error(err.message);
            setWloading(false);
            setUnconfirm(false);
        }
    }

    const handleClaimReward = async (e) => {
        e.preventDefault();
        setCloading(true);
        setWiconfirm(true);
        try {
            if (accStats.userTotalRecievable > 0) {
                if (account) {

                    if (chainId === CHAIN_ID) {

                        let stakeContract = getContract(stakeAbi, tokenStakingAddress, library);
                        let tx = await stakeContract.withdraw({ 'from': account });
                        const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 15000));
                        toast.promise(
                            resolveAfter3Sec,
                            {
                                pending: 'Waiting for confirmation 👌',
                            }
                        )


                        var interval = setInterval(async function () {
                            var receipt = await web3.eth.getTransactionReceipt(tx.hash);
                            if (receipt != null) {
                                clearInterval(interval)
                                if (receipt.status === true) {
                                    toast.success('success ! your last transaction is success 👍');
                                    setUpdater(new Date());
                                    setCloading(false);
                                    setWiconfirmation(true);

                                }
                                else if (receipt.status === false) {
                                    toast.error('error ! Your last transaction is failed.');
                                    setUpdater(new Date());
                                    setCloading(false);
                                    setWiconfirm(false);

                                }
                                else {
                                    toast.error('error ! something went wrong.');
                                    setUpdater(new Date());
                                    setCloading(false);
                                    setWiconfirm(false);

                                }
                            }
                        }, 5000);
                    }
                    else {
                        toast.error('Please select Smart Chain Network !');
                        setCloading(false);
                        setWiconfirm(false);
                    }

                }
                else {
                    toast.error('Please Connect Wallet!');
                    setCloading(false);
                    setWiconfirm(false);
                }
            }
            else {
                toast.error('withdrawal amount must be greater than zero !');
                setCloading(false);
                setWiconfirm(false);
            }

        }
        catch (err) {
            console.log(err.message);
            typeof err.reason !== 'undefined' ? toast.error(err.reason) : toast.error(err.message);
            setCloading(false);
            setWiconfirm(false);
        }
    }

    const handleClaimRewardOnly = async (e) => {
        e.preventDefault();
        setCloading(true);
        setWiconfirm(true);
        try {

            if (account) {

                if (chainId === CHAIN_ID) {

                    let stakeContract = getContract(stakeAbi, tokenStakingAddress, library);
                    let tx = await stakeContract.claimReward({ 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 15000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation 👌',
                        }
                    )


                    var interval = setInterval(async function () {
                        var receipt = await web3.eth.getTransactionReceipt(tx.hash);
                        if (receipt != null) {
                            clearInterval(interval)
                            if (receipt.status === true) {
                                toast.success('success ! your last transaction is success 👍');
                                setUpdater(new Date());
                                setCloading(false);
                                setWiconfirmation(true);

                            }
                            else if (receipt.status === false) {
                                toast.error('error ! Your last transaction is failed.');
                                setUpdater(new Date());
                                setCloading(false);
                                setWiconfirm(false);

                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setUpdater(new Date());
                                setCloading(false);
                                setWiconfirm(false);

                            }
                        }
                    }, 5000);
                }
                else {
                    toast.error('Please select Smart Chain Network !');
                    setCloading(false);
                    setWiconfirm(false);
                }

            }
            else {
                toast.error('Please Connect Wallet!');
                setCloading(false);
                setWiconfirm(false);
            }

        }
        catch (err) {
            typeof err.reason !== 'undefined' ? toast.error(err.reason) : toast.error(err.message);
            setCloading(false);
            setWiconfirm(false);
        }
    }

    console.log(accStats);
    return (
        <React.Fragment>
            <div aria-busy="false">
                <Header />
                <div className="page-container">
                    <div className="p-content">
                        <div className="container-fluid mt-3 p-scroll">
                            <div className="p-content-tabs">
                                <div className="row align-items-start">
                                    <div className="col-xl-4">
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link active" id="stake-tab" data-bs-toggle="tab" data-bs-target="#stake" type="button" role="tab" aria-controls="stake" aria-selected="true">Stake</button>
                                            </li>
                                            <li className="nav-item" role="presentation"><button className="nav-link" id="unStake-tab" data-bs-toggle="tab" data-bs-target="#unStake" type="button" role="tab" aria-controls="unStake" aria-selected="false">Unstake</button></li>
                                            <li className="nav-item" role="presentation"><button className="nav-link" id="withdraw-tab" data-bs-toggle="tab" data-bs-target="#withdraw" type="button" role="tab" aria-controls="withdraw" aria-selected="false">Withdraw</button></li>
                                        </ul>
                                        <div className="mt-3">
                                            <h4 className="p-tab-title mb-0 text-nowrap">Stake your Simba</h4>
                                        </div>
                                    </div>
                                    <div className="col-xl-8 mt-xl-0 mt-3">
                                        <div className="p-cards-top d-flex justify-content-xl-end justify-content-lg-center justify-content-md-center justify-content-start">
                                            <div className="p-sidebar-card p-card-top text-center mb-0 py-2 px-3 me-md-3 me-2 card-cross">
                                                <div className="p-sidebar-card-title">Number of Stakers</div>
                                                <div className="p-sidebar-card-body mt-2"><span className="value-staking">{formatPrice(stats.totalStakers)}</span></div>
                                            </div>
                                            <div className="p-sidebar-card p-card-top text-center mb-0 py-2 px-3 me-md-3 me-2 card-cross">
                                                <div className="p-sidebar-card-title">Total Simba Staked</div>
                                                <div className="p-sidebar-card-body mt-2"><span className="value-staking">{formatPrice(stats.totalStaked)}</span></div>
                                            </div>
                                            <div className="p-sidebar-card p-card-top text-center mb-0 py-2 px-3 card-cross">
                                                <div className="p-sidebar-card-title">APY</div>
                                                <div className="p-sidebar-card-body mt-2"><span className="value-staking">15.00%</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-content pt-5 mt-3" id="myTabContent">
                                    <div className="tab-pane fade show active" id="stake" role="tabpanel" aria-labelledby="stake-tab">
                                        <div className="row justify-content-center mb-4">
                                            <div className="col-lg-12">
                                                <div className="bs-stepper w-100">
                                                    <div className="bs-stepper-header" role="tablist">

                                                        <div className="step active" id="swapButtonStep3">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle"><i className="mdi mdi-account-check-outline"></i></span>
                                                                <span className="bs-stepper-label">Pre-authorization</span>
                                                            </button>
                                                        </div>
                                                        <div className="line" id="swapLineStep2"></div>
                                                        <div className={`step ${account && parseFloat(accStats.bnb_balance) > 0 && parseFloat(accStats.balance) > 0 ? "active" : ''} `} id="swapButtonStep2">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle"><i className="mdi mdi-currency-usd"></i></span>
                                                                <span className="bs-stepper-label">Amount to Stake</span>
                                                            </button>
                                                        </div>

                                                        <div className="line" id="swapLineStep3"></div>
                                                        <div className={`step ${sconfirm ? 'active' : ''}`} id="swapButtonStep4">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle">
                                                                    <i className="mdi mdi-shield-account-outline">
                                                                    </i>
                                                                </span>
                                                                <span className="bs-stepper-label">Confirm</span>
                                                            </button>
                                                        </div>
                                                        <div className="line" id="swapLineStep4"></div>
                                                        <div className={`step ${sconfirmation ? 'active' : ''}`} id="swapButtonStep5">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle">
                                                                    <i className="mdi mdi-check"></i></span>
                                                                <span className="bs-stepper-label">Confirmation</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-lg-12">
                                                <div className="">
                                                    <div className="p-sidebar-card-body">
                                                        <div className="bs-stepper-content" id="SwapStep1" >
                                                            <div className="text-center">
                                                                <h4 className="mb-2 pb-1">Checkpoints</h4>
                                                                <p>The following conditions must be met to proceed:</p>
                                                            </div>
                                                            <div className="row mt-4 pt-3 d-flex justify-content-center">
                                                                <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                                                                    <div className={`p-select-card mb-4 ${account ? 'selected' : ''}`}>
                                                                        <div className="p-select-card-title"><b>Connected with MetaMask</b></div>
                                                                        <div className="p-select-card-description">If not connected, click the "Connect Wallet" button in the top right corner</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                                                                    <div className={`p-select-card mb-4 ${parseFloat(accStats.balance) > 0 ? 'selected' : ''}`}>
                                                                        <div className="p-select-card-title"><b> Simba available to deposit</b></div>
                                                                        <div className="p-select-card-description">Current Balance: {formatPrice(accStats.balance)}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                                                                    <div className={`p-select-card mb-4 ${parseFloat(accStats.bnb_balance) > 0 ? 'selected' : ''}`}>
                                                                        <div className="p-select-card-title"><b>BNB available in wallet</b></div>
                                                                        <div className="p-select-card-description">BNB is required to pay transaction fees on the Binance Smart Chain network.<br />BNB Balance: {formatPrice(accStats.bnb_balance)}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                                                                    <div className={`p-select-card mb-4
                                                                    ${account && parseFloat(accStats.bnb_balance) > 0 && parseFloat(accStats.balance) > 0 ? "selected" : ''}`
                                                                    }>
                                                                        <div className="p-select-card-title"><b>Eligible to stake</b></div>
                                                                        <div className="p-select-card-description">You cannot stake if you have an active Simba unstake/withdrawal request</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {account && parseFloat(accStats.bnb_balance) > 0 && parseFloat(accStats.balance) &&
                                                            <div className="bs-stepper-content" id="SwapStep2">
                                                                <div className="text-center">
                                                                    <h4 className="mb-2 pb-1">Please enter the amount of Simba you want to stake</h4>
                                                                    <div className="mx-auto text-start mt-5" style={{ "maxWidth": "370px" }}>
                                                                        <div className="p-form-group mb-1">
                                                                            <label className="form-label p-main-text">Amount</label>
                                                                            <div className="p-input-group">
                                                                                <input type="number" className="form-control px-0" placeholder="0" value={amount} onChange={(e) => { handleChangeAmount(e) }} />
                                                                                <button type="button" className="btn btn-primary" onClick={handleMaxAmount}>MAX</button>
                                                                            </div>

                                                                        </div>
                                                                        <p className='text-danger mb-47'><small>{error_msg}</small></p>
                                                                        {parseFloat(accStats.isApprove) == 0 ? (
                                                                            <Button loading={loading} className="btn btn-primary btn-sm text-right" onClick={(e) => handleApprove(e)}>Approve</Button>
                                                                        ) : (
                                                                            <Button disabled={btndisabled} loading={loading} className="btn btn-primary btn-sm text-right" onClick={handleStake}>Stake</Button>
                                                                        )}


                                                                        <div className="d-flex align-items-start justify-content-between">
                                                                            <div className="font-14">Balance: <b className="text-warning">{formatPrice(accStats.balance)}</b></div>
                                                                            <div></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="unStake" role="tabpanel" aria-labelledby="unStake-tab">
                                        <div className="row justify-content-center mb-4">
                                            <div className="col-lg-12">
                                                <div className="bs-stepper w-100">
                                                    <div className="bs-stepper-header" role="tablist">
                                                        <div className="step active" id="unStakeButtonStep1">
                                                            <button type="button" className="step-trigger ps-0">
                                                                <span className="bs-stepper-circle ms-0"><i className="mdi mdi-exclamation"></i>
                                                                </span>
                                                                <span className="bs-stepper-label">Warning</span>
                                                            </button>
                                                        </div>
                                                        <div className="line" id="unStakeLineStep2"></div>
                                                        <div className={`step ${account ? 'active' : ''}`} id="unStakeButtonStep3">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle">
                                                                    <i className="mdi mdi-currency-usd">
                                                                    </i>
                                                                </span>
                                                                <span className="bs-stepper-label">Amount to Unstake</span>
                                                            </button>
                                                        </div>
                                                        <div className="line" id="unStakeLineStep3"></div>
                                                        <div className={`step ${unconfirm ? 'active' : ''}`} id="unStakeButtonStep4">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle">
                                                                    <i className="mdi mdi-currency-usd"></i>
                                                                </span>
                                                                <span className="bs-stepper-label">Initialize Unstake</span>
                                                            </button>
                                                        </div>
                                                        <div className="line" id="unStakeLineStep4"></div>
                                                        <div className={`step ${unconfirmation ? 'active' : ''}`} id="unStakeButtonStep5">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle">
                                                                    <i className="mdi mdi-check"></i>
                                                                </span>
                                                                <span className="bs-stepper-label">Confirmation</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-lg-12">
                                                <div className="">
                                                    <div className="p-sidebar-card-body">
                                                        {parseFloat(accStats.unamount) <= 0 && parseFloat(accStats.bnb_balance) <= 0 &&
                                                            <div className="bs-stepper-content" id="UnStakeStep1" >
                                                                <div className="warning d-flex justify-content-center">
                                                                    <div><i className="fas fa-exclamation-triangle fa-2x"></i></div>
                                                                    <div>
                                                                        <p>after staking, you must wait 72 hours before you can unstake</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        {account && parseFloat(accStats.userstaked) > 0 && parseFloat(accStats.bnb_balance) > 0 &&
                                                            <div className="bs-stepper-content" id="SwapStep2">
                                                                <div className="text-center">
                                                                    <h4 className="mb-2 pb-1">Please enter the amount of Simba you want to Unstake</h4>
                                                                    <div className="mx-auto text-start mt-5" style={{ "maxWidth": "370px" }}>
                                                                        <div className="p-form-group mb-1">
                                                                            <label className="form-label p-main-text">Amount</label>
                                                                            <div className="p-input-group">
                                                                                <input type="number" className="form-control px-0" placeholder="0" value={unamount} onChange={(e) => { handleChangeUnstakeAmount(e) }} />
                                                                                <button type="button" className="btn btn-primary" onClick={(e) => handleMaxUnstakeAmount(e)}>MAX</button>
                                                                            </div>

                                                                        </div>
                                                                        <p className='text-danger mb-47'><small>{error_msg2}</small></p>
                                                                        <Button className="btn btn-primary btn-sm" loading={wloading} onClick={handleWithdraw} >Unstake</Button>


                                                                        <div className="d-flex align-items-start justify-content-between">
                                                                            <div className="font-14 mb-4">Balance: <b className="text-warning">{formatPrice(accStats.unstakeable)}</b></div>
                                                                            <div></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="withdraw" role="tabpanel" aria-labelledby="withdraw-tab">
                                        <div className="row justify-content-center mb-4">
                                            <div className="col-lg-12">
                                                <div className="bs-stepper w-100">
                                                    <div className="bs-stepper-header" role="tablist">
                                                        <div className="step active" id="withdrawButtonStep1">
                                                            <button type="button" className="step-trigger ps-0">
                                                                <span className="bs-stepper-circle ms-0"><i className="mdi mdi-format-list-checkbox"></i></span>
                                                                <span className="bs-stepper-label">Checkpoints</span>
                                                            </button>
                                                        </div>
                                                        <div className="line" id="withdrawLineStep1"></div>
                                                        <div className={`step ${wiconfirm ? 'active' : ''}`} id="withdrawButtonStep2">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle"><i className="mdi mdi-currency-usd"></i>
                                                                </span>
                                                                <span className="bs-stepper-label">Initialize Withdrawal</span>
                                                            </button>
                                                        </div>
                                                        <div className="line" id="withdrawLineStep2"></div>
                                                        <div className={`step ${wiconfirmation ? 'active' : ''}`} id="withdrawButtonStep3">
                                                            <button type="button" className="step-trigger">
                                                                <span className="bs-stepper-circle"><i className="mdi mdi-check"></i></span>
                                                                <span className="bs-stepper-label">Confirmation</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-lg-12">
                                                <div className="">
                                                    <div className="p-sidebar-card-body">
                                                        <div className="bs-stepper-content" id="WithdrawStep1" >
                                                            <div className="text-center">
                                                                <h4 className="mb-2 pb-1">Checkpoints</h4>
                                                                <p>The following conditions must be met to proceed:</p>
                                                            </div>
                                                            <div className="row mt-4 pt-3 d-flex justify-content-center">
                                                                <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                                                                    <div className={`p-select-card mb-4 ${account ? 'selected' : ''}`}>
                                                                        <div className="p-select-card-title"><b>Connected with MetaMask</b></div>
                                                                        <div className="p-select-card-description">If not connected, click the "Connect Wallet" button in the top right corner</div>
                                                                    </div>
                                                                </div>
                                                                <div className={`col-lg-3 col-md-6 mb-lg-0 mb-3 `}>
                                                                    <div className={`p-select-card mb-4 ${accStats.userTotalRecievable > 0 ? 'selected' : ''}`}>
                                                                        <div className="p-select-card-title"><b>72 hour waiting period elapsed</b></div>
                                                                        <div className="p-select-card-description"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                                                                    <div className={`p-select-card mb-4 ${accStats.bnb_balance > 0 ? 'selected' : ''}`}>
                                                                        <div className="p-select-card-title"><b>BNB available in wallet</b></div>
                                                                        <div className="p-select-card-description">BNB is required to pay transaction fees on the Binance Smart Chain network.<br />BNB Balance: {formatPrice(accStats.bnb_balance)}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3 col-md-6 mb-lg-0 mb-3">
                                                                    <div className={`p-select-card mb-4 ${accStats.userTotalRecievable > 0 ? 'selected' : ''}`}>
                                                                        <div className="p-select-card-title"><b>You have Unstaked your Simba</b></div>
                                                                        <div className="p-select-card-description"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bs-stepper-content" id="WithdrawStep2" style={{ "display": "none" }}>
                                                            <div className="text-center">
                                                                <h4 className="mb-2 pb-1">Confirm Withdrawal</h4>
                                                                <p>In this step, you complete the transaction that withdraws your Simba tokens</p>
                                                            </div>
                                                        </div>
                                                        <div className="bs-stepper-content" id="WithdrawStep3" style={{ "display": "none" }}>
                                                            <div className="text-center">
                                                                <div className="text-warning"><i className="mdi mdi-check" style={{ "fontSize": "50px" }}></i></div>
                                                                <h4 className="mb-2 pb-1">Confirmed</h4>
                                                                <p>You have withdrawn your Simba tokens.<br />If desired, you may check Binance Smart Chain to confirm the transaction.</p>
                                                                <p><a className="p-address" href="https://bscscan.com/tx/" target="blank">&nbsp;</a></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {account && parseFloat(accStats.bnb_balance) > 0 &&
                                                        <div className="bs-stepper-content" id="SwapStep2">
                                                            <div className="text-center">
                                                                <h4 className="mb-2 pb-1">Withdraw Simba</h4>

                                                                <div className="font-14 mb-3">Balance: <b className="text-warning">{accStats.userTotalRecievable > 0 ? parseFloat(accStats.userTotalDeduction + accStats.userTotalRecievable).toFixed(4) : 0}</b></div>
                                                                <Button loading={cloading} className="btn btn-primary btn-sm" onClick={(e) => handleClaimReward(e)}>Withdraw</Button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />


                    </div>
                    <div className="p-sidebar">
                        <div>
                            <div className="p-sidebar-close mb-2">
                                <button className="btn btn-link text-warning" type="button">
                                    <i className="mdi mdi-arrow-right"></i>
                                </button>
                            </div>
                            <div className="p-sidebar-card mt-md-3 bg-white">
                                <div className="p-sidebar-card-title">Staked</div>
                                <div className="p-sidebar-card-body">
                                    <div className="p-sidebar-card-value">{formatPrice(accStats.userstaked)}</div>
                                </div>
                            </div>
                            <div className="p-sidebar-card mt-md-4 mt-3 bg-white">
                                <div className="p-sidebar-card-title">Unstaked</div>
                                <div className="p-sidebar-card-body">
                                    <div className="p-sidebar-card-value">{formatPrice(accStats.userTotalDeduction + accStats.userTotalRecievable)}</div>
                                </div>
                            </div>
                            <div className="p-sidebar-card mt-md-4 mt-3 bg-white">
                                <div className="p-sidebar-card-title">Rewards</div>
                                <div className="p-sidebar-card-body">
                                    <div className="p-sidebar-card-value">{parseFloat(accStats.seeReward).toFixed(3)}</div>
                                    <div className="p-sidebar-card-actions">
                                        <Button loading={cloading} className="btn btn-primary btn-sm" onClick={(e) => handleClaimRewardOnly(e)}>Claim</Button>

                                        {/* <Button className="btn btn-primary btn-sm" loading={wloading} onClick={handleWithdraw} >Unstake</Button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-sidebar-backdrop"></div>
                </div>
            </div>
        </React.Fragment>
    )
}
