import { Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

export const gasPrice = async (library: Web3Provider): Promise<BigNumber> => {
  return await library.getGasPrice();
};

export const unitFormatter = (
  units: string | BigNumber,
  decimals = 18
): number => {
  if (!units) return null;
  return Number(formatUnits(units, decimals ? decimals : 18));
};

export const unitParser = (
  units: string | number,
  decimals = 18
): BigNumber => {
  if (!units) return null;
  return parseUnits(units.toString(), decimals ? decimals : 18);
};
