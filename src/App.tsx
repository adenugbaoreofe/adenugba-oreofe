import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { ThemeMode, ArcPoolInfo, UserPosition, ActivityItem } from "./types";
import {
  ARC_TESTNET_CHAIN_ID,
  ARC_TESTNET_PARAMS,
  DEFAULT_DEMO_POOL,
  DEFAULT_DEMO_TOKEN,
  POOL_ABI,
  ERC20_ABI,
} from "./constants";
import { formatUnitsSafe, shortAddress } from "./utils";
import { ArcBackground } from "./components/ArcBackground";
import { NetworkBar } from "./components/NetworkBar";
import { PoolSelector } from "./components/PoolSelector";
import { CertificateHero } from "./components/CertificateHero";
import { ActionDeck } from "./components/ActionDeck";
import { AdminPanel } from "./components/AdminPanel";
import { ActivityLedger } from "./components/ActivityLedger";
import { FooterBar } from "./components/FooterBar";

// Declare window.ethereum type
declare global {
  interface Window {
    ethereum?: any;
    __arcStakingCache?: any;
  }
}

export default function App() {
  // Theme & Visual State
  const [theme, setTheme] = useState<ThemeMode>("parchment");
  const [showArcs, setShowArcs] = useState(true);

  // Web3 Connection State
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Pool & Contract State
  const [poolAddress, setPoolAddress] = useState(DEFAULT_DEMO_POOL);
  const [tokenAddress, setTokenAddress] = useState(DEFAULT_DEMO_TOKEN);
  const [tokenSymbol, setTokenSymbol] = useState("USDC");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [isOwner, setIsOwner] = useState(false);
  const [isOwnerPreview, setIsOwnerPreview] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [apyBps, setApyBps] = useState(1200); // 12.00%
  const [totalStaked, setTotalStaked] = useState("482,900.00");
  const [rewardReserve, setRewardReserve] = useState("75,000.00");

  // User Position State
  const [stakedBalance, setStakedBalance] = useState("5,000.00");
  const [pendingRewards, setPendingRewards] = useState("142.85");
  const [walletBalance, setWalletBalance] = useState("1,250.00");

  // Raw BigInts for max precision
  const [rawStaked, setRawStaked] = useState<bigint>(ethers.parseUnits("5000", 18));
  const [rawPending, setRawPending] = useState<bigint>(ethers.parseUnits("142.85", 18));
  const [rawWalletBal, setRawWalletBal] = useState<bigint>(ethers.parseUnits("1250", 18));

  // Loading & Helper Status States
  const [isLoadingPool, setIsLoadingPool] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    text: string;
    kind: "ok" | "error" | "info" | "";
  } | null>(null);
  const [loadHelperMsg, setLoadHelperMsg] = useState<{
    text: string;
    kind: "ok" | "error" | "";
  } | null>(null);
  const [adminHelperMsg, setAdminHelperMsg] = useState<{
    text: string;
    kind: "ok" | "error" | "";
  } | null>(null);

  // Activity Ledger Items
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([
    {
      id: "tx-init-1",
      type: "Stake",
      amountText: "+5,000.00 USDC",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      txHash: "0x89e02ef63a1523ad9963f45618b14a2754687d6928e14cb02082269c3a3b02c8",
      timestamp: Date.now() - 1000 * 60 * 25,
    },
    {
      id: "tx-init-2",
      type: "Fund reserve",
      amountText: "+50,000.00 USDC",
      address: "0x8f3c8B35b3e21F1703279148b8d96001889c676E",
      txHash: "0x3f5c88b901b0460c5a2c262ebbf584e0378038bcaec636c7a7b8e19bc5a8f4c2",
      timestamp: Date.now() - 1000 * 60 * 120,
    },
    {
      id: "tx-init-3",
      type: "APY change",
      amountText: "10.00% → 12.00%",
      address: "0x8f3c8B35b3e21F1703279148b8d96001889c676E",
      txHash: "0x51c9d8fa7216ee892bf445f1b1c67d71b569e5d4a13e2f12c98d67c992bf0781",
      timestamp: Date.now() - 1000 * 60 * 360,
    },
  ]);

  // Connect Wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setActionFeedback({
        text: "No Web3 browser wallet detected. Operating in simulated preview mode.",
        kind: "info",
      });
      setUserAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
      setChainId(ARC_TESTNET_CHAIN_ID);
      setIsDemoMode(true);
      return;
    }

    try {
      setIsConnecting(true);
      const bp = new ethers.BrowserProvider(window.ethereum);
      await bp.send("eth_requestAccounts", []);
      const sg = await bp.getSigner();
      const addr = await sg.getAddress();
      const net = await bp.getNetwork();

      setProvider(bp);
      setSigner(sg);
      setUserAddress(addr);
      setChainId(Number(net.chainId));
      setIsDemoMode(false);

      setActionFeedback({
        text: `Connected to wallet ${shortAddress(addr)}`,
        kind: "ok",
      });

      // Account & Network event listeners
      window.ethereum.on?.("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        } else {
          setUserAddress(null);
        }
      });
      window.ethereum.on?.("chainChanged", (chainHex: string) => {
        setChainId(parseInt(chainHex, 16));
      });
    } catch (err: any) {
      setActionFeedback({
        text: err?.message || "Wallet connection cancelled.",
        kind: "error",
      });
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Add Arc Testnet to Wallet
  const addArcNetwork = async () => {
    if (!window.ethereum) {
      setActionFeedback({
        text: "No browser wallet found to add network. RPC: https://rpc.testnet.arc.network",
        kind: "info",
      });
      return;
    }
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [ARC_TESTNET_PARAMS],
      });
      setActionFeedback({
        text: "Arc Testnet successfully added to your wallet.",
        kind: "ok",
      });
    } catch (err: any) {
      setActionFeedback({
        text: err?.message || "Failed to add Arc Testnet.",
        kind: "error",
      });
    }
  };

  // Load Pool Contract & Live Balances
  const loadPool = async (addrToLoad: string) => {
    if (!addrToLoad || !ethers.isAddress(addrToLoad)) {
      setLoadHelperMsg({
        text: "Please enter a valid contract address (0x…)",
        kind: "error",
      });
      return;
    }

    setIsLoadingPool(true);
    setLoadHelperMsg({ text: "Reading pool metadata…", kind: "" });

    try {
      if (signer) {
        const poolContract = new ethers.Contract(addrToLoad, POOL_ABI, signer);
        const tokAddr = await poolContract.token();
        setTokenAddress(tokAddr);

        const tokenContract = new ethers.Contract(tokAddr, ERC20_ABI, signer);
        const dec = Number(await tokenContract.decimals().catch(() => 18));
        const sym = await tokenContract.symbol().catch(() => "USDC");
        setTokenDecimals(dec);
        setTokenSymbol(sym);

        const ownerAddr = await poolContract.owner().catch(() => ethers.ZeroAddress);
        const myAddr = await signer.getAddress();
        setIsOwner(ownerAddr.toLowerCase() === myAddr.toLowerCase());

        const paused = await poolContract.paused().catch(() => false);
        setIsPaused(paused);

        const apy = await poolContract.apyBps().catch(() => 1200);
        setApyBps(Number(apy));

        const totStk = await poolContract.totalStaked().catch(() => 0n);
        const res = await poolContract.rewardReserve().catch(() => 0n);
        setTotalStaked(formatUnitsSafe(totStk, dec));
        setRewardReserve(formatUnitsSafe(res, dec));

        // Read user specifics
        const [stk, pnd] = await poolContract.getUserInfo(myAddr).catch(() => [0n, 0n]);
        const wBal = await tokenContract.balanceOf(myAddr).catch(() => 0n);

        setRawStaked(stk);
        setRawPending(pnd);
        setRawWalletBal(wBal);

        setStakedBalance(formatUnitsSafe(stk, dec));
        setPendingRewards(formatUnitsSafe(pnd, dec));
        setWalletBalance(formatUnitsSafe(wBal, dec));

        setPoolAddress(addrToLoad);
        setLoadHelperMsg({ text: "Pool loaded successfully from Arc Testnet.", kind: "ok" });
      } else {
        // Simulated pool state for preview
        setPoolAddress(addrToLoad);
        setTokenAddress(DEFAULT_DEMO_TOKEN);
        setTokenSymbol("USDC");
        setLoadHelperMsg({
          text: "Pool loaded in interactive demo mode.",
          kind: "ok",
        });
      }
    } catch (err: any) {
      setLoadHelperMsg({
        text: `Error loading pool: ${err?.message || err}`,
        kind: "error",
      });
    } finally {
      setIsLoadingPool(false);
    }
  };

  // Staking Action
  const handleStake = async (amountStr: string) => {
    const num = parseFloat(amountStr);
    if (isNaN(num) || num <= 0) {
      setActionFeedback({ text: "Enter an amount greater than 0.", kind: "error" });
      return;
    }

    setBusyAction("stake");
    setActionFeedback({ text: "Authorizing stake…", kind: "info" });

    try {
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        const parsed = ethers.parseUnits(amountStr, tokenDecimals);

        // Check allowance
        const allowance = await tokenContract.allowance(userAddress, poolAddress);
        if (allowance < parsed) {
          setActionFeedback({ text: "Granting token allowance…", kind: "info" });
          const appTx = await tokenContract.approve(poolAddress, parsed);
          await appTx.wait();
        }

        setActionFeedback({ text: "Confirming stake on Arc Testnet…", kind: "info" });
        const stakeTx = await poolContract.stake(parsed);
        await stakeTx.wait();

        addActivityItem("Stake", `+${amountStr} ${tokenSymbol}`, stakeTx.hash);
        setActionFeedback({ text: `Successfully staked ${amountStr} ${tokenSymbol}.`, kind: "ok" });
        await loadPool(poolAddress);
      } else {
        // Simulated Stake
        await new Promise((r) => setTimeout(r, 600));
        const currentStaked = parseFloat(stakedBalance.replace(/,/g, "")) || 0;
        const currentWallet = parseFloat(walletBalance.replace(/,/g, "")) || 0;

        if (num > currentWallet && currentWallet > 0) {
          setActionFeedback({
            text: `Insufficient wallet balance (${walletBalance} ${tokenSymbol})`,
            kind: "error",
          });
          setBusyAction(null);
          return;
        }

        const newStaked = currentStaked + num;
        const newWallet = Math.max(0, currentWallet - num);
        setStakedBalance(newStaked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setWalletBalance(newWallet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        addActivityItem("Stake", `+${amountStr} ${tokenSymbol}`);
        setActionFeedback({
          text: `Staked ${amountStr} ${tokenSymbol} into Arc pool.`,
          kind: "ok",
        });
      }
    } catch (err: any) {
      setActionFeedback({
        text: err?.shortMessage || err?.message || "Staking failed.",
        kind: "error",
      });
    } finally {
      setBusyAction(null);
    }
  };

  // Withdraw Action
  const handleWithdraw = async (amountStr: string) => {
    const num = parseFloat(amountStr);
    if (isNaN(num) || num <= 0) {
      setActionFeedback({ text: "Enter an amount greater than 0.", kind: "error" });
      return;
    }

    setBusyAction("withdraw");
    setActionFeedback({ text: "Processing withdrawal…", kind: "info" });

    try {
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const parsed = ethers.parseUnits(amountStr, tokenDecimals);
        const tx = await poolContract.withdraw(parsed);
        await tx.wait();

        addActivityItem("Withdraw", `−${amountStr} ${tokenSymbol}`, tx.hash);
        setActionFeedback({ text: `Withdrawn ${amountStr} ${tokenSymbol}.`, kind: "ok" });
        await loadPool(poolAddress);
      } else {
        await new Promise((r) => setTimeout(r, 600));
        const currentStaked = parseFloat(stakedBalance.replace(/,/g, "")) || 0;
        const currentWallet = parseFloat(walletBalance.replace(/,/g, "")) || 0;

        if (num > currentStaked) {
          setActionFeedback({
            text: `Withdraw amount exceeds staked position (${stakedBalance} ${tokenSymbol})`,
            kind: "error",
          });
          setBusyAction(null);
          return;
        }

        const newStaked = currentStaked - num;
        const newWallet = currentWallet + num;
        setStakedBalance(newStaked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setWalletBalance(newWallet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

        addActivityItem("Withdraw", `−${amountStr} ${tokenSymbol}`);
        setActionFeedback({ text: `Withdrawn ${amountStr} ${tokenSymbol}.`, kind: "ok" });
      }
    } catch (err: any) {
      setActionFeedback({
        text: err?.shortMessage || err?.message || "Withdrawal failed.",
        kind: "error",
      });
    } finally {
      setBusyAction(null);
    }
  };

  // Claim Rewards Action
  const handleClaim = async () => {
    setBusyAction("claim");
    setActionFeedback({ text: "Claiming rewards…", kind: "info" });

    try {
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const tx = await poolContract.claimReward();
        await tx.wait();

        addActivityItem("Claim", `+${pendingRewards} ${tokenSymbol}`, tx.hash);
        setActionFeedback({ text: `Claimed ${pendingRewards} ${tokenSymbol} rewards.`, kind: "ok" });
        await loadPool(poolAddress);
      } else {
        await new Promise((r) => setTimeout(r, 600));
        const claimed = pendingRewards;
        const currentWallet = parseFloat(walletBalance.replace(/,/g, "")) || 0;
        const pendingNum = parseFloat(pendingRewards.replace(/,/g, "")) || 0;

        setWalletBalance((currentWallet + pendingNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setPendingRewards("0.00");

        addActivityItem("Claim", `+${claimed} ${tokenSymbol}`);
        setActionFeedback({ text: `Successfully claimed ${claimed} ${tokenSymbol}.`, kind: "ok" });
      }
    } catch (err: any) {
      setActionFeedback({
        text: err?.shortMessage || err?.message || "Claim failed.",
        kind: "error",
      });
    } finally {
      setBusyAction(null);
    }
  };

  // Exit Position Action (Withdraw All + Claim)
  const handleExit = async () => {
    setBusyAction("exit");
    setActionFeedback({ text: "Executing complete position exit…", kind: "info" });

    try {
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const tx = await poolContract.exit();
        await tx.wait();

        addActivityItem("Withdraw", `−${stakedBalance} ${tokenSymbol} (Exit)`, tx.hash);
        setActionFeedback({ text: "Position closed. Principal and rewards recovered.", kind: "ok" });
        await loadPool(poolAddress);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        const stkNum = parseFloat(stakedBalance.replace(/,/g, "")) || 0;
        const pndNum = parseFloat(pendingRewards.replace(/,/g, "")) || 0;
        const wltNum = parseFloat(walletBalance.replace(/,/g, "")) || 0;

        setWalletBalance((wltNum + stkNum + pndNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setStakedBalance("0.00");
        setPendingRewards("0.00");

        addActivityItem("Withdraw", `−${stkNum.toFixed(2)} ${tokenSymbol} (Exit)`);
        setActionFeedback({
          text: `Position fully exited. ${stkNum.toFixed(2)} principal + ${pndNum.toFixed(2)} rewards credited.`,
          kind: "ok",
        });
      }
    } catch (err: any) {
      setActionFeedback({
        text: err?.shortMessage || err?.message || "Exit failed.",
        kind: "error",
      });
    } finally {
      setBusyAction(null);
    }
  };

  // Owner / Admin Operations
  const handleFundReserve = async (amountStr: string) => {
    setBusyAction("fund");
    try {
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        const parsed = ethers.parseUnits(amountStr, tokenDecimals);
        const appTx = await tokenContract.approve(poolAddress, parsed);
        await appTx.wait();
        const tx = await poolContract.fundRewards(parsed);
        await tx.wait();
        addActivityItem("Fund reserve", `+${amountStr} ${tokenSymbol}`, tx.hash);
        setAdminHelperMsg({ text: `Reserve funded with ${amountStr} ${tokenSymbol}.`, kind: "ok" });
        await loadPool(poolAddress);
      } else {
        await new Promise((r) => setTimeout(r, 500));
        const resNum = parseFloat(rewardReserve.replace(/,/g, "")) || 0;
        const addNum = parseFloat(amountStr) || 0;
        setRewardReserve((resNum + addNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        addActivityItem("Fund reserve", `+${amountStr} ${tokenSymbol}`);
        setAdminHelperMsg({ text: `Reserve funded with ${amountStr} ${tokenSymbol}.`, kind: "ok" });
      }
    } catch (err: any) {
      setAdminHelperMsg({ text: err?.message || "Funding failed.", kind: "error" });
    } finally {
      setBusyAction(null);
    }
  };

  const handleReclaimReserve = async (amountStr: string) => {
    setBusyAction("reclaim");
    try {
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const parsed = ethers.parseUnits(amountStr, tokenDecimals);
        const tx = await poolContract.withdrawRewardReserve(parsed);
        await tx.wait();
        addActivityItem("Reclaim reserve", `−${amountStr} ${tokenSymbol}`, tx.hash);
        setAdminHelperMsg({ text: `Reclaimed ${amountStr} ${tokenSymbol}.`, kind: "ok" });
        await loadPool(poolAddress);
      } else {
        await new Promise((r) => setTimeout(r, 500));
        const resNum = parseFloat(rewardReserve.replace(/,/g, "")) || 0;
        const subNum = parseFloat(amountStr) || 0;
        setRewardReserve(Math.max(0, resNum - subNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        addActivityItem("Reclaim reserve", `−${amountStr} ${tokenSymbol}`);
        setAdminHelperMsg({ text: `Reclaimed ${amountStr} ${tokenSymbol} from reserve.`, kind: "ok" });
      }
    } catch (err: any) {
      setAdminHelperMsg({ text: err?.message || "Reclaim failed.", kind: "error" });
    } finally {
      setBusyAction(null);
    }
  };

  const handleSetApy = async (apyBpsStr: string) => {
    setBusyAction("setApy");
    try {
      const bps = parseInt(apyBpsStr, 10);
      if (isNaN(bps) || bps < 0) {
        setAdminHelperMsg({ text: "Enter valid basis points (e.g. 1000 = 10%)", kind: "error" });
        return;
      }
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const tx = await poolContract.setAPY(bps);
        await tx.wait();
        addActivityItem("APY change", `${(apyBps / 100).toFixed(2)}% → ${(bps / 100).toFixed(2)}%`, tx.hash);
        setApyBps(bps);
        setAdminHelperMsg({ text: `APY updated to ${(bps / 100).toFixed(2)}%.`, kind: "ok" });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        addActivityItem("APY change", `${(apyBps / 100).toFixed(2)}% → ${(bps / 100).toFixed(2)}%`);
        setApyBps(bps);
        setAdminHelperMsg({ text: `APY updated to ${(bps / 100).toFixed(2)}%.`, kind: "ok" });
      }
    } catch (err: any) {
      setAdminHelperMsg({ text: err?.message || "APY update failed.", kind: "error" });
    } finally {
      setBusyAction(null);
    }
  };

  const handleTogglePause = async (pauseIt: boolean) => {
    setBusyAction("pause");
    try {
      if (signer && !isDemoMode) {
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, signer);
        const tx = pauseIt ? await poolContract.pause() : await poolContract.unpause();
        await tx.wait();
        setIsPaused(pauseIt);
        addActivityItem(pauseIt ? "Pause" : "Unpause", pauseIt ? "Staking paused" : "Staking resumed", tx.hash);
        setAdminHelperMsg({ text: pauseIt ? "Pool staking paused." : "Pool staking active.", kind: "ok" });
      } else {
        await new Promise((r) => setTimeout(r, 400));
        setIsPaused(pauseIt);
        addActivityItem(pauseIt ? "Pause" : "Unpause", pauseIt ? "Staking paused" : "Staking resumed");
        setAdminHelperMsg({ text: pauseIt ? "Pool staking paused." : "Pool staking active.", kind: "ok" });
      }
    } catch (err: any) {
      setAdminHelperMsg({ text: err?.message || "Pause command failed.", kind: "error" });
    } finally {
      setBusyAction(null);
    }
  };

  const addActivityItem = (
    type: ActivityItem["type"],
    amountText: string,
    txHash?: string
  ) => {
    const newItem: ActivityItem = {
      id: "tx-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      type,
      amountText,
      address: userAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      txHash:
        txHash ||
        "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join(""),
      timestamp: Date.now(),
    };
    setActivityItems((prev) => [newItem, ...prev]);
  };

  const simulateLiveEvent = () => {
    const randomAmount = (Math.random() * 2500 + 50).toFixed(2);
    addActivityItem("Stake", `+${randomAmount} ${tokenSymbol}`);
  };

  return (
    <div
      className={`min-h-screen relative font-sans transition-colors duration-500 ${
        theme === "parchment"
          ? "text-[#1C1F1B]"
          : theme === "obsidian"
          ? "text-[#E3EDE7]"
          : "text-[#E5F3EB]"
      }`}
    >
      {/* Exquisite Arc Architectural Blueprint Background Layer */}
      <ArcBackground theme={theme} showArcs={showArcs} />

      {/* Main Top App Bar */}
      <NetworkBar
        theme={theme}
        onThemeChange={setTheme}
        userAddress={userAddress}
        chainId={chainId}
        isConnecting={isConnecting}
        onConnect={connectWallet}
        onAddNetwork={addArcNetwork}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
      />

      {/* Primary Financial Ledger Sheet with Corner Registration Marks */}
      <main className="relative z-10 max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <div
          id="sheet"
          className={`relative rounded-xs border shadow-xl transition-all duration-300 ${
            theme === "parchment"
              ? "bg-[#EDE8D9] border-[#A79F87] shadow-[0_12px_36px_rgba(31,77,61,0.08)]"
              : theme === "obsidian"
              ? "bg-[#0E1411] border-[#223B2F] shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
              : "bg-[#091C14] border-[#1E4232] shadow-[0_16px_48px_rgba(4,20,13,0.7)]"
          }`}
        >
          {/* Corner Registration Marks (Archival Financial Instrument aesthetic) */}
          <span
            className="absolute -top-[1px] -left-[1px] w-3.5 h-3.5 border-t border-l pointer-events-none opacity-60 transition-colors"
            style={{ borderColor: theme === "parchment" ? "#A8823C" : "#D9B463" }}
          />
          <span
            className="absolute -top-[1px] -right-[1px] w-3.5 h-3.5 border-t border-r pointer-events-none opacity-60 transition-colors"
            style={{ borderColor: theme === "parchment" ? "#A8823C" : "#D9B463" }}
          />
          <span
            className="absolute -bottom-[1px] -left-[1px] w-3.5 h-3.5 border-b border-l pointer-events-none opacity-60 transition-colors"
            style={{ borderColor: theme === "parchment" ? "#A8823C" : "#D9B463" }}
          />
          <span
            className="absolute -bottom-[1px] -right-[1px] w-3.5 h-3.5 border-b border-r pointer-events-none opacity-60 transition-colors"
            style={{ borderColor: theme === "parchment" ? "#A8823C" : "#D9B463" }}
          />

          {/* Section 1: Network & Contract Terminal */}
          <PoolSelector
            theme={theme}
            poolAddress={poolAddress}
            tokenAddress={tokenAddress}
            tokenSymbol={tokenSymbol}
            isConnecting={isConnecting}
            userAddress={userAddress}
            onConnectWallet={connectWallet}
            onAddArcNetwork={addArcNetwork}
            onLoadPool={loadPool}
            isLoadingPool={isLoadingPool}
            loadHelperMsg={loadHelperMsg}
            onUsePreset={(addr) => loadPool(addr)}
          />

          {/* Section 2: Position Certificate Hero */}
          <CertificateHero
            theme={theme}
            stakedAmount={stakedBalance}
            tokenSymbol={tokenSymbol}
            pendingAmount={pendingRewards}
            apyValue={`${(apyBps / 100).toFixed(2)}%`}
            walletBalance={walletBalance}
            poolTotalStaked={totalStaked}
            poolReserve={rewardReserve}
            poolAddress={poolAddress}
            isPaused={isPaused}
          />

          {/* Section 3: Position Operations (Stake, Withdraw, Claim, Exit) */}
          <ActionDeck
            theme={theme}
            tokenSymbol={tokenSymbol}
            isPaused={isPaused}
            walletBalance={walletBalance}
            stakedBalance={stakedBalance}
            pendingAmount={pendingRewards}
            onStake={handleStake}
            onWithdraw={handleWithdraw}
            onClaim={handleClaim}
            onExit={handleExit}
            busyAction={busyAction}
            feedbackMessage={actionFeedback}
          />

          {/* Section 4: Pool Administration */}
          <AdminPanel
            theme={theme}
            tokenSymbol={tokenSymbol}
            isOwner={isOwner}
            isPaused={isPaused}
            onFundReserve={handleFundReserve}
            onReclaimReserve={handleReclaimReserve}
            onSetApy={handleSetApy}
            onTogglePause={handleTogglePause}
            busyAction={busyAction}
            adminHelperMsg={adminHelperMsg}
            onToggleOwnerPreview={() => setIsOwnerPreview(!isOwnerPreview)}
            isOwnerPreviewActive={isOwnerPreview}
          />

          {/* Section 5: Activity Ledger */}
          <ActivityLedger
            theme={theme}
            items={activityItems}
            userAddress={userAddress}
            onSimulateEvent={simulateLiveEvent}
          />
        </div>

        {/* Footer with Technical Specs & Faucet Links */}
        <FooterBar
          theme={theme}
          showArcs={showArcs}
          onToggleArcs={() => setShowArcs(!showArcs)}
        />
      </main>
    </div>
  );
}
