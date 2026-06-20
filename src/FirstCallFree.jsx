import { useState, useEffect } from 'react'
import { Star, Zap, Heart, Gift, MessageCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react'
import DosttLogo from './DosttLogo'
import GoldCoin from './GoldCoin'

const EXPERTS = [
  { id: 1, name: 'Priya Sharma',  tag: 'Life Coach',        rating: 4.9, em: <Star size={24} color="#EAB308" fill="#EAB308" />, wait: '< 1 min', reviews: 2340, bio: 'Helps you find clarity when life feels heavy.' },
  { id: 2, name: 'Neha Desai',  tag: 'Relationship Guide', rating: 4.8, em: <Heart size={24} color="#EC4899" fill="#EC4899" />, wait: '2 min',   reviews: 1820, bio: 'Real talk about love, heartbreak & healing.' },
  { id: 3, name: 'Kavya Nair',   tag: 'Motivator',          rating: 4.7, em: <Zap size={24} color="#3B82F6" fill="#3B82F6" />, wait: '< 1 min', reviews: 3100, bio: 'Turn your worst day into your best lesson.' },
]

const PACKS = [
  { coins: 100, price: '₹49',  label: 'Starter'    },
  { coins: 300, price: '₹129', label: 'Popular', hot: true },
  { coins: 700, price: '₹249', label: 'Best Value'  },
]

const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function FirstCallFree({ addCoins }) {
  const wasClaimed = localStorage.getItem('dostt_free_claimed') === 'true'
  const [step, setStep]       = useState(wasClaimed ? 'done' : 'claim')
  const [adTimer, setAdTimer] = useState(8)
  const [canSkip, setCanSkip] = useState(false)
  const [callTimer, setCallTimer] = useState(300)
  const [expert, setExpert]   = useState(null)
  const [rating, setRating]   = useState(0)
  const [bought, setBought]   = useState(null)

  // "Feature ad" — counts down showing listener info
  useEffect(() => {
    if (step !== 'ad') return
    const t = setInterval(() => {
      setAdTimer(prev => {
        if (prev <= 1) { clearInterval(t); setCanSkip(true); return 0 }
        if (prev <= 5)  setCanSkip(true)
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [step])

  useEffect(() => {
    if (step !== 'call') return
    const t = setInterval(() => {
      setCallTimer(prev => {
        if (prev <= 1) { clearInterval(t); endCall(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [step])

  const endCall = () => {
    localStorage.setItem('dostt_free_claimed', 'true')
    setStep('done')
  }

  // ── CLAIM ─────────────────────────────────────────────────────────────────
  if (step === 'claim') return (
    <div className="screen center">
      <DosttLogo size={48} />
      <div className="free-hero" style={{ marginTop: 12 }}>
        <div className="free-timer shimmer-text">Ends in 24:00:00</div>
        <div className="free-badge">FREE</div>
        <div className="free-ghost"><Gift size={32} color="#F59E0B" /></div>
      </div>
      <div>
        <h2>Your first call is on us!</h2>
        <p className="sub">5 minutes, zero coins. Talk to a real expert listener right now.</p>
      </div>

      <div className="how-it-works">
        <div className="hiw-title">Why use Dostt?</div>
        <div className="hiw-row">
          <span><MessageCircle size={20} color="#7C3AED" /></span>
          <p><strong>Find Clarity</strong> — talk through your thoughts with someone who actually listens and understands without judgement.</p>
        </div>
        <div className="hiw-row">
          <span><ShieldCheck size={20} color="#059669" /></span>
          <p><strong>100% Anonymous</strong> — your privacy is our priority. Share openly knowing your identity is completely safe with us.</p>
        </div>
        <div className="hiw-row">
          <span><Clock size={20} color="#2563EB" /></span>
          <p><strong>Available 24/7</strong> — whether it's 2 PM or 2 AM, there is always a friendly voice ready to hear you out.</p>
        </div>
      </div>

      <div className="ob-steps">
        <div className="ob-step"><span className="ob-num">1</span><p>Meet your listener</p></div>
        <div className="ob-arrow">→</div>
        <div className="ob-step"><span className="ob-num">2</span><p>Pick &amp; connect</p></div>
        <div className="ob-arrow">→</div>
        <div className="ob-step"><span className="ob-num">3</span><p>Talk for free</p></div>
      </div>

      <button className="btn-primary" onClick={() => setStep('ad')}>Claim Free Call</button>
      <p className="metric-note">📊 Targets activation — removes coin barrier at first session</p>
    </div>
  )

  // ── FEATURE AD (listener profile preview) ─────────────────────────────────
  if (step === 'ad') {
    const preview = EXPERTS[Math.floor(Math.random() * EXPERTS.length)]
    return (
      <div className="screen center">
        <div className="feat-ad-box">
          <div className="feat-ad-tag">MEET YOUR LISTENER</div>
          <div className="feat-ad-av">{preview.em}</div>
          <div className="feat-ad-name">{preview.name}</div>
          <div className="feat-ad-role">{preview.tag}</div>
          <p className="feat-ad-bio">"{preview.bio}"</p>
          <div className="feat-ad-stats">
            <div className="fas-item"><strong>⭐ {preview.rating}</strong><span>Rating</span></div>
            <div className="fas-item"><strong>{preview.reviews.toLocaleString()}</strong><span>Calls</span></div>
            <div className="fas-item"><strong>{preview.wait}</strong><span>Wait</span></div>
          </div>
          <div className="feat-ad-reviews">
            <div className="review-chip">"Changed my perspective completely" ★★★★★</div>
            <div className="review-chip">"Felt heard for the first time" ★★★★★</div>
          </div>
        </div>
        {canSkip
          ? <button className="btn-primary" onClick={() => setStep('pick')}>Choose My Listener →</button>
          : <p className="sub" style={{ marginTop: 8 }}>Loading available listeners… {adTimer}s</p>
        }
        <p className="metric-note">📊 Builds trust before first call — increases completion rate</p>
      </div>
    )
  }

  // ── PICK ──────────────────────────────────────────────────────────────────
  if (step === 'pick') return (
    <div className="screen">
      <div>
        <h2>Choose your listener</h2>
        <p className="sub">All verified. Available now. Your call is FREE 🎁</p>
      </div>
      <div className="expert-cards">
        {EXPERTS.map(e => (
          <div key={e.id} className={`expert-card${expert?.id === e.id ? ' card-sel' : ''}`} onClick={() => setExpert(e)}>
            <div className="expert-av">{e.em}</div>
            <div className="expert-info">
              <div className="expert-name">{e.name}</div>
              <div className="expert-tag">{e.tag}</div>
              <div className="expert-stats"><Star size={12} fill="currentColor" style={{ display: 'inline', position: 'relative', top: '-1px' }} /> {e.rating} · Wait {e.wait}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{e.bio}</div>
            </div>
            {expert?.id === e.id && <span className="card-check">✓</span>}
          </div>
        ))}
      </div>
      <button className="btn-primary" disabled={!expert} onClick={() => setStep('call')}>
        {expert ? `Start Free Call with ${expert.name.split(' ')[0]}` : 'Select a listener'}
      </button>
    </div>
  )

  // ── CALL ──────────────────────────────────────────────────────────────────
  if (step === 'call') return (
    <div className="screen center">
      <div className="call-card">
        <div className="call-av">{expert.em}</div>
        <h2 style={{ marginTop: 12 }}>{expert.name}</h2>
        <p style={{ color: 'var(--purple)', fontWeight: 600, fontSize: 13, marginBottom: 16 }}>{expert.tag}</p>
        <div className="call-timer-disp">{fmt(callTimer)}</div>
        <div className="call-status"><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block', marginRight: 6 }} /> Connected · FREE call</div>
        <div className="sound-waves">
          {[...Array(5)].map((_, i) => <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
        <div className="call-listener-note"><Heart size={14} fill="currentColor" style={{ display: 'inline', position: 'relative', top: '2px', marginRight: '4px' }} /> {expert.name.split(' ')[0]} is here for you</div>
        <button className="end-btn" onClick={endCall}>End Call</button>
      </div>
    </div>
  )

  // ── DONE ──────────────────────────────────────────────────────────────────
  if (step === 'done') return (
    <div className="screen center">
      <div style={{ fontSize: 52 }}><Sparkles size={48} color="#F59E0B" /></div>
      <div>
        <h2>How was your call?</h2>
        <p className="sub">{expert ? `Rate your experience with ${expert.name.split(' ')[0]}` : 'Rate your experience'}</p>
      </div>
      <div className="star-row">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} className={`star-btn${rating >= s ? ' star-lit' : ''}`} onClick={() => setRating(s)}>★</button>
        ))}
      </div>
      <div className="nudge-card">
        <div className="nudge-head">
          <GoldCoin size={36} />
          <div>
            <div className="nudge-title">Keep the conversation going</div>
            <div className="nudge-sub">Buy coins to call {expert?.name?.split(' ')[0] ?? 'your listener'} again</div>
          </div>
        </div>
        <div className="pack-row">
          {PACKS.map(p => (
            <div
              key={p.coins}
              className={`pack-card${p.hot ? ' pack-hot' : ''}${bought === p.coins ? ' pack-bought' : ''}`}
              onClick={() => { addCoins(p.coins); setBought(p.coins); setTimeout(() => setBought(null), 1800) }}
            >
              {p.hot && <div className="pack-hot-lbl">🔥 Popular</div>}
              {bought === p.coins
                ? <div className="pack-coins" style={{ color: '#22C55E' }}>✓ Added!</div>
                : <div className="pack-coins"><GoldCoin size={14} /> {p.coins}</div>
              }
              <div className="pack-price">{p.price}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="metric-note">📊 Warm user + personalised nudge = highest purchase intent</p>
    </div>
  )
}
