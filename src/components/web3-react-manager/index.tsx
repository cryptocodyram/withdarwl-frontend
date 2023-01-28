import React from "react";
import { useWeb3React } from "@web3-react/core";
import {
  useWeb3EagerConnect,
  useInactiveListener,
} from "../../hooks/useWeb3EagerConnect";
//import { useFetchTokenList } from "../../store/list/hooks";

const Web3ReactManager = (): null => {
  const context = useWeb3React();
  const { connector } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useWeb3EagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // fetch the tokenlist
  //useFetchTokenList();

  return null;
};

export default Web3ReactManager;
