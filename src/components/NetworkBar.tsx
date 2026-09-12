import React from "react";
import { ThemeMode } from "../types";
import { shortAddress } from "../utils";
import { Wallet, ExternalLink, ShieldCheck, Moon, Sun, Compass } from "lucide-react";

interface NetworkBarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  userAddress: string | null;
  chainId: number | null;
  isConnecting: boolean;
  onConnect: () => void;
  onAddNetwork: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const NetworkBar: React.FC<NetworkBarProps> = ({
  theme,
  onThemeChange,
  userAddress,
  chainId,
  isConnecting,
  onConnect,
  onAddNetwork,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const isArcTestnet = chainId === 5042002;
  const isConnected = !!userAddress;

  const isDark = theme === "obsidian" || theme === "emerald";

  return (
    <header
      id="topBar"
      className={`border-b transition-colors duration-300 ${
        theme === "parchment"
          ? "border-[#C9C1AC] bg-[#EDE8D9]/90 text-[#1C1F1B]"
          : theme === "obsidian"
          ? "border-[#1E2E25] bg-[#0E1411]/90 text-[#E3EDE7]"
          : "border-[#1E3B2E] bg-[#0A1F17]/90 text-[#E5F3EB]"
      } backdrop-blur-md sticky top-0 z-30`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-sm border flex items-center justify-center font-serif text-lg font-bold shadow-xs ${
              theme === "parchment"
                ? "border-[#A8823C] bg-[#F7F4EB] text-[#1F4D3D]"
                : "border-[#D9B463] bg-[#14231B] text-[#D9B463]"
            }`}
          >
            ⌒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl tracking-tight leading-none">
                Arc <span className="italic font-normal text-[#1F4D3D] dark:text-[#34D399]">Staking</span>
              </h1>
              <span
                className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border tracking-wider ${
                  theme === "parchment"
                    ? "border-[#C9C1AC] bg-[#E2DCC9]/70 text-[#5C5A4E]"
                    : "border-[#224031] bg-[#12241B] text-[#93B8A4]"
                }`}
              >
                Ledger
              </span>
            </div>
            <div className="text-[11px] font-mono opacity-65 flex items-center gap-2 mt-0.5">
              <span>Chain 5042002</span>
              <span>•</span>
              <span>USDC Gas</span>
            </div>
          </div>
        </div>

        {/* Right Status & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Theme Selector Pill */}
          <div
            className={`flex items-center p-0.5 rounded border text-xs font-mono ${
              theme === "parchment"
                ? "border-[#C9C1AC] bg-[#E2DCC9]/80 text-[#5C5A4E]"
                : "border-[#253D30] bg-[#132019] text-[#A6C9B6]"
            }`}
          >
            <button
              id="themeParchmentBtn"
              onClick={() => onThemeChange("parchment")}
              className={`px-2 py-1 rounded text-xs transition-all flex items-center gap-1 cursor-pointer ${
                theme === "parchment"
                  ? "bg-[#F5F2E9] text-[#1C1F1B] font-semibold shadow-xs"
                  : "hover:opacity-80 opacity-60"
              }`}
              title="Parchment Architectural Theme"
            >
              <Sun className="w-3 h-3" />
              <span className="hidden sm:inline">Parchment</span>
            </button>
            <button
              id="themeObsidianBtn"
              onClick={() => onThemeChange("obsidian")}
              className={`px-2 py-1 rounded text-xs transition-all flex items-center gap-1 cursor-pointer ${
                theme === "obsidian"
                  ? "bg-[#1C2C23] text-[#E3EDE7] font-semibold shadow-xs"
                  : "hover:opacity-80 opacity-60"
              }`}
              title="Obsidian Arc Theme"
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">Obsidian</span>
            </button>
            <button
              id="themeEmeraldBtn"
              onClick={() => onThemeChange("emerald")}
              className={`px-2 py-1 rounded text-xs transition-all flex items-center gap-1 cursor-pointer ${
                theme === "emerald"
                  ? "bg-[#18392B] text-[#D9B463] font-semibold shadow-xs"
                  : "hover:opacity-80 opacity-60"
              }`}
              title="Emerald Treasury Theme"
            >
              <Compass className="w-3 h-3" />
              <span className="hidden sm:inline">Emerald</span>
            </button>
          </div>

          {/* Network Indicator Pill */}
          <div
            id="netIndicator"
            className={`text-xs font-mono px-2.5 py-1.5 rounded border flex items-center gap-2 ${
              theme === "parchment"
                ? "border-[#C9C1AC] bg-[#F7F4EB] text-[#333]"
                : "border-[#20362B] bg-[#0F1B15] text-[#D6E6DC]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isConnected
                  ? isArcTestnet
                    ? "bg-[#1F4D3D] dark:bg-[#34D399] shadow-[0_0_8px_#34D399]"
                    : "bg-[#8C3B2E] dark:bg-[#F87171]"
                  : "bg-[#8C3B2E]"
              }`}
            />
            <span className="truncate max-w-[130px] sm:max-w-none">
              {isConnected
                ? isArcTestnet
                  ? "Arc Testnet (5042002)"
                  : `Wrong Net (${chainId})`
                : "Not Connected"}
            </span>
          </div>

          {/* Connect / Address Button */}
          <button
            id="mainConnectBtn"
            onClick={onConnect}
            disabled={isConnecting}
            className={`font-semibold text-xs sm:text-sm px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isConnected
                ? theme === "parchment"
                  ? "bg-[#1F4D3D] text-[#EDE8D9] hover:bg-[#173D30]"
                  : "bg-[#1D4A3A] text-[#E5F3EB] hover:bg-[#255C48] border border-[#34D399]/40"
                : theme === "parchment"
                ? "bg-[#1F4D3D] text-[#EDE8D9] hover:bg-[#173D30]"
                : "bg-[#D9B463] text-[#0A150F] hover:bg-[#E8C678] font-bold"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {isConnecting
                ? "Connecting…"
                : isConnected
                ? shortAddress(userAddress)
                : "Connect Wallet"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
