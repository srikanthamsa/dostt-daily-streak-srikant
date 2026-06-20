import { useState } from 'react'
import { Star, Zap, Heart, Ghost, User } from 'lucide-react'
import HomeScreen    from './HomeScreen'
import LanguageFilter from './LanguageFilter'
import DiaChat        from './DiaChat'
import LandingScreen  from './LandingScreen'
import DosttLogo      from './DosttLogo'
import './App.css'

function Coin({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#F59E0B" />
      <circle cx="12" cy="12" r="8.5" fill="#FCD34D" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="9" fill="#92400E" fontWeight="800">₹</text>
    </svg>
  )
}

function Recents() {
  const CALLS = [
    { name: 'Priya Sharma',  tag: 'Life Coach',        em: <Star size={24} color="#EAB308" fill="#EAB308" />, date: 'Today',      dur: '4:32', rating: 5 },
    { name: 'Kavya Nair',    tag: 'Motivator',          em: <Zap size={24} color="#3B82F6" fill="#3B82F6" />, date: 'Yesterday',  dur: '12:14', rating: 4 },
    { name: 'Neha Desai',   tag: 'Relationship Guide', em: <Heart size={24} color="#EC4899" fill="#EC4899" />, date: '2 days ago', dur: '7:08', rating: 5 },
  ]
  const empty = CALLS.length === 0
  return (
    <div className="screen">
      <h2>Recent Calls</h2>
      <p className="sub">Your conversation history on Dostt.</p>
      {empty
        ? <div className="empty-state"><span><Ghost size={48} opacity={0.5} /></span><p>No calls yet. Claim your free call!</p></div>
        : CALLS.map((c, i) => (
          <div key={i} className="recent-card">
            <div className="rc-av" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.em}</div>
            <div className="rc-info">
              <div className="rc-name">{c.name}</div>
              <div className="rc-tag">{c.tag}</div>
              <div className="rc-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {c.date} · {c.dur}
                <span style={{ display: 'flex', alignItems: 'center', color: '#F59E0B' }}>
                  {Array.from({ length: c.rating }).map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                </span>
              </div>
            </div>
            <button className="rc-again">Call again</button>
          </div>
        ))
      }
    </div>
  )
}

function Profile({ coins }) {
  return (
    <div className="screen center">
      <div className="profile-av" style={{ background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={48} color="white" /></div>
      <h2>Srikant Hamsa</h2>
      <p className="sub">srikanthamsa@gmail.com</p>
      <div className="profile-stats">
        <div className="ps-item"><strong>{coins}</strong><span>Coins</span></div>
        <div className="ps-item"><strong>{JSON.parse(localStorage.getItem('dostt_streak') || '{}').streak ?? 0}</strong><span>Streak 🔥</span></div>
        <div className="ps-item"><strong>3</strong><span>Calls</span></div>
      </div>
      <div className="profile-card">
        <div className="pc-row"><span>🌐</span><span>Language filter</span><span className="pc-val">Hindi, English</span></div>
        <div className="pc-row"><span>📍</span><span>Location</span><span className="pc-val">Mumbai</span></div>
      </div>
      <p className="attr-note">Built by <strong>Srikant Hamsa</strong> · Dostt AI Business Associate Assignment<br /><span>Powered by Claude Code</span></p>
    </div>
  )
}

// ── Nav icons ────────────────────────────────────────────────────────────────
function IcoHome({ on }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        fill={on ? '#7C3AED' : 'none'} stroke={on ? '#7C3AED' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  )
}
function IcoDia({ on }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={on ? '#7C3AED' : 'none'} stroke={on ? '#7C3AED' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M19 16L19.8 18.2L22 19L19.8 19.8L19 22L18.2 19.8L16 19L18.2 18.2L19 16Z"
        fill={on ? '#7C3AED' : 'rgba(255,255,255,0.4)'}/>
    </svg>
  )
}
function IcoRecents({ on }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={on ? '#7C3AED' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"/>
      <path d="M12 7V12L15 14.5" stroke={on ? '#7C3AED' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}
function IcoProfile({ on }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={on ? '#7C3AED' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"/>
      <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20"
        stroke={on ? '#7C3AED' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

const TABS = [
  { id: 'home',    lbl: 'Home',    Ico: IcoHome    },
  { id: 'dia',     lbl: 'Dia',     Ico: IcoDia     },
  { id: 'recents', lbl: 'Recents', Ico: IcoRecents },
  { id: 'profile', lbl: 'Profile', Ico: IcoProfile },
]

export default function App() {
  const [entered, setEntered] = useState(false)
  const [tab, setTab]         = useState('home')
  const [homeKey, setHomeKey] = useState(0)
  const [coins, setCoins]     = useState(() => JSON.parse(localStorage.getItem('dostt_coins') || '50'))

  const addCoins = n => setCoins(c => {
    const next = c + n; localStorage.setItem('dostt_coins', next); return next
  })
  const spendCoins = n => setCoins(c => {
    const next = Math.max(0, c - n); localStorage.setItem('dostt_coins', next); return next
  })

  if (!entered) return (
    <div className="app">
      <LandingScreen onEnter={() => setEntered(true)} />
    </div>
  )

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <DosttLogo size={28} />
          <span className="dostt-wordmark">dostt</span>
        </div>
        <div className="coin-pill">
          <Coin size={18} />
          <span>{coins}</span>
        </div>
      </header>

      <main className="app-main">
        {tab === 'home'    && <HomeScreen key={homeKey} coins={coins} addCoins={addCoins} />}
        {tab === 'dia'     && <DiaChat />}
        {tab === 'recents' && <Recents />}
        {tab === 'profile' && <Profile coins={coins} />}
      </main>

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-btn${tab === t.id ? ' on' : ''}`} onClick={() => { setTab(t.id); if (t.id === 'home') setHomeKey(k => k + 1) }}>
            <t.Ico on={tab === t.id} />
            <span className="nav-lbl">{t.lbl}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
