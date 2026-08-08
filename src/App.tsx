import React, { useState, useEffect } from "react";
import { Timeframe, SkillNode, TreeTheme } from "./types";
import { initialTimeframes, initialSkills } from "./data/initialData";
import { Navbar } from "./components/Navbar";
import { SkillTreeView } from "./components/SkillTreeView";
import { SkillDetailModal } from "./components/SkillDetailModal";
import { SkillFormModal } from "./components/SkillFormModal";
import { TimeframeModal } from "./components/TimeframeModal";
import { RewardVault } from "./components/RewardVault";
import { HonorBoard } from "./components/HonorBoard";
import { AiSkillGeneratorModal } from "./components/AiSkillGeneratorModal";
import {
  playSkillLitSound,
  triggerConfetti,
  triggerGrandConfetti,
  calculateExp,
  getLevelTitle,
} from "./utils/audioAndParticles";

export default function App() {
  // Load initial data from localStorage or fallback
  const [timeframes, setTimeframes] = useState<Timeframe[]>(() => {
    try {
      const saved = localStorage.getItem("skilltree_timeframes");
      return saved ? JSON.parse(saved) : initialTimeframes;
    } catch {
      return initialTimeframes;
    }
  });

  const [skills, setSkills] = useState<SkillNode[]>(() => {
    try {
      const saved = localStorage.getItem("skilltree_skills");
      return saved ? JSON.parse(saved) : initialSkills;
    } catch {
      return initialSkills;
    }
  });

  const [selectedTimeframeId, setSelectedTimeframeId] = useState<string>(
    timeframes[0]?.id || "tf-2026-q3q4"
  );

  const [activeTab, setActiveTab] = useState<"tree" | "vault" | "honor" | "ai">("tree");

  // Modals
  const [selectedSkillForDetail, setSelectedSkillForDetail] = useState<SkillNode | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingSkill, setEditingSkill] = useState<SkillNode | null>(null);
  const [isTimeframeModalOpen, setIsTimeframeModalOpen] = useState<boolean>(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState<boolean>(false);

  // Auto persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("skilltree_timeframes", JSON.stringify(timeframes));
    } catch (e) {
      console.error(e);
    }
  }, [timeframes]);

  useEffect(() => {
    try {
      localStorage.setItem("skilltree_skills", JSON.stringify(skills));
    } catch (e) {
      console.error(e);
    }
  }, [skills]);

  // Selected timeframe
  const activeTimeframe =
    timeframes.find((t) => t.id === selectedTimeframeId) || timeframes[0] || initialTimeframes[0];

  // Skills belonging to active timeframe
  const timeframeSkills = skills.filter((s) => s.timeframeId === activeTimeframe.id);

  // Total User EXP & Level
  const totalCompletedSkills = skills.filter((s) => s.status === "completed");
  const totalExp = totalCompletedSkills.reduce((acc, curr) => acc + calculateExp(curr.difficulty), 0);
  const userLevel = Math.floor(totalExp / 500) + 1;
  const userLevelInfo = getLevelTitle(userLevel);

  // Unlocked rewards count
  const unlockedRewardsCount = skills.filter((s) => s.rewardStatus === "unlocked").length;

  // Handler: Light Up Skill
  const handleLightUpSkill = (skillId: string, reflection: string) => {
    const target = skills.find((s) => s.id === skillId);
    if (!target) return;

    playSkillLitSound();
    triggerConfetti();

    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          return {
            ...s,
            status: "completed",
            completedAt: new Date().toISOString(),
            reflection: reflection.trim() || s.reflection,
            rewardStatus: s.reward ? "unlocked" : "locked",
          };
        }
        return s;
      })
    );

    // Update child prerequisites
    setSkills((prev) =>
      prev.map((s) => {
        if (s.prerequisites.includes(skillId) && s.status === "locked") {
          const prereqs = prev.filter((p) => s.prerequisites.includes(p.id));
          const allCompleted = prereqs.every(
            (p) => p.id === skillId || p.status === "completed"
          );
          if (allCompleted) {
            return { ...s, status: "available" };
          }
        }
        return s;
      })
    );

    setSelectedSkillForDetail(null);
  };

  // Handler: Revert Skill
  const handleRevertSkill = (skillId: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          return {
            ...s,
            status: "available",
            completedAt: undefined,
            rewardStatus: "locked",
          };
        }
        return s;
      })
    );
    setSelectedSkillForDetail(null);
  };

  // Handler: Toggle Subtask
  const handleToggleSubTask = (skillId: string, subTaskId: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          const updatedSteps = s.actionSteps.map((step) =>
            step.id === subTaskId ? { ...step, done: !step.done } : step
          );
          return { ...s, actionSteps: updatedSteps };
        }
        return s;
      })
    );

    // Update modal state if open
    if (selectedSkillForDetail && selectedSkillForDetail.id === skillId) {
      setSelectedSkillForDetail((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          actionSteps: prev.actionSteps.map((step) =>
            step.id === subTaskId ? { ...step, done: !step.done } : step
          ),
        };
      });
    }
  };

  // Handler: Claim Skill Reward
  const handleClaimReward = (skillId: string) => {
    triggerConfetti();
    setSkills((prev) =>
      prev.map((s) =>
        s.id === skillId
          ? { ...s, rewardStatus: "claimed", rewardClaimedAt: new Date().toISOString() }
          : s
      )
    );
    if (selectedSkillForDetail && selectedSkillForDetail.id === skillId) {
      setSelectedSkillForDetail((prev) =>
        prev ? { ...prev, rewardStatus: "claimed" } : null
      );
    }
  };

  // Handler: Claim Timeframe Reward
  const handleClaimTimeframeReward = (timeframeId: string) => {
    triggerGrandConfetti();
    setTimeframes((prev) =>
      prev.map((t) => (t.id === timeframeId ? { ...t, rewardClaimed: true } : t))
    );
  };

  // Handler: Save Skill (Create or Edit)
  const handleSaveSkill = (skillData: Partial<SkillNode>) => {
    if (editingSkill) {
      setSkills((prev) =>
        prev.map((s) => (s.id === editingSkill.id ? ({ ...s, ...skillData } as SkillNode) : s))
      );
    } else {
      const newSkill = {
        ...skillData,
        timeframeId: activeTimeframe.id,
      } as SkillNode;
      setSkills((prev) => [...prev, newSkill]);
    }

    setEditingSkill(null);
    setIsFormModalOpen(false);
  };

  // Handler: Delete Skill
  const handleDeleteSkill = (skillId: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
    setSelectedSkillForDetail(null);
  };

  // Handler: Update Position on Drag
  const handleUpdateSkillPosition = (skillId: string, x: number, y: number) => {
    setSkills((prev) => prev.map((s) => (s.id === skillId ? { ...s, x, y } : s)));
  };

  // Handler: Change Theme
  const handleChangeTheme = (theme: TreeTheme) => {
    setTimeframes((prev) =>
      prev.map((t) => (t.id === activeTimeframe.id ? { ...t, theme } : t))
    );
  };

  // Handler: Save New Timeframe
  const handleSaveTimeframe = (newTimeframe: Timeframe) => {
    setTimeframes((prev) => [...prev, newTimeframe]);
    setSelectedTimeframeId(newTimeframe.id);
  };

  // Handler: Import AI Generated Tree Branch
  const handleImportAiSkills = (newSkills: SkillNode[], suggestedReward?: string) => {
    setSkills((prev) => [...prev, ...newSkills]);
    if (suggestedReward && !activeTimeframe.targetReward) {
      setTimeframes((prev) =>
        prev.map((t) => (t.id === activeTimeframe.id ? { ...t, targetReward: suggestedReward } : t))
      );
    }
    triggerGrandConfetti();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 p-2 sm:p-3 pb-12">
      {/* Header Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        timeframes={timeframes}
        selectedTimeframeId={selectedTimeframeId}
        setSelectedTimeframeId={setSelectedTimeframeId}
        onOpenNewTimeframe={() => setIsTimeframeModalOpen(true)}
        userExp={totalExp}
        userLevelInfo={userLevelInfo}
        unlockedRewardsCount={unlockedRewardsCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto py-4">
        {activeTab === "tree" && (
          <SkillTreeView
            timeframe={activeTimeframe}
            skills={timeframeSkills}
            onSelectSkill={(skill) => setSelectedSkillForDetail(skill)}
            onOpenAddSkill={() => {
              setEditingSkill(null);
              setIsFormModalOpen(true);
            }}
            onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
            onUpdateSkillPosition={handleUpdateSkillPosition}
            onChangeTheme={handleChangeTheme}
            onToggleClaimTreeReward={() => handleClaimTimeframeReward(activeTimeframe.id)}
          />
        )}

        {activeTab === "vault" && (
          <RewardVault
            skills={skills}
            timeframes={timeframes}
            onClaimReward={handleClaimReward}
            onClaimTimeframeReward={handleClaimTimeframeReward}
          />
        )}

        {activeTab === "honor" && (
          <HonorBoard
            skills={skills}
            timeframes={timeframes}
            userExp={totalExp}
            userLevelInfo={userLevelInfo}
          />
        )}

        {activeTab === "ai" && (
          <div className="max-w-3xl mx-auto">
            <AiSkillGeneratorModal
              timeframe={activeTimeframe}
              onClose={() => setActiveTab("tree")}
              onImportGeneratedSkills={handleImportAiSkills}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedSkillForDetail && (
        <SkillDetailModal
          skill={selectedSkillForDetail}
          allSkills={skills}
          onClose={() => setSelectedSkillForDetail(null)}
          onLightUpSkill={handleLightUpSkill}
          onRevertSkill={handleRevertSkill}
          onToggleSubTask={handleToggleSubTask}
          onClaimReward={handleClaimReward}
          onEditSkill={(skill) => {
            setSelectedSkillForDetail(null);
            setEditingSkill(skill);
            setIsFormModalOpen(true);
          }}
          onDeleteSkill={handleDeleteSkill}
        />
      )}

      {isFormModalOpen && (
        <SkillFormModal
          timeframeId={activeTimeframe.id}
          allSkills={timeframeSkills}
          initialSkill={editingSkill}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingSkill(null);
          }}
          onSave={handleSaveSkill}
        />
      )}

      {isTimeframeModalOpen && (
        <TimeframeModal
          onClose={() => setIsTimeframeModalOpen(false)}
          onSave={handleSaveTimeframe}
        />
      )}

      {isAiGeneratorOpen && (
        <AiSkillGeneratorModal
          timeframe={activeTimeframe}
          onClose={() => setIsAiGeneratorOpen(false)}
          onImportGeneratedSkills={handleImportAiSkills}
        />
      )}
    </div>
  );
}
