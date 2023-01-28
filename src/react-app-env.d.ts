/// <reference types="react-scripts" />

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isBitKeep: boolean;
    request: (args: RequestArguments) => Promise<unknown>;
  };
}
