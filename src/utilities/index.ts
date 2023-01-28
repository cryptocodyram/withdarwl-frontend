import { Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "ethers";

export const gasPrice = async (library: Web3Provider): Promise<BigNumber> => {
  return await library.getGasPrice();
};
