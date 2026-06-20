import { useState } from 'react'
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
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setActiveIndex(prev => Math.min(prev + 1, EXPERIMENTS.length - 1))
    } else if (isRightSwipe) {
      setActiveIndex(prev => Math.max(prev - 1, 0))
    }
  }

  return (
    <div className="landing" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Hero ── */}
      <div className="landing-hero" style={{ flexShrink: 0 }}>
        <DosttLogo size={64} />
        <div className="landing-brand">dostt</div>
        <div className="landing-byline">Retention Experiments</div>
        <div className="landing-author">by <strong>Srikant Hamsa</strong></div>
      </div>

      {/* ── Context ── */}
      <div className="landing-context" style={{ flexShrink: 0, paddingBottom: 0 }}>
        <p>
          Dostt connects people. The core loop breaks at 3 key points.
          Here are 3 experiments to fix them.
        </p>
      </div>

      {/* ── Experiments 3D Carousel ── */}
      <div 
        className="landing-experiments-carousel"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        <button 
          className="carousel-nav-btn left" 
          onClick={() => setActiveIndex(prev => Math.max(prev - 1, 0))}
          style={{ opacity: activeIndex === 0 ? 0.3 : 1, pointerEvents: activeIndex === 0 ? 'none' : 'auto' }}
        >
          &lsaquo;
        </button>

        <div className="carousel-container">
          {EXPERIMENTS.map((e, i) => {
            const offset = i - activeIndex
            const absOffset = Math.abs(offset)
            const isActive = offset === 0
            
            // Calculate 3D transforms
            const scale = isActive ? 1 : 0.85
            const translateX = offset === 0 ? 0 : offset > 0 ? 40 : -40
            const rotateY = offset === 0 ? 0 : offset > 0 ? -15 : 15
            const translateZ = isActive ? 20 : -60
            const zIndex = 10 - absOffset
            const opacity = isActive ? 1 : 0.4

            return (
              <div 
                key={e.num} 
                className={`le-card ${isActive ? 'active' : ''}`}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  zIndex,
                  opacity,
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <div className="le-head">
                  <div className="le-num" style={{ background: e.color }}>{e.num}</div>
                  <div className="le-icon">{e.icon}</div>
                  <div className="le-name">{e.name}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                  <div className="le-section-label" style={{ marginTop: 0 }}>Problem</div>
                  <div className="le-text">{e.problem}</div>
                  <div className="le-section-label">Hypothesis</div>
                  <div className="le-text">{e.hypothesis}</div>
                </div>
                <div className="le-metric" style={{ marginTop: 'auto' }}>
                  <span className="le-metric-label"><TrendingUp size={14} style={{ display: 'inline', marginRight: 4 }} /> Moves</span>
                  <span>{e.metric}</span>
                </div>
              </div>
            )
          })}
        </div>

        <button 
          className="carousel-nav-btn right" 
          onClick={() => setActiveIndex(prev => Math.min(prev + 1, EXPERIMENTS.length - 1))}
          style={{ opacity: activeIndex === EXPERIMENTS.length - 1 ? 0.3 : 1, pointerEvents: activeIndex === EXPERIMENTS.length - 1 ? 'none' : 'auto' }}
        >
          &rsaquo;
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        {EXPERIMENTS.map((_, i) => (
          <div 
            key={i} 
            onClick={() => setActiveIndex(i)}
            style={{ 
              width: '8px', height: '8px', borderRadius: '50%', 
              background: i === activeIndex ? 'var(--purple-bright)' : 'rgba(255,255,255,0.2)',
              cursor: 'pointer', transition: 'background 0.3s'
            }}
          />
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="landing-cta-wrap" style={{ flexShrink: 0 }}>
        <button className="landing-cta" onClick={onEnter}>
          Explore prototype <ArrowRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
        </button>
      </div>
    </div>
  )
}
