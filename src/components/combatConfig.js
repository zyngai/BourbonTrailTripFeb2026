// All tunable game constants (~60s total: ~45s phase 1, ~3s enrage, ~12s phase 2)
export const CONFIG = {
  // Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 450,

  // Player
  PLAYER_MAX_HP: 120,
  PLAYER_BASE_DAMAGE: 12,
  PLAYER_ATTACK_COOLDOWN: 450, // ms between attacks (fast clicking)
  PLAYER_X: 150,
  PLAYER_Y_OFFSET: 80, // from canvas bottom

  // Boss
  BOSS_MAX_HP: 200,
  BOSS_BASE_DAMAGE: 4,
  BOSS_ENRAGE_DAMAGE: 35,
  BOSS_ATTACK_COOLDOWN: 2800, // ms phase 1 (very slow, easy)
  BOSS_ENRAGE_COOLDOWN: 500, // ms phase 2 (relentless barrage)
  BOSS_MISS_CHANCE: 0.45, // misses nearly half in phase 1
  BOSS_ENRAGE_MISS_CHANCE: 0.0, // never misses in phase 2
  BOSS_REGEN_RATE: 0.05, // barely noticeable regen in phase 1
  BOSS_REGEN_THRESHOLD: 0.6, // only regen above 60% HP
  BOSS_ENRAGE_REGEN_RATE: 0.8, // heals very aggressively in phase 2
  BOSS_X: 600,
  BOSS_Y_OFFSET: 60,

  // Phase thresholds
  ENRAGE_HP_PERCENT: 0.5,
  ENRAGE_DURATION: 3000, // ms for transition animation (dramatic pause)

  // Player heals at milestones (phase 1 feels comfortable)
  HEAL_MILESTONES: [
    { bossHpPercent: 0.85, healAmount: 20, used: false },
    { bossHpPercent: 0.7, healAmount: 25, used: false },
    { bossHpPercent: 0.6, healAmount: 20, used: false },
  ],

  // Damage scaling - player deals more as boss HP drops (phase 1 only)
  PLAYER_DAMAGE_SCALE_MIN: 0.9,
  PLAYER_DAMAGE_SCALE_MAX: 1.4,
  // Phase 2: player damage is crushed
  PLAYER_ENRAGE_DAMAGE_MULT: 0.3,

  // Projectile
  PROJECTILE_SPEED: 8,
  PROJECTILE_SIZE: 6,

  // VFX
  PARTICLE_LIFETIME: 600,
  SHAKE_DURATION: 200,
  SHAKE_INTENSITY: 4,

  // Countdown
  COUNTDOWN_DURATION: 3000,

  // Character classes
  CLASSES: {
    wizard: {
      name: 'Wizard',
      attackType: 'ranged',
      color: '#8A2BE2',
      colorDark: '#4B0082',
      projectileColor: '#c77dff',
      label: 'Alex',
    },
    thief: {
      name: 'Thief',
      attackType: 'melee',
      color: '#556B2F',
      colorDark: '#2F4F4F',
      projectileColor: '#90ee90',
      label: 'Cece',
    },
    warrior: {
      name: 'Warrior',
      attackType: 'melee',
      color: '#DC143C',
      colorDark: '#8B0000',
      projectileColor: '#ff6b6b',
      label: 'Henrik',
    },
    cleric: {
      name: 'Cleric',
      attackType: 'ranged',
      color: '#FFD700',
      colorDark: '#DAA520',
      projectileColor: '#fff3b0',
      label: 'Z',
    },
  },
}
