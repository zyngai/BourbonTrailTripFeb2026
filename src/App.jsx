import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import BossFight from './components/BossFight.jsx'

// ===== PARTICLE BACKGROUND =====
function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const emojis = ['🥃', '🥃', '🍂', '✨', '🌟', '🍁']

    class Particle {
      constructor() {
        this.reset()
        this.y = Math.random() * canvas.height
      }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = -20
        this.size = Math.random() * 16 + 8
        this.speed = Math.random() * 0.4 + 0.15
        this.opacity = Math.random() * 0.4 + 0.1
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = Math.random() * 0.02 + 0.005
        this.emoji = emojis[Math.floor(Math.random() * emojis.length)]
        this.rotation = Math.random() * Math.PI * 2
        this.rotSpeed = (Math.random() - 0.5) * 0.01
      }
      update() {
        this.y += this.speed
        this.wobble += this.wobbleSpeed
        this.x += Math.sin(this.wobble) * 0.3
        this.rotation += this.rotSpeed
        if (this.y > canvas.height + 20) this.reset()
      }
      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.font = `${this.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.emoji, 0, 0)
        ctx.restore()
      }
    }

    for (let i = 0; i < 25; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.update(); p.draw() })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

// ===== SCROLL REVEAL HOOK =====
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ===== HEADER =====
function Header() {
  return (
    <RevealSection>
      <header className="header">
        <div className="subtitle">A Quest for the Finest Spirits</div>
        <h1>Kentucky Bourbon Trail</h1>
        <div className="dates">TBD</div>
        <div className="travelers">A Party of 4 Adventurers</div>
        <div className="route-badge">
          <span>Matthews, NC</span>
          <span className="arrow">&rarr;</span>
          <span>Louisville, KY</span>
        </div>
      </header>
    </RevealSection>
  )
}

// ===== OVERVIEW =====
function AnimatedNumber({ target, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const num = parseInt(target) || 0
          const duration = 1500
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * num))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{prefix}{value}{suffix}</span>
}

function Overview() {
  const stats = [
    { icon: '📅', value: '4', label: 'Days', prefix: '', suffix: '' },
    { icon: '🥃', value: '6', label: 'Distilleries', prefix: '', suffix: '+' },
    { icon: '🏙️', value: '3', label: 'Cities', prefix: '', suffix: '' },
    { icon: '🛣️', value: '500', label: 'Miles Round Trip', prefix: '~', suffix: '' },
  ]

  return (
    <RevealSection>
      <div className="overview">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <h3><AnimatedNumber target={s.value} prefix={s.prefix} suffix={s.suffix} /></h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </RevealSection>
  )
}

// ===== CHARACTER CARD =====
function CharacterCard({ name, charClass, emoji, level, skills, delay }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`character-card ${charClass}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
      }}
    >
      <div className={`character-avatar ${charClass}`}>{emoji}</div>
      <div className="character-name">{name}</div>
      <div className="character-class-badge">{charClass}</div>
      <div className="character-stats">
        <div className="stat-row">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level}</span>
        </div>
        {skills.map((skill, i) => (
          <div className="stat-row" key={i}>
            <span className="stat-label">{skill.name}</span>
            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{ width: visible ? `${skill.value * 20}%` : '0%' }}
              />
            </div>
            <span className="stat-value">+{skill.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== PARTY SECTION =====
function Party() {
  const characters = [
    {
      name: 'Alex',
      charClass: 'wizard',
      emoji: '🧙',
      level: 1,
      skills: [
        { name: 'Navigation', value: 3 },
        { name: 'Arcane Knowledge', value: 2 },
        { name: 'Bourbon Lore', value: 2 },
      ],
    },
    {
      name: 'Cece',
      charClass: 'thief',
      emoji: '🗡️',
      level: 1,
      skills: [
        { name: 'Snack Acquisition', value: 3 },
        { name: 'Stealth', value: 2 },
        { name: 'Charm', value: 2 },
      ],
    },
    {
      name: 'Henrik',
      charClass: 'warrior',
      emoji: '⚔️',
      level: 1,
      skills: [
        { name: 'Bourbon Resistance', value: 3 },
        { name: 'Strength', value: 2 },
        { name: 'Endurance', value: 2 },
      ],
    },
    {
      name: 'Z',
      charClass: 'cleric',
      emoji: '🛡️',
      level: 1,
      skills: [
        { name: 'Trip Planning', value: 3 },
        { name: 'Healing', value: 2 },
        { name: 'Wisdom', value: 2 },
      ],
    },
  ]

  return (
    <RevealSection>
      <div className="party-section">
        <h2 className="section-title">The Party</h2>
        <div className="section-subtitle">Choose your champion for the trail ahead</div>
        <div className="party-grid">
          {characters.map((char, i) => (
            <CharacterCard key={char.name} {...char} delay={i * 150} />
          ))}
        </div>
      </div>
    </RevealSection>
  )
}

// ===== BOSS FIGHT MINI-GAME (imported from ./components/BossFight.jsx) =====

// ===== VOTE OPTION =====
function VoteOption({ id, label, checked, onChange }) {
  const [votes, setVotes] = useState(checked ? 1 : 0)

  useEffect(() => {
    setVotes(checked ? 1 : 0)
  }, [checked])

  const handleChange = (e) => {
    setVotes(e.target.checked ? 1 : 0)
    onChange(id, e.target.checked)
  }

  return (
    <div className="option-item">
      <input type="checkbox" id={id} checked={checked} onChange={handleChange} />
      <label htmlFor={id} dangerouslySetInnerHTML={{ __html: label }} />
      <span className="votes">{votes}</span>
    </div>
  )
}

// ===== DAY CARD =====
function DayCard({ day, date, location, children }) {
  return (
    <RevealSection>
      <div className="day-card">
        <div className="day-header">
          <h2>Day {day} &mdash; {date}</h2>
          <span className="location">{location}</span>
        </div>
        <div className="day-content">{children}</div>
      </div>
    </RevealSection>
  )
}

// ===== MAP SECTION =====
function TripMap() {
  return (
    <RevealSection>
      <div className="map-section">
        <h2 className="section-title">Trip Route & Destinations</h2>
        <div className="map-container">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=-86.5%2C37.2%2C-84.0%2C38.8&layer=mapnik&marker=38.2527%2C-85.7585"
            allowFullScreen=""
            loading="lazy"
            title="Trip Route Map"
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <a
            href="https://www.google.com/maps/dir/Matthews,+NC/Louisville,+KY/Bardstown,+KY/Frankfort,+KY/Versailles,+KY/Louisville,+KY/Matthews,+NC"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link-btn"
          >
            Open Full Route in Google Maps ↗
          </a>
        </div>
        <div className="destinations-list">
          {[
            { marker: 'A', name: 'Matthews, NC', type: 'Start/End' },
            { marker: 'B', name: 'Louisville, KY', type: 'Days 1 & 3-4' },
            { marker: 'C', name: 'Bardstown, KY', type: 'Day 2' },
            { marker: 'D', name: 'Frankfort, KY', type: 'Day 3' },
            { marker: 'E', name: 'Versailles, KY', type: 'Day 3' },
          ].map((d) => (
            <div className="destination" key={d.marker}>
              <span className="dest-marker">{d.marker}</span>
              <span className="dest-name">{d.name}</span>
              <span className="dest-type">{d.type}</span>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  )
}

// ===== PACKING CHECKLIST =====
function PackingChecklist({ checkboxState, onCheckboxChange }) {
  const items = [
    'Valid ID (21+)',
    'Comfortable walking shoes',
    'Layers (Feb weather)',
    'Camera/Phone charger',
    'Cooler for purchases',
    'Snacks for the drive',
    'Reservation confirmations',
    'Cash for tips',
  ]

  return (
    <RevealSection>
      <div className="packing-section">
        <h2 className="section-title">Packing Checklist</h2>
        <div className="checklist">
          {items.map((item, i) => {
            const id = `pack${i + 1}`
            return (
              <div className="checklist-item" key={id}>
                <input
                  type="checkbox"
                  id={id}
                  checked={!!checkboxState[id]}
                  onChange={(e) => onCheckboxChange(id, e.target.checked)}
                />
                <label htmlFor={id}>{item}</label>
              </div>
            )
          })}
        </div>
      </div>
    </RevealSection>
  )
}

// ===== GROUP NOTES =====
function GroupNotes({ notes, onNotesChange }) {
  return (
    <RevealSection>
      <div className="notes-section">
        <h2 className="section-title">Group Notes & Reminders</h2>
        <textarea
          className="group-notes"
          placeholder="Add notes, questions, or reminders for the group here..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </RevealSection>
  )
}

// ===== MAIN APP =====
function App() {
  const [checkboxState, setCheckboxState] = useState({})
  const [notes, setNotes] = useState('')

  // Load state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bourbonTrip2026')
      if (saved) {
        const state = JSON.parse(saved)
        setCheckboxState(state.checkboxes || {})
        setNotes(state.notes || '')
      }
    } catch (e) { /* ignore */ }
  }, [])

  // Save state to localStorage
  const saveState = useCallback((checkboxes, notesVal) => {
    localStorage.setItem('bourbonTrip2026', JSON.stringify({
      checkboxes,
      notes: notesVal,
    }))
  }, [])

  const handleCheckboxChange = useCallback((id, checked) => {
    setCheckboxState((prev) => {
      const next = { ...prev, [id]: checked }
      saveState(next, notes)
      return next
    })
  }, [notes, saveState])

  const handleNotesChange = useCallback((val) => {
    setNotes(val)
    saveState(checkboxState, val)
  }, [checkboxState, saveState])

  return (
    <div className="app">
      <ParticleBackground />
      <div className="ambient-bg" />
      <div className="container">
        <Header />
        <Overview />
        <Party />
        <RevealSection>
          <BossFight />
        </RevealSection>
        <TripMap />

        {/* Day 1 */}
        <DayCard day={1} date="TBD" location="Louisville, KY">
          <div className="time-block">
            <h3>Morning / Early Afternoon</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🚗</span>
                <span className="activity-name">Drive from Matthews, NC → Louisville, KY</span>
                <span className="activity-type">Travel</span>
              </div>
              <div className="activity-desc">~7.5–8 hours drive. Check into Louisville hotel and relax before dinner.</div>
            </div>
          </div>
          <div className="time-block">
            <h3>Late Afternoon / Evening — Distillery Experiences</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🥃</span>
                <span className="activity-name">Whiskey Row Urban Experience</span>
                <span className="activity-type">Distillery</span>
              </div>
              <div className="options-list">
                <VoteOption id="oldforester" label="<strong>Old Forester Distilling Co.</strong> — Classic trail stop" checked={!!checkboxState.oldforester} onChange={handleCheckboxChange} />
                <VoteOption id="angelsenvy" label="<strong>Angel's Envy</strong> — Modern distillery with tasting sessions" checked={!!checkboxState.angelsenvy} onChange={handleCheckboxChange} />
              </div>
            </div>
          </div>
          <div className="time-block">
            <h3>Dinner Options</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🍽️</span>
                <span className="activity-name">Vote for Dinner</span>
                <span className="activity-type">Restaurant</span>
              </div>
              <div className="options-list">
                <VoteOption id="loulou" label="<strong>Lou Lou on Market</strong> — Cajun-inspired, East Market" checked={!!checkboxState.loulou} onChange={handleCheckboxChange} />
                <VoteOption id="cured" label="<strong>CURED Restaurant</strong> — Elegant charcuterie & house-cured meats" checked={!!checkboxState.cured} onChange={handleCheckboxChange} />
                <VoteOption id="repeal" label="<strong>Repeal Oak Fired Steakhouse</strong> — Upscale steakhouse, bourbon cocktails" checked={!!checkboxState.repeal} onChange={handleCheckboxChange} />
              </div>
            </div>
          </div>
          <div className="pro-tip">
            <strong>Pro Tip:</strong> Louisville has great nightlife — locals recommend Michter's Fort Nelson bar or the downtown bourbon bars along Whiskey Row for nightcaps.
          </div>
        </DayCard>

        {/* Day 2 */}
        <DayCard day={2} date="TBD" location="Bardstown, KY">
          <div className="time-block">
            <h3>Morning — Head to Bardstown (45–55 min)</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">📍</span>
                <span className="activity-name">Bardstown — "Bourbon Capital of the World"</span>
                <span className="activity-type">Destination</span>
              </div>
            </div>
          </div>
          <div className="time-block">
            <h3>Distillery Stops</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🥃</span>
                <span className="activity-name">Bardstown Distilleries</span>
                <span className="activity-type">Distillery</span>
              </div>
              <div className="options-list">
                <VoteOption id="heavenhill" label="<strong>Heaven Hill Bourbon Heritage Center</strong> — Deep history & tasting experiences" checked={!!checkboxState.heavenhill} onChange={handleCheckboxChange} />
                <VoteOption id="makersmark" label="<strong>Maker's Mark Distillery</strong> — Iconic campus & wax-dip experience (35–40 min south)" checked={!!checkboxState.makersmark} onChange={handleCheckboxChange} />
              </div>
            </div>
          </div>
          <div className="time-block">
            <h3>Lunch in Bardstown</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🍴</span>
                <span className="activity-name">Bardstown Bourbon Company</span>
                <span className="activity-type">Restaurant</span>
              </div>
              <div className="activity-desc">Bourbon tasting + lunch with a creative, modern menu.</div>
            </div>
          </div>
          <div className="time-block">
            <h3>Afternoon — Explore Town</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🏛️</span>
                <span className="activity-name">Bardstown Historic District</span>
                <span className="activity-type">Sightseeing</span>
              </div>
              <div className="activity-desc">Historic architecture & bourbon lore.</div>
            </div>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🏛️</span>
                <span className="activity-name">Oscar Getz Museum of Whiskey History</span>
                <span className="activity-type">Optional</span>
              </div>
              <div className="activity-desc">Optional stop for bourbon history enthusiasts.</div>
            </div>
          </div>
          <div className="time-block">
            <h3>Dinner & Evening Options</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🍽️</span>
                <span className="activity-name">Vote for Dinner</span>
                <span className="activity-type">Restaurant</span>
              </div>
              <div className="options-list">
                <VoteOption id="talbott" label="<strong>The Old Talbott Tavern</strong> — Classic historic tavern with local flavor" checked={!!checkboxState.talbott} onChange={handleCheckboxChange} />
                <VoteOption id="mammys" label="<strong>Mammy's Kitchen & Bar</strong> — Southern comfort food" checked={!!checkboxState.mammys} onChange={handleCheckboxChange} />
                <VoteOption id="bluegrass" label="<strong>Bluegrass Tavern</strong> — Casual bar & grill" checked={!!checkboxState.bluegrass} onChange={handleCheckboxChange} />
                <VoteOption id="liamash" label="<strong>Liam Ash Cocktail Emporium</strong> — Cocktail bar for nightcaps" checked={!!checkboxState.liamash} onChange={handleCheckboxChange} />
              </div>
            </div>
          </div>
          <div className="pro-tip">
            <strong>Stay Overnight:</strong> Bardstown — charming and convenient for next day's adventure.
          </div>
        </DayCard>

        {/* Day 3 */}
        <DayCard day={3} date="TBD" location="Frankfort & Versailles, KY">
          <div className="time-block">
            <h3>Morning — Drive to Frankfort (~1 hr 20 min from Bardstown)</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🥃</span>
                <span className="activity-name">Buffalo Trace Distillery</span>
                <span className="activity-type">Must-See</span>
              </div>
              <div className="activity-desc">A must-see, historic and well-loved trail tour. Free tours available and widely recommended by visitors. Note: New John G. Carlisle Cafe expected in 2026.</div>
            </div>
          </div>
          <div className="time-block">
            <h3>Lunch in Frankfort</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🍽️</span>
                <span className="activity-name">Vote for Lunch</span>
                <span className="activity-type">Restaurant</span>
              </div>
              <div className="options-list">
                <VoteOption id="bourbonmain" label="<strong>Bourbon On Main</strong> — Locally popular, bourbon-friendly menu" checked={!!checkboxState.bourbonmain} onChange={handleCheckboxChange} />
                <VoteOption id="brownbarrel" label="<strong>The Brown Barrel</strong> — Elevated comfort food" checked={!!checkboxState.brownbarrel} onChange={handleCheckboxChange} />
                <VoteOption id="thestave" label="<strong>The Stave</strong> — Southern KY cuisine & bourbon bar (15–20 min south)" checked={!!checkboxState.thestave} onChange={handleCheckboxChange} />
              </div>
            </div>
          </div>
          <div className="time-block">
            <h3>Afternoon — Woodford Reserve Distillery (Versailles, KY)</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🥃</span>
                <span className="activity-name">Woodford Reserve Distillery</span>
                <span className="activity-type">Flagship</span>
              </div>
              <div className="activity-desc">Scenic flagship stop — very popular for its beautiful grounds and comprehensive experience.</div>
            </div>
          </div>
          <div className="time-block">
            <h3>Evening — Return to Louisville (~1 hr)</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🍽️</span>
                <span className="activity-name">Final Dinner in Louisville</span>
                <span className="activity-type">Restaurant</span>
              </div>
              <div className="options-list">
                <VoteOption id="porch" label="<strong>Porch Kitchen & Bar</strong> — Elevated Southern menu" checked={!!checkboxState.porch} onChange={handleCheckboxChange} />
                <VoteOption id="decade" label="<strong>Decade</strong> — High-end dinner for a memorable final night" checked={!!checkboxState.decade} onChange={handleCheckboxChange} />
              </div>
            </div>
          </div>
        </DayCard>

        {/* Day 4 */}
        <DayCard day={4} date="TBD" location="Return Home">
          <div className="time-block">
            <h3>Morning</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">☕</span>
                <span className="activity-name">Breakfast & Last Tasting</span>
                <span className="activity-type">Optional</span>
              </div>
              <div className="activity-desc">Easy breakfast & a last bourbon-inspired coffee or tasting flight downtown (many bars open early on Monday).</div>
            </div>
          </div>
          <div className="time-block">
            <h3>Drive Home</h3>
            <div className="activity">
              <div className="activity-header">
                <span className="activity-icon">🏁</span>
                <span className="activity-name">Louisville → Matthews, NC</span>
                <span className="activity-type">Travel</span>
              </div>
              <div className="activity-desc">~7.5–8 hours drive home.</div>
            </div>
          </div>
        </DayCard>

        <PackingChecklist checkboxState={checkboxState} onCheckboxChange={handleCheckboxChange} />
        <GroupNotes notes={notes} onNotesChange={handleNotesChange} />

        <footer className="footer">
          <p>Kentucky Bourbon Trail Trip 2026 | A Party of 4</p>
          <p className="reminder">Remember: Always have a designated driver!</p>
        </footer>
      </div>
    </div>
  )
}

export default App
