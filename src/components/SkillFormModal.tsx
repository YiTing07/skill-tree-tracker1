import React, { useState } from "react";
import { SkillNode, DifficultyLevel, SubTask } from "../types";
import { X, Plus, Trash2, Sparkles, Gift, Code, Layers, Rocket, Languages, Activity, BookOpen, HeartPulse } from "lucide-react";

interface SkillFormModalProps {
  timeframeId: string;
  allSkills: SkillNode[];
  initialSkill?: SkillNode | null;
  onClose: () => void;
  onSave: (skillData: Partial<SkillNode>) => void;
}

export const SkillFormModal: React.FC<SkillFormModalProps> = ({
  timeframeId,
  allSkills,
  initialSkill,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState<string>(initialSkill?.title || "");
  const [category, setCategory] = useState<string>(initialSkill?.category || "程式開發");
  const [description, setDescription] = useState<string>(initialSkill?.description || "");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialSkill?.difficulty || "Medium");
  const [estimatedDays, setEstimatedDays] = useState<number>(initialSkill?.estimatedDays || 7);
  const [prerequisites, setPrerequisites] = useState<string[]>(initialSkill?.prerequisites || []);
  const [reward, setReward] = useState<string>(initialSkill?.reward || "");
  const [icon, setIcon] = useState<string>(initialSkill?.icon || "Code");

  // Action steps / sub-tasks
  const [actionSteps, setActionSteps] = useState<SubTask[]>(
    initialSkill?.actionSteps || [
      { id: "step-1", text: "理解核心理論與架構", done: false },
      { id: "step-2", text: "完成實體練習專案", done: false },
    ]
  );
  const [newStepText, setNewStepText] = useState<string>("");

  // Position on canvas
  const [x, setX] = useState<number>(initialSkill?.x || Math.floor(Math.random() * 400) + 200);
  const [y, setY] = useState<number>(initialSkill?.y || Math.floor(Math.random() * 300) + 150);

  const categories = ["程式開發", "AI 應用", "外語能力", "體能健身", "閱讀學習", "生活習慣", "財富管理", "藝術創作", "其他"];

  const icons = [
    { name: "Code", label: "程式", icon: <Code className="w-4 h-4" /> },
    { name: "Layers", label: "架構", icon: <Layers className="w-4 h-4" /> },
    { name: "Sparkles", label: "靈感", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Rocket", label: "實戰", icon: <Rocket className="w-4 h-4" /> },
    { name: "Languages", label: "語言", icon: <Languages className="w-4 h-4" /> },
    { name: "Activity", label: "運動", icon: <Activity className="w-4 h-4" /> },
    { name: "BookOpen", label: "閱讀", icon: <BookOpen className="w-4 h-4" /> },
    { name: "HeartPulse", label: "健康", icon: <HeartPulse className="w-4 h-4" /> },
  ];

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    setActionSteps([...actionSteps, { id: `step-${Date.now()}`, text: newStepText.trim(), done: false }]);
    setNewStepText("");
  };

  const handleRemoveStep = (stepId: string) => {
    setActionSteps(actionSteps.filter((s) => s.id !== stepId));
  };

  const togglePrereq = (skillId: string) => {
    if (prerequisites.includes(skillId)) {
      setPrerequisites(prerequisites.filter((id) => id !== skillId));
    } else {
      setPrerequisites([...prerequisites, skillId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialSkill?.id || `skill-${Date.now()}`,
      timeframeId,
      title: title.trim(),
      category,
      description: description.trim(),
      difficulty,
      estimatedDays,
      prerequisites,
      actionSteps,
      reward: reward.trim(),
      rewardStatus: initialSkill?.rewardStatus || "locked",
      status: initialSkill?.status || (prerequisites.length > 0 ? "locked" : "available"),
      x,
      y,
      icon,
    });

    onClose();
  };

  // Available candidate prerequisites (exclude current skill)
  const candidatePrereqs = allSkills.filter((s) => s.id !== initialSkill?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-extrabold text-white">
              {initialSkill ? "編輯技能任務" : "新增技能任務"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300">技能任務名稱 *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：Master TypeScript 泛型高階實戰"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">簡短描述與學習重點</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="說明這個技能的具體目標、實戰價值或學習資源..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Difficulty & Estimated Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">難度評級</label>
              <div className="grid grid-cols-4 gap-2">
                {(["Easy", "Medium", "Hard", "Master"] as DifficultyLevel[]).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                      difficulty === d
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">預估天數 (Days)</label>
              <input
                type="number"
                min={1}
                max={365}
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">樹上標籤圖示</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setIcon(item.name)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    icon === item.name
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pre-set Reward Input */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-400" />
              給自己的預先完成獎勵 (Pre-set Reward)
            </label>
            <input
              type="text"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="例如：吃頓高級鐵板燒 🍣、買精裝書籍 📚、放假去泡溫泉 ♨️"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Prerequisites Checklist */}
          {candidatePrereqs.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                前置條件 (必須完成哪些技能後才可解鎖本項目)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
                {candidatePrereqs.map((pSkill) => (
                  <label
                    key={pSkill.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={prerequisites.includes(pSkill.id)}
                      onChange={() => togglePrereq(pSkill.id)}
                      className="accent-emerald-500"
                    />
                    <span className="font-medium text-slate-200 truncate">{pSkill.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Steps Sub-tasks */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">分解執行步驟 (Sub-tasks)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddStep())}
                placeholder="輸入步驟名稱並按新增..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                新增步驟
              </button>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {actionSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="text-slate-300">{step.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
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
              儲存技能任務
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
