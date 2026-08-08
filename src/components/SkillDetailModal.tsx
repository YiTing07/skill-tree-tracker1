import React, { useState } from "react";
import { SkillNode, SubTask } from "../types";
import {
  X,
  CheckCircle2,
  Lock,
  Gift,
  Clock,
  Sparkles,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  Award,
  Calendar,
  AlertCircle,
  Zap,
} from "lucide-react";

interface SkillDetailModalProps {
  skill: SkillNode;
  allSkills: SkillNode[];
  onClose: () => void;
  onLightUpSkill: (skillId: string, reflection: string) => void;
  onRevertSkill: (skillId: string) => void;
  onToggleSubTask: (skillId: string, subTaskId: string) => void;
  onClaimReward: (skillId: string) => void;
  onEditSkill: (skill: SkillNode) => void;
  onDeleteSkill: (skillId: string) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  allSkills,
  onClose,
  onLightUpSkill,
  onRevertSkill,
  onToggleSubTask,
  onClaimReward,
  onEditSkill,
  onDeleteSkill,
}) => {
  const [reflectionInput, setReflectionInput] = useState<string>(skill.reflection || "");
  const [isEditingReflection, setIsEditingReflection] = useState<boolean>(false);

  const isCompleted = skill.status === "completed";
  const isLocked = skill.status === "locked";

  // Prerequisites information
  const prereqSkills = allSkills.filter((s) => skill.prerequisites.includes(s.id));
  const uncompletedPrereqs = prereqSkills.filter((s) => s.status !== "completed");

  // Action steps progress
  const doneSubTasks = skill.actionSteps.filter((s) => s.done).length;
  const totalSubTasks = skill.actionSteps.length;
  const subTaskPercent = totalSubTasks > 0 ? Math.round((doneSubTasks / totalSubTasks) * 100) : 100;

  const handleLightUp = () => {
    onLightUpSkill(skill.id, reflectionInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div
          className={`p-6 border-b border-slate-800 relative overflow-hidden ${
            isCompleted
              ? "bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-900/40"
              : isLocked
              ? "bg-slate-950/90"
              : "bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-900/40"
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-2 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isCompleted
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : isLocked
                    ? "bg-slate-800 text-slate-400 border-slate-700"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {isCompleted ? "✨ 技能已點亮" : isLocked ? "🔒 前置鎖定中" : "⚡ 挑戰進行中"}
              </span>

              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                {skill.category}
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                  skill.difficulty === "Easy"
                    ? "text-emerald-400 bg-emerald-500/10"
                    : skill.difficulty === "Medium"
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-purple-400 bg-purple-500/10"
                }`}
              >
                {skill.difficulty} 難度
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                預估 {skill.estimatedDays} 天
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-white tracking-tight">{skill.title}</h3>
            <p className="text-sm text-slate-300">{skill.description}</p>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Prerequisites Warning if Locked */}
          {isLocked && uncompletedPrereqs.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">需先完成以下前置技能才能點亮本項目：</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                  {uncompletedPrereqs.map((p) => (
                    <li key={p.id}>{p.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Steps Checklist */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                技能分解步驟 / 子任務 ({doneSubTasks}/{totalSubTasks})
              </span>
              <span className="text-emerald-400">{subTaskPercent}% 完成</span>
            </div>

            {/* Sub-task progress bar */}
            {totalSubTasks > 0 && (
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${subTaskPercent}%` }}
                />
              </div>
            )}

            <div className="space-y-2">
              {skill.actionSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => onToggleSubTask(skill.id, step.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    step.done
                      ? "bg-emerald-500/10 border-emerald-500/30 text-slate-200"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  {step.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${step.done ? "line-through text-slate-400" : ""}`}>
                    {step.text}
                  </span>
                </div>
              ))}
              {totalSubTasks === 0 && (
                <p className="text-xs text-slate-500 italic">尚無特定步驟，直接專注於本技能即可！</p>
              )}
            </div>
          </div>

          {/* Attached Pre-set Reward Box */}
          {skill.reward && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    自訂完成獎勵
                  </span>
                </div>
                {skill.rewardStatus === "unlocked" && (
                  <button
                    onClick={() => onClaimReward(skill.id)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 animate-bounce"
                  >
                    兌換獎勵! 🎁
                  </button>
                )}
                {skill.rewardStatus === "claimed" && (
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    已享受獎勵 🎉
                  </span>
                )}
                {skill.rewardStatus === "locked" && (
                  <span className="text-xs text-slate-500 font-medium">點亮技能後解鎖</span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-200 pl-7">{skill.reward}</p>
            </div>
          )}

          {/* User Reflection Notes (Upon Completion) */}
          {isCompleted && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  點亮心得與心得紀錄 (Reflection)
                </span>
                <span className="text-[10px] text-slate-500">
                  完成於：{skill.completedAt ? new Date(skill.completedAt).toLocaleDateString() : "近期"}
                </span>
              </div>
              <textarea
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="寫下完成這個技能的心得或學習筆記，這將同步展示於年度榮耀榜！"
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {/* Edit / Delete actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditSkill(skill)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
              title="編輯技能"
            >
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline">編輯</span>
            </button>
            <button
              onClick={() => onDeleteSkill(skill.id)}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs flex items-center gap-1 transition-colors"
              title="刪除技能"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">刪除</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <button
                onClick={() => onRevertSkill(skill.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                重置為進行中
              </button>
            ) : (
              <button
                disabled={isLocked}
                onClick={handleLightUp}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  isLocked
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-slate-950 hover:opacity-90 shadow-lg shadow-emerald-500/30 animate-pulse"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>點亮技能✨ (Light Up!)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
