import { useState, useEffect } from 'react'
import { Briefcase, Gift, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import LiveStream    from './LiveStream'
import GoldCoin      from './GoldCoin'
import LanguageFilter from './LanguageFilter'

// ── Listeners data ──────────────────────────────────────────────────────────
const LISTENERS = [
  { id: 1, name: 'yogitaaa',  tag: 'Life Coach',    avatar: '/avatars/avatar_orange_1781937749343.png', bg: 'linear-gradient(160deg,#c4a882,#a0785a)', online: true  },
  { id: 2, name: 'riyaa8765', tag: 'Relationship',  avatar: '/avatars/avatar_blue_1781937765422.png', bg: 'linear-gradient(160deg,#b8a4d4,#7c5cbf)', online: true,
    categories: ['Family & Relationships', 'Emotional Support', 'Films & Music', 'Childhood Memories'] },
  { id: 3, name: 'urshi19',   tag: 'Motivator',     avatar: '/avatars/avatar_red_1781937779884.png', bg: 'linear-gradient(160deg,#a8c4a0,#6a9e62)', online: true  },
  { id: 4, name: 'kavya_k',   tag: 'Mental Health', avatar: '/avatars/avatar_purple_1781937797935.png', bg: 'linear-gradient(160deg,#f4a460,#cd853f)', online: false },
  { id: 5, name: 'priya_s',   tag: 'Career Guide',  avatar: '/avatars/avatar_blue_1781937765422.png', em: <Briefcase size={20} color="white" />, bg: 'linear-gradient(160deg,#87ceeb,#4682b4)', online: true  },
]

const FEATURED = LISTENERS[1]

// ── Spin Wheel ──────────────────────────────────────────────────────────────
const PRIZES      = ['10c', '25c', '50c', '100c', 'Free!', '2× XP', '30c', '5c']
const PRIZE_LABELS = ['10 coins', '25 coins', '50 coins', '100 coins', 'Free Call!', '2× Streak', '30 coins', '5 coins']
const COLORS      = ['#7C3AED','#9F67FF','#4C1D95','#6D28D9','#8B5CF6','#7C3AED','#5B21B6','#A78BFA']

function SpinWheelCard({ onWin }) {
  const [angle, setAngle]       = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult]     = useState(null)
  const [spinsLeft, setSpinsLeft] = useState(3)

  const spin = () => {
    if (spinning || spinsLeft === 0) return
    setResult(null)
    setSpinning(true)
    const slot   = Math.floor(Math.random() * PRIZES.length)
    const extra  = 360 * (5 + Math.floor(Math.random() * 4))
    
    // Calculate target angle to make segment 'slot' land at the top
    const baseAngle = 360 - (slot * (360 / PRIZES.length) + (180 / PRIZES.length))
    const currentMod = angle % 360
    let diff = baseAngle - currentMod
    if (diff <= 0) diff += 360
    
    const target = angle + extra + diff

    setAngle(target)
    setTimeout(() => {
      setSpinning(false)
      setResult(PRIZE_LABELS[slot])
      setSpinsLeft(s => s - 1)
      if (PRIZES[slot].endsWith('c')) onWin(parseInt(PRIZES[slot]))
    }, 3200)
  }

  const seg = 360 / PRIZES.length
  const r   = 85

  return (
    <div className="spin-card" onClick={spin}>
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="spin-card-content">
        <div className="spin-area">
          <div className="spin-pointer"></div>
          <svg
            width={r * 2 + 30} height={r * 2 + 30}
            viewBox={`0 0 ${r*2+30} ${r*2+30}`}
            style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 3.2s cubic-bezier(0.2,0,0.1,1)' : 'none', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
          >
            <defs>
              <radialGradient id="wheel-glow" cx="50%" cy="50%" r="50%">
                <stop offset="80%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
              </radialGradient>
              <linearGradient id="center-pin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <filter id="inner-shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.6" />
              </filter>
            </defs>
            <g transform="translate(15,15)">
              {PRIZES.map((p, i) => {
                const a1 = (i * seg - 90) * (Math.PI / 180)
                const a2 = ((i + 1) * seg - 90) * (Math.PI / 180)
                const x1 = r + r * Math.cos(a1)
                const y1 = r + r * Math.sin(a1)
                const x2 = r + r * Math.cos(a2)
                const y2 = r + r * Math.sin(a2)
                const mid = (a1 + a2) / 2
                const textX = r + (r * 0.65) * Math.cos(mid)
                const textY = r + (r * 0.65) * Math.sin(mid)
                const textRot = (mid * 180 / Math.PI) + 90
                return (
                  <g key={i}>
                    <path d={`M${r},${r} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={COLORS[i]} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="9" fill="white" fontWeight="800"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)', transform: `rotate(${textRot > 90 && textRot < 270 ? textRot + 180 : textRot}deg)`, transformOrigin: `${textX}px ${textY}px` }}
                    >{p.split(' ')[0]}</text>
                  </g>
                )
              })}
              <circle cx={r} cy={r} r={r} fill="url(#wheel-glow)" pointerEvents="none" />
              <circle cx={r} cy={r} r={r} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="4" />
              <circle cx={r} cy={r} r="14" fill="url(#center-pin)" filter="url(#inner-shadow)" />
              <circle cx={r} cy={r} r="5" fill="#78350f" />
            </g>
          </svg>
        </div>

        <div className="spin-right-col">
          <div className="spin-header">
            <span className="spin-title">Spin to Win!</span>
            <span className="spins-left">{spinsLeft} free spins</span>
          </div>
          {result && (
            <div className="spin-result">
              <span>You won</span>
              <strong style={{ display:'flex', alignItems:'center', gap:5 }}>
                {result.includes('coin') && <GoldCoin size={20} />}{result}
              </strong>
            </div>
          )}
          {spinsLeft === 0
            ? <span className="spin-cta disabled">Come back tomorrow</span>
            : <span className="spin-cta">{spinning ? 'Spinning…' : 'Tap here to spin!'}</span>
          }
        </div>
      </div>
    </div>
  )
}

// ── Listener card ───────────────────────────────────────────────────────────
function ListenerCard({ l }) {
  return (
    <div className="lc-wrap" style={!l.avatar ? { background: l.bg } : {}}>
      {l.avatar && <img src={l.avatar} alt={l.name} className="lc-bg-img" />}
      <div className="lc-name-wrap">
        <div className="lc-name">{l.name}</div>
        {l.online && <div className="lc-online" />}
      </div>
      {!l.avatar && <div className="lc-em-fallback">{l.em}</div>}
      <div className="lc-overlay-actions">
        <button className="lc-overlay-btn"><img src="/phone.png" style={{ width: '16px', height: '16px', objectFit: 'contain' }} alt="Call" /></button>
        <button className="lc-overlay-btn"><img src="/zoom.png" style={{ width: '16px', height: '16px', objectFit: 'contain' }} alt="Video" /></button>
      </div>
    </div>
  )
}

// ── Inline Filter Toggle ────────────────────────────────────────────────────
function FilterRow({ coins, addCoins }) {
  const [open, setOpen] = useState(false)
  const spendCoins = n => {
    const cur = JSON.parse(localStorage.getItem('dostt_coins') || '0')
    const next = Math.max(0, cur - n)
    localStorage.setItem('dostt_coins', next)
  }
  return (
    <div className="filter-row-wrap">
      <button className="filter-row-btn" style={{ borderRadius: open ? '16px 16px 0 0' : '16px', borderBottom: open ? 'none' : '1px solid var(--border-dark)' }} onClick={() => setOpen(o => !o)}>
        <span style={{ display: 'flex', alignItems: 'center' }}><Globe size={16} style={{ marginRight: 6, color: '#7C3AED' }} /> Find listeners in your language & city</span>
        <span className="filter-arrow">{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      {open && (
        <div className="filter-inline">
          <LanguageFilter coins={coins} spendCoins={spendCoins} />
        </div>
      )}
    </div>
  )
}

// ── HomeScreen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ coins, addCoins }) {
  const [view, setView] = useState('home')
  const [open, setOpen] = useState(false)
  const [streak, setStreak] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('dostt_streak') || '{}')
    const today = new Date().toDateString()
    if (s.lastCheckin === today) {
      setCheckedIn(true)
      setStreak(s.streak || 1)
    } else {
      setStreak(s.streak || 0)
    }
  }, [])

  const checkIn = (e) => {
    if (e) e.stopPropagation()
    if (checkedIn) return
    const today = new Date().toDateString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const s = JSON.parse(localStorage.getItem('dostt_streak') || '{}')
    const cont = s.lastCheckin === yesterday.toDateString()
    const newStreak = cont ? streak + 1 : 1
    const reward = newStreak >= 7 ? 5 : 1
    localStorage.setItem('dostt_streak', JSON.stringify({ streak: newStreak, lastCheckin: today, coins: coins + reward }))
    setStreak(newStreak)
    setCheckedIn(true)
    addCoins(reward)
  }

  if (view === 'live')      return <div className="sub-view"><LiveStream onBack={() => setView('home')} /></div>

  return (
    <div className="home-screen">

      {/* ── Feature grid ── */}
      <div className="feature-grid">
        <SpinWheelCard onWin={addCoins} />
        <div className="quick-cards">
          <div className="quick-card qc-live" onClick={() => setView('live')}>
            <div className="qc-text" style={{ zIndex: 2 }}>
              <div className="qc-label">Video Streams</div>
              <div className="qc-sub" style={{ whiteSpace: 'normal', paddingRight: '40px', color: 'rgba(255,255,255,0.8)' }}>5 active streams</div>
            </div>
            <div className="qc-icon" style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
              <img src="/live-streaming.svg" alt="Video Streams" style={{ width: '90px', height: '90px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
            </div>
          </div>
          <div className="quick-card qc-streak" onClick={checkIn}>
            <div className="qc-text" style={{ zIndex: 2 }}>
              <div className="qc-label">{streak} Day Streak</div>
              <div className="qc-sub" style={{ whiteSpace: 'normal', paddingRight: '40px', color: 'rgba(255,255,255,0.8)' }}>{checkedIn ? '✓ Checked in' : 'Tap to check in'}</div>
            </div>
            <div className="qc-icon" onClick={(e) => { e.stopPropagation(); setShowStreakModal(true) }} style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', zIndex: 3, cursor: 'pointer' }}>
              <img src="/fire.svg" alt="Streak Info" style={{ width: '56px', height: '56px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── First Call Free banner ── */}
      <div className="fcf-home-banner shimmer-banner">
        <div className="fcf-left">
          <span className="fcf-tag">FIRST TIME OFFER!</span>
          <div className="fcf-title">Your first call is FREE <Gift size={20} style={{ display: 'inline', marginLeft: 4, color: '#FCD34D' }} /></div>
          <div className="fcf-sub">No coins needed for your first match</div>
        </div>
      </div>

      {/* ── Star Dostts ── */}
      <div className="star-section">
        <div className="section-header">
          <span className="section-title">Star Dostts</span>
          <span className="section-see-all">See all</span>
        </div>
        <div className="listener-scroll">
          {LISTENERS.map(l => <ListenerCard key={l.id} l={l} />)}
        </div>
      </div>

      {/* ── Language & City Filter ── */}
      <FilterRow coins={coins} addCoins={addCoins} />

      {/* ── Featured listeners ── */}
      <div className="featured-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {LISTENERS.slice(0, 3).map(user => (
          <div key={user.id} className="featured-wrap" style={{ margin: '0 16px' }}>
            <div className="featured-card" style={!user.avatar ? { background: user.bg } : {}}>
              <div className="featured-badge">⭐ Top Rated</div>
              {user.avatar ? <img src={user.avatar} alt={user.name} className="featured-av-img" /> : <div className="featured-em">{user.em}</div>}
            </div>
            <div className="featured-info">
              <div className="featured-info-name">{user.name}</div>
              <div className="featured-cats">
                {(user.categories || ['Emotional Support', 'Relationships']).map(c => (
                  <span key={c} className="featured-cat-chip">{c}</span>
                ))}
              </div>
              <div className="featured-ctas">
                <button className="fcta-btn fcta-audio call-pill"><span><GoldCoin size={12} style={{ display: 'inline', position: 'relative', top: '1px' }} /></span> 1/min <span><img src="/phone.png" style={{ width: '16px', height: '16px', objectFit: 'contain' }} alt="Call" /></span></button>
                <button className="fcta-btn fcta-video call-pill"><span><GoldCoin size={12} style={{ display: 'inline', position: 'relative', top: '1px' }} /></span> 6/min <span><img src="/zoom.png" style={{ width: '16px', height: '16px', objectFit: 'contain' }} alt="Video" /></span></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showStreakModal && (
        <div className="modal-backdrop" onClick={() => setShowStreakModal(false)}>
          <div className="streak-modal" onClick={e => e.stopPropagation()}>
            <img src="/fire.svg" alt="Streak" style={{ width: '64px', height: '64px', margin: '0 auto 12px', display: 'block', filter: 'drop-shadow(0 4px 10px rgba(245,158,11,0.5))' }} />
            <h3 style={{ textAlign: 'center', margin: '0 0 16px', color: 'white', fontSize: '20px' }}>Streak Benefits</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>Every Check-in</span>
              <strong style={{ color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '4px' }}>1 <GoldCoin size={14} /></strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '20px' }}>
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>7 Days Streak</span>
              <strong style={{ color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '4px' }}>5 <GoldCoin size={14} /></strong>
            </div>
            <button className="btn-primary" onClick={() => setShowStreakModal(false)}>Awesome!</button>
          </div>
        </div>
      )}

    </div>
  )
}
