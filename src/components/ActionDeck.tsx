import React, { useState } from "react";
import { ThemeMode } from "../types";
import { ArrowDownRight, ArrowUpRight, Award, LogOut, Loader2 } from "lucide-react";

interface ActionDeckProps {
  theme: ThemeMode;
  tokenSymbol: string;
  isPaused: boolean;
  walletBalance: string;
  stakedBalance: string;
  pendingAmount: string;
  onStake: (amountStr: string) => Promise<void>;
  onWithdraw: (amountStr: string) => Promise<void>;
  onClaim: () => Promise<void>;
  onExit: () => Promise<void>;
  busyAction: string | null;
  feedbackMessage: { text: string; kind: "ok" | "error" | "info" | "" } | null;
}

export const ActionDeck: React.FC<ActionDeckProps> = ({
  theme,
  tokenSymbol,
  isPaused,
  walletBalance,
  stakedBalance,
  pendingAmount,
  onStake,
  onWithdraw,
  onClaim,
  onExit,
  busyAction,
  feedbackMessage,
}) => {
  const [stakeVal, setStakeVal] = useState("");
  const [withdrawVal, setWithdrawVal] = useState("");

  const handleMaxStake = () => {
    // Remove formatting commas for clean parsing
    const clean = walletBalance.replace(/,/g, "");
    if (clean && clean !== "—") setStakeVal(clean);
  };

  const handleMaxWithdraw = () => {
    const clean = stakedBalance.replace(/,/g, "");
    if (clean && clean !== "—") setWithdrawVal(clean);
  };

  const isDark = theme === "obsidian" || theme === "emerald";

  return (
    <section
      id="actionsSection"
      className={`p-6 sm:p-8 border-b transition-colors duration-300 ${
        theme === "parchment"
          ? "border-[#C9C1AC] bg-[#EDE8D9] text-[#1C1F1B]"
          : theme === "obsidian"
          ? "border-[#1E2E25] bg-[#0E1411] text-[#E3EDE7]"
          : "border-[#1E3B2E] bg-[#0A1F17] text-[#E5F3EB]"
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider opacity-75">
          Position Operations
        </h2>
        <span className="text-[11px] font-mono opacity-50">
          Smart Contract Automated
        </span>
      </div>

      <div className="space-y-4">
        {/* Row 1: STAKE */}
        <div
          className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 rounded border transition-colors ${
            theme === "parchment"
              ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
              : "border-[#1E2F26] bg-[#121B16]/60"
          }`}
        >
          <div className="min-w-[140px]">
            <div className="flex items-center gap-1.5 font-medium text-sm">
              <ArrowDownRight className="w-4 h-4 text-[#1F4D3D] dark:text-[#34D399]" />
              <span>Stake {tokenSymbol}</span>
            </div>
            <span className="block text-xs font-mono opacity-60 mt-0.5">
              Requires 1-click token approval
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-44">
              <input
                type="text"
                id="stakeInput"
                placeholder="0.00"
                value={stakeVal}
                disabled={isPaused || busyAction !== null}
                onChange={(e) => setStakeVal(e.target.value)}
                className={`w-full font-mono text-sm px-3 py-2 rounded border transition-all ${
                  theme === "parchment"
                    ? "bg-white border-[#A79F87] text-[#1C1F1B] focus:border-[#1F4D3D] focus:ring-1 focus:ring-[#1F4D3D]"
                    : "bg-[#09100C] border-[#223B2F] text-[#E3EDE7] focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399]"
                }`}
              />
              <button
                type="button"
                id="stakeMaxBtn"
                onClick={handleMaxStake}
                disabled={isPaused || busyAction !== null}
                className="absolute right-2 top-2 text-[11px] font-mono font-medium opacity-70 hover:opacity-100 underline cursor-pointer"
                title="Use full wallet balance"
              >
                MAX
              </button>
            </div>

            <button
              id="stakeBtn"
              type="button"
              disabled={isPaused || busyAction !== null || !stakeVal}
              onClick={() => {
                onStake(stakeVal);
                setStakeVal("");
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                theme === "parchment"
                  ? "bg-[#1F4D3D] text-[#EDE8D9] hover:bg-[#163B2E]"
                  : "bg-[#1D4A3A] text-[#E5F3EB] hover:bg-[#255C48] border border-[#34D399]/40"
              }`}
            >
              {busyAction === "stake" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Staking…</span>
                </>
              ) : (
                <span>Stake</span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: WITHDRAW */}
        <div
          className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 rounded border transition-colors ${
            theme === "parchment"
              ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
              : "border-[#1E2F26] bg-[#121B16]/60"
          }`}
        >
          <div className="min-w-[140px]">
            <div className="flex items-center gap-1.5 font-medium text-sm">
              <ArrowUpRight className="w-4 h-4 text-[#A8823C] dark:text-[#D9B463]" />
              <span>Withdraw</span>
            </div>
            <span className="block text-xs font-mono opacity-60 mt-0.5">
              No lockup — available anytime
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-44">
              <input
                type="text"
                id="withdrawInput"
                placeholder="0.00"
                value={withdrawVal}
                disabled={busyAction !== null}
                onChange={(e) => setWithdrawVal(e.target.value)}
                className={`w-full font-mono text-sm px-3 py-2 rounded border transition-all ${
                  theme === "parchment"
                    ? "bg-white border-[#A79F87] text-[#1C1F1B] focus:border-[#1F4D3D] focus:ring-1 focus:ring-[#1F4D3D]"
                    : "bg-[#09100C] border-[#223B2F] text-[#E3EDE7] focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399]"
                }`}
              />
              <button
                type="button"
                id="withdrawMaxBtn"
                onClick={handleMaxWithdraw}
                disabled={busyAction !== null}
                className="absolute right-2 top-2 text-[11px] font-mono font-medium opacity-70 hover:opacity-100 underline cursor-pointer"
                title="Withdraw full staked amount"
              >
                MAX
              </button>
            </div>

            <button
              id="withdrawBtn"
              type="button"
              disabled={busyAction !== null || !withdrawVal}
              onClick={() => {
                onWithdraw(withdrawVal);
                setWithdrawVal("");
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded border transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                theme === "parchment"
                  ? "border-[#1F4D3D] text-[#1F4D3D] hover:bg-[#DCE6DE]"
                  : "border-[#34D399] text-[#34D399] hover:bg-[#122A20]"
              }`}
            >
              {busyAction === "withdraw" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Withdrawing…</span>
                </>
              ) : (
                <span>Withdraw</span>
              )}
            </button>
          </div>
        </div>

        {/* Row 3: CLAIM REWARDS & EXIT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Claim Rewards Card */}
          <div
            className={`p-4 rounded border flex items-center justify-between gap-3 ${
              theme === "parchment"
                ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
                : "border-[#1E2F26] bg-[#121B16]/60"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 font-medium text-sm">
                <Award className="w-4 h-4 text-[#1F4D3D] dark:text-[#34D399]" />
                <span>Claim Rewards</span>
              </div>
              <span className="block text-xs font-mono opacity-60 mt-0.5">
                {pendingAmount} {tokenSymbol} ready
              </span>
            </div>

            <button
              id="claimBtn"
              type="button"
              disabled={busyAction !== null || pendingAmount === "0" || pendingAmount === "0.00" || pendingAmount === "—"}
              onClick={onClaim}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                theme === "parchment"
                  ? "bg-[#1F4D3D] text-[#EDE8D9] hover:bg-[#163B2E]"
                  : "bg-[#1D4A3A] text-[#E5F3EB] hover:bg-[#255C48] border border-[#34D399]/40"
              }`}
            >
              {busyAction === "claim" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Claiming…</span>
                </>
              ) : (
                <span>Claim</span>
              )}
            </button>
          </div>

          {/* Exit Position Card */}
          <div
            className={`p-4 rounded border flex items-center justify-between gap-3 ${
              theme === "parchment"
                ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
                : "border-[#1E2F26] bg-[#121B16]/60"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 font-medium text-sm text-[#8C3B2E] dark:text-[#F87171]">
                <LogOut className="w-4 h-4" />
                <span>Exit Position</span>
              </div>
              <span className="block text-xs font-mono opacity-60 mt-0.5">
                Withdraw all + Claim in 1 pair
              </span>
            </div>

            <button
              id="exitBtn"
              type="button"
              disabled={busyAction !== null}
              onClick={onExit}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded border border-[#8C3B2E] text-[#8C3B2E] hover:bg-[#F1E1DC] dark:border-[#EF4444] dark:text-[#EF4444] dark:hover:bg-[#3B1515] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {busyAction === "exit" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exiting…</span>
                </>
              ) : (
                <span>Exit</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Action Helper / Status Feedback */}
      {feedbackMessage && feedbackMessage.text && (
        <div
          id="actionHelper"
          className={`mt-4 p-3 rounded font-mono text-xs flex items-center gap-2 ${
            feedbackMessage.kind === "ok"
              ? "bg-[#DCE6DE] text-[#1F4D3D] border border-[#1F4D3D]/30 dark:bg-[#133023] dark:text-[#34D399]"
              : feedbackMessage.kind === "error"
              ? "bg-[#F1E1DC] text-[#8C3B2E] border border-[#8C3B2E]/30 dark:bg-[#3B1515] dark:text-[#FCA5A5]"
              : "bg-black/5 dark:bg-white/5 opacity-80"
          }`}
        >
          <span className="font-semibold">Status:</span>
          <span>{feedbackMessage.text}</span>
        </div>
      )}
    </section>
  );
};
