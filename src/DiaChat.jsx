import { useState, useEffect, useRef } from 'react'
import { Bot, Phone, Send, User, Radio } from 'lucide-react'

const DIA_AVATAR = <Bot size={16} />

const GREET = "Hey! I'm Dia. I'm here whenever you need someone to talk to. What's on your mind today?"

const RESPONSES = [
  { keys: ['sad','cry','crying','upset','down','lonely','alone'],
    replies: ["Hey, I hear you. It's okay to feel that way. Tell me more — what happened?","You don't have to carry this alone. I'm right here. What's been going on?","Sending you a big virtual hug! Want to talk about what's making you feel this way?"] },
  { keys: ['happy','excited','great','amazing','good','awesome'],
    replies: ["Yay! That makes me so happy to hear! Tell me everything.","Aww that's wonderful! You deserve all the good things. What happened?","YES! That energy is everything. I love when you're in a good mood!"] },
  { keys: ['love','relationship','boyfriend','girlfriend','crush','dating','breakup','broke up'],
    replies: ["Ooh relationships! This is my zone. Tell me more — what's the situation?","Hearts can be complicated. I'm all ears. What's happening with you two?","Love is beautiful but also messy sometimes. What's going on?"] },
  { keys: ['work','job','stress','boss','career','office','colleague'],
    replies: ["Work stress is so real. What's been happening at work?","Ugh, that sounds exhausting. Your feelings are valid. Tell me more?","Career stuff can feel so heavy. I'm listening. What's the situation?"] },
  { keys: ['family','mom','dad','parents','sister','brother','home'],
    replies: ["Family dynamics can be so complex. What's going on at home?","I get it — family can be both everything and sometimes overwhelming. What happened?","Tell me about it. What's going on with them?"] },
  { keys: ['bored','boring','nothing','ok','fine','idk','idk'],
    replies: ["Come on, something must be up! Tell me one thing that happened today.","Boring days need a little spark. Want to play 20 questions?","Okayy fine then — I'll go first. If you could be anywhere right now, where would you be?"] },
  { keys: ['hi','hello','hey','hii','heyy','sup','wassup'],
    replies: ["Heyyy! So good to hear from you. How are you feeling today?","Hi hi! I was waiting for you! What's up?","Heyy! Talk to me — how's your day going?"] },
  { keys: ['call','voice','talk','speak'],
    replies: ["Aww you want to hear my voice? Hit that voice call button below and let's chat for real!","I'd love that! Voice calls feel so much more personal. Tap the call button anytime!"] },
]

const DEFAULT_REPLIES = [
  "Tell me more. I'm fully here for you.","Hmm, interesting! Say more?","I feel like there's something deeper here. What's really going on?","You know you can tell me anything, right?","That's a lot to carry. How are you coping?","I'm listening. Keep going.",
]

function getDiaReply(text) {
  const lower = text.toLowerCase()
  for (const r of RESPONSES) {
    if (r.keys.some(k => lower.includes(k))) {
      return r.replies[Math.floor(Math.random() * r.replies.length)]
    }
  }
  return DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)]
}

let msgId = 10

export default function DiaChat() {
  const [messages, setMessages] = useState([{ id: 1, from: 'dia', text: GREET }])
  const [input, setInput]       = useState('')
  const [typing, setTyping]     = useState(false)
  const [calling, setCalling]   = useState(false)
  const [callSecs, setCallSecs] = useState(0)
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  useEffect(() => {
    if (!calling) return
    const t = setInterval(() => setCallSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [calling])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg = { id: ++msgId, from: 'user', text }
    setMessages(p => [...p, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(p => [...p, { id: ++msgId, from: 'dia', text: getDiaReply(text) }])
    }, 900 + Math.random() * 800)
  }

  const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  if (calling) return (
    <div className="screen center" style={{ height: '100%' }}>
      <div className="call-card">
        <div style={{ fontSize: 64 }}><User size={64} /></div>
        <h2 style={{ marginTop: 24 }}>Dia</h2>
        <p style={{ color: 'var(--purple)', fontWeight: 600, fontSize: 13, marginBottom: 16 }}>AI Companion</p>
        <div className="call-timer-disp">{fmt(callSecs)}</div>
        <div className="call-status"><Radio size={14} style={{ marginRight: 4 }} /> Connected · AI Voice Call</div>
        <div className="sound-waves">
          {[...Array(5)].map((_,i) => <div key={i} className="wave-bar" style={{ animationDelay: `${i*0.15}s` }} />)}
        </div>
        <button className="end-btn" onClick={() => { setCalling(false); setCallSecs(0) }}>End Call</button>
      </div>
    </div>
  )

  return (
    <div className="dia-wrap">
      {/* Header */}
      <div className="dia-header">
        <div className="dia-av-wrap">
          <div className="dia-av">👩</div>
          <div className="dia-online" />
        </div>
        <div className="dia-info">
          <div className="dia-name">Dia</div>
          <div className="dia-status">● Online · AI Companion</div>
        </div>
        <button className="dia-call-btn" onClick={() => setCalling(true)}><Phone size={20} /></button>
      </div>

      {/* Chat */}
      <div className="dia-chat" ref={chatRef}>
        {messages.map(m => (
          <div key={m.id} className={`dia-msg ${m.from === 'user' ? 'dia-msg-user' : 'dia-msg-dia'}`}>
            {m.from === 'dia' && <div className="dia-msg-av"><Bot size={16} color="white" /></div>}
            <div className="dia-bubble">{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="dia-msg dia-msg-dia">
            <div className="dia-msg-av"><Bot size={16} color="white" /></div>
            <div className="dia-bubble dia-typing"><span /><span /><span /></div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="dia-input-bar">
        <input
          className="chat-inp"
          placeholder="Say something to Dia…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="chat-send" onClick={send}><Send size={16} /></button>
      </div>
    </div>
  )
}
