import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  getNftContractInterface,
  getNFTCnotractEncodedCalldata,
} from "../utilities/contracts";
import { nftContractAddress } from "../constant";
import { BigNumber } from "ethers";
import { gasPrice } from "../utilities";

export enum MINT_NFT_STATUS {
  LOADING,
  ERROR,
  CONFIRMED,
}

export interface MintResponse {
  nftMintStatus: MINT_NFT_STATUS;
  trigeredMint: () => Promise<void>;
  transactionHash?: string;
}

export const useMint = (): MintResponse => {
  const [nftMintStatus, setNftMintStatus] = React.useState<MINT_NFT_STATUS>();
  const [transactionHash, setTransactionHash] = React.useState<string>("");

  const { chainId, account, library } = useWeb3React();

  /** @ts-ignore */
  const nftAddress = nftContractAddress[chainId];

  const iface = getNftContractInterface();

  const trigeredMint = useCallback(async () => {
    try {
      setNftMintStatus(MINT_NFT_STATUS.LOADING);

      const callData = getNFTCnotractEncodedCalldata(iface, "mint", []);

      // estimate gas on
      let gasLimit = await library.getSigner().estimateGas({
        from: account,
        to: nftAddress,
        data: callData,
        value: 0,
      });

      const gas_price = await gasPrice(library);

      const mint = await library.getSigner().sendTransaction({
        from: account,
        to: nftAddress,
        data: callData,
        gasLimit,
        gasPrice: gas_price,
        value: 0,
      });

      // atleast two confirmation required
      const tx = await mint.wait(2);
      setNftMintStatus(MINT_NFT_STATUS.CONFIRMED);
      setTransactionHash(tx?.transactionHash);
    } catch (err) {
      if (err instanceof Error) {
        setNftMintStatus(MINT_NFT_STATUS.ERROR);
      }
    }
  }, [account, iface, library, nftAddress]);

  return {
    /** @ts-ignore */
    nftMintStatus,
    trigeredMint,
    transactionHash,
  };
};
