import DosttLogo from './DosttLogo'
import { Phone, Globe, Video, TrendingUp, ArrowRight } from 'lucide-react'

const EXPERIMENTS = [
  {
    num: '01',
    icon: <Phone size={20} color="white" />,
    name: 'First Call Free',
    problem: "Coin barrier blocks trial. High drop-off before first call.",
    hypothesis: 'Free first call + listener preview = higher activation & purchase rate.',
    metric: 'Activation Rate · Conversion',
    color: '#7C3AED',
  },
  {
    num: '02',
    icon: <Globe size={20} color="white" />,
    name: 'Language & City Filter',
    problem: "Mismatched listeners = disconnected, short calls.",
    hypothesis: "Local filters boost relevance. Longer calls = higher retention.",
    metric: 'D7 Retention · Session Length',
    color: '#2563EB',
  },
  {
    num: '03',
    icon: <Video size={20} color="white" />,
    name: 'Live Streams & Streaks',
    problem: 'Zero engagement on days users don\'t want to call.',
    hypothesis: 'Streams + streak rewards build a daily habit without forcing calls.',
    metric: 'DAU · Session Depth',
    color: '#059669',
  },
]

export default function LandingScreen({ onEnter }) {
  return (
    <div className="landing">
      {/* ── Hero ── */}
      <div className="landing-hero">
        <DosttLogo size={64} />
        <div className="landing-brand">dostt</div>
        <div className="landing-byline">Retention Experiments</div>
        <div className="landing-author">by <strong>Srikant Hamsa</strong></div>
      </div>

      {/* ── Context ── */}
      <div className="landing-context">
        <p>
          Dostt connects people. The core loop breaks at 3 key points.
          Here are 3 experiments to fix them.
        </p>
      </div>

      {/* ── Experiments ── */}
      <div className="landing-experiments">
        {EXPERIMENTS.map(e => (
          <div key={e.num} className="le-card">
            <div className="le-head">
              <div className="le-num" style={{ background: e.color }}>{e.num}</div>
              <div className="le-icon">{e.icon}</div>
              <div className="le-name">{e.name}</div>
            </div>
            <div className="le-section-label">Problem</div>
            <div className="le-text">{e.problem}</div>
            <div className="le-section-label">Hypothesis</div>
            <div className="le-text">{e.hypothesis}</div>
            <div className="le-metric">
              <span className="le-metric-label"><TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} /> Moves</span>
              <span>{e.metric}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="landing-cta-wrap">
        <button className="landing-cta" onClick={onEnter}>
          Explore prototype <ArrowRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
        </button>
      </div>
    </div>
  )
}
