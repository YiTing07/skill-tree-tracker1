import React, { useState } from "react";
import { SkillNode, Timeframe } from "../types";
import {
  Trophy,
  Award,
  Calendar,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Download,
  CheckCircle2,
  Gift,
  Flame,
  Star,
  Quote,
  Copy,
  Printer,
} from "lucide-react";
import { triggerGrandConfetti } from "../utils/audioAndParticles";

interface HonorBoardProps {
  skills: SkillNode[];
  timeframes: Timeframe[];
  userExp: number;
  userLevelInfo: { level: number; title: string };
}

export const HonorBoard: React.FC<HonorBoardProps> = ({
  skills,
  timeframes,
  userExp,
  userLevelInfo,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [annualMotto, setAnnualMotto] = useState<string>("「不斷探索邊界，點亮每一顆屬於自己的技能奇蹟。」");
  const [isPlayingTimeMachine, setIsPlayingTimeMachine] = useState<boolean>(false);
  const [playbackMonth, setPlaybackMonth] = useState<number>(12); // 1 to 12
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Filter completed skills by year
  const completedSkills = skills.filter((s) => {
    if (s.status !== "completed") return false;
    if (!s.completedAt) return true; // Default to active year
    const itemYear = new Date(s.completedAt).getFullYear();
    return itemYear === selectedYear;
  });

  // Sort chronologically
  const sortedSkills = [...completedSkills].sort((a, b) => {
    const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return dateA - dateB;
  });

  // Filter skills for time machine playback
  const playbackSkills = sortedSkills.filter((s) => {
    if (!s.completedAt) return true;
    const month = new Date(s.completedAt).getMonth() + 1;
    return month <= playbackMonth;
  });

  // Annual statistics
  const totalCompleted = completedSkills.length;
  const totalRewardsClaimed = completedSkills.filter((s) => s.rewardStatus === "claimed").length;
  const categoriesCount = Array.from(new Set(completedSkills.map((s) => s.category)));

  // Time machine controls
  const handleTogglePlay = () => {
    if (isPlayingTimeMachine) {
      setIsPlayingTimeMachine(false);
      return;
    }

    setIsPlayingTimeMachine(true);
    setPlaybackMonth(1);

    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      setPlaybackMonth(current);
      if (current >= 12) {
        clearInterval(interval);
        setIsPlayingTimeMachine(false);
        triggerGrandConfetti();
      }
    }, 800);
  };

  const handleCopySummary = () => {
    const summary = `🏆【${selectedYear} 年度技能榮耀榜】\n` +
      `✨ 全年點亮技能數：${totalCompleted} 項\n` +
      `🎁 享受自訂獎勵：${totalRewardsClaimed} 個\n` +
      `🌟 技能位階：Lv.${userLevelInfo.level} ${userLevelInfo.title}\n` +
      `💬 年度感言：${annualMotto}\n\n` +
      `最引以為傲的點亮技能：\n` +
      completedSkills.slice(0, 3).map((s) => `• ${s.title} (${s.category})`).join("\n");

    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Year Switcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                1 Year Retrospective
              </span>
              <span className="text-xs text-slate-400 font-medium">一年後的榮耀回顧</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200">
              {selectedYear} 年度技能榮耀榜
            </h2>
            <p className="text-sm text-slate-300">
              時間是最好的見證。回顧這一年你在樹上點亮的所有技能、獲得的突破與享受的專屬獎勵。
            </p>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
            {[2025, 2026, 2027].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedYear === yr
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-slate-950 shadow-lg shadow-purple-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {yr} 年
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Metrics & Level Badge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalCompleted}</div>
            <div className="text-xs text-slate-400 font-medium">全年點亮技能總數</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalRewardsClaimed}</div>
            <div className="text-xs text-slate-400 font-medium">已兌換解鎖獎勵</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">Lv.{userLevelInfo.level}</div>
            <div className="text-xs text-purple-300 font-bold">{userLevelInfo.title}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{categoriesCount.length} 跨界</div>
            <div className="text-xs text-slate-400 font-medium">涵蓋技能範疇類別</div>
          </div>
        </div>
      </div>

      {/* Time Machine Interactive Playback (時間膠囊重播) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">時間膠囊：{selectedYear} 年度點亮軌跡重播</h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              進度至 {playbackMonth} 月 ({playbackSkills.length} 個技能)
            </span>

            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md shadow-amber-400/20"
            >
              {isPlayingTimeMachine ? (
                <>
                  <Pause className="w-4 h-4" /> 暫停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> 播放成長動畫
                </>
              )}
            </button>
          </div>
        </div>

        {/* Month Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={12}
            value={playbackMonth}
            onChange={(e) => setPlaybackMonth(Number(e.target.value))}
            className="w-full accent-amber-400 bg-slate-950 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>1月</span>
            <span>3月</span>
            <span>6月 (年中)</span>
            <span>9月</span>
            <span>12月 (年終)</span>
          </div>
        </div>
      </div>

      {/* Printable / Shareable Honor Certificate Card (榮耀成就卡) */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/40 text-white relative shadow-2xl space-y-6 overflow-hidden">
        {/* Certificate Watermark Corner Decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-bl-full pointer-events-none border-b border-l border-amber-500/20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/5 rounded-tr-full pointer-events-none border-t border-r border-purple-500/20" />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-bold shadow-xl shadow-amber-500/20 mb-2">
            <Award className="w-10 h-10" />
          </div>

          <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Annual Skill Mastery Certificate
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {selectedYear} 年度個人技能榮耀證書
          </h3>

          <div className="max-w-xl mx-auto pt-2">
            <div className="flex items-center gap-2 justify-center text-slate-400 text-xs italic mb-2">
              <Quote className="w-4 h-4 text-amber-400" />
              <span>年度格言／靈魂感言：</span>
            </div>
            <input
              type="text"
              value={annualMotto}
              onChange={(e) => setAnnualMotto(e.target.value)}
              className="w-full text-center bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-sm font-semibold text-amber-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Certificate Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 relative z-10">
          {playbackSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 flex flex-col justify-between space-y-2 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <h4 className="text-sm font-bold text-white">{skill.title}</h4>
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {skill.category}
                </span>
              </div>

              {skill.reflection && (
                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  「{skill.reflection}」
                </p>
              )}

              {skill.reward && (
                <div className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                  <Gift className="w-3.5 h-3.5" />
                  <span>已享受獎勵：{skill.reward}</span>
                </div>
              )}
            </div>
          ))}

          {playbackSkills.length === 0 && (
            <div className="col-span-2 text-center py-8 text-slate-500">
              尚無完成點亮的技能，持續在技能樹上耕耘吧！
            </div>
          )}
        </div>

        {/* Certificate Footer Share Buttons */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="text-xs text-slate-400">
            驗證於 {selectedYear} 年末 • 頒發給獨一無二的自我成長者 🌟
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedText ? "已複製成就卡摘要！" : "複製成就摘要"}</span>
            </button>

            <button
              onClick={() => triggerGrandConfetti()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 shadow-lg shadow-purple-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>發射慶祝煙火 🎉</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
