import { CONFIG } from './combatConfig.js'
import { Player, Boss, Projectile, VFXParticle, DamageNumber } from './entities.js'
import { drawBackground, drawDustMotes } from './drawBackground.js'
import { drawMunchkin } from './drawMunchkin.js'
import { drawBoss, drawEnrageShockwave } from './drawBoss.js'

export class GameEngine {
  constructor(canvas, onStateChange) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.onStateChange = onStateChange
    this.animId = null
    this.lastTime = 0
    this.time = 0

    // Entities
    this.player = null
    this.boss = null
    this.projectiles = []
    this.particles = []
    this.damageNumbers = []

    // State
    this.phase = 'IDLE' // IDLE, COUNTDOWN, PHASE_1, ENRAGE_TRANSITION, PHASE_2, VICTORY, DEFEAT
    this.countdownTimer = 0
    this.countdownText = ''
    this.enrageTimer = 0
    this.shakeTimer = 0
    this.shakeIntensity = 0
    this.healMilestones = []

    // Screen flash
    this.flashAlpha = 0
    this.flashColor = 'white'

    // Scaling
    this.scale = 1
    this.offsetX = 0
    this.offsetY = 0
  }

  resize() {
    const parent = this.canvas.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    // Fit to container maintaining aspect ratio
    const aspectRatio = CONFIG.CANVAS_WIDTH / CONFIG.CANVAS_HEIGHT
    let w = rect.width
    let h = w / aspectRatio

    if (h > rect.width * 0.7) {
      h = rect.width * 0.7
      w = h * aspectRatio
    }

    this.canvas.style.width = `${w}px`
    this.canvas.style.height = `${h}px`
    this.canvas.width = CONFIG.CANVAS_WIDTH * dpr
    this.canvas.height = CONFIG.CANVAS_HEIGHT * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    this.scale = w / CONFIG.CANVAS_WIDTH
  }

  startGame(charClass) {
    this.player = new Player(charClass)
    this.boss = new Boss()
    this.player.init(CONFIG.CANVAS_HEIGHT)
    this.boss.init(CONFIG.CANVAS_HEIGHT)
    this.projectiles = []
    this.particles = []
    this.damageNumbers = []
    this.healMilestones = CONFIG.HEAL_MILESTONES.map(m => ({ ...m }))
    this.shakeTimer = 0
    this.flashAlpha = 0

    this.phase = 'COUNTDOWN'
    this.countdownTimer = CONFIG.COUNTDOWN_DURATION
    this.countdownText = '3'
    this.onStateChange({ phase: 'COUNTDOWN', playerHp: 1, bossHp: 1 })

    if (!this.animId) {
      this.lastTime = performance.now()
      this.loop(this.lastTime)
    }
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)
      this.animId = null
    }
  }

  handleTap() {
    if (this.phase !== 'PHASE_1' && this.phase !== 'PHASE_2') return
    if (!this.player || this.player.dead) return

    const attackType = this.player.tryAttack()
    if (!attackType) return

    const bossHpPercent = this.boss.getHpPercent()
    const damage = this.player.getDamage(bossHpPercent, this.boss.enraged)

    if (attackType === 'ranged') {
      // Fire projectile toward boss
      const proj = new Projectile(
        this.player.x + 20, this.player.y - 30,
        this.boss.x, this.boss.y - 40,
        this.player.classConfig.projectileColor,
        CONFIG.PROJECTILE_SPEED
      )
      proj.damage = damage
      this.projectiles.push(proj)
    } else {
      // Melee - instant hit with lunge visual
      this.applyDamageToBoss(damage)
    }
  }

  applyDamageToBoss(damage) {
    const dead = this.boss.takeDamage(damage)
    this.spawnBurstParticles(this.boss.x, this.boss.y - 40, this.player.classConfig.projectileColor, 6)
    this.damageNumbers.push(new DamageNumber(
      this.boss.x + (Math.random() - 0.5) * 30,
      this.boss.y - 60,
      `-${damage}`,
      this.player.classConfig.projectileColor
    ))
    this.triggerShake(CONFIG.SHAKE_INTENSITY * 0.5, 100)

    if (dead) {
      this.phase = 'VICTORY'
      this.flashAlpha = 0.8
      this.flashColor = '#ffd700'
      this.onStateChange({ phase: 'VICTORY', playerHp: this.player.hp / this.player.maxHp, bossHp: 0 })
      return
    }

    // Check enrage threshold
    if (!this.boss.enraged && this.boss.getHpPercent() <= CONFIG.ENRAGE_HP_PERCENT) {
      this.startEnrage()
      return
    }

    // Check heal milestones
    this.checkHealMilestones()

    this.onStateChange({
      phase: this.phase,
      playerHp: this.player.hp / this.player.maxHp,
      bossHp: this.boss.getHpPercent(),
    })
  }

  startEnrage() {
    this.phase = 'ENRAGE_TRANSITION'
    this.enrageTimer = CONFIG.ENRAGE_DURATION
    this.boss.staggerTimer = CONFIG.ENRAGE_DURATION
    // Clear all in-flight projectiles - full combat pause
    this.projectiles = []
    this.triggerShake(CONFIG.SHAKE_INTENSITY * 2, CONFIG.ENRAGE_DURATION)
    this.flashAlpha = 0.5
    this.flashColor = '#ff4400'
    this.onStateChange({
      phase: 'ENRAGE_TRANSITION',
      playerHp: this.player.hp / this.player.maxHp,
      bossHp: this.boss.getHpPercent(),
    })
  }

  checkHealMilestones() {
    const bossPercent = this.boss.getHpPercent()
    for (const m of this.healMilestones) {
      if (!m.used && bossPercent <= m.bossHpPercent) {
        m.used = true
        this.player.heal(m.healAmount)
        this.spawnHealParticles(this.player.x, this.player.y - 30)
        this.damageNumbers.push(new DamageNumber(
          this.player.x,
          this.player.y - 50,
          `+${m.healAmount}`,
          '#00ff88'
        ))
      }
    }
  }

  processBossAttack(attack) {
    if (!attack || attack.type === 'miss') {
      if (attack) {
        this.damageNumbers.push(new DamageNumber(
          this.player.x + (Math.random() - 0.5) * 20,
          this.player.y - 50,
          'MISS',
          'rgba(180,180,180,1)'
        ))
      }
      return
    }

    const dead = this.player.takeDamage(attack.damage)
    this.spawnBurstParticles(this.player.x, this.player.y - 25, '#ff4444', 8)
    this.damageNumbers.push(new DamageNumber(
      this.player.x + (Math.random() - 0.5) * 20,
      this.player.y - 50,
      `-${attack.damage}`,
      '#ff4444'
    ))
    this.triggerShake(CONFIG.SHAKE_INTENSITY, CONFIG.SHAKE_DURATION)

    if (attack.type === 'bellySlam') {
      this.flashAlpha = 0.3
      this.flashColor = '#ff2200'
    }

    if (dead) {
      this.phase = 'DEFEAT'
      this.onStateChange({ phase: 'DEFEAT', playerHp: 0, bossHp: this.boss.getHpPercent() })
    } else {
      this.onStateChange({
        phase: this.phase,
        playerHp: this.player.hp / this.player.maxHp,
        bossHp: this.boss.getHpPercent(),
      })
    }
  }

  triggerShake(intensity, duration) {
    this.shakeIntensity = intensity
    this.shakeTimer = duration
  }

  spawnBurstParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new VFXParticle(x, y, color, 'burst'))
    }
  }

  spawnHealParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push(new VFXParticle(x + (Math.random() - 0.5) * 20, y, '#00ff88', 'heal'))
    }
  }

  spawnFireParticles() {
    if (!this.boss) return
    for (let i = 0; i < 3; i++) {
      this.particles.push(new VFXParticle(
        this.boss.x + (Math.random() - 0.5) * 60,
        this.boss.y - 30 - Math.random() * 40,
        `rgb(255, ${60 + Math.random() * 100}, 0)`,
        'fire'
      ))
    }
  }

  // ---- GAME LOOP ----
  loop = (now) => {
    const dt = Math.min(now - this.lastTime, 50) // cap at 50ms
    this.lastTime = now
    this.time = now

    this.update(dt)
    this.render()

    this.animId = requestAnimationFrame(this.loop)
  }

  update(dt) {
    // Countdown
    if (this.phase === 'COUNTDOWN') {
      this.countdownTimer -= dt
      const sec = Math.ceil(this.countdownTimer / 1000)
      if (sec <= 0) {
        this.countdownText = 'FIGHT!'
        if (this.countdownTimer < -500) {
          this.phase = 'PHASE_1'
          this.onStateChange({
            phase: 'PHASE_1',
            playerHp: 1,
            bossHp: 1,
          })
        }
      } else {
        this.countdownText = String(sec)
      }
      return
    }

    // Enrage transition
    if (this.phase === 'ENRAGE_TRANSITION') {
      this.enrageTimer -= dt
      this.spawnFireParticles()
      if (this.enrageTimer <= 0) {
        this.boss.enraged = true
        this.phase = 'PHASE_2'
        this.flashAlpha = 0.6
        this.flashColor = '#ff6600'
        this.onStateChange({
          phase: 'PHASE_2',
          playerHp: this.player.hp / this.player.maxHp,
          bossHp: this.boss.getHpPercent(),
        })
      }
      // Update particles during transition
      this.particles = this.particles.filter(p => { p.update(dt); return p.alive })
      this.damageNumbers = this.damageNumbers.filter(d => { d.update(dt); return d.alive })
      if (this.shakeTimer > 0) this.shakeTimer -= dt
      if (this.flashAlpha > 0) this.flashAlpha = Math.max(0, this.flashAlpha - dt * 0.001)
      return
    }

    if (this.phase !== 'PHASE_1' && this.phase !== 'PHASE_2') {
      // Still render particles in VICTORY/DEFEAT
      this.particles = this.particles.filter(p => { p.update(dt); return p.alive })
      this.damageNumbers = this.damageNumbers.filter(d => { d.update(dt); return d.alive })
      if (this.flashAlpha > 0) this.flashAlpha = Math.max(0, this.flashAlpha - dt * 0.002)
      return
    }

    // Update entities
    this.player.update(dt)
    const bossAction = this.boss.update(dt, this.phase)
    if (bossAction) this.processBossAttack(bossAction)

    // Update projectiles
    for (const proj of this.projectiles) {
      proj.update(dt)
      if (proj.hitTest(this.boss.x, this.boss.y - 40, 35)) {
        proj.alive = false
        this.applyDamageToBoss(proj.damage)
      }
      // Off screen
      if (proj.x > CONFIG.CANVAS_WIDTH + 50 || proj.x < -50 || proj.y > CONFIG.CANVAS_HEIGHT + 50 || proj.y < -50) {
        proj.alive = false
      }
    }
    this.projectiles = this.projectiles.filter(p => p.alive)

    // Fire particles in phase 2
    if (this.phase === 'PHASE_2' && Math.random() < 0.15) {
      this.spawnFireParticles()
    }

    // Update particles and damage numbers
    this.particles = this.particles.filter(p => { p.update(dt); return p.alive })
    this.damageNumbers = this.damageNumbers.filter(d => { d.update(dt); return d.alive })

    // Shake
    if (this.shakeTimer > 0) this.shakeTimer -= dt
    // Flash
    if (this.flashAlpha > 0) this.flashAlpha = Math.max(0, this.flashAlpha - dt * 0.003)
  }

  render() {
    const ctx = this.ctx
    const w = CONFIG.CANVAS_WIDTH
    const h = CONFIG.CANVAS_HEIGHT

    ctx.save()

    // Screen shake
    if (this.shakeTimer > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2
      ctx.translate(sx, sy)
    }

    // Background
    drawBackground(ctx, w, h)
    drawDustMotes(ctx, w, h, this.time)

    // Enrage darkening
    if (this.phase === 'ENRAGE_TRANSITION') {
      const progress = 1 - this.enrageTimer / CONFIG.ENRAGE_DURATION
      ctx.fillStyle = `rgba(0,0,0,${progress * 0.3})`
      ctx.fillRect(0, 0, w, h)
    }

    // Draw entities
    if (this.player) {
      drawMunchkin(ctx, this.player.x, this.player.y, this.player.charClass, this.time, this.player.attacking)
    }
    if (this.boss) {
      drawBoss(ctx, this.boss.x, this.boss.y, this.time, this.boss.enraged, this.boss.attackAnim > 0 ? this.boss.attackAnim : 0)
    }

    // Projectiles
    for (const proj of this.projectiles) proj.draw(ctx)

    // Particles
    for (const p of this.particles) p.draw(ctx)

    // Damage numbers
    for (const d of this.damageNumbers) d.draw(ctx)

    // Enrage shockwave
    if (this.phase === 'ENRAGE_TRANSITION' && this.boss) {
      const progress = 1 - this.enrageTimer / CONFIG.ENRAGE_DURATION
      drawEnrageShockwave(ctx, this.boss.x, this.boss.y, progress)
    }

    // Countdown text
    if (this.phase === 'COUNTDOWN') {
      ctx.fillStyle = 'rgba(0,0,0,0.4)'
      ctx.fillRect(0, 0, w, h)
      ctx.font = 'bold 72px Cinzel, serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffd700'
      ctx.shadowColor = '#ff8800'
      ctx.shadowBlur = 20
      ctx.fillText(this.countdownText, w / 2, h / 2)
      ctx.shadowBlur = 0
    }

    // Enrage text
    if (this.phase === 'ENRAGE_TRANSITION') {
      const progress = 1 - this.enrageTimer / CONFIG.ENRAGE_DURATION
      if (progress > 0.5) {
        const textAlpha = Math.min(1, (progress - 0.5) * 4)
        ctx.font = 'bold 48px Cinzel, serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = `rgba(255, 100, 0, ${textAlpha})`
        ctx.shadowColor = '#ff4400'
        ctx.shadowBlur = 30
        ctx.fillText('ENRAGED!', w / 2, h / 2)
        ctx.shadowBlur = 0
      }
    }

    // Screen flash overlay
    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor.startsWith('rgba')
        ? this.flashColor
        : this.flashColor + Math.round(this.flashAlpha * 255).toString(16).padStart(2, '0')
      ctx.fillRect(0, 0, w, h)
    }

    ctx.restore()
  }
}
