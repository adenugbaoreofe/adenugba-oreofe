import React, { useState } from "react";
import { ThemeMode } from "../types";
import { Copy, Check, ExternalLink, Sparkles, TrendingUp, Vault } from "lucide-react";
import { getAddressUrl } from "../utils";

interface CertificateHeroProps {
  theme: ThemeMode;
  stakedAmount: string;
  tokenSymbol: string;
  pendingAmount: string;
  apyValue: string;
  walletBalance: string;
  poolTotalStaked: string;
  poolReserve: string;
  poolAddress: string;
  isPaused: boolean;
}

export const CertificateHero: React.FC<CertificateHeroProps> = ({
  theme,
  stakedAmount,
  tokenSymbol,
  pendingAmount,
  apyValue,
  walletBalance,
  poolTotalStaked,
  poolReserve,
  poolAddress,
  isPaused,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!poolAddress) return;
    navigator.clipboard.writeText(poolAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = theme === "obsidian" || theme === "emerald";

  return (
    <section
      id="certificateHero"
      className={`relative p-6 sm:p-8 border-b transition-colors duration-300 ${
        theme === "parchment"
          ? "border-[#C9C1AC] bg-[#F7F3E6]/60 text-[#1C1F1B]"
          : theme === "obsidian"
          ? "border-[#1E2E25] bg-[#0E1512]/60 text-[#E3EDE7]"
          : "border-[#1E3B2E] bg-[#0B1E16]/60 text-[#E5F3EB]"
      }`}
    >
      {/* Paused Alert Banner if pool paused */}
      {isPaused && (
        <div
          id="pausedBanner"
          className="mb-6 p-3.5 rounded border text-xs sm:text-sm font-mono flex items-center gap-2.5 bg-[#F1E1DC] text-[#8C3B2E] border-[#8C3B2E]/40 dark:bg-[#381B17] dark:text-[#FCA5A5] dark:border-[#991B1B]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#8C3B2E] dark:bg-[#EF4444] animate-pulse" />
          <span>
            <strong>Notice:</strong> Staking is currently paused by the pool owner. Withdrawals and reward claims remain fully open.
          </span>
        </div>
      )}

      {/* Certificate Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs uppercase tracking-wider font-mono font-medium ${
              theme === "parchment" ? "text-[#5C5A4E]" : "text-[#93AFA1]"
            }`}
          >
            Staked Position Certificate
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              theme === "parchment"
                ? "border-[#A8823C]/50 bg-[#FDFBF7] text-[#A8823C]"
                : "border-[#D9B463]/40 bg-[#17271E] text-[#E5C378]"
            }`}
          >
            Proof-of-Stake
          </span>
        </div>

        <div className="text-[11px] font-mono opacity-60">
          Auto-Compounding Eligible
        </div>
      </div>

      {/* Main Stake Display */}
      <div className="mt-1 flex flex-wrap items-baseline gap-3">
        <div
          id="stakedAmountDisplay"
          className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight leading-none"
        >
          {stakedAmount}
        </div>
        <span
          id="tokenSymbolLabel"
          className={`font-mono text-xl sm:text-2xl font-normal ${
            theme === "parchment" ? "text-[#5C5A4E]" : "text-[#93B8A4]"
          }`}
        >
          {tokenSymbol}
        </span>
      </div>

      {/* Certificate Technical Data Grid */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 mt-7 pt-6 border-t border-dashed ${
          theme === "parchment" ? "border-[#C9C1AC]" : "border-[#1E3328]"
        }`}
      >
        {/* Cell 1: Pending Rewards */}
        <div className="flex flex-col">
          <span
            className={`text-[11px] font-medium mb-1 flex items-center gap-1 ${
              theme === "parchment" ? "text-[#5C5A4E]" : "text-[#8CAEA0]"
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#A8823C] dark:text-[#E5C378]" />
            Pending Rewards
          </span>
          <span
            id="pendingAmountDisplay"
            className="font-mono text-base sm:text-lg font-semibold text-[#1F4D3D] dark:text-[#34D399]"
          >
            {pendingAmount} {tokenSymbol}
          </span>
        </div>

        {/* Cell 2: APY */}
        <div className="flex flex-col">
          <span
            className={`text-[11px] font-medium mb-1 flex items-center gap-1 ${
              theme === "parchment" ? "text-[#5C5A4E]" : "text-[#8CAEA0]"
            }`}
          >
            <TrendingUp className="w-3 h-3 text-[#1F4D3D] dark:text-[#34D399]" />
            Current APY
          </span>
          <div className="flex items-center gap-1.5">
            <span
              id="apyValueDisplay"
              className="font-mono text-base sm:text-lg font-semibold"
            >
              {apyValue}
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                theme === "parchment"
                  ? "bg-[#DCE6DE] text-[#1F4D3D]"
                  : "bg-[#163628] text-[#34D399]"
              }`}
            >
              Fixed
            </span>
          </div>
        </div>

        {/* Cell 3: Wallet Balance */}
        <div className="flex flex-col">
          <span
            className={`text-[11px] font-medium mb-1 ${
              theme === "parchment" ? "text-[#5C5A4E]" : "text-[#8CAEA0]"
            }`}
          >
            Available in Wallet
          </span>
          <span
            id="walletBalanceDisplay"
            className="font-mono text-base sm:text-lg font-semibold"
          >
            {walletBalance} {tokenSymbol}
          </span>
        </div>

        {/* Cell 4: Pool Total Staked */}
        <div className="flex flex-col">
          <span
            className={`text-[11px] font-medium mb-1 flex items-center gap-1 ${
              theme === "parchment" ? "text-[#5C5A4E]" : "text-[#8CAEA0]"
            }`}
          >
            <Vault className="w-3 h-3 opacity-60" />
            Pool Total Staked
          </span>
          <span
            id="poolTotalStakedDisplay"
            className="font-mono text-sm sm:text-base font-medium opacity-90"
          >
            {poolTotalStaked} {tokenSymbol}
          </span>
        </div>

        {/* Cell 5: Reward Reserve */}
        <div className="flex flex-col">
          <span
            className={`text-[11px] font-medium mb-1 ${
              theme === "parchment" ? "text-[#5C5A4E]" : "text-[#8CAEA0]"
            }`}
          >
            Reward Reserve
          </span>
          <span
            id="poolReserveDisplay"
            className="font-mono text-sm sm:text-base font-medium opacity-90"
          >
            {poolReserve} {tokenSymbol}
          </span>
        </div>

        {/* Cell 6: Contract Identifier */}
        <div className="flex flex-col">
          <span
            className={`text-[11px] font-medium mb-1 flex items-center justify-between ${
              theme === "parchment" ? "text-[#5C5A4E]" : "text-[#8CAEA0]"
            }`}
          >
            <span>Instrument / Pool</span>
            {poolAddress && (
              <button
                onClick={handleCopy}
                className="hover:opacity-100 opacity-60 flex items-center gap-0.5 text-[10px] cursor-pointer"
                title="Copy Address"
              >
                {copied ? (
                  <Check className="w-2.5 h-2.5 text-green-600" />
                ) : (
                  <Copy className="w-2.5 h-2.5" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm truncate">
            <span
              id="poolAddrDisplay"
              className="truncate select-all"
              title={poolAddress || "No pool loaded"}
            >
              {poolAddress ? `${poolAddress.slice(0, 10)}…${poolAddress.slice(-6)}` : "—"}
            </span>
            {poolAddress && (
              <a
                href={getAddressUrl(poolAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100 opacity-60 cursor-pointer"
                title="View on ArcScan Explorer"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
