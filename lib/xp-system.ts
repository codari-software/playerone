// XP and Level System

export function calculateLevel(xp: number): number {
  // Formula: Level = floor(sqrt(XP / 50)) + 1
  // Level 1: 0 XP
  // Level 2: 100 XP
  // Level 3: 250 XP
  // Level 4: 450 XP
  // Level 5: 700 XP
  // etc.
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export function getXpForLevel(level: number): number {
  // Reverse formula to get required XP for a level
  return Math.pow(level - 1, 2) * 50;
}

export function getXpProgress(currentXp: number): {
  currentLevel: number;
  nextLevel: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercentage: number;
  xpNeeded: number;
} {
  const currentLevel = calculateLevel(currentXp);
  const nextLevel = currentLevel + 1;
  const xpForCurrentLevel = getXpForLevel(currentLevel);
  const xpForNextLevel = getXpForLevel(nextLevel);
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(
    100,
    (xpInCurrentLevel / xpNeededForNextLevel) * 100
  );

  return {
    currentLevel,
    nextLevel,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercentage,
    xpNeeded: xpForNextLevel - currentXp,
  };
}

export function getLevelTitle(level: number): string {
  if (level >= 100) return '🌟 Legendary Hero';
  if (level >= 75) return '👑 Epic Champion';
  if (level >= 50) return '⚔️ Master Warrior';
  if (level >= 30) return '🛡️ Brave Knight';
  if (level >= 15) return '🗡️ Skilled Adventurer';
  if (level >= 5) return '🎯 Novice Explorer';
  return '🌱 Beginner';
}
