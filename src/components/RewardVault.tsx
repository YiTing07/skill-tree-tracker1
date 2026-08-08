import React, { useState } from "react";
import { SkillNode, Timeframe } from "../types";
import { Gift, Lock, CheckCircle2, Sparkles, PartyPopper, Clock, Trophy } from "lucide-react";

interface RewardVaultProps {
  skills: SkillNode[];
  timeframes: Timeframe[];
  onClaimReward: (skillId: string) => void;
  onClaimTimeframeReward: (timeframeId: string) => void;
}

export const RewardVault: React.FC<RewardVaultProps> = ({
  skills,
  timeframes,
  onClaimReward,
  onClaimTimeframeReward,
}) => {
  const [filter, setFilter] = useState<"all" | "unlocked" | "claimed" | "locked">("all");

  // Gather skill rewards
  const skillRewards = skills
    .filter((s) => s.reward && s.reward.trim().length > 0)
    .map((s) => ({
      id: `skill-reward-${s.id}`,
      skillId: s.id,
      title: s.reward,
      sourceTitle: `技能：${s.title}`,
      rewardStatus: s.rewardStatus,
      claimedAt: s.rewardClaimedAt,
      type: "skill",
    }));

  // Gather timeframe rewards
  const timeframeRewards = timeframes
    .filter((t) => t.targetReward && t.targetReward.trim().length > 0)
    .map((t) => {
      const tfSkills = skills.filter((s) => s.timeframeId === t.id);
      const isComplete = tfSkills.length > 0 && tfSkills.every((s) => s.status === "completed");
      const status = t.rewardClaimed ? "claimed" : isComplete ? "unlocked" : "locked";

      return {
        id: `tf-reward-${t.id}`,
        timeframeId: t.id,
        title: t.targetReward,
        sourceTitle: `區間大獎：${t.title}`,
        rewardStatus: status,
        claimedAt: t.rewardClaimed ? new Date().toISOString() : undefined,
        type: "timeframe",
      };
    });

  const allRewards = [...skillRewards, ...timeframeRewards];

  const unlockedCount = allRewards.filter((r) => r.rewardStatus === "unlocked").length;
  const claimedCount = allRewards.filter((r) => r.rewardStatus === "claimed").length;
  const lockedCount = allRewards.filter((r) => r.rewardStatus === "locked").length;

  const filtered = allRewards.filter((r) => {
    if (filter === "unlocked") return r.rewardStatus === "unlocked";
    if (filter === "claimed") return r.rewardStatus === "claimed";
    if (filter === "locked") return r.rewardStatus === "locked";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/30 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-amber-400 animate-bounce" />
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300">
                預先獎勵寶庫 (Reward Vault)
              </h2>
            </div>
            <p className="text-sm text-slate-300">
              犒賞是持續成長的最強動力。為每個技能節點預先設定犒賞，點亮技能時即刻解鎖享受！
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
            <div className="p-2">
              <div className="text-xl font-extrabold text-amber-400">{unlockedCount}</div>
              <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                待享用 (Unlocked)
              </div>
            </div>
            <div className="p-2 border-x border-slate-800">
              <div className="text-xl font-extrabold text-emerald-400">{claimedCount}</div>
              <div className="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider">
                已兌換 (Claimed)
              </div>
            </div>
            <div className="p-2">
              <div className="text-xl font-extrabold text-slate-500">{lockedCount}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                未解鎖 (Locked)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === "all"
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          全部獎勵 ({allRewards.length})
        </button>
        <button
          onClick={() => setFilter("unlocked")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filter === "unlocked"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>可兌換 ({unlockedCount})</span>
        </button>
        <button
          onClick={() => setFilter("claimed")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filter === "claimed"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>已享用 ({claimedCount})</span>
        </button>
        <button
          onClick={() => setFilter("locked")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filter === "locked"
              ? "bg-slate-800 text-slate-400 border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>修練中 ({lockedCount})</span>
        </button>
      </div>

      {/* Reward Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const isUnlocked = item.rewardStatus === "unlocked";
          const isClaimed = item.rewardStatus === "claimed";

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? "bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30"
                  : isClaimed
                  ? "bg-slate-900/60 border-slate-800 text-slate-300"
                  : "bg-slate-950/80 border-slate-800/80 text-slate-500"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                    {item.sourceTitle}
                  </span>
                  <span
                    className={`text-xs font-bold flex items-center gap-1 ${
                      isUnlocked
                        ? "text-amber-400"
                        : isClaimed
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> 已解鎖!
                      </>
                    ) : isClaimed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> 已享用
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> 前置任務未完成
                      </>
                    )}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white flex items-start gap-2 pt-1">
                  <span className="text-xl">🎁</span>
                  <span>{item.title}</span>
                </h4>
              </div>

              {/* Card Footer Action */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {isClaimed
                    ? `兌換於 ${item.claimedAt ? new Date(item.claimedAt).toLocaleDateString() : "完成日"}`
                    : isUnlocked
                    ? "可以立刻去享有這份禮物囉！"
                    : "完成相應技能後自動解鎖"}
                </div>

                {isUnlocked && (
                  <button
                    onClick={() => {
                      if (item.type === "skill" && item.skillId) {
                        onClaimReward(item.skillId);
                      } else if (item.type === "timeframe" && item.timeframeId) {
                        onClaimTimeframeReward(item.timeframeId);
                      }
                    }}
                    className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 hover:opacity-90 shadow-lg shadow-amber-400/20 transition-all animate-bounce"
                  >
                    點擊享用獎勵! 🎉
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Gift className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-sm">尚無符合條件的獎勵，在技能任務中設定預先獎勵吧！</p>
        </div>
      )}
    </div>
  );
};
