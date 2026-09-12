import React, { useState } from "react";
import { ThemeMode } from "../types";
import { ShieldCheck, Coins, RefreshCw, Percent, AlertOctagon, PlayCircle, Loader2 } from "lucide-react";

interface AdminPanelProps {
  theme: ThemeMode;
  tokenSymbol: string;
  isOwner: boolean;
  isPaused: boolean;
  onFundReserve: (amountStr: string) => Promise<void>;
  onReclaimReserve: (amountStr: string) => Promise<void>;
  onSetApy: (apyBpsStr: string) => Promise<void>;
  onTogglePause: (pauseIt: boolean) => Promise<void>;
  busyAction: string | null;
  adminHelperMsg: { text: string; kind: "ok" | "error" | "" } | null;
  onToggleOwnerPreview: () => void;
  isOwnerPreviewActive: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  theme,
  tokenSymbol,
  isOwner,
  isPaused,
  onFundReserve,
  onReclaimReserve,
  onSetApy,
  onTogglePause,
  busyAction,
  adminHelperMsg,
  onToggleOwnerPreview,
  isOwnerPreviewActive,
}) => {
  const [fundVal, setFundVal] = useState("");
  const [reclaimVal, setReclaimVal] = useState("");
  const [apyVal, setApyVal] = useState("");

  const showPanel = isOwner || isOwnerPreviewActive;

  const isDark = theme === "obsidian" || theme === "emerald";

  return (
    <section
      id="ownerSection"
      className={`p-6 sm:p-8 border-b transition-colors duration-300 ${
        theme === "parchment"
          ? "border-[#C9C1AC] bg-[#EDE8D9] text-[#1C1F1B]"
          : theme === "obsidian"
          ? "border-[#1E2E25] bg-[#0E1411] text-[#E3EDE7]"
          : "border-[#1E3B2E] bg-[#0A1F17] text-[#E5F3EB]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <h2 className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider opacity-75">
            Pool Administration
          </h2>
          <span
            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border tracking-wider font-semibold ${
              theme === "parchment"
                ? "border-[#A8823C] bg-[#FAF7F0] text-[#8F6E2F]"
                : "border-[#D9B463] bg-[#1C251C] text-[#E5C378]"
            }`}
          >
            {isOwner ? "Contract Owner" : "Admin Mode (Simulated)"}
          </span>
        </div>

        {/* Preview toggle button for testing */}
        <button
          type="button"
          onClick={onToggleOwnerPreview}
          className="text-xs font-mono opacity-65 hover:opacity-100 underline cursor-pointer"
        >
          {isOwnerPreviewActive ? "Hide Owner Controls" : "Show Owner Controls"}
        </button>
      </div>

      {showPanel ? (
        <div className="space-y-4">
          {/* Row 1: Fund reserve */}
          <div
            className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-3.5 rounded border ${
              theme === "parchment"
                ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
                : "border-[#1E2F26] bg-[#121B16]/60"
            }`}
          >
            <div className="min-w-[140px]">
              <div className="font-medium text-xs sm:text-sm flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#A8823C]" />
                <span>Fund Reward Reserve</span>
              </div>
              <span className="block text-xs font-mono opacity-60">
                Deposit tokens for user yield
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <input
                type="text"
                id="fundInput"
                placeholder="0.00"
                value={fundVal}
                onChange={(e) => setFundVal(e.target.value)}
                className={`font-mono text-xs sm:text-sm px-3 py-1.5 rounded border w-36 ${
                  theme === "parchment"
                    ? "bg-white border-[#A79F87] text-[#1C1F1B]"
                    : "bg-[#09100C] border-[#223B2F] text-[#E3EDE7]"
                }`}
              />
              <button
                id="fundBtn"
                type="button"
                disabled={busyAction !== null || !fundVal}
                onClick={() => {
                  onFundReserve(fundVal);
                  setFundVal("");
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1 text-white shadow-xs ${
                  theme === "parchment"
                    ? "bg-[#A8823C] hover:bg-[#8F6E2F]"
                    : "bg-[#B8923F] hover:bg-[#C9A24D]"
                }`}
              >
                {busyAction === "fund" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Fund</span>
              </button>
            </div>
          </div>

          {/* Row 2: Reclaim unused reserve */}
          <div
            className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-3.5 rounded border ${
              theme === "parchment"
                ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
                : "border-[#1E2F26] bg-[#121B16]/60"
            }`}
          >
            <div className="min-w-[140px]">
              <div className="font-medium text-xs sm:text-sm flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 opacity-70" />
                <span>Reclaim Unused Reserve</span>
              </div>
              <span className="block text-xs font-mono opacity-60">
                Withdraw unallocated rewards
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <input
                type="text"
                id="reclaimInput"
                placeholder="0.00"
                value={reclaimVal}
                onChange={(e) => setReclaimVal(e.target.value)}
                className={`font-mono text-xs sm:text-sm px-3 py-1.5 rounded border w-36 ${
                  theme === "parchment"
                    ? "bg-white border-[#A79F87] text-[#1C1F1B]"
                    : "bg-[#09100C] border-[#223B2F] text-[#E3EDE7]"
                }`}
              />
              <button
                id="reclaimBtn"
                type="button"
                disabled={busyAction !== null || !reclaimVal}
                onClick={() => {
                  onReclaimReserve(reclaimVal);
                  setReclaimVal("");
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded border transition-all cursor-pointer flex items-center gap-1 ${
                  theme === "parchment"
                    ? "border-[#1F4D3D] text-[#1F4D3D] hover:bg-[#DCE6DE]"
                    : "border-[#34D399] text-[#34D399] hover:bg-[#122A20]"
                }`}
              >
                {busyAction === "reclaim" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Reclaim</span>
              </button>
            </div>
          </div>

          {/* Row 3: Set APY */}
          <div
            className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-3.5 rounded border ${
              theme === "parchment"
                ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
                : "border-[#1E2F26] bg-[#121B16]/60"
            }`}
          >
            <div className="min-w-[140px]">
              <div className="font-medium text-xs sm:text-sm flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#1F4D3D] dark:text-[#34D399]" />
                <span>Adjust Target APY</span>
              </div>
              <span className="block text-xs font-mono opacity-60">
                In basis points (1000 bps = 10.00%)
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <input
                type="text"
                id="apyInput"
                placeholder="e.g. 1200"
                value={apyVal}
                onChange={(e) => setApyVal(e.target.value)}
                className={`font-mono text-xs sm:text-sm px-3 py-1.5 rounded border w-36 ${
                  theme === "parchment"
                    ? "bg-white border-[#A79F87] text-[#1C1F1B]"
                    : "bg-[#09100C] border-[#223B2F] text-[#E3EDE7]"
                }`}
              />
              <button
                id="setApyBtn"
                type="button"
                disabled={busyAction !== null || !apyVal}
                onClick={() => {
                  onSetApy(apyVal);
                  setApyVal("");
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded border transition-all cursor-pointer flex items-center gap-1 ${
                  theme === "parchment"
                    ? "border-[#1F4D3D] text-[#1F4D3D] hover:bg-[#DCE6DE]"
                    : "border-[#34D399] text-[#34D399] hover:bg-[#122A20]"
                }`}
              >
                {busyAction === "setApy" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>Update APY</span>
              </button>
            </div>
          </div>

          {/* Row 4: Emergency Pause / Unpause */}
          <div
            className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-3.5 rounded border ${
              theme === "parchment"
                ? "border-[#C9C1AC]/80 bg-[#F5F2E9]/60"
                : "border-[#1E2F26] bg-[#121B16]/60"
            }`}
          >
            <div>
              <div className="font-medium text-xs sm:text-sm flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-[#8C3B2E] dark:text-[#EF4444]" />
                <span>Emergency Circuit Breaker</span>
              </div>
              <span className="block text-xs font-mono opacity-60">
                {isPaused
                  ? "Pool staking is currently PAUSED"
                  : "Pool staking is currently ACTIVE"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="pauseBtn"
                type="button"
                disabled={isPaused || busyAction !== null}
                onClick={() => onTogglePause(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded border border-[#8C3B2E] text-[#8C3B2E] hover:bg-[#F1E1DC] dark:border-[#EF4444] dark:text-[#EF4444] dark:hover:bg-[#3B1515] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Pause Staking
              </button>
              <button
                id="unpauseBtn"
                type="button"
                disabled={!isPaused || busyAction !== null}
                onClick={() => onTogglePause(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  theme === "parchment"
                    ? "border-[#1F4D3D] text-[#1F4D3D] hover:bg-[#DCE6DE]"
                    : "border-[#34D399] text-[#34D399] hover:bg-[#122A20]"
                }`}
              >
                Resume Staking
              </button>
            </div>
          </div>

          {/* Admin Helper Message */}
          {adminHelperMsg && adminHelperMsg.text && (
            <div
              id="ownerHelper"
              className={`p-2.5 rounded font-mono text-xs ${
                adminHelperMsg.kind === "ok"
                  ? "bg-[#DCE6DE] text-[#1F4D3D] dark:bg-[#133023] dark:text-[#34D399]"
                  : "bg-[#F1E1DC] text-[#8C3B2E] dark:bg-[#3B1515] dark:text-[#FCA5A5]"
              }`}
            >
              {adminHelperMsg.text}
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs font-mono opacity-60 italic flex items-center justify-between">
          <span>
            Connected wallet is not the contract owner. Click "Show Owner Controls" above to inspect administrative actions in test mode.
          </span>
        </div>
      )}
    </section>
  );
};
