import React, { useState } from "react";
import { SkillNode, Timeframe, TreeTheme } from "../types";
import {
  Sparkles,
  Lock,
  CheckCircle2,
  Plus,
  TreeDeciduous,
  Gift,
  Palette,
  Move,
  Info,
  Code,
  Layers,
  Rocket,
  Languages,
  Activity,
  BookOpen,
  HeartPulse,
  Award,
  Zap,
} from "lucide-react";

interface SkillTreeViewProps {
  timeframe: Timeframe;
  skills: SkillNode[];
  onSelectSkill: (skill: SkillNode) => void;
  onOpenAddSkill: () => void;
  onOpenAiGenerator: () => void;
  onUpdateSkillPosition: (skillId: string, x: number, y: number) => void;
  onChangeTheme: (theme: TreeTheme) => void;
  onToggleClaimTreeReward: () => void;
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  timeframe,
  skills,
  onSelectSkill,
  onOpenAddSkill,
  onOpenAiGenerator,
  onUpdateSkillPosition,
  onChangeTheme,
  onToggleClaimTreeReward,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isDragMode, setIsDragMode] = useState<boolean>(false);
  const [draggedSkillId, setDraggedSkillId] = useState<string | null>(null);

  // Filter skills by category
  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];
  const filteredSkills = selectedCategory === "All" ? skills : skills.filter((s) => s.category === selectedCategory);

  // Progress stats
  const completedCount = skills.filter((s) => s.status === "completed").length;
  const totalCount = skills.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isTreeFullyCompleted = totalCount > 0 && completedCount === totalCount;

  // Icon mapping helper
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "Code":
        return <Code className="w-5 h-5" />;
      case "Layers":
        return <Layers className="w-5 h-5" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5" />;
      case "Rocket":
        return <Rocket className="w-5 h-5" />;
      case "Languages":
        return <Languages className="w-5 h-5" />;
      case "Activity":
        return <Activity className="w-5 h-5" />;
      case "BookOpen":
        return <BookOpen className="w-5 h-5" />;
      case "HeartPulse":
        return <HeartPulse className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  // Theme styling configurations
  const getThemeStyles = (theme: TreeTheme) => {
    switch (theme) {
      case "worldTree":
        return {
          bg: "from-slate-950 via-slate-900 to-amber-950/40",
          trunkColor: "#78350f",
          leafColor: "rgba(245, 158, 11, 0.15)",
          lineLit: "stroke-amber-400",
          lineUnlit: "stroke-slate-700",
          cardBg: "bg-slate-900/90 border-amber-500/30",
          nodeLit: "bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 shadow-amber-500/50 ring-amber-300",
          nodeAvailable: "bg-slate-900 border-2 border-amber-400/80 text-amber-300 shadow-amber-500/20",
          nodeLocked: "bg-slate-900/60 border border-slate-700 text-slate-500",
          accentText: "text-amber-300",
        };
      case "cyberTree":
        return {
          bg: "from-slate-950 via-slate-900 to-cyan-950/40",
          trunkColor: "#0891b2",
          leafColor: "rgba(6, 182, 212, 0.15)",
          lineLit: "stroke-cyan-400",
          lineUnlit: "stroke-slate-800",
          cardBg: "bg-slate-900/90 border-cyan-500/30",
          nodeLit: "bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 shadow-cyan-500/50 ring-cyan-300",
          nodeAvailable: "bg-slate-900 border-2 border-cyan-400/80 text-cyan-300 shadow-cyan-500/20",
          nodeLocked: "bg-slate-900/60 border border-slate-800 text-slate-500",
          accentText: "text-cyan-300",
        };
      case "sakuraTree":
        return {
          bg: "from-slate-950 via-slate-900 to-pink-950/30",
          trunkColor: "#9d174d",
          leafColor: "rgba(244, 114, 182, 0.15)",
          lineLit: "stroke-pink-400",
          lineUnlit: "stroke-slate-800",
          cardBg: "bg-slate-900/90 border-pink-500/30",
          nodeLit: "bg-gradient-to-tr from-pink-500 to-rose-400 text-slate-950 shadow-pink-500/50 ring-pink-300",
          nodeAvailable: "bg-slate-900 border-2 border-pink-400/80 text-pink-300 shadow-pink-500/20",
          nodeLocked: "bg-slate-900/60 border border-slate-800 text-slate-500",
          accentText: "text-pink-300",
        };
      case "emeraldTree":
        return {
          bg: "from-slate-950 via-slate-900 to-emerald-950/40",
          trunkColor: "#065f46",
          leafColor: "rgba(16, 185, 129, 0.15)",
          lineLit: "stroke-emerald-400",
          lineUnlit: "stroke-slate-800",
          cardBg: "bg-slate-900/90 border-emerald-500/30",
          nodeLit: "bg-gradient-to-tr from-emerald-500 to-teal-300 text-slate-950 shadow-emerald-500/50 ring-emerald-300",
          nodeAvailable: "bg-slate-900 border-2 border-emerald-400/80 text-emerald-300 shadow-emerald-500/20",
          nodeLocked: "bg-slate-900/60 border border-slate-800 text-slate-500",
          accentText: "text-emerald-300",
        };
      case "cosmicTree":
        return {
          bg: "from-slate-950 via-slate-900 to-purple-950/40",
          trunkColor: "#6b21a8",
          leafColor: "rgba(168, 85, 247, 0.15)",
          lineLit: "stroke-purple-400",
          lineUnlit: "stroke-slate-800",
          cardBg: "bg-slate-900/90 border-purple-500/30",
          nodeLit: "bg-gradient-to-tr from-purple-500 to-indigo-300 text-slate-950 shadow-purple-500/50 ring-purple-300",
          nodeAvailable: "bg-slate-900 border-2 border-purple-400/80 text-purple-300 shadow-purple-500/20",
          nodeLocked: "bg-slate-900/60 border border-slate-800 text-slate-500",
          accentText: "text-purple-300",
        };
      default:
        return {
          bg: "from-slate-950 via-slate-900 to-emerald-950/40",
          trunkColor: "#065f46",
          leafColor: "rgba(16, 185, 129, 0.15)",
          lineLit: "stroke-emerald-400",
          lineUnlit: "stroke-slate-800",
          cardBg: "bg-slate-900/90 border-emerald-500/30",
          nodeLit: "bg-gradient-to-tr from-emerald-500 to-teal-300 text-slate-950 shadow-emerald-500/50 ring-emerald-300",
          nodeAvailable: "bg-slate-900 border-2 border-emerald-400/80 text-emerald-300 shadow-emerald-500/20",
          nodeLocked: "bg-slate-900/60 border border-slate-800 text-slate-500",
          accentText: "text-emerald-300",
        };
    }
  };

  const themeStyle = getThemeStyles(timeframe.theme || "worldTree");

  // Handle Dragging
  const handleSvgMouseDown = (skillId: string, e: React.MouseEvent) => {
    if (!isDragMode) return;
    setDraggedSkillId(skillId);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragMode || !draggedSkillId) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 600);
    onUpdateSkillPosition(draggedSkillId, Math.max(50, Math.min(750, x)), Math.max(50, Math.min(550, y)));
  };

  const handleSvgMouseUp = () => {
    setDraggedSkillId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card: Goal Timeframe + Big Reward + Overall Progress */}
      <div className={`p-6 rounded-2xl border bg-gradient-to-r ${themeStyle.cardBg} backdrop-blur-md shadow-2xl relative overflow-hidden`}>
        {/* Glow ambient background element */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Timeframe Title & Goal */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                {timeframe.startDate} ~ {timeframe.endDate}
              </span>
              <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                {timeframe.intervalType === "quarterly" ? "季度目標" : timeframe.intervalType === "halfYear" ? "半年進度" : "年度樹狀圖"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {timeframe.title}
            </h2>
            <p className="text-sm text-slate-300 line-clamp-2">{timeframe.description}</p>
          </div>

          {/* Big Reward & Overall Progress */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 lg:w-96">
            {/* Target Tree Reward */}
            <div className="flex items-start justify-between gap-3 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
              <div className="flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
                <div>
                  <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    終極通關獎勵
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {timeframe.targetReward || "尚未設定終極獎勵"}
                  </div>
                </div>
              </div>
              {isTreeFullyCompleted && (
                <button
                  onClick={onToggleClaimTreeReward}
                  className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${
                    timeframe.rewardClaimed
                      ? "bg-slate-700 text-slate-300"
                      : "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/30 animate-pulse"
                  }`}
                >
                  {timeframe.rewardClaimed ? "已兌換" : "點擊兌換!"}
                </button>
              )}
            </div>

            {/* Tree Completion Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TreeDeciduous className="w-3.5 h-3.5 text-emerald-400" />
                  技能樹點亮進度
                </span>
                <span className={themeStyle.accentText}>
                  {completedCount} / {totalCount} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700 shadow-lg shadow-emerald-500/30"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Theme Switcher, Category Filter, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">分類：</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {cat === "All" ? "全部技能" : cat}
            </button>
          ))}
        </div>

        {/* Tools & Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-lg">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={timeframe.theme}
              onChange={(e) => onChangeTheme(e.target.value as TreeTheme)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="worldTree" className="bg-slate-900">✨ 金色世界樹</option>
              <option value="cyberTree" className="bg-slate-900">⚡ 賽博霓虹</option>
              <option value="sakuraTree" className="bg-slate-900">🌸 櫻花生機</option>
              <option value="emeraldTree" className="bg-slate-900">🌿 翡翠神木</option>
              <option value="cosmicTree" className="bg-slate-900">🌌 星空宇宙</option>
            </select>
          </div>

          {/* Drag Edit Toggle */}
          <button
            onClick={() => setIsDragMode(!isDragMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isDragMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
            title="開啟後可拖拽節點調整樹狀位置"
          >
            <Move className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDragMode ? "結束調整" : "調整位置"}</span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={onOpenAiGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 生成樹</span>
          </button>

          {/* Add Skill Button */}
          <button
            onClick={onOpenAddSkill}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>新增技能</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Skill Tree Canvas Area */}
      <div
        className={`relative w-full h-[620px] rounded-2xl border border-slate-800 bg-gradient-to-b ${themeStyle.bg} overflow-hidden shadow-2xl select-none`}
      >
        {/* Background Decorative Tree Roots & Canopy */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Organic Tree Trunk Silhouette */}
          <path
            d="M 380 600 C 380 500, 390 420, 400 320 C 410 220, 390 120, 400 0 C 410 120, 430 220, 420 320 C 410 420, 420 500, 420 600 Z"
            fill={themeStyle.trunkColor}
          />
          {/* Main Branches */}
          <path
            d="M 400 450 C 320 400, 220 380, 150 350 M 400 380 C 480 340, 580 320, 650 280 M 400 280 C 330 220, 250 180, 200 150"
            stroke={themeStyle.trunkColor}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle Canopy Glow Circles */}
          <circle cx="400" cy="180" r="140" fill={themeStyle.leafColor} />
          <circle cx="220" cy="320" r="100" fill={themeStyle.leafColor} />
          <circle cx="580" cy="300" r="110" fill={themeStyle.leafColor} />
        </svg>

        {/* Interactive SVG Node Link Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
        >
          <defs>
            {/* Glowing line gradients */}
            <linearGradient id="lineLitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Draw lines from prerequisites to children */}
          {filteredSkills.map((node) => {
            if (!node.prerequisites || node.prerequisites.length === 0) return null;

            return node.prerequisites.map((prereqId) => {
              const parentNode = skills.find((s) => s.id === prereqId);
              if (!parentNode) return null;

              const isBothCompleted = parentNode.status === "completed" && node.status === "completed";
              const isLinkActive = parentNode.status === "completed";

              // Curved bezier path connecting parent to child
              const midY = (parentNode.y + node.y) / 2;
              const pathD = `M ${parentNode.x} ${parentNode.y} C ${parentNode.x} ${midY}, ${node.x} ${midY}, ${node.x} ${node.y}`;

              return (
                <g key={`${parentNode.id}->${node.id}`}>
                  {/* Outer Glow path for completed links */}
                  {isBothCompleted && (
                    <path
                      d={pathD}
                      fill="none"
                      className="stroke-amber-400/50"
                      strokeWidth="6"
                      filter="url(#glow)"
                    />
                  )}
                  {/* Core Line */}
                  <path
                    d={pathD}
                    fill="none"
                    strokeWidth={isBothCompleted ? "3.5" : isLinkActive ? "2.5" : "1.5"}
                    strokeDasharray={isBothCompleted ? "none" : isLinkActive ? "4,4" : "6,6"}
                    className={
                      isBothCompleted
                        ? themeStyle.lineLit
                        : isLinkActive
                        ? "stroke-emerald-400/80"
                        : themeStyle.lineUnlit
                    }
                  />
                  {/* Energy Particle on Active Lines */}
                  {isBothCompleted && (
                    <circle r="3" fill="#F59E0B" filter="url(#glow)">
                      <animateMotion path={pathD} dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            });
          })}
        </svg>

        {/* Render Skill Nodes HTML Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredSkills.map((skill) => {
            const isCompleted = skill.status === "completed";
            const isLocked = skill.status === "locked";
            const isAvailable = skill.status === "available";

            // Map x (0-800) and y (0-600) into percentage positions for responsiveness
            const leftPercent = (skill.x / 800) * 100;
            const topPercent = (skill.y / 600) * 100;

            return (
              <div
                key={skill.id}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute pointer-events-auto transition-transform hover:scale-110 duration-200 z-10"
                onMouseDown={(e) => handleSvgMouseDown(skill.id, e)}
              >
                <div
                  onClick={() => !isDragMode && onSelectSkill(skill)}
                  className="group relative flex flex-col items-center cursor-pointer"
                >
                  {/* Node Badge Circle */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                      isCompleted
                        ? `${themeStyle.nodeLit} ring-4 shadow-xl`
                        : isAvailable
                        ? `${themeStyle.nodeAvailable} shadow-lg ring-2 ring-emerald-400/40 animate-pulse`
                        : `${themeStyle.nodeLocked}`
                    }`}
                  >
                    {/* Status Icon */}
                    {isCompleted ? (
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-slate-950 font-bold" />
                        <span className="text-[9px] font-extrabold uppercase tracking-tighter text-slate-900 mt-0.5">
                          點亮
                        </span>
                      </div>
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-emerald-400">
                        {getIcon(skill.icon)}
                        <span className="text-[9px] font-bold text-emerald-300 mt-0.5">可挑戰</span>
                      </div>
                    )}

                    {/* Pre-set Reward Badge Indicator */}
                    {skill.reward && (
                      <div
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md border ${
                          skill.rewardStatus === "claimed"
                            ? "bg-slate-800 text-slate-400 border-slate-700"
                            : skill.rewardStatus === "unlocked"
                            ? "bg-amber-400 text-slate-950 border-amber-200 font-bold animate-bounce"
                            : "bg-slate-900 text-amber-400 border-amber-500/40"
                        }`}
                        title={`獎勵: ${skill.reward}`}
                      >
                        🎁
                      </div>
                    )}
                  </div>

                  {/* Skill Node Label Card */}
                  <div
                    className={`mt-2 px-3 py-1.5 rounded-xl border text-center max-w-[140px] sm:max-w-[160px] shadow-lg backdrop-blur-md transition-all ${
                      isCompleted
                        ? "bg-slate-900/90 border-amber-500/40 text-amber-200"
                        : isAvailable
                        ? "bg-slate-900/90 border-emerald-500/40 text-emerald-200"
                        : "bg-slate-950/80 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="text-xs font-bold line-clamp-1">{skill.title}</div>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span className="truncate">{skill.category}</span>
                      <span>•</span>
                      <span
                        className={
                          skill.difficulty === "Easy"
                            ? "text-emerald-400"
                            : skill.difficulty === "Medium"
                            ? "text-amber-400"
                            : "text-purple-400"
                        }
                      >
                        {skill.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State Banner if no skills */}
        {skills.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-4">
            <TreeDeciduous className="w-16 h-16 text-slate-600 animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-200">這個時間區間尚未建立技能任務</h3>
              <p className="text-xs text-slate-400 max-w-md">
                您可以點擊「新增技能」手動打造技能樹，或使用「AI 生成樹」由 AI 自動規劃漸進式學習圖譜！
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onOpenAiGenerator}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                AI 快速生成技能樹
              </button>
              <button
                onClick={onOpenAddSkill}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                手動建立第一個技能
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Instructions Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-300">圖例說明：</span>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-sm shadow-amber-500/50" />
            <span>已點亮✨ (完成)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-emerald-400" />
            <span>進行中 (可點亮)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
            <span>前置鎖定 (需先解鎖父技能)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🎁</span>
            <span>包含完成獎勵</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Info className="w-3.5 h-3.5" />
          <span>點擊任意技能節點即可查看任務細節、子步驟與點亮技能！</span>
        </div>
      </div>
    </div>
  );
};
