import React, { useState } from "react";
import { Timeframe, TreeTheme } from "../types";
import { X, Calendar, Gift, Palette } from "lucide-react";

interface TimeframeModalProps {
  onClose: () => void;
  onSave: (timeframe: Timeframe) => void;
}

export const TimeframeModal: React.FC<TimeframeModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("2026-07-01");
  const [endDate, setEndDate] = useState<string>("2026-12-31");
  const [description, setDescription] = useState<string>("");
  const [intervalType, setIntervalType] = useState<Timeframe["intervalType"]>("halfYear");
  const [targetReward, setTargetReward] = useState<string>("");
  const [theme, setTheme] = useState<TreeTheme>("worldTree");
  const [year, setYear] = useState<number>(2026);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: `tf-${Date.now()}`,
      title: title.trim(),
      startDate,
      endDate,
      description: description.trim(),
      intervalType,
      targetReward: targetReward.trim(),
      rewardClaimed: false,
      theme,
      year: Number(year) || 2026,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-extrabold text-white">建立新時間區間目標</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">時間區間名稱 *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：2026 下半年全能躍升計劃"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">開始日期</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">結束日期</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">區間類型</label>
              <select
                value={intervalType}
                onChange={(e) => setIntervalType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value="quarterly">季度目標 (Quarterly)</option>
                <option value="halfYear">半年計畫 (Half-Year)</option>
                <option value="annual">全年度目標 (Annual)</option>
                <option value="custom">自訂特訓 (Custom)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">歸屬年份</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">目標說明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="說明本區間的核心使命與想獲得的成長..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-400" />
              整棵樹 100% 點亮時的【終極大獎勵】
            </label>
            <input
              type="text"
              value={targetReward}
              onChange={(e) => setTargetReward(e.target.value)}
              placeholder="例如：日本東京 5 天 4 夜自由行 & 頂級溫泉旅館體驗 ♨️"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              技能樹視覺主題
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as TreeTheme)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none"
            >
              <option value="worldTree">✨ 金色世界樹 (Golden World Tree)</option>
              <option value="cyberTree">⚡ 賽博霓虹 (Cyber Neon)</option>
              <option value="sakuraTree">🌸 櫻花生機 (Sakura Bloom)</option>
              <option value="emeraldTree">🌿 翡翠神木 (Emerald Sanctuary)</option>
              <option value="cosmicTree">🌌 星空宇宙 (Cosmic Star)</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
            >
              建立時間區間
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
