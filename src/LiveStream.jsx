import { useState, useEffect, useRef } from 'react'
import { Heart, Star, Zap, Target, Sparkles, Send, Eye, TrendingUp } from 'lucide-react'

const STREAMS = [
  { id: 1, streamer: 'Riya Singh',  avatar: '/avatars/avatar_blue_1781937765422.png', topic: 'Dealing with Career Anxiety',   viewers: 234, em: <Heart size={24} color="#EC4899" fill="#EC4899" />, tag: 'Mental Health',  bg: 'linear-gradient(135deg,#4C1D95,#7C3AED)' },
  { id: 2, streamer: 'Shruti Verma',  avatar: '/avatars/avatar_orange_1781937749343.png', topic: 'Breakup Recovery Stories',      viewers: 189, em: <Star size={24} color="#EAB308" fill="#EAB308" />, tag: 'Relationships',   bg: 'linear-gradient(135deg,#1E3A5F,#2563EB)' },
  { id: 3, streamer: 'Ananya K',    avatar: '/avatars/avatar_red_1781937779884.png', topic: 'Morning Motivation Session',     viewers: 412, em: <Zap size={24} color="#3B82F6" fill="#3B82F6" />, tag: 'Motivation',      bg: 'linear-gradient(135deg,#14532D,#16A34A)' },
  { id: 4, streamer: 'Megha R',     avatar: '/avatars/avatar_purple_1781937797935.png', topic: 'Work Stress & Burnout',          viewers: 156, em: <Target size={24} color="#F97316" fill="#F97316" />, tag: 'Career',          bg: 'linear-gradient(135deg,#7C2D12,#EA580C)' },
  { id: 5, streamer: 'Sneha P',     avatar: '/avatars/avatar_blue_1781937765422.png', topic: 'Loneliness & Connection',        viewers: 98,  em: <Sparkles size={24} color="#EC4899" fill="#EC4899" />, tag: 'Mental Health',  bg: 'linear-gradient(135deg,#831843,#DB2777)' },
]

const CHAT_POOL = [
  'This is exactly what I needed','Thank you for sharing',
  'I went through something similar','Can you share more on this?',
  'Sending love from Mumbai','This helped me so much',
  'Following for more','Real talk no filter',
  'You\'re amazing!','Same here',
  'Feeling seen','Bahut helpful hai yeh',
  'Dil se shukriya','Keep going!',
  'First time here and loving it','So true',
  'This saved my day','Sharing with my bestie',
  'Gyaan le rahe hain','Bilkul sahi baat',
]
const USERS = ['pooja_23','rani_s','meera_k','anita99','priya_p','roshni_m','kavitha_r','sita_v','nisha_t','anjali_d']

let msgId = 0
const rndMsg = () => ({
  id: ++msgId,
  user:  USERS[Math.floor(Math.random() * USERS.length)],
  text:  CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)],
})

const SEED = Array.from({ length: 6 }, rndMsg)

export default function LiveStream({ onBack }) {
  const [activeId, setActiveId]   = useState(null)
  const [messages, setMessages]   = useState(SEED)
  const [input, setInput]         = useState('')
  const [hearts, setHearts]       = useState([])
  const [viewers, setViewers]     = useState(
    Object.fromEntries(STREAMS.map(s => [s.id, s.viewers]))
  )
  const [pts, setPts]             = useState(0)
  const chatRef = useRef(null)

  const active = STREAMS.find(s => s.id === activeId)

  // Viewer count drift
  useEffect(() => {
    const t = setInterval(() => {
      setViewers(prev => {
        const next = { ...prev }
        STREAMS.forEach(s => {
          next[s.id] = Math.max(10, prev[s.id] + Math.floor(Math.random() * 9) - 4)
        })
        return next
      })
    }, 3000)
    return () => clearInterval(t)
  }, [])

  // Live chat simulation
  useEffect(() => {
    if (!activeId) return
    const delay = () => 1200 + Math.random() * 2200
    let t
    const schedule = () => { t = setTimeout(() => { setMessages(p => [...p, rndMsg()].slice(-40)); schedule() }, delay()) }
    schedule()
    return () => clearTimeout(t)
  }, [activeId])

  // Points ticker
  useEffect(() => {
    if (!activeId) return
    const t = setInterval(() => setPts(p => p + 1), 4000)
    return () => clearInterval(t)
  }, [activeId])

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  const sendHeart = () => {
    const id = Date.now()
    setHearts(p => [...p, { id, x: 30 + Math.random() * 40 }])
    setTimeout(() => setHearts(p => p.filter(h => h.id !== id)), 1400)
  }

  const sendMsg = () => {
    if (!input.trim()) return
    setMessages(p => [...p, { id: ++msgId, user: 'you', text: input }].slice(-40))
    setInput('')
  }

  // ── STREAM VIEW ───────────────────────────────────────────────────────────
  if (active) return (
    <div className="sv-wrap">
      <div className="sv-video" style={{ backgroundColor: '#000', backgroundImage: 'url(/live-preview.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="sv-top">
          <button className="sv-back" onClick={() => { setActiveId(null); setPts(0); setMessages(SEED) }}>← Back</button>
          <div className="sv-live-pill"><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginRight: 6 }} /> LIVE</div>
          <div className="sv-viewers"><Eye size={12} style={{ display: 'inline', marginRight: 4 }} /> {viewers[active.id].toLocaleString()}</div>
        </div>
        <div className="sv-overlay">
          <div className="sv-name">{active.streamer}</div>
          <div className="sv-tag">{active.tag}</div>
        </div>
        <div className="sv-pts">+{pts} pts</div>
        {hearts.map(h => (
          <div key={h.id} className="float-heart" style={{ left: `${h.x}%` }}><Heart size={24} fill="#ef4444" color="#ef4444" /></div>
        ))}
      </div>

      <div className="sv-bottom">
        <div className="chat-area" ref={chatRef}>
          {messages.map(m => (
            <div key={m.id} className={`chat-row${m.user === 'you' ? ' chat-mine' : ''}`}>
              <span className="chat-user">{m.user}</span>
              <span className="chat-text">{m.text}</span>
            </div>
          ))}
        </div>
        <div className="chat-bar">
          <input
            className="chat-inp"
            placeholder="Say something…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
          />
          <button className="chat-heart" onClick={sendHeart}><Heart size={22} fill="currentColor" color="currentColor" /></button>
          <button className="chat-send" onClick={sendMsg}><Send size={16} /></button>
        </div>
      </div>
    </div>
  )

  // ── STREAM LIST ───────────────────────────────────────────────────────────
  return (
    <div className="screen">
      <div>
        <button className="back-dark" style={{ marginBottom: '16px', padding: 0 }} onClick={onBack}>← Back</button>
        <h2>Live Now <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginLeft: 4 }} /></h2>
        <p className="sub">Real conversations happening right now. Watch, react, earn points.</p>
      </div>
      <div className="stream-list">
        {STREAMS.map(s => (
          <div key={s.id} className="stream-card" onClick={() => setActiveId(s.id)}>
            <div className="sc-av" style={!s.avatar ? { background: s.bg } : {}}>
              {s.avatar ? <img src={s.avatar} alt={s.streamer} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : s.em}
            </div>
            <div className="sc-info">
              <div className="sc-name">{s.streamer}</div>
              <div className="sc-topic">{s.topic}</div>
              <div className="sc-meta">
                <span className="sc-live"><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginRight: 4 }} /> LIVE</span>
                <span>{viewers[s.id].toLocaleString()} watching</span>
                <span className="sc-tag">{s.tag}</span>
              </div>
            </div>
            <div className="sc-arrow">›</div>
          </div>
        ))}
      </div>
      <p className="metric-note"><TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} /> Targets session time + DAU via passive discovery loop</p>
    </div>
  )
}
