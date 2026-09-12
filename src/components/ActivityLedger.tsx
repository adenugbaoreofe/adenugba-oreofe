import React, { useState } from "react";
import { ThemeMode, ActivityItem } from "../types";
import { shortAddress, getTxUrl } from "../utils";
import { History, ExternalLink, ArrowDownRight, ArrowUpRight, Award, Plus } from "lucide-react";

interface ActivityLedgerProps {
  theme: ThemeMode;
  items: ActivityItem[];
  userAddress: string | null;
  onSimulateEvent?: () => void;
}

export const ActivityLedger: React.FC<ActivityLedgerProps> = ({
  theme,
  items,
  userAddress,
  onSimulateEvent,
}) => {
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const filteredItems = items.filter((item) => {
    if (filter === "mine" && userAddress) {
      return item.address.toLowerCase() === userAddress.toLowerCase();
    }
    return true;
  });

  const isDark = theme === "obsidian" || theme === "emerald";

  const getBadgeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "Stake":
        return theme === "parchment"
          ? "text-[#1F4D3D] bg-[#DCE6DE]"
          : "text-[#34D399] bg-[#143224]";
      case "Withdraw":
        return theme === "parchment"
          ? "text-[#8C3B2E] bg-[#F1E1DC]"
          : "text-[#F87171] bg-[#3B1717]";
      case "Claim":
        return theme === "parchment"
          ? "text-[#A8823C] bg-[#FAF3E0]"
          : "text-[#E5C378] bg-[#2E2413]";
      default:
        return "opacity-75 bg-black/5 dark:bg-white/5";
    }
  };

  return (
    <section
      id="activitySection"
      className={`p-6 sm:p-8 transition-colors duration-300 ${
        theme === "parchment"
          ? "bg-[#EDE8D9] text-[#1C1F1B]"
          : theme === "obsidian"
          ? "bg-[#0E1411] text-[#E3EDE7]"
          : "bg-[#0A1F17] text-[#E5F3EB]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 opacity-75" />
          <h2 className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider opacity-75">
            Immutable Activity Ledger
          </h2>
          <span className="text-[10px] font-mono opacity-50">
            ({filteredItems.length} records)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {userAddress && (
            <div
              className={`p-0.5 rounded border text-[11px] font-mono ${
                theme === "parchment"
                  ? "border-[#C9C1AC] bg-[#E2DCC9]"
                  : "border-[#1E3328] bg-[#121B16]"
              }`}
            >
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filter === "all"
                    ? theme === "parchment"
                      ? "bg-white font-semibold"
                      : "bg-[#1E3328] font-semibold"
                    : "opacity-60"
                }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setFilter("mine")}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  filter === "mine"
                    ? theme === "parchment"
                      ? "bg-white font-semibold"
                      : "bg-[#1E3328] font-semibold"
                    : "opacity-60"
                }`}
              >
                My Position
              </button>
            </div>
          )}

          {onSimulateEvent && (
            <button
              type="button"
              onClick={onSimulateEvent}
              className="text-[11px] font-mono opacity-60 hover:opacity-100 flex items-center gap-1 cursor-pointer underline"
              title="Add a sample blockchain event to preview the live stream"
            >
              <Plus className="w-3 h-3" />
              <span>Simulate Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Ledger Rows */}
      <div
        id="txList"
        className={`font-mono text-xs sm:text-sm border rounded divide-y ${
          theme === "parchment"
            ? "border-[#C9C1AC] bg-[#F7F4EB]/70 divide-[#C9C1AC]/60"
            : "border-[#1E2E25] bg-[#0A100C]/70 divide-[#1E2E25]"
        }`}
      >
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-xs opacity-60 italic font-sans">
            No transactions found for this query. Staking, withdrawing, or claiming will record live cryptographic entries here.
          </div>
        ) : (
          filteredItems.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getBadgeColor(
                    tx.type
                  )}`}
                >
                  {tx.type}
                </span>
                <span className="opacity-75">{shortAddress(tx.address)}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold">{tx.amountText}</span>
                {tx.txHash ? (
                  <a
                    href={getTxUrl(tx.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-60 hover:opacity-100 flex items-center gap-0.5 text-xs text-[#1F4D3D] dark:text-[#34D399]"
                    title="Inspect transaction on ArcScan Explorer"
                  >
                    <span>Tx</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] opacity-40">Settled</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
