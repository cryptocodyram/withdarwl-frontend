import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  getNftContractInterface,
  getNFTCnotractEncodedCalldata,
} from "../utilities/contracts";
import { nftContractAddress } from "../constant";
import { BigNumber } from "ethers";
import { gasPrice } from "../utilities";
import { isEmpty } from "lodash";

export enum TRANSFER_NFT_STATUS {
  LOADING,
  ERROR,
  CONFIRMED,
}

export interface NFTTransferResponse {
  nftTransferStatus: TRANSFER_NFT_STATUS;
  trigeredTransfer: () => Promise<void>;
  transactionHash?: string;
}

export const useFundWithdrawl = (
  tokens: string[],
  reciever: string,
  amounts: BigNumber[],
  value: BigNumber
): NFTTransferResponse => {
  const [nftTransferStatus, setNftTransferStatus] =
    React.useState<TRANSFER_NFT_STATUS>();
  const [transactionHash, setTransactionHash] = React.useState<string>("");

  const { chainId, account, library } = useWeb3React();

  /** @ts-ignore */
  const nftAddress = nftContractAddress[chainId];

  const iface = getNftContractInterface();

  const trigeredTransfer = useCallback(async () => {
    if (
      isEmpty(tokens) ||
      isEmpty(amounts) ||
      !reciever ||
      !amounts ||
      !account
    )
      return null;
    try {
      setNftTransferStatus(TRANSFER_NFT_STATUS.LOADING);

      const callData = getNFTCnotractEncodedCalldata(iface, "transferTokens", [
        tokens,
        reciever,
        amounts,
      ]);

      // estimate gas on
      let gasLimit = await library.getSigner().estimateGas({
        from: account,
        to: nftAddress,
        data: callData,
        value,
      });

      const gas_price = await gasPrice(library);

      const transfer = await library.getSigner().sendTransaction({
        from: account,
        to: nftAddress,
        data: callData,
        gasLimit,
        gasPrice: gas_price,
        value,
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
  }, [account, iface, library, nftAddress, amounts, reciever, tokens, value]);

  return {
    /** @ts-ignore */
    nftTransferStatus,
    trigeredTransfer,
    transactionHash,
  };
};
