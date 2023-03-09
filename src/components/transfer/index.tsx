import React from "react";
import { useWeb3React } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { injected } from "../../connectors";
import { useSwitchChainId } from "../../hooks/useSwitchNetwork";
import {
  TRANSFER_NFT_STATUS,
  useFundWithdrawl,
} from "../../hooks/useFundWithdrawl";
import { unitFormatter, unitParser } from "../../utilities";
import { round } from "lodash";
import { ZERO_ADDRESS } from "../../constant";

const Networks: { [chainId: number]: string } = {
  5: "Goerli",
  80001: "Mumbai",
};

function Transfer() {
  const [recieverAddress, setReceiverAddress] = React.useState<string>();
  const [token1Address, setToken1Address] = React.useState<string>();
  const [token2Address, setToken2Address] = React.useState<string>();
  const [token1Amount, setToken1Amount] = React.useState<number>(0);
  const [token2Amount, setToken2Amount] = React.useState<number>(0);
  const [value, setValue] = React.useState<number>(0);
  const [myBalance, setMyBalance] = React.useState<number>(0);

  let { activate, account, active, chainId, library } = useWeb3React();
  let [connector] = React.useState<AbstractConnector>(injected);

  const switchChainId = useSwitchChainId();

  const activating = async () => {
    return connector && activate(connector);
  };

  React.useEffect(() => {
    if (!account || !library) return;
    const getBalance = async () => {
      const myBalance = await library.getBalance(account);
      console.log("myBalance", myBalance);
      setMyBalance(unitFormatter(myBalance));
    };

    getBalance();
  }, [account, library]);

  const { trigeredTransfer, nftTransferStatus } = useFundWithdrawl(
    [token1Address, token2Address],
    recieverAddress,
    [unitParser(token1Amount), unitParser(token2Amount)],
    unitParser(value)
  );

  return (
    <div>
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
      <label> My balance : {round(myBalance, 4)} MATIC</label>
      <br />
      {/* <button onClick={() => mint.trigeredMint()}>
        {" "}
        {mint.nftMintStatus === MINT_NFT_STATUS.LOADING
          ? `Minting`
          : `mint nft`}
      </button> */}
      <br />
      <br />
      <label> Reciever Address</label>
      <input
        value={recieverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
      />
      <br />
      <label> Token Address and amount </label>
      <br />
      <br />
      <label> token address</label>
      <input
        value={token1Address}
        onChange={(e) => setToken1Address(e.target.value)}
        placeholder="token 1 address"
      />
      <label> token amount</label>
      <input
        value={token1Amount}
        onChange={(e) => setToken1Amount(Number(e.target.value))}
        placeholder="token 1 amount"
      />
      <br />
      <br />
      <label> token address</label>
      <input
        value={token2Address}
        onChange={(e) => setToken2Address(e.target.value)}
        placeholder="token 2 address"
      />
      <label> token amount</label>
      <input
        value={token2Amount}
        onChange={(e) => setToken2Amount(Number(e.target.value))}
        placeholder="token 2 amount"
      />
      <br />
      <br />
      <label> value in matic </label>
      <input
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder="value in matic"
      />
      {/* <input value={nftId} onChange={(e) => setNftId(Number(e.target.value))} /> */}
      <br />
      <button onClick={() => trigeredTransfer()}>
        {" "}
        {nftTransferStatus === TRANSFER_NFT_STATUS.LOADING
          ? `Transfering`
          : `Transfer`}{" "}
      </button>
    </div>
  );
}

export default Transfer;
