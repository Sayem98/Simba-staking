import {useWeb3React} from "@web3-react/core";
import {useEffect, useRef, useState} from "react";
import { simpleRpcProvider } from "../utils";

const useActiveWeb3React = () => {
    const {library, chainId, ...web3React} = useWeb3React()
    const refEth = useRef(library)
    const [provider, setProvider] = useState(library || simpleRpcProvider)

    useEffect(() => {
        if(library !== refEth.current) {
            setProvider(library || simpleRpcProvider)
            refEth.current = library
        }
    }, [library])

    return { library: provider, chainId: chainId, ...web3React}
}

export default useActiveWeb3React
