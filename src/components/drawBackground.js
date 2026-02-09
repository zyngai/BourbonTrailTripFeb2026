// Woodford Reserve rickhouse interior - barrel aging warehouse
// Deep perspective rows of stacked barrels, heavy timber frame, dirt floor

let cachedBg = null
let cachedW = 0
let cachedH = 0

export function drawBackground(ctx, w, h) {
  if (cachedBg && cachedW === w && cachedH === h) {
    ctx.drawImage(cachedBg, 0, 0)
    return
  }

  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const c = off.getContext('2d')

  // Deep dark base
  c.fillStyle = '#0c0804'
  c.fillRect(0, 0, w, h)

  const floorY = h * 0.62

  // --- Back wall: aged limestone with staining ---
  drawAgedLimestone(c, w, floorY)

  // --- Heavy timber frame structure ---
  drawTimberFrame(c, w, h, floorY)

  // --- Barrel stacks (the main feature) ---
  // Left wall barrels - side view, stacked 3 high
  drawBarrelStack(c, 0, 20, w * 0.22, floorY - 25, 3, 4)
  // Right wall barrels - larger, closer
  drawBarrelStack(c, w * 0.72, 15, w * 0.28, floorY - 20, 3, 3)
  // Center-back smaller rack (depth illusion)
  drawBarrelStack(c, w * 0.32, 40, w * 0.28, floorY * 0.55, 2, 3)

  // --- Worn dirt/concrete floor ---
  drawDistilleryFloor(c, w, h, floorY)

  // --- Overhead industrial pendant lights ---
  drawPendantLight(c, w * 0.3, 8, 0.9)
  drawPendantLight(c, w * 0.65, 5, 1.0)

  // --- Warm amber lighting from pendants ---
  const light1 = c.createRadialGradient(w * 0.3, 30, 5, w * 0.3, 30, h * 0.75)
  light1.addColorStop(0, 'rgba(255, 180, 60, 0.18)')
  light1.addColorStop(0.2, 'rgba(220, 150, 40, 0.10)')
  light1.addColorStop(0.5, 'rgba(180, 100, 20, 0.04)')
  light1.addColorStop(1, 'transparent')
  c.fillStyle = light1
  c.fillRect(0, 0, w, h)

  const light2 = c.createRadialGradient(w * 0.65, 25, 5, w * 0.65, 25, h * 0.7)
  light2.addColorStop(0, 'rgba(255, 190, 70, 0.15)')
  light2.addColorStop(0.2, 'rgba(220, 150, 40, 0.08)')
  light2.addColorStop(0.5, 'rgba(180, 100, 20, 0.03)')
  light2.addColorStop(1, 'transparent')
  c.fillStyle = light2
  c.fillRect(0, 0, w, h)

  // Light cone on floor
  const floorSpot = c.createRadialGradient(w * 0.45, floorY + 15, 0, w * 0.45, floorY + 15, w * 0.25)
  floorSpot.addColorStop(0, 'rgba(200, 150, 70, 0.08)')
  floorSpot.addColorStop(1, 'transparent')
  c.fillStyle = floorSpot
  c.fillRect(0, floorY, w, h - floorY)

  // --- Heavy vignette (dark warehouse edges) ---
  const vigL = c.createLinearGradient(0, 0, w * 0.15, 0)
  vigL.addColorStop(0, 'rgba(0,0,0,0.7)')
  vigL.addColorStop(1, 'transparent')
  c.fillStyle = vigL
  c.fillRect(0, 0, w * 0.2, h)

  const vigR = c.createLinearGradient(w, 0, w * 0.85, 0)
  vigR.addColorStop(0, 'rgba(0,0,0,0.7)')
  vigR.addColorStop(1, 'transparent')
  c.fillStyle = vigR
  c.fillRect(w * 0.8, 0, w * 0.2, h)

  const vigT = c.createLinearGradient(0, 0, 0, 50)
  vigT.addColorStop(0, 'rgba(0,0,0,0.6)')
  vigT.addColorStop(1, 'transparent')
  c.fillStyle = vigT
  c.fillRect(0, 0, w, 50)

  const vigB = c.createLinearGradient(0, h, 0, h - 40)
  vigB.addColorStop(0, 'rgba(0,0,0,0.4)')
  vigB.addColorStop(1, 'transparent')
  c.fillStyle = vigB
  c.fillRect(0, h - 40, w, 40)

  // Haze / atmosphere overlay
  c.fillStyle = 'rgba(30, 18, 8, 0.15)'
  c.fillRect(0, 0, w, h)

  cachedBg = off
  cachedW = w
  cachedH = h
  ctx.drawImage(off, 0, 0)
}

function drawAgedLimestone(c, w, wallH) {
  // Darker, more weathered limestone with staining
  const blockH = 18
  const blockW = 48
  for (let y = 0; y < wallH; y += blockH) {
    const rowOffset = (Math.floor(y / blockH) % 2) * (blockW * 0.5)
    for (let x = -rowOffset; x < w + blockW; x += blockW) {
      const bw = blockW - 1.5
      const bh = blockH - 1.5
      // Darker, more varied - aged limestone
      const base = 28 + Math.random() * 18
      const stain = Math.random() < 0.2 ? -8 : 0 // water staining
      const r = base + 5 + stain + Math.random() * 4
      const g = base + 2 + stain + Math.random() * 3
      const b = base - 3 + stain
      c.fillStyle = `rgb(${r}, ${g}, ${b})`
      c.fillRect(x + 0.75, y + 0.75, bw, bh)

      // Deep mortar
      c.strokeStyle = 'rgba(8, 5, 2, 0.6)'
      c.lineWidth = 1.5
      c.strokeRect(x + 0.75, y + 0.75, bw, bh)

      // Weathering texture
      if (Math.random() < 0.3) {
        c.fillStyle = `rgba(${base - 5}, ${base - 8}, ${base - 12}, 0.2)`
        c.fillRect(x + 2 + Math.random() * 10, y + 2, Math.random() * 20 + 5, Math.random() * 8 + 2)
      }
    }
  }

  // Moisture staining drips from top
  for (let i = 0; i < 8; i++) {
    const dx = Math.random() * w
    const dh = 30 + Math.random() * 80
    c.fillStyle = `rgba(15, 10, 5, ${0.05 + Math.random() * 0.08})`
    c.fillRect(dx, 0, 3 + Math.random() * 4, dh)
  }
}

function drawTimberFrame(c, w, h, floorY) {
  const beamColor = '#1a0e06'
  const beamHighlight = '#2a1a0e'

  // Main vertical posts
  const posts = [w * 0.22, w * 0.48, w * 0.72]
  for (const px of posts) {
    // Post body
    c.fillStyle = beamColor
    c.fillRect(px - 8, 0, 16, floorY + 5)
    // Right highlight edge
    c.fillStyle = beamHighlight
    c.fillRect(px + 4, 0, 4, floorY + 5)
    // Grain lines
    c.strokeStyle = 'rgba(50, 30, 15, 0.2)'
    c.lineWidth = 0.5
    for (let g = 0; g < 4; g++) {
      const gx = px - 5 + g * 4
      c.beginPath()
      c.moveTo(gx, 0)
      c.lineTo(gx + (Math.random() - 0.5) * 2, floorY)
      c.stroke()
    }
  }

  // Horizontal cross beams
  c.fillStyle = beamColor
  c.fillRect(0, 0, w, 14)
  c.fillStyle = beamHighlight
  c.fillRect(0, 10, w, 4)

  // Mid-height beam
  const midY = floorY * 0.38
  c.fillStyle = beamColor
  c.fillRect(0, midY, w, 10)
  c.fillStyle = beamHighlight
  c.fillRect(0, midY + 7, w, 3)

  // Diagonal braces (subtle)
  c.strokeStyle = 'rgba(26, 14, 6, 0.5)'
  c.lineWidth = 6
  c.beginPath()
  c.moveTo(posts[0], 14)
  c.lineTo(posts[0] + 40, midY)
  c.stroke()
  c.beginPath()
  c.moveTo(posts[2], 14)
  c.lineTo(posts[2] - 40, midY)
  c.stroke()
}

function drawBarrelStack(c, startX, startY, rackW, rackH, rows, cols) {
  const barrelW = rackW / cols
  const barrelH = rackH / rows

  // Dark rack frame behind barrels
  c.fillStyle = '#0a0604'
  c.fillRect(startX, startY, rackW, rackH)

  // Horizontal rack rails
  c.fillStyle = '#1a0e06'
  for (let j = 0; j <= rows; j++) {
    c.fillRect(startX, startY + j * barrelH - 3, rackW, 6)
  }

  const barrelShades = ['#2a1808', '#33200e', '#261505', '#301c0a', '#221004']
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bx = startX + col * barrelW + barrelW * 0.5
      const by = startY + row * barrelH + barrelH * 0.5
      const rw = barrelW * 0.44
      const rh = barrelH * 0.4
      const shade = barrelShades[(row * cols + col) % barrelShades.length]

      // Barrel side - oval (side view)
      const barrelGrad = c.createRadialGradient(bx, by, 0, bx, by, rw)
      barrelGrad.addColorStop(0, shade)
      barrelGrad.addColorStop(0.6, shade)
      barrelGrad.addColorStop(1, '#0a0604')
      c.fillStyle = barrelGrad
      c.beginPath()
      c.ellipse(bx, by, rw, rh, 0, 0, Math.PI * 2)
      c.fill()

      // Metal bands (hoops)
      c.strokeStyle = '#3d3020'
      c.lineWidth = 1.2
      for (const bandOff of [-rw * 0.6, -rw * 0.2, rw * 0.2, rw * 0.6]) {
        c.beginPath()
        c.moveTo(bx + bandOff, by - rh)
        c.lineTo(bx + bandOff, by + rh)
        c.stroke()
      }

      // Highlight edge (light reflection)
      c.strokeStyle = 'rgba(100, 70, 35, 0.15)'
      c.lineWidth = 1
      c.beginPath()
      c.ellipse(bx - 2, by - 2, rw * 0.85, rh * 0.85, 0, -0.8, 0.8)
      c.stroke()

      // Bung (stopper) on some barrels
      if ((row + col) % 3 === 0) {
        c.fillStyle = '#1a0e06'
        c.beginPath()
        c.arc(bx, by, 2.5, 0, Math.PI * 2)
        c.fill()
      }
    }
  }
}

function drawDistilleryFloor(c, w, h, floorY) {
  // Worn concrete/dirt floor
  const floorGrad = c.createLinearGradient(0, floorY, 0, h)
  floorGrad.addColorStop(0, '#2a2018')
  floorGrad.addColorStop(0.15, '#221810')
  floorGrad.addColorStop(1, '#14100a')
  c.fillStyle = floorGrad
  c.fillRect(0, floorY, w, h - floorY)

  // Concrete texture - random speckles
  for (let i = 0; i < 200; i++) {
    const fx = Math.random() * w
    const fy = floorY + Math.random() * (h - floorY)
    const shade = 20 + Math.random() * 25
    c.fillStyle = `rgba(${shade + 5}, ${shade}, ${shade - 5}, ${0.1 + Math.random() * 0.15})`
    c.beginPath()
    c.arc(fx, fy, 0.5 + Math.random() * 2, 0, Math.PI * 2)
    c.fill()
  }

  // Subtle drainage grooves
  c.strokeStyle = 'rgba(10, 6, 2, 0.3)'
  c.lineWidth = 1
  for (let fy = floorY + 20; fy < h; fy += 35) {
    c.beginPath()
    c.moveTo(0, fy)
    c.lineTo(w, fy + (Math.random() - 0.5) * 3)
    c.stroke()
  }

  // Bourbon stain puddle (center)
  const stainGrad = c.createRadialGradient(w * 0.45, floorY + 30, 0, w * 0.45, floorY + 30, 60)
  stainGrad.addColorStop(0, 'rgba(60, 30, 10, 0.12)')
  stainGrad.addColorStop(0.5, 'rgba(40, 20, 5, 0.06)')
  stainGrad.addColorStop(1, 'transparent')
  c.fillStyle = stainGrad
  c.beginPath()
  c.ellipse(w * 0.45, floorY + 30, 65, 20, 0, 0, Math.PI * 2)
  c.fill()
}

function drawPendantLight(c, x, topY, brightness) {
  // Chain
  c.strokeStyle = '#2a2018'
  c.lineWidth = 2
  c.beginPath()
  c.moveTo(x, topY)
  c.lineTo(x, topY + 20)
  c.stroke()

  // Fixture (metal shade)
  c.fillStyle = '#1a1208'
  c.beginPath()
  c.moveTo(x - 14, topY + 20)
  c.lineTo(x - 8, topY + 28)
  c.lineTo(x + 8, topY + 28)
  c.lineTo(x + 14, topY + 20)
  c.closePath()
  c.fill()

  // Bulb glow
  const glow = c.createRadialGradient(x, topY + 26, 0, x, topY + 26, 12)
  glow.addColorStop(0, `rgba(255, 200, 80, ${0.8 * brightness})`)
  glow.addColorStop(0.3, `rgba(255, 170, 40, ${0.4 * brightness})`)
  glow.addColorStop(1, 'transparent')
  c.fillStyle = glow
  c.beginPath()
  c.arc(x, topY + 26, 12, 0, Math.PI * 2)
  c.fill()
}

// Atmospheric dust particles floating in light beams
export function drawDustMotes(ctx, w, h, time) {
  ctx.save()
  for (let i = 0; i < 25; i++) {
    const seed = i * 137.5
    const speed = 0.3 + (i % 5) * 0.06
    const x = ((seed + time * 0.006 * speed) % (w + 40)) - 20
    const drift = Math.sin(time * 0.001 + seed) * 15
    const y = ((seed * 2.3 + time * 0.004 * (0.2 + (i % 3) * 0.1)) % (h + 40)) - 20 + drift
    // Brighter when near light positions
    const distToLight1 = Math.abs(x - w * 0.3) / w + Math.abs(y - 30) / h
    const distToLight2 = Math.abs(x - w * 0.65) / w + Math.abs(y - 25) / h
    const lightProximity = Math.max(0, 1 - Math.min(distToLight1, distToLight2) * 2.5)
    const alpha = (0.05 + lightProximity * 0.2) * (0.7 + 0.3 * Math.sin(time * 0.002 + i))
    const size = 0.8 + Math.sin(seed) * 0.5 + lightProximity * 0.8
    ctx.fillStyle = `rgba(240, 210, 150, ${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}
