import React from "react";
import { Timeframe } from "../types";
import {
  TreeDeciduous,
  Gift,
  Trophy,
  Sparkles,
  Plus,
  Zap,
  Calendar,
  Flame,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  activeTab: "tree" | "vault" | "honor" | "ai";
  setActiveTab: (tab: "tree" | "vault" | "honor" | "ai") => void;
  timeframes: Timeframe[];
  selectedTimeframeId: string;
  setSelectedTimeframeId: (id: string) => void;
  onOpenNewTimeframe: () => void;
  userExp: number;
  userLevelInfo: { level: number; title: string; minExp: number; maxExp: number };
  unlockedRewardsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  timeframes,
  selectedTimeframeId,
  setSelectedTimeframeId,
  onOpenNewTimeframe,
  userExp,
  userLevelInfo,
  unlockedRewardsCount,
}) => {
  const selectedTimeframe = timeframes.find((t) => t.id === selectedTimeframeId) || timeframes[0];

  const expProgress =
    Math.min(
      100,
      Math.max(
        0,
        ((userExp - userLevelInfo.minExp) / (userLevelInfo.maxExp - userLevelInfo.minExp)) * 100
      )
    );

  return (
    <header className="sticky top-2 z-40 max-w-7xl mx-auto w-full">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800/90 rounded-2xl text-white shadow-2xl px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("tree")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TreeDeciduous className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                  技能樹 Growth Tree
                </h1>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">紀錄技能、點亮成就、解鎖自訂獎勵</p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
            <Calendar className="w-4 h-4 text-emerald-400 ml-2" />
            <select
              value={selectedTimeframeId}
              onChange={(e) => setSelectedTimeframeId(e.target.value)}
              className="bg-transparent text-sm text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
            >
              {timeframes.map((tf) => (
                <option key={tf.id} value={tf.id} className="bg-slate-900 text-slate-200">
                  {tf.title} ({tf.startDate.slice(0, 7)} ~ {tf.endDate.slice(0, 7)})
                </option>
              ))}
            </select>
            <button
              onClick={onOpenNewTimeframe}
              title="新增時間區間"
              className="p-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("tree")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "tree"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <TreeDeciduous className="w-4 h-4" />
              <span className="hidden sm:inline">技能樹</span>
            </button>

            <button
              onClick={() => setActiveTab("vault")}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "vault"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">獎勵寶庫</span>
              {unlockedRewardsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 animate-bounce">
                  {unlockedRewardsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("honor")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "honor"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-inner"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">一年後榮耀榜</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "ai"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-inner"
                  : "bg-slate-800/80 text-teal-400 hover:bg-slate-800 hover:text-teal-300 border border-teal-500/20"
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-300 animate-spin" style={{ animationDuration: "4s" }} />
              <span className="hidden md:inline">AI 技能導師</span>
            </button>
          </nav>

          {/* User EXP & Level Widget */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-slate-400 leading-tight">
                  Lv.{userLevelInfo.level} {userLevelInfo.title}
                </div>
                <div className="text-xs font-bold text-amber-300 leading-tight">
                  {userExp} EXP
                </div>
              </div>
            </div>
            {/* Level Progress Bar */}
            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Timeframe Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-800/60 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <select
              value={selectedTimeframeId}
              onChange={(e) => setSelectedTimeframeId(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 rounded px-2 py-1 font-medium focus:outline-none"
            >
              {timeframes.map((tf) => (
                <option key={tf.id} value={tf.id}>
                  {tf.title}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onOpenNewTimeframe}
            className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新區間</span>
          </button>
        </div>
      </div>
    </header>
  );
};
