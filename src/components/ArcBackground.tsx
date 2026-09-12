import React from "react";
import { ThemeMode } from "../types";

interface ArcBackgroundProps {
  theme: ThemeMode;
  showArcs?: boolean;
}

export const ArcBackground: React.FC<ArcBackgroundProps> = ({
  theme,
  showArcs = true,
}) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 transition-colors duration-700"
      aria-hidden="true"
    >
      {/* Dynamic Theme Gradient Base */}
      {theme === "parchment" && (
        <>
          <div
            className="absolute inset-0 bg-[#E3DDCA]"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 50% 15%, rgba(250, 248, 242, 0.9) 0%, rgba(226, 220, 201, 0.95) 70%, rgba(212, 204, 183, 1) 100%),
                repeating-linear-gradient(115deg, rgba(31,77,61,0.035) 0px, rgba(31,77,61,0.035) 1px, transparent 1px, transparent 10px)
              `,
            }}
          />
          {/* Subtle noise/paper grain vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4)_0%,_transparent_60%)]" />
        </>
      )}

      {theme === "obsidian" && (
        <>
          <div
            className="absolute inset-0 bg-[#0A0D0C]"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 90% 60% at 50% -10%, rgba(28, 67, 54, 0.45) 0%, rgba(10, 13, 12, 0.95) 75%),
                radial-gradient(circle at 85% 85%, rgba(168, 130, 60, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 15% 70%, rgba(31, 77, 61, 0.12) 0%, transparent 60%)
              `,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </>
      )}

      {theme === "emerald" && (
        <>
          <div
            className="absolute inset-0 bg-[#071711]"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 50% 0%, rgba(27, 85, 63, 0.6) 0%, rgba(7, 23, 17, 0.98) 70%),
                radial-gradient(circle at 50% 100%, rgba(168, 130, 60, 0.15) 0%, transparent 60%)
              `,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(5,15,11,0.85)_100%)]" />
        </>
      )}

      {/* SVG Architectural Arc Blueprint Overlay */}
      {showArcs && (
        <svg
          className="absolute inset-0 w-full h-full opacity-65 transition-opacity duration-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fine drafting grid pattern */}
            <pattern
              id="grid-pattern"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={
                  theme === "parchment"
                    ? "rgba(31, 77, 61, 0.065)"
                    : "rgba(52, 211, 153, 0.05)"
                }
                strokeWidth="0.8"
              />
              <circle
                cx="0"
                cy="0"
                r="1.2"
                fill={
                  theme === "parchment"
                    ? "rgba(168, 130, 60, 0.25)"
                    : "rgba(217, 180, 99, 0.25)"
                }
              />
              <path
                d="M -4 0 L 4 0 M 0 -4 L 0 4"
                stroke={
                  theme === "parchment"
                    ? "rgba(31, 77, 61, 0.09)"
                    : "rgba(52, 211, 153, 0.08)"
                }
                strokeWidth="0.6"
              />
            </pattern>

            {/* Glowing filter for dark modes */}
            <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Drafting Grid */}
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* Central Architectural Compass & Orbital Arcs */}
          <g
            transform="translate(50%, 140)"
            className="origin-top"
            style={{ transform: "translate(50vw, 120px)" }}
          >
            {/* Concentric Arcs */}
            {[240, 360, 480, 620, 780, 960, 1180].map((radius, idx) => {
              const isAccent = idx % 2 === 1;
              const strokeColor =
                theme === "parchment"
                  ? isAccent
                    ? "rgba(168, 130, 60, 0.35)"
                    : "rgba(31, 77, 61, 0.18)"
                  : isAccent
                  ? "rgba(217, 180, 99, 0.25)"
                  : "rgba(52, 211, 153, 0.16)";

              return (
                <g key={radius}>
                  <circle
                    cx="0"
                    cy="0"
                    r={radius}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isAccent ? "1.2" : "0.75"}
                    strokeDasharray={isAccent ? "6 4 2 4" : "none"}
                  />
                  {/* Arc tick marks */}
                  {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((deg) => {
                    const rad = ((deg + 90) * Math.PI) / 180;
                    const x1 = Math.cos(rad) * (radius - 4);
                    const y1 = Math.sin(rad) * (radius - 4);
                    const x2 = Math.cos(rad) * (radius + 4);
                    const y2 = Math.sin(rad) * (radius + 4);
                    return (
                      <line
                        key={deg}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={strokeColor}
                        strokeWidth="0.8"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Radiant Crosshairs & Angle Rays */}
            {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((deg) => {
              const rad = ((deg + 90) * Math.PI) / 180;
              const x2 = Math.cos(rad) * 1250;
              const y2 = Math.sin(rad) * 1250;
              return (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2={x2}
                  y2={y2}
                  stroke={
                    theme === "parchment"
                      ? deg === 0
                        ? "rgba(168, 130, 60, 0.3)"
                        : "rgba(31, 77, 61, 0.08)"
                      : deg === 0
                      ? "rgba(217, 180, 99, 0.3)"
                      : "rgba(52, 211, 153, 0.07)"
                  }
                  strokeWidth={deg === 0 ? "1.2" : "0.6"}
                  strokeDasharray={deg % 30 === 0 ? "4 4" : "2 6"}
                />
              );
            })}

            {/* Geometric Calipers / Focal Arc Crest */}
            <path
              d="M -320 180 A 380 380 0 0 1 320 180"
              fill="none"
              stroke={
                theme === "parchment"
                  ? "rgba(168, 130, 60, 0.55)"
                  : "rgba(217, 180, 99, 0.45)"
              }
              strokeWidth="2"
              filter={theme !== "parchment" ? "url(#arc-glow)" : undefined}
            />
            <path
              d="M -300 200 A 380 380 0 0 1 300 200"
              fill="none"
              stroke={
                theme === "parchment"
                  ? "rgba(31, 77, 61, 0.35)"
                  : "rgba(52, 211, 153, 0.3)"
              }
              strokeWidth="1"
            />
          </g>

          {/* Technical Margin Calibration Indicators */}
          <g
            className="text-[9px] font-mono tracking-widest uppercase"
            fill={
              theme === "parchment"
                ? "rgba(92, 90, 78, 0.5)"
                : "rgba(156, 163, 175, 0.35)"
            }
          >
            <text x="32" y="42">
              ARC-TESTNET // CHAIN: 5042002 [0x4CEF52]
            </text>
            <text x="32" y="58">
              ORBITAL COORD: R-STAKE · NATIVE GAS: USDC
            </text>
            <text x="32" y="calc(100% - 32px)">
              CONSENSUS LEDGER · AUTONOMOUS STAKING ENGINE
            </text>
            <text
              x="calc(100% - 32px)"
              y="42"
              textAnchor="end"
            >
              CONTRACT: EIP-1193 / ERC-20 COMPLIANT
            </text>
            <text
              x="calc(100% - 32px)"
              y="58"
              textAnchor="end"
            >
              CRYPTO LEDGER INSTRUMENT #7709-ARC
            </text>
            <text
              x="calc(100% - 32px)"
              y="calc(100% - 32px)"
              textAnchor="end"
            >
              SECURITY: MULTI-SIG AUDITED · SECURE VAULT
            </text>
          </g>

          {/* Edge Framing Fine Lines */}
          <line
            x1="24"
            y1="24"
            x2="calc(100% - 24px)"
            y2="24"
            stroke={
              theme === "parchment"
                ? "rgba(168, 130, 60, 0.2)"
                : "rgba(217, 180, 99, 0.15)"
            }
            strokeWidth="0.8"
          />
          <line
            x1="24"
            y1="calc(100% - 24px)"
            x2="calc(100% - 24px)"
            y2="calc(100% - 24px)"
            stroke={
              theme === "parchment"
                ? "rgba(168, 130, 60, 0.2)"
                : "rgba(217, 180, 99, 0.15)"
            }
            strokeWidth="0.8"
          />
          <line
            x1="24"
            y1="24"
            x2="24"
            y2="calc(100% - 24px)"
            stroke={
              theme === "parchment"
                ? "rgba(168, 130, 60, 0.2)"
                : "rgba(217, 180, 99, 0.15)"
            }
            strokeWidth="0.8"
          />
          <line
            x1="calc(100% - 24px)"
            y1="24"
            x2="calc(100% - 24px)"
            y2="calc(100% - 24px)"
            stroke={
              theme === "parchment"
                ? "rgba(168, 130, 60, 0.2)"
                : "rgba(217, 180, 99, 0.15)"
            }
            strokeWidth="0.8"
          />

          {/* Corner Registration Crosses */}
          {[
            { x: 24, y: 24 },
            { x: "calc(100% - 24px)", y: 24 },
            { x: 24, y: "calc(100% - 24px)" },
            { x: "calc(100% - 24px)", y: "calc(100% - 24px)" },
          ].map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="none"
                stroke={
                  theme === "parchment"
                    ? "rgba(168, 130, 60, 0.4)"
                    : "rgba(217, 180, 99, 0.4)"
                }
                strokeWidth="0.8"
              />
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};
