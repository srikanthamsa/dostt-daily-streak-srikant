import { useState, useEffect } from 'react'
import { Briefcase, Gift } from 'lucide-react'
import LiveStream    from './LiveStream'
import FirstCallFree from './FirstCallFree'
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
    const extra  = 360 * (5 + Math.floor(Math.random() * 4))
    const slot   = Math.floor(Math.random() * PRIZES.length)
    const target = angle + extra + (slot * (360 / PRIZES.length))
    setAngle(target)
    setTimeout(() => {
      setSpinning(false)
      setResult(PRIZE_LABELS[slot])
      setSpinsLeft(s => s - 1)
      if (PRIZES[slot].endsWith('c')) onWin(parseInt(PRIZES[slot]))
    }, 3200)
  }

  const seg = 360 / PRIZES.length
  const r   = 70

  return (
    <div className="spin-card" onClick={spin}>
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="coin-drop" />
      <div className="spin-header">
        <span className="spin-title">Spin the Wheel</span>
        <span className="spins-left">{spinsLeft} free spins today</span>
      </div>
      <div className="spin-area">
        <div className="spin-pointer">▼</div>
        <svg
          width={r * 2 + 20} height={r * 2 + 20}
          viewBox={`0 0 ${r*2+20} ${r*2+20}`}
          style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 3.2s cubic-bezier(0.2,0,0.1,1)' : 'none' }}
        >
          {PRIZES.map((p, i) => {
            const a1 = (i * seg - 90) * (Math.PI / 180)
            const a2 = ((i + 1) * seg - 90) * (Math.PI / 180)
            const x1 = r + 10 + r * Math.cos(a1)
            const y1 = r + 10 + r * Math.sin(a1)
            const x2 = r + 10 + r * Math.cos(a2)
            const y2 = r + 10 + r * Math.sin(a2)
            const mid = (a1 + a2) / 2
            return (
              <g key={i}>
                <path d={`M${r+10},${r+10} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={COLORS[i]} />
                <text
                  x={r + 10 + (r * 0.65) * Math.cos(mid)}
                  y={r + 10 + (r * 0.65) * Math.sin(mid)}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="8" fill="white" fontWeight="700"
                >{p.split(' ')[0]}</text>
              </g>
            )
          })}
          <circle cx={r+10} cy={r+10} r="10" fill="#2D1B69" />
        </svg>
        {result && (
          <div className="spin-result">
            <span>You won</span>
            <strong style={{ display:'flex', alignItems:'center', gap:5 }}>
              {result.includes('coin') && <GoldCoin size={20} />}{result}
            </strong>
          </div>
        )}
      </div>
      {spinsLeft === 0
        ? <span className="spin-cta disabled">Come back tomorrow</span>
        : <span className="spin-cta">{spinning ? 'Spinning…' : 'Tap to spin!'} · Daily Rewards</span>
      }
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
        <span>🌐 Find listeners in your language & city</span>
        <span className="filter-arrow">{open ? '▲' : '▼'}</span>
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
  const [view, setView]     = useState('home')
  const [streak, setStreak] = useState(() => {
    const s = JSON.parse(localStorage.getItem('dostt_streak') || '{}')
    return s.streak ?? 0
  })
  const [checkedIn, setCheckedIn] = useState(() => {
    const s = JSON.parse(localStorage.getItem('dostt_streak') || '{}')
    return s.lastCheckin === new Date().toDateString()
  })

  const checkIn = () => {
    if (checkedIn) return
    const today = new Date().toDateString()
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    const s = JSON.parse(localStorage.getItem('dostt_streak') || '{}')
    const cont = s.lastCheckin === yesterday.toDateString()
    const newStreak = cont ? streak + 1 : 1
    const reward = newStreak >= 7 ? 50 : newStreak >= 3 ? 25 : 10
    localStorage.setItem('dostt_streak', JSON.stringify({ streak: newStreak, lastCheckin: today, coins: coins + reward }))
    setStreak(newStreak)
    setCheckedIn(true)
    addCoins(reward)
  }

  if (view === 'live')      return <div className="sub-view"><LiveStream onBack={() => setView('home')} /></div>
  if (view === 'free-call') return <div className="sub-view"><button className="back-dark" onClick={() => setView('home')}>← Back</button><FirstCallFree addCoins={addCoins} /></div>

  return (
    <div className="home-screen">

      {/* ── Feature grid ── */}
      <div className="feature-grid">
        <SpinWheelCard onWin={addCoins} />
        <div className="quick-cards">
          <div className="quick-card qc-live" onClick={() => setView('live')}>
            <div className="qc-text" style={{ zIndex: 2 }}>
              <div className="qc-label">Video Streams</div>
              <div className="qc-sub" style={{ whiteSpace: 'normal', paddingRight: '40px' }}>5 active streams</div>
            </div>
            <div className="qc-icon" style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
              <img src="/live-streaming.svg" alt="Video Streams" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            </div>
          </div>
          <div className="quick-card qc-streak" onClick={checkIn}>
            <div className="qc-text" style={{ zIndex: 2 }}>
              <div className="qc-label">{streak} Day Streak</div>
              <div className="qc-sub" style={{ whiteSpace: 'normal', paddingRight: '40px' }}>{checkedIn ? '✓ Checked in' : 'Tap to check in'}</div>
            </div>
            <div className="qc-icon" style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
              <img src="/fire.svg" alt="Streak" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── First Call Free banner ── */}
      <div className="fcf-home-banner" onClick={() => setView('free-call')}>
        <div className="fcf-left">
          <span className="fcf-tag">FIRST TIME OFFER!</span>
          <div className="fcf-title">Your first call is FREE <Gift size={20} style={{ display: 'inline', marginLeft: 4, color: '#FCD34D' }} /></div>
          <div className="fcf-sub">No coins needed for your first match</div>
        </div>
        <div className="fcf-arrow">›</div>
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

    </div>
  )
}
