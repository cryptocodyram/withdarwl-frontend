import { Interface, LogDescription } from "ethers/lib/utils";
import NFT_CONTRACT_ABI from "../constant/ABI/NFT_CONTRACT_ABI.json";
/**
 * Get NFT Contract Interface
 * @returns
 */

export const getNftContractInterface = () => {
  return new Interface(NFT_CONTRACT_ABI);
};

export const getNFTCnotractEncodedCalldata = (
  iface: Interface,
  methodName: string,
  values?: any[]
): string => {
  return iface.encodeFunctionData(methodName, values);
};
