import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  getNftContractInterface,
  getNFTCnotractEncodedCalldata,
} from "../utilities/contracts";
import { nftContractAddress } from "../constant";
import { BigNumber } from "ethers";
import { gasPrice } from "../utilities";

export enum TRANSFER_NFT_STATUS {
  LOADING,
  ERROR,
  CONFIRMED,
}

export interface NFTTransferResponse {
  nftTransferStatus: TRANSFER_NFT_STATUS;
  trigeredTransfer: (reciever: string, nftId: number) => Promise<void>;
  transactionHash?: string;
}

export const useTransfer = (): NFTTransferResponse => {
  const [nftTransferStatus, setNftTransferStatus] =
    React.useState<TRANSFER_NFT_STATUS>();
  const [transactionHash, setTransactionHash] = React.useState<string>("");

  const { chainId, account, library } = useWeb3React();

  /** @ts-ignore */
  const nftAddress = nftContractAddress[chainId];

  const iface = getNftContractInterface();

  const trigeredTransfer = useCallback(
    async (reciever: string, nftId: number) => {
      try {
        setNftTransferStatus(TRANSFER_NFT_STATUS.LOADING);

        const callData = getNFTCnotractEncodedCalldata(iface, "transferFrom", [
          account,
          reciever,
          BigNumber.from(nftId.toString()),
        ]);

        // estimate gas on
        let gasLimit = await library.getSigner().estimateGas({
          from: account,
          to: nftAddress,
          data: callData,
          value: 0,
        });

        const gas_price = await gasPrice(library);

        const transfer = await library.getSigner().sendTransaction({
          from: account,
          to: nftAddress,
          data: callData,
          gasLimit,
          gasPrice: gas_price,
          value: 0,
        });

        // atleast two confirmation required
        const tx = await transfer.wait(2);
        setNftTransferStatus(TRANSFER_NFT_STATUS.CONFIRMED);
        setTransactionHash(tx?.transactionHash);
      } catch (err) {
        if (err instanceof Error) {
          setNftTransferStatus(TRANSFER_NFT_STATUS.ERROR);
        }
      }
    },
    [account, iface, library, nftAddress]
  );

  return {
    /** @ts-ignore */
    nftTransferStatus,
    trigeredTransfer,
    transactionHash,
  };
};
