export type DifficultyLevel = "Easy" | "Medium" | "Hard" | "Master";

export type SkillStatus = "locked" | "available" | "completed";

export type RewardStatus = "locked" | "unlocked" | "claimed";

export type TreeTheme = "worldTree" | "cyberTree" | "sakuraTree" | "emeraldTree" | "cosmicTree";

export interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

export interface Timeframe {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  intervalType: "quarterly" | "halfYear" | "annual" | "custom";
  targetReward: string;
  rewardClaimed: boolean;
  theme: TreeTheme;
  year: number; // e.g. 2026
}

export interface SkillNode {
  id: string;
  timeframeId: string;
  title: string;
  category: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedDays: number;
  prerequisites: string[]; // SkillNode IDs
  status: SkillStatus;
  completedAt?: string; // ISO date
  reflection?: string; // User notes upon completion
  actionSteps: SubTask[];
  reward: string; // Pre-set reward for this skill
  rewardStatus: RewardStatus;
  rewardClaimedAt?: string;
  x: number; // Canvas SVG coordinate (0-800)
  y: number; // Canvas SVG coordinate (0-600)
  icon?: string;
}

export interface RewardVaultItem {
  id: string;
  skillId?: string;
  timeframeId?: string;
  title: string;
  sourceTitle: string; // Skill name or Timeframe name
  rewardStatus: RewardStatus;
  unlockedAt?: string;
  claimedAt?: string;
  notes?: string;
}

export interface AnnualSummary {
  year: number;
  totalSkills: number;
  completedSkills: number;
  completedPercentage: number;
  totalExp: number;
  totalRewardsClaimed: number;
  topCategory: string;
  completedList: SkillNode[];
  annualMotto: string;
}
