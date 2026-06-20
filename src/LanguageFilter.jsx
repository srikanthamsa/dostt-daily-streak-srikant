import { useState, useEffect } from 'react'
import GoldCoin from './GoldCoin'

const LANGS  = ['Hindi','English','Tamil','Telugu','Kannada','Bengali','Marathi','Punjabi','Gujarati','Malayalam']
const STATES = ['Maharashtra','Karnataka','Tamil Nadu','Delhi','Uttar Pradesh','Gujarat','Rajasthan','Punjab','West Bengal','Kerala','Andhra Pradesh','Bihar']
const CITIES = {
  'Maharashtra':    ['Mumbai','Pune','Nagpur','Nashik'],
  'Karnataka':      ['Bengaluru','Mysuru','Hubli','Mangaluru'],
  'Tamil Nadu':     ['Chennai','Coimbatore','Madurai','Salem'],
  'Delhi':          ['New Delhi','Dwarka','Rohini','Saket'],
  'Uttar Pradesh':  ['Lucknow','Kanpur','Varanasi','Agra'],
  'Gujarat':        ['Ahmedabad','Surat','Vadodara','Rajkot'],
  'Rajasthan':      ['Jaipur','Jodhpur','Udaipur','Kota'],
  'Punjab':         ['Chandigarh','Ludhiana','Amritsar','Jalandhar'],
  'West Bengal':    ['Kolkata','Howrah','Durgapur','Asansol'],
  'Kerala':         ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur'],
  'Andhra Pradesh': ['Visakhapatnam','Vijayawada','Guntur','Tirupati'],
  'Bihar':          ['Patna','Gaya','Bhagalpur','Muzaffarpur'],
}

const COOLDOWN_MS   = 24 * 60 * 60 * 1000
const UNLOCK_COINS  = 500

function getStored() { return JSON.parse(localStorage.getItem('dostt_filter') || '{}') }

function fmtCooldown(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${h}h ${m}m ${s}s`
}

export default function LanguageFilter({ coins, spendCoins }) {
  const stored = getStored()
  const [langs, setLangs]     = useState(stored.langs || [])
  const [state, setState]     = useState(stored.state || '')
  const [city, setCity]       = useState(stored.city  || '')
  const [saved, setSaved]     = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [unlocking, setUnlocking] = useState(false)
  const [hasResetOnce, setHasResetOnce] = useState(stored.hasResetOnce || false)

  useEffect(() => {
    const tick = () => {
      const s = getStored()
      if (s.lastChanged) {
        const left = COOLDOWN_MS - (Date.now() - s.lastChanged)
        setCooldown(left > 0 ? left : 0)
      }
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [saved, unlocking])

  const toggleLang = l => setLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])

  const handleSave = () => {
    if (cooldown > 0) return
    localStorage.setItem('dostt_filter', JSON.stringify({ langs, state, city, lastChanged: Date.now(), hasResetOnce }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleUnlock = () => {
    if (coins < UNLOCK_COINS) return
    spendCoins(UNLOCK_COINS)
    // Reset cooldown by clearing lastChanged
    const s = getStored()
    localStorage.setItem('dostt_filter', JSON.stringify({ ...s, lastChanged: null }))
    setCooldown(0)
    setUnlocking(true)
    setTimeout(() => setUnlocking(false), 100)
  }

  const cities = state ? (CITIES[state] || []) : []
  const locked = cooldown > 0

  return (
    <div className="screen">
      <div>
        <h2>Find Your People</h2>
        <p className="sub">Filter listeners by language and location. Feel at home.</p>
      </div>

      <div>
        <p className="field-label" style={{ marginBottom: 10 }}>Languages you speak</p>
        <div className="chip-grid">
          {LANGS.map(l => (
            <button key={l} className={`chip${langs.includes(l) ? ' chip-on' : ''}`} onClick={() => toggleLang(l)}>{l}</button>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label" style={{ marginBottom: 10 }}>State</p>
        <select className="inp sel-inp" value={state} onChange={e => { setState(e.target.value); setCity('') }} disabled={locked}>
          <option value="">Any state</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {cities.length > 0 && (
        <div>
          <p className="field-label" style={{ marginBottom: 10 }}>City</p>
          <div className="chip-grid">
            {cities.map(c => (
              <button key={c} className={`chip${city === c ? ' chip-on' : ''}${locked ? ' chip-disabled' : ''}`} onClick={() => !locked && setCity(prev => prev === c ? '' : c)}>{c}</button>
            ))}
          </div>
        </div>
      )}

      {locked && (
        <div className="cooldown-box">
          <div className="cooldown-info">
            <span style={{ fontSize: 24 }}>⏳</span>
            <div>
              <div className="cooldown-title">Location filter locked</div>
              <div className="cooldown-timer">{fmtCooldown(cooldown)} remaining</div>
            </div>
          </div>
          <div className="unlock-row">
            {!hasResetOnce && (
              <div style={{ marginBottom: '12px' }}>
                <button 
                  className="unlock-btn" 
                  style={{ background: '#4F46E5', borderColor: '#4F46E5', color: 'white' }}
                  onClick={() => {
                    const s = getStored()
                    localStorage.setItem('dostt_filter', JSON.stringify({ ...s, lastChanged: null, hasResetOnce: true }))
                    setHasResetOnce(true)
                    setCooldown(0)
                  }}
                >
                  <span style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>Reset for Free (1 Left)</span>
                </button>
              </div>
            )}
            <div className="unlock-note">Want to change location now?</div>
            <button
              className={`unlock-btn${coins < UNLOCK_COINS ? ' unlock-disabled' : ''}`}
              onClick={handleUnlock}
              disabled={coins < UNLOCK_COINS}
            >
              {coins < UNLOCK_COINS
                ? <span style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>Need {UNLOCK_COINS} <GoldCoin size={16} /> (you have {coins})</span>
                : <span style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>Unlock now · {UNLOCK_COINS} <GoldCoin size={16} /></span>}
            </button>
          </div>
        </div>
      )}

      {langs.length > 0 && (
        <div className="filter-preview">
          <div className="fp-row">🗣️ <span>{langs.join(', ')}</span></div>
          {state && <div className="fp-row">📍 <span>{city ? `${city}, ${state}` : state}</span></div>}
        </div>
      )}

      <button
        className={`btn-primary${saved ? ' done' : ''}`}
        onClick={handleSave}
        disabled={langs.length === 0 || locked}
      >
        {saved ? '✓ Filters saved!' : locked ? 'Location locked · Language only' : 'Save Filters'}
      </button>

      <p className="metric-note">📊 Targets D7 retention — language match = longer calls = return</p>
    </div>
  )
}
