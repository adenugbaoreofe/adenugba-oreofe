import React from "react";
import { ThemeMode } from "../types";
import { ExternalLink, Droplets, Layers, Shield } from "lucide-react";

interface FooterBarProps {
  theme: ThemeMode;
  showArcs: boolean;
  onToggleArcs: () => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  theme,
  showArcs,
  onToggleArcs,
}) => {
  return (
    <footer
      id="foot"
      className="max-w-4xl mx-auto mt-6 px-4 py-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono opacity-70"
    >
      <div className="flex items-center gap-3">
        <span>Arc Testnet • Chain 5042002</span>
        <span>•</span>
        <span>Gas paid in USDC</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <a
          href="https://testnet.arcscan.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline flex items-center gap-1"
        >
          <span>arcscan.app</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <a
          href="https://faucet.circle.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline flex items-center gap-1"
        >
          <Droplets className="w-3 h-3" />
          <span>USDC Faucet</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          type="button"
          onClick={onToggleArcs}
          className="hover:underline flex items-center gap-1 cursor-pointer"
          title="Toggle geometric arc blueprint overlay"
        >
          <Layers className="w-3 h-3" />
          <span>{showArcs ? "Hide Blueprint Arcs" : "Show Blueprint Arcs"}</span>
        </button>
      </div>
    </footer>
  );
};
