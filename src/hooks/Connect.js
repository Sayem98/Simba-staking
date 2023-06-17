import React from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
    NoEthereumProviderError
} from "@web3-react/injected-connector";

import { useEffect, useState } from "react";
import { injected, bscwallet } from "./connectors";
import Modal from 'react-bootstrap/Modal';
import { CHAIN_ID } from "./connectors";
import { trimAddress } from './constant';



export const Connect = function () {
    const context = useWeb3React();
    const { connector, chainId, account, activate, deactivate, active, error } = context;
    const [show, setShow] = useState(false);

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState();
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);


    function getErrorMessage(error) {

        if (error instanceof NoEthereumProviderError) {
            return "Metamask not deteced";
        }
        if (error instanceof UnsupportedChainIdError) {
            return <span className="btn-text" onClick={switchNetwork}>Switch Network</span>;
        }

        deactivate(injected);
    }

    const activating = (connection) => connection === activatingConnector;
    const connected = (connection) => connection === connector;

    const switchNetwork = () => {
        try {
            // @ts-ignore
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }]
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <React.Fragment>
            <li className="nav-item me-2">

                {
                    error &&
                    <button type="button" className="btn btn-primary" onClick={() => {
                        setActivatingConnector();
                    }}>
                        <span>{getErrorMessage(error)}</span>
                    </button>
                }
                {!error &&
                    <>
                        {active && (connected(injected) || connected(bscwallet)) &&
                            <button type="button" className="btn btn-primary" >
                                {CHAIN_ID === chainId ? (
                                    <span onClick={() => {
                                        setActivatingConnector();
                                        deactivate(injected);
                                        deactivate(bscwallet);

                                    }} >{account && trimAddress(account)}</span>
                                ) : (
                                    <span onClick={switchNetwork}>Switch Network</span>
                                )}
                            </button>


                        }
                        {!active && (!connected(injected) || !connected(bscwallet)) &&
                            <button type="button" className="btn btn-primary" onClick={() => {
                                setShow(!show);
                            }}>
                                {(activating(injected) || activating(bscwallet)) && <> <i className="mdi mdi-wallet-plus-outline me-1"></i><span>Connecting</span></>}
                                {(!activating(injected) || !activating(bscwallet)) && <> <i className="mdi mdi-wallet-plus-outline me-1"></i><span>Connect Wallet</span></>}
                            </button>
                        }
                    </>
                }
            </li>
            {!error &&
                <>
                    {active && (connected(injected) || connected(bscwallet)) &&
                        <li className="nav-item me-2">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                setActivatingConnector();
                                deactivate(injected);
                                deactivate(bscwallet);

                            }} >Disconnect</button>
                        </li>
                    }
                </>
            }

            <Modal
                size="sm"
                show={show}
                onHide={() => setShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Body >
                    <div className="c-list border-b px-3 py-2 d-flex align-items-center" onClick={() => {
                        activate(injected);
                        setShow(false);
                    }}>
                        <img src="../images/metamask.svg" width="30px" className="me-2" alt="metamask" />
                        <div style={{ "color": "#000" }}>Metamask</div>
                    </div>
                    <div className="c-list border-b px-3 py-2 d-flex align-items-center" onClick={() => {
                        activate(bscwallet);
                        setShow(false);
                    }}>
                        <img src="../images/binance-extension.jpg" width="30px" className="me-2" alt="binance" />
                        <div style={{ "color": "#000" }}>Binance Chain Wallet</div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Connect;