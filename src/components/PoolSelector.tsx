import React, { useState } from "react";
import { ThemeMode } from "../types";
import { DEFAULT_DEMO_POOL, ARC_TESTNET_PARAMS } from "../constants";
import { Settings2, RefreshCw, PlusCircle, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";

interface PoolSelectorProps {
  theme: ThemeMode;
  poolAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  isConnecting: boolean;
  userAddress: string | null;
  onConnectWallet: () => void;
  onAddArcNetwork: () => void;
  onLoadPool: (address: string) => Promise<void>;
  isLoadingPool: boolean;
  loadHelperMsg: { text: string; kind: "ok" | "error" | "" } | null;
  onUsePreset: (address: string) => void;
}

export const PoolSelector: React.FC<PoolSelectorProps> = ({
  theme,
  poolAddress,
  tokenAddress,
  tokenSymbol,
  isConnecting,
  userAddress,
  onConnectWallet,
  onAddArcNetwork,
  onLoadPool,
  isLoadingPool,
  loadHelperMsg,
  onUsePreset,
}) => {
  const [inputAddr, setInputAddr] = useState(poolAddress || DEFAULT_DEMO_POOL);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const isDark = theme === "obsidian" || theme === "emerald";

  const handleLoad = () => {
    if (inputAddr.trim()) {
      onLoadPool(inputAddr.trim());
    }
  };

  return (
    <section
      id="connectSection"
      className={`p-6 sm:p-8 border-b transition-colors duration-300 ${
        theme === "parchment"
          ? "border-[#C9C1AC] bg-[#EDE8D9] text-[#1C1F1B]"
          : theme === "obsidian"
          ? "border-[#1E2E25] bg-[#0E1411] text-[#E3EDE7]"
          : "border-[#1E3B2E] bg-[#0A1F17] text-[#E5F3EB]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider opacity-75">
            Network & Contract Terminal
          </h2>
          <p className="text-xs font-mono opacity-60 mt-0.5">
            Arc Testnet (Chain ID 5042002) • Gas settled in USDC
          </p>
        </div>

        {/* Quick actions row */}
        <div className="flex flex-wrap items-center gap-2">
          {!userAddress ? (
            <button
              id="connectWalletBtn"
              type="button"
              onClick={onConnectWallet}
              disabled={isConnecting}
              className={`px-3.5 py-2 text-xs font-semibold rounded transition-all cursor-pointer shadow-xs ${
                theme === "parchment"
                  ? "bg-[#1F4D3D] text-[#EDE8D9] hover:bg-[#163B2E]"
                  : "bg-[#D9B463] text-[#0A150F] hover:bg-[#E8C678]"
              }`}
            >
              {isConnecting ? "Connecting…" : "Connect Web3 Wallet"}
            </button>
          ) : (
            <div
              className={`text-xs font-mono px-3 py-1.5 rounded border flex items-center gap-1.5 ${
                theme === "parchment"
                  ? "border-[#1F4D3D]/30 bg-[#DCE6DE] text-[#1F4D3D]"
                  : "border-[#34D399]/30 bg-[#122E22] text-[#34D399]"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Wallet Linked</span>
            </div>
          )}

          <button
            id="addNetworkBtn"
            type="button"
            onClick={onAddArcNetwork}
            className={`px-3 py-2 text-xs font-semibold rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
              theme === "parchment"
                ? "border-[#1F4D3D] text-[#1F4D3D] hover:bg-[#DCE6DE]"
                : "border-[#2D5A46] text-[#A6CDBA] hover:bg-[#163428]"
            }`}
            title="Adds Arc Testnet RPC (5042002) to your browser wallet extension"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Arc Testnet</span>
          </button>

          <button
            id="toggleConfigBtn"
            type="button"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`p-2 rounded border text-xs transition-all cursor-pointer flex items-center gap-1 ${
              theme === "parchment"
                ? "border-[#C9C1AC] hover:bg-[#E2DCC9]"
                : "border-[#20362B] hover:bg-[#15241C]"
            }`}
            title="Configure Pool Contract Address"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contract Settings</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isConfigOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Contract Configuration Dropdown/Panel */}
      {isConfigOpen && (
        <div
          className={`mt-5 pt-5 border-t border-dashed space-y-3 ${
            theme === "parchment" ? "border-[#C9C1AC]" : "border-[#1E3328]"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="poolAddr"
                className="block text-xs font-mono font-medium opacity-75 mb-1.5"
              >
                Staking Pool Address
              </label>
              <div className="flex gap-2">
                <input
                  id="poolAddr"
                  type="text"
                  value={inputAddr}
                  onChange={(e) => setInputAddr(e.target.value)}
                  placeholder="0x… StakingPool contract"
                  className={`w-full font-mono text-xs px-3 py-2 rounded border transition-all ${
                    theme === "parchment"
                      ? "bg-white border-[#A79F87] text-[#1C1F1B] focus:border-[#1F4D3D]"
                      : "bg-[#09100C] border-[#223B2F] text-[#E3EDE7] focus:border-[#34D399]"
                  }`}
                />
                <button
                  id="loadPoolBtn"
                  type="button"
                  onClick={handleLoad}
                  disabled={isLoadingPool}
                  className={`px-3 py-2 text-xs font-semibold rounded border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    theme === "parchment"
                      ? "border-[#1F4D3D] bg-[#1F4D3D] text-[#EDE8D9] hover:bg-[#163B2E]"
                      : "border-[#34D399] bg-[#16382B] text-[#34D399] hover:bg-[#1D4A3A]"
                  }`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingPool ? "animate-spin" : ""}`}
                  />
                  <span>Load</span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="tokenAddr"
                className="block text-xs font-mono font-medium opacity-75 mb-1.5"
              >
                Staked Token Contract (ERC-20)
              </label>
              <input
                id="tokenAddr"
                type="text"
                readOnly
                value={tokenAddress}
                placeholder="Auto-resolved from StakingPool"
                className={`w-full font-mono text-xs px-3 py-2 rounded border opacity-80 cursor-not-allowed ${
                  theme === "parchment"
                    ? "bg-[#E2DCC9]/60 border-[#C9C1AC] text-[#5C5A4E]"
                    : "bg-[#0B130F] border-[#1E2E25] text-[#7A9E8D]"
                }`}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono opacity-60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#A8823C]" />
              Verified Presets:
            </span>
            <button
              type="button"
              onClick={() => {
                setInputAddr(DEFAULT_DEMO_POOL);
                onUsePreset(DEFAULT_DEMO_POOL);
              }}
              className="text-[11px] font-mono underline hover:opacity-100 opacity-70 cursor-pointer"
            >
              Arc USDC Genesis Pool
            </button>
          </div>

          {loadHelperMsg && loadHelperMsg.text && (
            <div
              id="loadHelper"
              className={`text-xs font-mono p-2 rounded ${
                loadHelperMsg.kind === "ok"
                  ? "bg-[#DCE6DE] text-[#1F4D3D] dark:bg-[#133023] dark:text-[#34D399]"
                  : "bg-[#F1E1DC] text-[#8C3B2E] dark:bg-[#3B1515] dark:text-[#FCA5A5]"
              }`}
            >
              {loadHelperMsg.text}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
