import { useCallback } from "react";
import { supportedChainId } from "../constant";
import { useWeb3React } from "@web3-react/core";
import { hexValue } from "ethers/lib/utils";

export const useSwitchChainId = () => {
  const { library } = useWeb3React();

  return useCallback(
    async (newAppChainId: number, noSwitch?: boolean) => {
      const isMetaMask = window.ethereum && window.ethereum.isMetaMask;
      try {
        if (!supportedChainId.includes(newAppChainId)) return null;
        if (isMetaMask && !noSwitch) {
          await library.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: hexValue(newAppChainId) }],
          });
        }

        return true;
      } catch (err) {
        /**@ts-ignore */
        if (err?.code === 4902) {
          const ethereum = window?.ethereum;
          /**@ts-ignore */
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [newAppChainId],
          });
        }
        console.log("Error in change of app chainId: ", err);
        return false;
      }
    },
    [library]
  );
};
