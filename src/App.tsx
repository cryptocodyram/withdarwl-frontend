import React from "react";
import "./App.css";
import { Web3ReactProvider } from "@web3-react/core";
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";
import Transfer from "./components/transfer";

function App() {
  const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
    return new Web3Provider(provider);
  };

  return (
    <div className="App">
      <Web3ReactProvider getLibrary={getLibrary}>
        <Transfer />
      </Web3ReactProvider>
    </div>
  );
}

export default App;
