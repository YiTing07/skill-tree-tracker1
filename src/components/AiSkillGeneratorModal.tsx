import React, { useState } from "react";
import { SkillNode, Timeframe } from "../types";
import { Sparkles, X, ArrowRight, CheckCircle2, AlertCircle, Loader2, Gift, Code } from "lucide-react";

interface AiSkillGeneratorModalProps {
  timeframe: Timeframe;
  onClose: () => void;
  onImportGeneratedSkills: (skills: SkillNode[], timeframeReward?: string) => void;
}

export const AiSkillGeneratorModal: React.FC<AiSkillGeneratorModalProps> = ({
  timeframe,
  onClose,
  onImportGeneratedSkills,
}) => {
  const [goalInput, setGoalInput] = useState<string>("");
  const [category, setCategory] = useState<string>("程式開發");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const presetExamples = [
    "掌握 React 19 與 AI Agent 全棧開發",
    "考取日檢 N2 與流利商務口語",
    "一年內體能大突破與半馬通關",
    "從零打造能產生被動收入的 SaaS 產品",
  ];

  const handleGenerate = async () => {
    if (!goalInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setGeneratedResult(null);

    try {
      const res = await fetch("/api/ai-deconstruct-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goalInput.trim(),
          timeframe: timeframe.title,
          category,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "產生失敗，請確認伺服器設定");
      }

      setGeneratedResult(json.data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "發生未知錯誤，請稍後重試");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!generatedResult || !generatedResult.nodes) return;

    const newSkills: SkillNode[] = generatedResult.nodes.map((node: any, idx: number) => ({
      id: `ai-skill-${Date.now()}-${idx}`,
      timeframeId: timeframe.id,
      title: node.title,
      category: node.category || category,
      description: node.description || "",
      difficulty: node.difficulty || "Medium",
      estimatedDays: node.estimatedDays || 14,
      prerequisites: [], // map after creation
      status: idx === 0 ? "available" : "locked",
      actionSteps: [
        { id: `as-1`, text: "研讀核心指南與理論觀念", done: false },
        { id: `as-2`, text: "進行專案實戰練兵", done: false },
      ],
      reward: node.reward || "給自己的成就小禮物 🎁",
      rewardStatus: "locked",
      x: node.x || 200 + (idx % 3) * 200,
      y: node.y || 450 - Math.floor(idx / 2) * 120,
      icon: "Sparkles",
    }));

    // Fix prereq IDs mapping
    const idMap: { [oldId: string]: string } = {};
    generatedResult.nodes.forEach((node: any, idx: number) => {
      idMap[node.id] = newSkills[idx].id;
    });

    newSkills.forEach((skill, idx) => {
      const originalNode = generatedResult.nodes[idx];
      if (originalNode.prerequisites && Array.isArray(originalNode.prerequisites)) {
        skill.prerequisites = originalNode.prerequisites
          .map((oldId: string) => idMap[oldId])
          .filter(Boolean);
      }
    });

    onImportGeneratedSkills(newSkills, generatedResult.suggestedReward);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-300 animate-spin" style={{ animationDuration: "5s" }} />
            <div>
              <h3 className="text-lg font-extrabold text-white">AI 技能樹解構師 (Gemini)</h3>
              <p className="text-xs text-slate-400">輸入你想達成的宏大目標，AI 將自動拆解成漸進式技能樹與自訂獎勵</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Goal Input & Category */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300">你想要達成的目標或願景：</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="例如：半年內成為具備 Gemini API 實戰經驗的 AI 全棧工程師..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
              <button
                disabled={isLoading || !goalInput.trim()}
                onClick={handleGenerate}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold transition-all ${
                  isLoading || !goalInput.trim()
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI 思考拆解中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>產生技能樹</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-medium">靈感範例：</span>
              {presetExamples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setGoalInput(ex)}
                  className="text-[10px] bg-slate-950 text-slate-300 hover:text-teal-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-teal-500/40 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* AI Generated Preview Tree Results */}
          {generatedResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    AI 拆解結果
                  </div>
                  <h4 className="text-lg font-extrabold text-white">{generatedResult.treeTitle}</h4>
                </div>
                <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30 font-bold">
                  {generatedResult.nodes?.length || 0} 個技能關卡
                </span>
              </div>

              {/* Big Suggested Reward */}
              {generatedResult.suggestedReward && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs">
                  <Gift className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-amber-200">
                    <strong className="text-amber-300">建議通關大獎勵：</strong> {generatedResult.suggestedReward}
                  </span>
                </div>
              )}

              {/* Node list preview */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {generatedResult.nodes?.map((node: any, idx: number) => (
                  <div
                    key={node.id || idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{idx + 1}. {node.title}</span>
                        <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {node.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-1">{node.description}</p>
                      {node.reward && (
                        <p className="text-amber-400 text-[10px]">🎁 完成獎勵：{node.reward}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            關閉
          </button>

          {generatedResult && (
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-90 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>匯入此技能樹圖譜</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
