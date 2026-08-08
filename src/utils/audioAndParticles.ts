import confetti from "canvas-confetti";

export function playSkillLitSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
    });
  } catch (e) {
    console.error("Audio error", e);
  }
}

export function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"],
  });
}

export function triggerGrandConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
  }, 250);
}

export function calculateExp(difficulty: string): number {
  switch (difficulty) {
    case "Easy":
      return 100;
    case "Medium":
      return 250;
    case "Hard":
      return 500;
    case "Master":
      return 1000;
    default:
      return 200;
  }
}

export function getLevelTitle(level: number): { level: number; title: string; minExp: number; maxExp: number } {
  const titles = [
    "初生樹芽", // Lv 1
    "技能新星", // Lv 2
    "探索冒險家", // Lv 3
    "專能技師", // Lv 4
    "領域高能手", // Lv 5
    "技能樹巨擘", // Lv 6
    "傳奇導師", // Lv 7
    "萬能大宗師", // Lv 8
    "靈魂進化者", // Lv 9
    "神話樹尊", // Lv 10+
  ];

  const minExp = (level - 1) * 500;
  const maxExp = level * 500;
  const titleIndex = Math.min(level - 1, titles.length - 1);

  return {
    level,
    title: titles[titleIndex],
    minExp,
    maxExp,
  };
}
