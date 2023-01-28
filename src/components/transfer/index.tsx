import React from "react";
import { useWeb3React } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { injected } from "../../connectors";
import { useSwitchChainId } from "../../hooks/useSwitchNetwork";
import { TRANSFER_NFT_STATUS, useTransfer } from "../../hooks/useTransferNFT";
import { MINT_NFT_STATUS, useMint } from "../../hooks/useMint";

const Networks: { [chainId: number]: string } = {
  5: "Goerli",
  80001: "Mumbai",
};
function Transfer() {
  const [recieverAddress, setReceiverAddress] = React.useState<string>();
  const [nftId, setNftId] = React.useState<number>();

  let { activate, account, active, chainId } = useWeb3React();
  let [connector] = React.useState<AbstractConnector>(injected);

  const switchChainId = useSwitchChainId();

  const activating = async () => {
    return connector && activate(connector);
  };

  const mint = useMint();

  const { trigeredTransfer, nftTransferStatus } = useTransfer();

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <button
        disabled={account && active ? true : false}
        onClick={() => activating()}
      >
        {" "}
        connect
      </button>
      <br />
      <button onClick={() => switchChainId(chainId === 5 ? 80001 : 5)}>
        switch network
      </button>
      <br />
      {account && active
        ? `connected Wallet ${account}  - connected on ${
            Networks[Number(chainId)]
          }`
        : ``}
      <br />
      <br />
      <button onClick={() => mint.trigeredMint()}>
        {" "}
        {mint.nftMintStatus === MINT_NFT_STATUS.LOADING
          ? `Minting`
          : `mint nft`}
      </button>
      <br />
      <br />
      <label> Reciever Address</label>
      <input
        value={recieverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
      />
      <br />
      <label> nft id</label>
      <input value={nftId} onChange={(e) => setNftId(Number(e.target.value))} />
      <br />
      <button
        onClick={() => trigeredTransfer(String(recieverAddress), Number(nftId))}
      >
        {" "}
        {nftTransferStatus === TRANSFER_NFT_STATUS.LOADING
          ? `Transfering`
          : `Transfer`}{" "}
      </button>
    </div>
  );
}

export default Transfer;
