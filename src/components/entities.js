import { CONFIG } from './combatConfig.js'

export class Player {
  constructor(charClass) {
    this.charClass = charClass
    this.classConfig = CONFIG.CLASSES[charClass]
    this.maxHp = CONFIG.PLAYER_MAX_HP
    this.hp = this.maxHp
    this.x = CONFIG.PLAYER_X
    this.y = 0 // set on init
    this.attackCooldown = 0
    this.attacking = false
    this.attackTimer = 0
    this.dead = false
  }

  init(canvasH) {
    this.y = canvasH - CONFIG.PLAYER_Y_OFFSET
  }

  update(dt) {
    if (this.attackCooldown > 0) this.attackCooldown -= dt
    if (this.attacking) {
      this.attackTimer -= dt
      if (this.attackTimer <= 0) this.attacking = false
    }
  }

  tryAttack() {
    if (this.attackCooldown > 0 || this.dead) return null
    this.attackCooldown = CONFIG.PLAYER_ATTACK_COOLDOWN
    this.attacking = true
    this.attackTimer = 200 // visual attack lasts 200ms

    return this.classConfig.attackType
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount)
    if (this.hp <= 0) this.dead = true
    return this.hp <= 0
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount)
  }

  getDamage(bossHpPercent, bossEnraged) {
    // Scale damage based on boss HP - more damage as boss gets lower
    const scale = CONFIG.PLAYER_DAMAGE_SCALE_MIN +
      (CONFIG.PLAYER_DAMAGE_SCALE_MAX - CONFIG.PLAYER_DAMAGE_SCALE_MIN) * (1 - bossHpPercent)
    let dmg = CONFIG.PLAYER_BASE_DAMAGE * scale * (0.9 + Math.random() * 0.2)
    // Phase 2: player damage is severely nerfed
    if (bossEnraged) dmg *= CONFIG.PLAYER_ENRAGE_DAMAGE_MULT
    return Math.round(dmg)
  }
}

export class Boss {
  constructor() {
    this.maxHp = CONFIG.BOSS_MAX_HP
    this.hp = this.maxHp
    this.x = CONFIG.BOSS_X
    this.y = 0
    this.attackCooldown = 0
    this.enraged = false
    this.attackAnim = 0
    this.dead = false
    this.staggerTimer = 0
  }

  init(canvasH) {
    this.y = canvasH - CONFIG.BOSS_Y_OFFSET
  }

  update(dt, phase) {
    if (this.staggerTimer > 0) {
      this.staggerTimer -= dt
      return
    }

    if (this.attackAnim > 0) this.attackAnim -= dt / 1000

    const cooldown = this.enraged ? CONFIG.BOSS_ENRAGE_COOLDOWN : CONFIG.BOSS_ATTACK_COOLDOWN
    this.attackCooldown -= dt
    if (this.attackCooldown <= 0 && phase !== 'ENRAGE_TRANSITION') {
      this.attackCooldown = cooldown
      return this.doAttack()
    }

    // Passive regen
    if (!this.enraged && this.hp / this.maxHp > CONFIG.BOSS_REGEN_THRESHOLD) {
      // Phase 1: gentle regen above 60%
      this.hp = Math.min(this.maxHp, this.hp + CONFIG.BOSS_REGEN_RATE)
    } else if (this.enraged) {
      // Phase 2: aggressive regen making it nearly impossible
      this.hp = Math.min(this.maxHp, this.hp + CONFIG.BOSS_ENRAGE_REGEN_RATE)
    }

    return null
  }

  doAttack() {
    // Miss chance - generous in phase 1, zero in phase 2
    const missChance = this.enraged ? CONFIG.BOSS_ENRAGE_MISS_CHANCE : CONFIG.BOSS_MISS_CHANCE
    if (Math.random() < missChance) {
      this.attackAnim = 0.3
      return { type: 'miss' }
    }

    this.attackAnim = 0.5
    const damage = this.enraged ? CONFIG.BOSS_ENRAGE_DAMAGE : CONFIG.BOSS_BASE_DAMAGE
    const variance = Math.round(damage * (0.85 + Math.random() * 0.3))

    if (this.enraged && Math.random() < 0.4) {
      // Belly slam in enrage - devastating damage
      return { type: 'bellySlam', damage: Math.round(variance * 1.4) }
    }

    return { type: Math.random() < 0.5 ? 'bottleSwing' : 'bourbonSplash', damage: variance }
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount)
    if (this.hp <= 0) this.dead = true
    return this.hp <= 0
  }

  getHpPercent() {
    return this.hp / this.maxHp
  }
}

export class Projectile {
  constructor(x, y, targetX, targetY, color, speed) {
    this.x = x
    this.y = y
    const dx = targetX - x
    const dy = targetY - y
    const dist = Math.sqrt(dx * dx + dy * dy)
    this.vx = (dx / dist) * speed
    this.vy = (dy / dist) * speed
    this.color = color
    this.alive = true
    this.trail = []
    this.size = CONFIG.PROJECTILE_SIZE
  }

  update(dt) {
    this.trail.push({ x: this.x, y: this.y })
    if (this.trail.length > 8) this.trail.shift()
    this.x += this.vx * (dt / 16)
    this.y += this.vy * (dt / 16)
  }

  draw(ctx) {
    // Trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i]
      const alpha = (i / this.trail.length) * 0.4
      ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba')
      ctx.beginPath()
      ctx.arc(t.x, t.y, this.size * (i / this.trail.length), 0, Math.PI * 2)
      ctx.fill()
    }
    // Main
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    // Glow
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2)
    ctx.fill()
  }

  hitTest(targetX, targetY, radius) {
    const dx = this.x - targetX
    const dy = this.y - targetY
    return Math.sqrt(dx * dx + dy * dy) < radius + this.size
  }
}

export class VFXParticle {
  constructor(x, y, color, type) {
    this.x = x
    this.y = y
    this.color = color
    this.type = type // 'burst', 'heal', 'fire', 'miss'
    this.lifetime = CONFIG.PARTICLE_LIFETIME
    this.maxLifetime = this.lifetime
    this.alive = true

    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 3
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed - (type === 'heal' ? 2 : 0)
    this.size = 2 + Math.random() * 3
    if (type === 'fire') {
      this.vy = -1 - Math.random() * 2
      this.lifetime = 800
      this.maxLifetime = 800
    }
  }

  update(dt) {
    this.lifetime -= dt
    if (this.lifetime <= 0) {
      this.alive = false
      return
    }
    this.x += this.vx * (dt / 16)
    this.y += this.vy * (dt / 16)
    this.vy += 0.05 * (dt / 16) // gravity
    if (this.type === 'fire') this.vy -= 0.1 * (dt / 16)
  }

  draw(ctx) {
    const progress = 1 - this.lifetime / this.maxLifetime
    const alpha = 1 - progress
    const size = this.size * (1 - progress * 0.5)
    ctx.fillStyle = this.color.includes('rgba')
      ? this.color
      : `${this.color.slice(0, -1)}, ${alpha})`
        .replace('rgb', 'rgba')
    ctx.beginPath()
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

export class DamageNumber {
  constructor(x, y, text, color) {
    this.x = x
    this.y = y
    this.text = text
    this.color = color
    this.lifetime = 800
    this.maxLifetime = 800
    this.alive = true
    this.vy = -2
  }

  update(dt) {
    this.lifetime -= dt
    if (this.lifetime <= 0) {
      this.alive = false
      return
    }
    this.y += this.vy * (dt / 16)
    this.vy += 0.03 * (dt / 16)
  }

  draw(ctx) {
    const progress = 1 - this.lifetime / this.maxLifetime
    const alpha = 1 - progress
    const scale = 1 + progress * 0.3
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(scale, scale)
    ctx.font = 'bold 16px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`
    ctx.fillText(this.text, 1, 1)
    ctx.fillStyle = this.color.includes('rgba')
      ? this.color
      : this.color
    ctx.globalAlpha = alpha
    ctx.fillText(this.text, 0, 0)
    ctx.restore()
  }
}
