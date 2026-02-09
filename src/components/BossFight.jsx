import { useState, useEffect, useRef, useCallback } from 'react'
import { GameEngine } from './gameEngine.js'
import { CONFIG } from './combatConfig.js'
import './BossFight.css'

const CHARACTERS = [
  { key: 'wizard', name: 'Alex', emoji: '🧙', className: 'Wizard' },
  { key: 'thief', name: 'Cece', emoji: '🗡️', className: 'Thief' },
  { key: 'warrior', name: 'Henrik', emoji: '⚔️', className: 'Warrior' },
  { key: 'cleric', name: 'Z', emoji: '🛡️', className: 'Cleric' },
]

export default function BossFight() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [gameState, setGameState] = useState('CHARACTER_SELECT')
  const [playerHp, setPlayerHp] = useState(1)
  const [bossHp, setBossHp] = useState(1)
  const [enraged, setEnraged] = useState(false)

  const handleStateChange = useCallback((state) => {
    setPlayerHp(state.playerHp)
    setBossHp(state.bossHp)
    setGameState(state.phase)
    if (state.phase === 'PHASE_2' || state.phase === 'ENRAGE_TRANSITION') {
      setEnraged(true)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (engineRef.current) engineRef.current.stop()
    }
  }, [])

  const startGame = useCallback((charClass) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (engineRef.current) engineRef.current.stop()

    const engine = new GameEngine(canvas, handleStateChange)
    engineRef.current = engine
    engine.resize()
    engine.startGame(charClass)
    setEnraged(false)

    const handleResize = () => engine.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleStateChange])

  const handleCanvasClick = useCallback(() => {
    if (engineRef.current) engineRef.current.handleTap()
  }, [])

  const handleRetry = useCallback(() => {
    if (engineRef.current) engineRef.current.stop()
    engineRef.current = null
    setGameState('CHARACTER_SELECT')
    setPlayerHp(1)
    setBossHp(1)
    setEnraged(false)
  }, [])

  const isPlaying = gameState !== 'CHARACTER_SELECT'
  const showResult = gameState === 'VICTORY' || gameState === 'DEFEAT'

  return (
    <div className="bossfight-section">
      <h2 className="bossfight-title">Boss Fight</h2>
      <p className="bossfight-subtitle">Defeat the Bourbon Noble to claim your prize</p>

      {!isPlaying && (
        <div className="char-select-grid">
          {CHARACTERS.map((c) => (
            <button
              key={c.key}
              className={`char-select-btn ${c.key}`}
              onClick={() => startGame(c.key)}
            >
              <span className="char-select-emoji">{c.emoji}</span>
              <div className="char-select-name">{c.name}</div>
              <div className="char-select-class">{c.className}</div>
            </button>
          ))}
        </div>
      )}

      {isPlaying && (
        <>
          <div className="hp-bars">
            <div className="hp-bar-wrap">
              <div className="hp-bar-label">
                <span>Player</span>
                <span>{Math.round(playerHp * CONFIG.PLAYER_MAX_HP)} / {CONFIG.PLAYER_MAX_HP}</span>
              </div>
              <div className="hp-bar-track">
                <div
                  className={`hp-bar-fill player ${playerHp < 0.3 ? 'low' : ''}`}
                  style={{ width: `${playerHp * 100}%` }}
                />
              </div>
            </div>
            <div className="hp-bar-wrap">
              <div className="hp-bar-label">
                <span>Bourbon Noble{enraged ? ' (ENRAGED)' : ''}</span>
                <span>{Math.round(bossHp * CONFIG.BOSS_MAX_HP)} / {CONFIG.BOSS_MAX_HP}</span>
              </div>
              <div className="hp-bar-track">
                <div
                  className={`hp-bar-fill boss ${enraged ? 'enraged' : ''}`}
                  style={{ width: `${bossHp * 100}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="game-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          style={{ display: isPlaying ? 'block' : 'none' }}
          onClick={handleCanvasClick}
          onTouchStart={(e) => { e.preventDefault(); handleCanvasClick() }}
        />

        {showResult && (
          <div className={`game-result-overlay ${gameState.toLowerCase()}`}>
            <div className={`result-title ${gameState.toLowerCase()}`}>
              {gameState === 'VICTORY' ? 'VICTORY' : 'DEFEAT'}
            </div>
            <div className="result-subtitle">
              {gameState === 'VICTORY'
                ? 'The Bourbon Noble has been vanquished!'
                : 'The Bourbon Noble prevails...'}
            </div>
            <button className="result-btn" onClick={handleRetry}>
              {gameState === 'VICTORY' ? 'Play Again' : 'Try Again'}
            </button>
          </div>
        )}
      </div>

      {isPlaying && !showResult && (
        <div className="game-hint">Tap / Click to attack!</div>
      )}

      {!isPlaying && (
        <div className="game-hint">Choose your champion to begin the battle</div>
      )}
    </div>
  )
}
