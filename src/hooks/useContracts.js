import { useMemo } from "react";
import { getMulticallContract } from "./contractHelper";

export const useMulticallContract = () => {
  return useMemo(() => {
    return getMulticallContract();
  }, []);
} 
