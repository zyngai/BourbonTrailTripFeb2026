// The Bourbon Noble - Godskin Noble-inspired, bloated and grotesque
// Pale cracked skin, sunken eyes, tattered robes, massive bourbon bottle club

export function drawBoss(ctx, x, y, time, enraged, attackAnim) {
  ctx.save()
  ctx.translate(x, y)

  const bob = Math.sin(time * 0.002) * 2
  const breathe = Math.sin(time * 0.0015) * 3

  // Enrage effects
  if (enraged) {
    drawFireAura(ctx, time)
    drawSmoke(ctx, time)
  }

  // Ground shadow
  ctx.fillStyle = enraged ? 'rgba(80,20,0,0.4)' : 'rgba(0,0,0,0.45)'
  ctx.beginPath()
  ctx.ellipse(0, 6, 48, 12, 0, 0, Math.PI * 2)
  ctx.fill()

  // --- LEGS (thick, wrapped) ---
  const legColor = enraged ? '#2a0a04' : '#8a7a6a'
  ctx.fillStyle = legColor
  // Left leg
  ctx.beginPath()
  ctx.moveTo(-22, -8 + bob)
  ctx.lineTo(-26, 4 + bob)
  ctx.lineTo(-10, 4 + bob)
  ctx.lineTo(-8, -8 + bob)
  ctx.closePath()
  ctx.fill()
  // Right leg
  ctx.beginPath()
  ctx.moveTo(8, -8 + bob)
  ctx.lineTo(10, 4 + bob)
  ctx.lineTo(26, 4 + bob)
  ctx.lineTo(22, -8 + bob)
  ctx.closePath()
  ctx.fill()
  // Leg wraps
  ctx.strokeStyle = enraged ? 'rgba(100,30,0,0.3)' : 'rgba(60,50,40,0.3)'
  ctx.lineWidth = 1
  for (let i = -6; i < 3; i += 3) {
    ctx.beginPath()
    ctx.moveTo(-24, i + bob)
    ctx.lineTo(-10, i + 1 + bob)
    ctx.moveTo(10, i + bob)
    ctx.lineTo(24, i + 1 + bob)
    ctx.stroke()
  }
  // Feet
  ctx.fillStyle = enraged ? '#1a0804' : '#5a4a3a'
  ctx.fillRect(-28, 2 + bob, 20, 6)
  ctx.fillRect(8, 2 + bob, 20, 6)

  // --- MASSIVE BODY ---
  const bodyW = 44 + breathe
  const bodyH = 56 + breathe * 0.5

  // Body shadow layer
  ctx.fillStyle = enraged ? 'rgba(60,10,0,0.3)' : 'rgba(0,0,0,0.15)'
  ctx.beginPath()
  ctx.ellipse(2, -36 + bob, bodyW + 2, bodyH + 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // Main bloated body
  const bodyGrad = ctx.createRadialGradient(-10, -45 + bob, 5, 0, -35 + bob, bodyW)
  if (enraged) {
    bodyGrad.addColorStop(0, '#4a1508')
    bodyGrad.addColorStop(0.4, '#3a0e04')
    bodyGrad.addColorStop(1, '#1a0604')
  } else {
    bodyGrad.addColorStop(0, '#c8b8a0')
    bodyGrad.addColorStop(0.3, '#b8a488')
    bodyGrad.addColorStop(0.7, '#a08868')
    bodyGrad.addColorStop(1, '#887058')
  }
  ctx.fillStyle = bodyGrad
  ctx.beginPath()
  ctx.ellipse(0, -36 + bob, bodyW, bodyH, 0, 0, Math.PI * 2)
  ctx.fill()

  // Skin details - veins and stretch marks
  ctx.strokeStyle = enraged ? 'rgba(200,60,0,0.25)' : 'rgba(120,80,50,0.2)'
  ctx.lineWidth = 0.8
  for (let i = 0; i < 6; i++) {
    const vx = -20 + i * 8 + Math.random() * 4
    const vy = -55 + bob + Math.random() * 30
    ctx.beginPath()
    ctx.moveTo(vx, vy)
    ctx.quadraticCurveTo(vx + 3, vy + 10, vx - 2, vy + 18)
    ctx.stroke()
  }

  // Grotesque belly folds
  ctx.strokeStyle = enraged ? 'rgba(150,40,0,0.35)' : 'rgba(100,70,40,0.3)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(0, -25 + bob, 30, 0.2, 2.9)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, -18 + bob, 22, 0.4, 2.7)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(3, -30 + bob, 18, 0.6, 2.5)
  ctx.stroke()

  // Navel (disturbing detail)
  ctx.fillStyle = enraged ? '#2a0804' : '#7a6048'
  ctx.beginPath()
  ctx.ellipse(0, -22 + bob, 4, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // --- TATTERED ROBE/DRAPING ---
  ctx.fillStyle = enraged ? '#1a0604' : '#4a3a2a'
  // Left drape
  ctx.beginPath()
  ctx.moveTo(-35, -60 + bob)
  ctx.quadraticCurveTo(-44, -30 + bob, -38, -5 + bob)
  ctx.lineTo(-30, -5 + bob)
  ctx.quadraticCurveTo(-36, -32 + bob, -28, -58 + bob)
  ctx.closePath()
  ctx.fill()
  // Right drape
  ctx.beginPath()
  ctx.moveTo(35, -60 + bob)
  ctx.quadraticCurveTo(44, -30 + bob, 38, -5 + bob)
  ctx.lineTo(30, -5 + bob)
  ctx.quadraticCurveTo(36, -32 + bob, 28, -58 + bob)
  ctx.closePath()
  ctx.fill()
  // Tattered edges
  ctx.strokeStyle = enraged ? '#3a1a08' : '#3a2a1a'
  ctx.lineWidth = 0.8
  for (let i = 0; i < 5; i++) {
    const ty = -5 + bob - i * 3
    ctx.beginPath()
    ctx.moveTo(-38 + i, ty)
    ctx.lineTo(-34 + i, ty + 5)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(38 - i, ty)
    ctx.lineTo(34 - i, ty + 5)
    ctx.stroke()
  }

  // Chest wrap - decayed bandaging
  ctx.fillStyle = enraged ? '#2a0a04' : '#7a6a5a'
  ctx.beginPath()
  ctx.moveTo(-34, -62 + bob)
  ctx.quadraticCurveTo(0, -52 + bob, 34, -62 + bob)
  ctx.lineTo(30, -70 + bob)
  ctx.quadraticCurveTo(0, -64 + bob, -30, -70 + bob)
  ctx.closePath()
  ctx.fill()
  // Bandage wrapping lines
  ctx.strokeStyle = enraged ? 'rgba(100,30,0,0.3)' : 'rgba(90,70,50,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-30, -66 + bob)
  ctx.lineTo(30, -60 + bob)
  ctx.moveTo(-28, -58 + bob)
  ctx.lineTo(28, -65 + bob)
  ctx.stroke()

  // --- ARMS ---
  const armSwing = attackAnim ? Math.sin(attackAnim * 12) * 0.6 : 0

  // Left arm (clawed)
  ctx.save()
  ctx.translate(-36, -56 + bob)
  ctx.rotate(-0.25 + armSwing)
  // Upper arm
  ctx.fillStyle = enraged ? '#3a0e04' : '#b8a488'
  ctx.beginPath()
  ctx.moveTo(-5, 0)
  ctx.quadraticCurveTo(-8, 18, -5, 32)
  ctx.lineTo(7, 32)
  ctx.quadraticCurveTo(8, 18, 5, 0)
  ctx.closePath()
  ctx.fill()
  // Forearm
  ctx.beginPath()
  ctx.moveTo(-4, 30)
  ctx.lineTo(-6, 44)
  ctx.lineTo(6, 44)
  ctx.lineTo(4, 30)
  ctx.closePath()
  ctx.fill()
  // Clawed hand
  ctx.fillStyle = enraged ? '#2a0804' : '#a08868'
  ctx.beginPath()
  ctx.arc(0, 46, 7, 0, Math.PI * 2)
  ctx.fill()
  // Claws
  ctx.strokeStyle = enraged ? '#cc4400' : '#4a3a2a'
  ctx.lineWidth = 1.5
  for (let cl = -2; cl <= 2; cl++) {
    ctx.beginPath()
    ctx.moveTo(cl * 3, 52)
    ctx.lineTo(cl * 4, 58)
    ctx.stroke()
  }
  ctx.restore()

  // Right arm (holding bottle)
  ctx.save()
  ctx.translate(36, -56 + bob)
  ctx.rotate(0.25 - armSwing * 1.5)
  ctx.fillStyle = enraged ? '#3a0e04' : '#b8a488'
  ctx.beginPath()
  ctx.moveTo(-5, 0)
  ctx.quadraticCurveTo(-8, 18, -5, 32)
  ctx.lineTo(7, 32)
  ctx.quadraticCurveTo(8, 18, 5, 0)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-4, 30)
  ctx.lineTo(-6, 44)
  ctx.lineTo(6, 44)
  ctx.lineTo(4, 30)
  ctx.closePath()
  ctx.fill()
  // Hand gripping
  ctx.fillStyle = enraged ? '#2a0804' : '#a08868'
  ctx.beginPath()
  ctx.arc(0, 44, 7, 0, Math.PI * 2)
  ctx.fill()
  // MASSIVE bourbon bottle
  drawBourbonBottle(ctx, 0, 28, enraged, time)
  ctx.restore()

  // --- HEAD ---
  // Thick neck
  ctx.fillStyle = enraged ? '#3a0e04' : '#b8a488'
  ctx.fillRect(-8, -76 + bob, 16, 10)

  // Skull-like head
  const headGrad = ctx.createRadialGradient(-3, -88 + bob, 2, 0, -86 + bob, 18)
  if (enraged) {
    headGrad.addColorStop(0, '#4a1508')
    headGrad.addColorStop(1, '#2a0804')
  } else {
    headGrad.addColorStop(0, '#c8b8a0')
    headGrad.addColorStop(0.5, '#b0a080')
    headGrad.addColorStop(1, '#8a7a60')
  }
  ctx.fillStyle = headGrad
  ctx.beginPath()
  ctx.ellipse(0, -88 + bob, 17, 19, 0, 0, Math.PI * 2)
  ctx.fill()

  // Sunken cheeks
  ctx.fillStyle = enraged ? 'rgba(60,10,0,0.3)' : 'rgba(80,60,40,0.2)'
  ctx.beginPath()
  ctx.ellipse(-9, -84 + bob, 5, 7, -0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(9, -84 + bob, 5, 7, 0.2, 0, Math.PI * 2)
  ctx.fill()

  // --- EYES ---
  // Eye sockets (deep, dark)
  ctx.fillStyle = enraged ? '#1a0400' : '#3a2a1a'
  ctx.beginPath()
  ctx.ellipse(-7, -91 + bob, 5, 4, -0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(7, -91 + bob, 5, 4, 0.1, 0, Math.PI * 2)
  ctx.fill()

  if (enraged) {
    // Blazing ember eyes
    ctx.shadowColor = '#ff4400'
    ctx.shadowBlur = 15
    ctx.fillStyle = '#ff6600'
    ctx.beginPath()
    ctx.ellipse(-7, -91 + bob, 3.5, 2.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(7, -91 + bob, 3.5, 2.5, 0, 0, Math.PI * 2)
    ctx.fill()
    // White-hot pupil
    ctx.fillStyle = '#ffcc00'
    ctx.beginPath()
    ctx.arc(-7, -91 + bob, 1.5, 0, Math.PI * 2)
    ctx.arc(7, -91 + bob, 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  } else {
    // Dim, soulless eyes
    ctx.fillStyle = '#8a6030'
    ctx.beginPath()
    ctx.ellipse(-7, -91 + bob, 3, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(7, -91 + bob, 3, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#1a0e08'
    ctx.beginPath()
    ctx.arc(-7, -91 + bob, 1.5, 0, Math.PI * 2)
    ctx.arc(7, -91 + bob, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // --- MOUTH ---
  ctx.lineWidth = 2
  if (attackAnim) {
    // Gaping maw
    ctx.fillStyle = enraged ? '#1a0200' : '#1a0e08'
    ctx.beginPath()
    ctx.ellipse(0, -80 + bob, 10, 7, 0, 0, Math.PI * 2)
    ctx.fill()
    // Jagged teeth
    ctx.fillStyle = enraged ? '#cc6600' : '#c8b890'
    for (let t = -7; t <= 7; t += 3.5) {
      ctx.beginPath()
      ctx.moveTo(t - 1.5, -84 + bob)
      ctx.lineTo(t, -80 + bob)
      ctx.lineTo(t + 1.5, -84 + bob)
      ctx.closePath()
      ctx.fill()
    }
    for (let t = -6; t <= 6; t += 3) {
      ctx.beginPath()
      ctx.moveTo(t - 1, -76 + bob)
      ctx.lineTo(t, -79 + bob)
      ctx.lineTo(t + 1, -76 + bob)
      ctx.closePath()
      ctx.fill()
    }
  } else {
    // Closed grimace with visible teeth
    ctx.strokeStyle = enraged ? '#cc3300' : '#3a2a1a'
    ctx.beginPath()
    ctx.moveTo(-8, -81 + bob)
    ctx.quadraticCurveTo(0, -77 + bob, 8, -81 + bob)
    ctx.stroke()
    // Teeth peeking
    ctx.fillStyle = enraged ? '#cc6600' : '#c8b890'
    for (let t = -5; t <= 5; t += 2.5) {
      ctx.beginPath()
      ctx.moveTo(t - 0.8, -81 + bob)
      ctx.lineTo(t, -79 + bob)
      ctx.lineTo(t + 0.8, -81 + bob)
      ctx.closePath()
      ctx.fill()
    }
  }

  // Nose (barely there, grotesque)
  ctx.fillStyle = enraged ? '#3a0e04' : '#a08868'
  ctx.beginPath()
  ctx.moveTo(-3, -88 + bob)
  ctx.lineTo(0, -83 + bob)
  ctx.lineTo(3, -88 + bob)
  ctx.closePath()
  ctx.fill()
  // Nostrils
  ctx.fillStyle = '#1a0e08'
  ctx.beginPath()
  ctx.arc(-2, -85 + bob, 1.2, 0, Math.PI * 2)
  ctx.arc(2, -85 + bob, 1.2, 0, Math.PI * 2)
  ctx.fill()

  // --- CROWN (bone/metal) ---
  const crownColor = enraged ? '#8a2200' : '#8b7355'
  const crownHighlight = enraged ? '#cc4400' : '#b8a070'
  ctx.fillStyle = crownColor
  // Base band
  ctx.beginPath()
  ctx.ellipse(0, -104 + bob, 16, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  // Spikes
  for (let i = -3; i <= 3; i++) {
    const spikeH = (i === 0) ? 16 : 10 + Math.abs(i) * -1
    ctx.fillStyle = crownColor
    ctx.beginPath()
    ctx.moveTo(i * 5 - 2.5, -106 + bob)
    ctx.lineTo(i * 5, -106 - spikeH + bob)
    ctx.lineTo(i * 5 + 2.5, -106 + bob)
    ctx.closePath()
    ctx.fill()
    // Spike highlight
    ctx.fillStyle = crownHighlight
    ctx.beginPath()
    ctx.moveTo(i * 5, -106 - spikeH + bob)
    ctx.lineTo(i * 5 + 1.5, -107 + bob)
    ctx.lineTo(i * 5 + 0.5, -107 + bob)
    ctx.closePath()
    ctx.fill()
  }

  // Enraged: cracks in skin glowing
  if (enraged) {
    ctx.strokeStyle = 'rgba(255, 80, 0, 0.4)'
    ctx.lineWidth = 1
    for (let i = 0; i < 8; i++) {
      const cx = -30 + i * 9
      const cy = -50 + bob + (i % 3) * 12
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + 4, cy + 8)
      ctx.lineTo(cx + 1, cy + 14)
      ctx.stroke()
    }
  }

  ctx.restore()
}

function drawBourbonBottle(ctx, x, y, enraged, time) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(0.25)

  // Large bottle (club-sized)
  // Body
  const bottleGrad = ctx.createLinearGradient(-10, -8, 10, -8)
  if (enraged) {
    bottleGrad.addColorStop(0, '#4a0800')
    bottleGrad.addColorStop(0.5, '#6a1000')
    bottleGrad.addColorStop(1, '#4a0800')
  } else {
    bottleGrad.addColorStop(0, '#2a1808')
    bottleGrad.addColorStop(0.3, '#4a2c1a')
    bottleGrad.addColorStop(0.7, '#3d2010')
    bottleGrad.addColorStop(1, '#2a1808')
  }
  ctx.fillStyle = bottleGrad
  ctx.beginPath()
  ctx.roundRect(-10, -8, 20, 38, 4)
  ctx.fill()

  // Bottle neck
  ctx.fillStyle = enraged ? '#5a0c00' : '#3d2010'
  ctx.beginPath()
  ctx.moveTo(-5, -8)
  ctx.lineTo(-4, -22)
  ctx.lineTo(4, -22)
  ctx.lineTo(5, -8)
  ctx.closePath()
  ctx.fill()

  // Cork
  ctx.fillStyle = enraged ? '#8a2200' : '#8b7355'
  ctx.fillRect(-5, -26, 10, 5)

  // Label
  ctx.fillStyle = enraged ? '#cc4400' : '#e8d0b0'
  ctx.fillRect(-8, 2, 16, 14)
  ctx.fillStyle = enraged ? '#1a0400' : '#4a2c1a'
  ctx.font = 'bold 6px serif'
  ctx.textAlign = 'center'
  ctx.fillText('KBT', 0, 10)
  ctx.font = '4px serif'
  ctx.fillText('RESERVE', 0, 14)

  // Glass reflection
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-6, -5)
  ctx.lineTo(-5, 25)
  ctx.stroke()

  // Liquid glow (enraged - bottle is on fire)
  if (enraged) {
    const flicker = 0.2 + 0.1 * Math.sin(time * 0.01)
    ctx.fillStyle = `rgba(255, 100, 0, ${flicker})`
    ctx.beginPath()
    ctx.roundRect(-8, 0, 16, 28, 3)
    ctx.fill()
  }

  ctx.restore()
}

function drawFireAura(ctx, time) {
  ctx.save()
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2 + time * 0.002
    const dist = 55 + Math.sin(time * 0.004 + i * 1.5) * 15
    const fx = Math.cos(angle) * dist
    const fy = Math.sin(angle) * dist * 0.55 - 45
    const size = 6 + Math.sin(time * 0.006 + i * 2.3) * 4

    const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, size)
    grad.addColorStop(0, 'rgba(255, 100, 0, 0.5)')
    grad.addColorStop(0.4, 'rgba(255, 40, 0, 0.25)')
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(fx, fy, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawSmoke(ctx, time) {
  ctx.save()
  ctx.globalAlpha = 0.15
  for (let i = 0; i < 6; i++) {
    const seed = i * 97.3
    const sx = Math.sin(seed + time * 0.001) * 30
    const sy = -60 - (time * 0.02 + seed) % 80
    const size = 10 + Math.sin(time * 0.003 + i) * 5
    ctx.fillStyle = 'rgba(40, 10, 0, 0.5)'
    ctx.beginPath()
    ctx.arc(sx, sy, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

export function drawEnrageShockwave(ctx, x, y, progress) {
  const radius = progress * 350
  const alpha = 1 - progress

  ctx.save()
  ctx.translate(x, y - 45)

  // Expanding ring
  ctx.strokeStyle = `rgba(255, 80, 0, ${alpha * 0.8})`
  ctx.lineWidth = 4 + progress * 10
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.stroke()

  // Fire ring
  ctx.strokeStyle = `rgba(255, 180, 0, ${alpha * 0.4})`
  ctx.lineWidth = 2 + progress * 4
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2)
  ctx.stroke()

  // Dark inner ring
  ctx.strokeStyle = `rgba(100, 20, 0, ${alpha * 0.3})`
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}
