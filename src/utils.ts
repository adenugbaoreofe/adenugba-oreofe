import { ethers } from "ethers";

export function formatUnitsSafe(
  val: bigint | string | number | undefined,
  decimals = 18,
  maxFrac = 4
): string {
  if (val === undefined || val === null) return "—";
  try {
    const rawBigInt = typeof val === "bigint" ? val : BigInt(val.toString());
    const formatted = ethers.formatUnits(rawBigInt, decimals);
    const num = Number(formatted);
    if (Number.isNaN(num)) return formatted;
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxFrac,
    });
  } catch {
    return typeof val === "string" ? val : "—";
  }
}

export function shortAddress(addr?: string): string {
  if (!addr) return "—";
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function getTxUrl(hash?: string): string {
  if (!hash) return "#";
  return `https://testnet.arcscan.app/tx/${hash}`;
}

export function getAddressUrl(addr?: string): string {
  if (!addr) return "#";
  return `https://testnet.arcscan.app/address/${addr}`;
}
