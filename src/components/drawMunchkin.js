// Draw player characters - semi-realistic proportioned figures with canvas primitives
// Characters are ~45px wide, ~75px tall, drawn at (x, y) as center-bottom

export function drawMunchkin(ctx, x, y, charClass, time, attacking) {
  ctx.save()
  ctx.translate(x, y)

  // Subtle breathing
  const breathe = Math.sin(time * 0.003) * 1.5

  // Attack lunge
  let lungeX = 0
  if (attacking) {
    lungeX = charClass === 'wizard' || charClass === 'cleric' ? 0 : 18
  }
  ctx.translate(lungeX, 0)

  switch (charClass) {
    case 'wizard': drawWizard(ctx, breathe, time, attacking); break
    case 'thief': drawThief(ctx, breathe, time, attacking); break
    case 'warrior': drawWarrior(ctx, breathe, time, attacking); break
    case 'cleric': drawCleric(ctx, breathe, time, attacking); break
  }

  ctx.restore()
}

// --- SHARED HELPERS ---

function drawHead(ctx, y, skinTone, hasFacialHair) {
  // Neck
  ctx.fillStyle = skinTone
  ctx.fillRect(-3, -42 + y, 6, 6)

  // Head shape (slightly oval)
  ctx.fillStyle = skinTone
  ctx.beginPath()
  ctx.ellipse(0, -52 + y, 10, 12, 0, 0, Math.PI * 2)
  ctx.fill()

  // Jaw definition
  ctx.fillStyle = skinTone
  ctx.beginPath()
  ctx.moveTo(-8, -48 + y)
  ctx.quadraticCurveTo(-7, -40 + y, 0, -38 + y)
  ctx.quadraticCurveTo(7, -40 + y, 8, -48 + y)
  ctx.fill()

  if (hasFacialHair) {
    ctx.fillStyle = 'rgba(40, 25, 15, 0.4)'
    ctx.beginPath()
    ctx.moveTo(-6, -46 + y)
    ctx.quadraticCurveTo(-5, -38 + y, 0, -36 + y)
    ctx.quadraticCurveTo(5, -38 + y, 6, -46 + y)
    ctx.fill()
  }
}

function drawEyes(ctx, y, expression) {
  if (expression === 'fierce') {
    // Angled brows, sharp eyes
    ctx.fillStyle = '#1a0e08'
    ctx.beginPath()
    ctx.ellipse(-4, -53 + y, 2, 1.5, -0.15, 0, Math.PI * 2)
    ctx.ellipse(4, -53 + y, 2, 1.5, 0.15, 0, Math.PI * 2)
    ctx.fill()
    // Angry brows
    ctx.strokeStyle = '#1a0e08'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(-7, -57 + y)
    ctx.lineTo(-2, -56 + y)
    ctx.moveTo(7, -57 + y)
    ctx.lineTo(2, -56 + y)
    ctx.stroke()
  } else if (expression === 'narrow') {
    // Sly, narrowed
    ctx.fillStyle = '#1a0e08'
    ctx.fillRect(-6, -54 + y, 5, 1.8)
    ctx.fillRect(1, -54 + y, 5, 1.8)
  } else if (expression === 'calm') {
    ctx.fillStyle = '#1a0e08'
    ctx.beginPath()
    ctx.arc(-4, -53 + y, 1.8, 0, Math.PI * 2)
    ctx.arc(4, -53 + y, 1.8, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // Default
    ctx.fillStyle = '#1a0e08'
    ctx.beginPath()
    ctx.arc(-4, -53 + y, 1.8, 0, Math.PI * 2)
    ctx.arc(4, -53 + y, 1.8, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawBoots(ctx, y, color) {
  ctx.fillStyle = color
  // Left boot
  ctx.beginPath()
  ctx.moveTo(-10, -3 + y)
  ctx.lineTo(-12, 0)
  ctx.lineTo(-1, 0)
  ctx.lineTo(-2, -3 + y)
  ctx.closePath()
  ctx.fill()
  // Right boot
  ctx.beginPath()
  ctx.moveTo(2, -3 + y)
  ctx.lineTo(1, 0)
  ctx.lineTo(12, 0)
  ctx.lineTo(10, -3 + y)
  ctx.closePath()
  ctx.fill()
  // Sole
  ctx.fillStyle = '#0a0604'
  ctx.fillRect(-12, -1, 11, 2)
  ctx.fillRect(1, -1, 11, 2)
}

// --- WIZARD (Alex) ---
function drawWizard(ctx, breathe, time, attacking) {
  const y = breathe

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, 2, 16, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  drawBoots(ctx, y, '#2a1a3d')

  // Legs
  ctx.fillStyle = '#3a1f5c'
  ctx.fillRect(-8, -15 + y, 7, 13)
  ctx.fillRect(1, -15 + y, 7, 13)

  // Long robe body with flare
  ctx.fillStyle = '#4a1b7a'
  ctx.beginPath()
  ctx.moveTo(-14, -15 + y)
  ctx.lineTo(-12, -38 + y)
  ctx.quadraticCurveTo(0, -42 + y, 12, -38 + y)
  ctx.lineTo(14, -15 + y)
  ctx.closePath()
  ctx.fill()

  // Robe inner detail
  ctx.strokeStyle = '#7b4daa'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, -40 + y)
  ctx.lineTo(0, -15 + y)
  ctx.stroke()
  ctx.moveTo(-12, -15 + y)
  ctx.lineTo(12, -15 + y)
  ctx.stroke()

  // Collar
  ctx.fillStyle = '#6a2db8'
  ctx.beginPath()
  ctx.moveTo(-10, -38 + y)
  ctx.quadraticCurveTo(0, -34 + y, 10, -38 + y)
  ctx.lineTo(8, -42 + y)
  ctx.quadraticCurveTo(0, -40 + y, -8, -42 + y)
  ctx.closePath()
  ctx.fill()

  drawHead(ctx, y, '#d4a880', false)
  drawEyes(ctx, y, 'calm')

  // Hair (short dark)
  ctx.fillStyle = '#1a0e08'
  ctx.beginPath()
  ctx.arc(0, -56 + y, 10, Math.PI + 0.3, -0.3)
  ctx.fill()

  // Tall pointed hat with bend
  ctx.fillStyle = '#2d1054'
  ctx.beginPath()
  ctx.moveTo(-12, -60 + y)
  ctx.quadraticCurveTo(-5, -78 + y, 5, -90 + y)
  ctx.quadraticCurveTo(8, -85 + y, 6, -80 + y)
  ctx.quadraticCurveTo(2, -70 + y, 12, -60 + y)
  ctx.closePath()
  ctx.fill()

  // Hat brim
  ctx.fillStyle = '#3a1868'
  ctx.beginPath()
  ctx.ellipse(0, -60 + y, 16, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Hat band with rune
  ctx.strokeStyle = '#9c6dcc'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(0, -62 + y, 12, 3.5, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Staff
  const staffAngle = attacking ? -0.5 : 0.08
  ctx.save()
  ctx.translate(16, -28 + y)
  ctx.rotate(staffAngle)
  // Wood shaft with knots
  ctx.fillStyle = '#3d2415'
  ctx.fillRect(-2.5, -40, 5, 48)
  ctx.fillStyle = '#2a1a0e'
  ctx.beginPath()
  ctx.arc(-0.5, -20, 3, 0, Math.PI * 2)
  ctx.fill()
  // Crystal orb
  const pulse = 5 + Math.sin(time * 0.005) * 2
  ctx.fillStyle = `rgba(160, 80, 220, 0.25)`
  ctx.beginPath()
  ctx.arc(0, -44, pulse + 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = `rgba(180, 100, 240, 0.6)`
  ctx.beginPath()
  ctx.arc(0, -44, pulse, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(220, 180, 255, 0.7)'
  ctx.beginPath()
  ctx.arc(-1.5, -46, pulse * 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// --- THIEF (Cece) ---
function drawThief(ctx, breathe, time, attacking) {
  const y = breathe

  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, 2, 14, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  drawBoots(ctx, y, '#1a1a12')

  // Legs (fitted)
  ctx.fillStyle = '#2a2a1a'
  ctx.fillRect(-7, -16 + y, 6, 14)
  ctx.fillRect(1, -16 + y, 6, 14)

  // Lean body - leather armor
  ctx.fillStyle = '#2e3320'
  ctx.beginPath()
  ctx.moveTo(-11, -16 + y)
  ctx.lineTo(-10, -38 + y)
  ctx.quadraticCurveTo(0, -41 + y, 10, -38 + y)
  ctx.lineTo(11, -16 + y)
  ctx.closePath()
  ctx.fill()

  // Leather armor details
  ctx.strokeStyle = '#4a4a30'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(-8, -34 + y)
  ctx.lineTo(8, -34 + y)
  ctx.moveTo(-9, -28 + y)
  ctx.lineTo(9, -28 + y)
  ctx.stroke()

  // Belt with pouches
  ctx.fillStyle = '#3d2a15'
  ctx.fillRect(-10, -20 + y, 20, 4)
  ctx.fillStyle = '#4a3520'
  ctx.fillRect(-9, -24 + y, 5, 7)
  ctx.fillRect(5, -24 + y, 4, 6)
  // Buckle
  ctx.fillStyle = '#8b7355'
  ctx.fillRect(-2, -21 + y, 4, 4)

  // Cape (flowing behind)
  ctx.fillStyle = '#1a2810'
  ctx.beginPath()
  ctx.moveTo(-8, -38 + y)
  ctx.quadraticCurveTo(-20, -20 + y, -16, -5 + y)
  ctx.lineTo(-14, -5 + y)
  ctx.quadraticCurveTo(-17, -22 + y, -6, -36 + y)
  ctx.closePath()
  ctx.fill()

  drawHead(ctx, y, '#c48e6a', false)
  drawEyes(ctx, y, 'narrow')

  // Hair (pulled back, dark)
  ctx.fillStyle = '#1a0a05'
  ctx.beginPath()
  ctx.ellipse(0, -57 + y, 10, 8, 0, Math.PI + 0.5, -0.5)
  ctx.fill()
  // Ponytail
  ctx.fillStyle = '#1a0a05'
  ctx.beginPath()
  ctx.moveTo(3, -58 + y)
  ctx.quadraticCurveTo(10, -55 + y, 8, -45 + y)
  ctx.lineTo(5, -45 + y)
  ctx.quadraticCurveTo(7, -53 + y, 1, -56 + y)
  ctx.closePath()
  ctx.fill()

  // Hood (down around shoulders)
  ctx.fillStyle = '#1a2810'
  ctx.beginPath()
  ctx.moveTo(-12, -40 + y)
  ctx.quadraticCurveTo(-14, -45 + y, -8, -48 + y)
  ctx.quadraticCurveTo(0, -46 + y, 8, -48 + y)
  ctx.quadraticCurveTo(14, -45 + y, 12, -40 + y)
  ctx.closePath()
  ctx.fill()

  // Dual daggers
  const dagAngle1 = attacking ? -1.3 : -0.2
  const dagAngle2 = attacking ? 1.0 : 0.3
  // Right dagger
  ctx.save()
  ctx.translate(14, -25 + y)
  ctx.rotate(dagAngle1)
  drawDagger(ctx)
  ctx.restore()
  // Left dagger (off-hand)
  ctx.save()
  ctx.translate(-14, -25 + y)
  ctx.scale(-1, 1)
  ctx.rotate(dagAngle2)
  drawDagger(ctx)
  ctx.restore()
}

function drawDagger(ctx) {
  // Wrapped handle
  ctx.fillStyle = '#3d2415'
  ctx.fillRect(-2, 0, 4, 10)
  ctx.strokeStyle = '#5d4037'
  ctx.lineWidth = 0.8
  for (let i = 1; i < 9; i += 2) {
    ctx.beginPath()
    ctx.moveTo(-2, i)
    ctx.lineTo(2, i + 1)
    ctx.stroke()
  }
  // Cross guard
  ctx.fillStyle = '#6b5540'
  ctx.fillRect(-4, -2, 8, 3)
  // Blade
  const bladeGrad = ctx.createLinearGradient(-2.5, -2, 2.5, -2)
  bladeGrad.addColorStop(0, '#8a8a8a')
  bladeGrad.addColorStop(0.5, '#d0d0d0')
  bladeGrad.addColorStop(1, '#8a8a8a')
  ctx.fillStyle = bladeGrad
  ctx.beginPath()
  ctx.moveTo(-2.5, -2)
  ctx.lineTo(0, -22)
  ctx.lineTo(2.5, -2)
  ctx.closePath()
  ctx.fill()
  // Edge highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(0, -21)
  ctx.lineTo(2, -3)
  ctx.stroke()
}

// --- WARRIOR (Henrik) ---
function drawWarrior(ctx, breathe, time, attacking) {
  const y = breathe

  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.beginPath()
  ctx.ellipse(0, 2, 18, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  drawBoots(ctx, y, '#2a1808')

  // Legs (armored greaves)
  ctx.fillStyle = '#4a4a4a'
  ctx.fillRect(-9, -16 + y, 8, 14)
  ctx.fillRect(1, -16 + y, 8, 14)
  // Knee guards
  ctx.fillStyle = '#5a5a5a'
  ctx.beginPath()
  ctx.arc(-5, -16 + y, 5, 0, Math.PI * 2)
  ctx.arc(5, -16 + y, 5, 0, Math.PI * 2)
  ctx.fill()

  // Broad torso - plate armor
  const armorGrad = ctx.createLinearGradient(-14, -40, 14, -20)
  armorGrad.addColorStop(0, '#5a1015')
  armorGrad.addColorStop(0.4, '#7a1520')
  armorGrad.addColorStop(0.6, '#8a1a28')
  armorGrad.addColorStop(1, '#5a1015')
  ctx.fillStyle = armorGrad
  ctx.beginPath()
  ctx.moveTo(-14, -16 + y)
  ctx.lineTo(-13, -38 + y)
  ctx.lineTo(-8, -42 + y)
  ctx.quadraticCurveTo(0, -44 + y, 8, -42 + y)
  ctx.lineTo(13, -38 + y)
  ctx.lineTo(14, -16 + y)
  ctx.closePath()
  ctx.fill()

  // Chest plate center ridge
  ctx.strokeStyle = '#9a2030'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, -42 + y)
  ctx.lineTo(0, -18 + y)
  ctx.stroke()

  // Pauldrons (shoulder armor)
  ctx.fillStyle = '#5a5a5a'
  ctx.beginPath()
  ctx.ellipse(-14, -38 + y, 8, 6, -0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(14, -38 + y, 8, 6, 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#707070'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(-14, -38 + y, 6, 4, -0.3, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(14, -38 + y, 6, 4, 0.3, 0, Math.PI * 2)
  ctx.stroke()

  // Belt
  ctx.fillStyle = '#3d2a15'
  ctx.fillRect(-13, -19 + y, 26, 4)
  ctx.fillStyle = '#8b7355'
  ctx.fillRect(-2, -20 + y, 4, 5)

  drawHead(ctx, y, '#d4a880', true)
  drawEyes(ctx, y, 'fierce')

  // Helm - Viking-style with nose guard
  ctx.fillStyle = '#505050'
  ctx.beginPath()
  ctx.arc(0, -56 + y, 12, Math.PI + 0.2, -0.2)
  ctx.fill()
  // Helm ridge
  ctx.fillStyle = '#606060'
  ctx.fillRect(-1.5, -68 + y, 3, 16)
  // Nose guard
  ctx.fillStyle = '#484848'
  ctx.fillRect(-2, -60 + y, 4, 12)
  // Helm rim
  ctx.strokeStyle = '#686868'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, -56 + y, 12, Math.PI + 0.1, -0.1)
  ctx.stroke()

  // Horns
  ctx.fillStyle = '#8b7355'
  ctx.beginPath()
  ctx.moveTo(-11, -60 + y)
  ctx.quadraticCurveTo(-20, -72 + y, -14, -74 + y)
  ctx.quadraticCurveTo(-12, -68 + y, -10, -60 + y)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(11, -60 + y)
  ctx.quadraticCurveTo(20, -72 + y, 14, -74 + y)
  ctx.quadraticCurveTo(12, -68 + y, 10, -60 + y)
  ctx.fill()

  // Shield (left hand) - kite shield
  ctx.save()
  ctx.translate(-18, -28 + y)
  const shieldGrad = ctx.createLinearGradient(-10, -12, 10, 12)
  shieldGrad.addColorStop(0, '#5a5a5a')
  shieldGrad.addColorStop(0.5, '#707070')
  shieldGrad.addColorStop(1, '#4a4a4a')
  ctx.fillStyle = shieldGrad
  ctx.beginPath()
  ctx.moveTo(0, -14)
  ctx.lineTo(-10, -6)
  ctx.lineTo(-8, 12)
  ctx.lineTo(0, 16)
  ctx.lineTo(8, 12)
  ctx.lineTo(10, -6)
  ctx.closePath()
  ctx.fill()
  // Shield emblem
  ctx.fillStyle = '#7a1520'
  ctx.beginPath()
  ctx.arc(0, 2, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#404040'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, -14)
  ctx.lineTo(0, 16)
  ctx.moveTo(-10, -6)
  ctx.lineTo(10, -6)
  ctx.stroke()
  ctx.restore()

  // Sword (right hand) - broadsword
  const swordAngle = attacking ? -1.6 : -0.15
  ctx.save()
  ctx.translate(18, -28 + y)
  ctx.rotate(swordAngle)
  // Pommel
  ctx.fillStyle = '#8b7355'
  ctx.beginPath()
  ctx.arc(0, 14, 3, 0, Math.PI * 2)
  ctx.fill()
  // Grip
  ctx.fillStyle = '#3d2415'
  ctx.fillRect(-2.5, 2, 5, 12)
  // Leather wrap
  ctx.strokeStyle = '#5d4037'
  ctx.lineWidth = 1
  for (let i = 3; i < 13; i += 2.5) {
    ctx.beginPath()
    ctx.moveTo(-2.5, i)
    ctx.lineTo(2.5, i + 1.5)
    ctx.stroke()
  }
  // Cross guard
  ctx.fillStyle = '#8b7355'
  ctx.fillRect(-7, 0, 14, 3)
  // Blade
  const bladeGrad = ctx.createLinearGradient(-3, 0, 3, 0)
  bladeGrad.addColorStop(0, '#8a8a8a')
  bladeGrad.addColorStop(0.3, '#c0c0c0')
  bladeGrad.addColorStop(0.5, '#e0e0e0')
  bladeGrad.addColorStop(0.7, '#c0c0c0')
  bladeGrad.addColorStop(1, '#8a8a8a')
  ctx.fillStyle = bladeGrad
  ctx.beginPath()
  ctx.moveTo(-3.5, 0)
  ctx.lineTo(-2, -32)
  ctx.lineTo(0, -35)
  ctx.lineTo(2, -32)
  ctx.lineTo(3.5, 0)
  ctx.closePath()
  ctx.fill()
  // Blood groove (fuller)
  ctx.strokeStyle = 'rgba(100,100,100,0.4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, -2)
  ctx.lineTo(0, -30)
  ctx.stroke()
  ctx.restore()
}

// --- CLERIC (Z) ---
function drawCleric(ctx, breathe, time, attacking) {
  const y = breathe

  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, 2, 15, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  drawBoots(ctx, y, '#5a4a30')

  // Legs
  ctx.fillStyle = '#8a7a5a'
  ctx.fillRect(-7, -15 + y, 6, 13)
  ctx.fillRect(1, -15 + y, 6, 13)

  // Vestment robe - layered
  ctx.fillStyle = '#c8c0a8'
  ctx.beginPath()
  ctx.moveTo(-13, -15 + y)
  ctx.lineTo(-11, -38 + y)
  ctx.quadraticCurveTo(0, -42 + y, 11, -38 + y)
  ctx.lineTo(13, -15 + y)
  ctx.closePath()
  ctx.fill()

  // Over-robe / stole
  ctx.fillStyle = '#ddd8c4'
  ctx.beginPath()
  ctx.moveTo(-5, -40 + y)
  ctx.lineTo(-7, -15 + y)
  ctx.lineTo(7, -15 + y)
  ctx.lineTo(5, -40 + y)
  ctx.closePath()
  ctx.fill()

  // Gold cross on chest
  ctx.fillStyle = '#c8a832'
  ctx.fillRect(-1.5, -36 + y, 3, 14)
  ctx.fillRect(-5, -33 + y, 10, 3)

  // Sash
  ctx.fillStyle = '#b8a030'
  ctx.fillRect(-12, -22 + y, 24, 3)

  // Shoulder mantle
  ctx.fillStyle = '#b8b098'
  ctx.beginPath()
  ctx.moveTo(-14, -38 + y)
  ctx.quadraticCurveTo(-16, -32 + y, -14, -28 + y)
  ctx.lineTo(-10, -36 + y)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(14, -38 + y)
  ctx.quadraticCurveTo(16, -32 + y, 14, -28 + y)
  ctx.lineTo(10, -36 + y)
  ctx.closePath()
  ctx.fill()

  drawHead(ctx, y, '#8b6844', false)
  drawEyes(ctx, y, 'calm')

  // Short hair
  ctx.fillStyle = '#0a0604'
  ctx.beginPath()
  ctx.arc(0, -56 + y, 10, Math.PI + 0.4, -0.4)
  ctx.fill()

  // Halo - golden, more substantial
  const haloGlow = 0.6 + 0.15 * Math.sin(time * 0.004)
  ctx.save()
  ctx.translate(0, -68 + y)
  // Outer halo glow
  ctx.strokeStyle = `rgba(255, 215, 0, ${haloGlow * 0.3})`
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2)
  ctx.stroke()
  // Main halo
  ctx.strokeStyle = `rgba(255, 215, 0, ${haloGlow})`
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.ellipse(0, 0, 14, 4.5, 0, 0, Math.PI * 2)
  ctx.stroke()
  // Highlight
  ctx.strokeStyle = `rgba(255, 250, 200, ${haloGlow * 0.6})`
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(0, -0.5, 12, 3.5, 0, -0.5, Math.PI + 0.5)
  ctx.stroke()
  ctx.restore()

  // Golden crosier (bishop's staff)
  const staffAngle = attacking ? -0.45 : 0.06
  ctx.save()
  ctx.translate(16, -26 + y)
  ctx.rotate(staffAngle)
  // Shaft
  const shaftGrad = ctx.createLinearGradient(-2, -40, 2, -40)
  shaftGrad.addColorStop(0, '#8b7530')
  shaftGrad.addColorStop(0.5, '#c8a832')
  shaftGrad.addColorStop(1, '#8b7530')
  ctx.fillStyle = shaftGrad
  ctx.fillRect(-2.5, -40, 5, 48)
  // Crook (curved top)
  ctx.strokeStyle = '#c8a832'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(4, -44, 8, Math.PI * 0.5, Math.PI * 1.8)
  ctx.stroke()
  // Orb at crook tip
  const orbPulse = 0.5 + 0.2 * Math.sin(time * 0.006)
  ctx.fillStyle = `rgba(255, 230, 130, ${orbPulse})`
  ctx.beginPath()
  ctx.arc(4, -52, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = `rgba(255, 255, 220, ${orbPulse * 0.7})`
  ctx.beginPath()
  ctx.arc(3, -53, 1.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}
