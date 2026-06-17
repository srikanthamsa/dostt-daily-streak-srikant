import React, { useState } from 'react';
import { Coins, Flame, Gift, Sparkles, X } from 'lucide-react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(1250);
  const [streak, setStreak] = useState(4);
  const [boxState, setBoxState] = useState('closed'); // 'closed', 'opening', 'opened'
  const [reward, setReward] = useState(0);

  const days = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', active: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
  ];

  const handleOpenBox = () => {
    if (boxState !== 'closed') return;
    
    setBoxState('opening');
    
    // Simulate API call and box animation
    setTimeout(() => {
      const earned = Math.floor(Math.random() * 50) + 50; // Random reward between 50-100
      setReward(earned);
      setCoins(prev => prev + earned);
      setStreak(prev => prev + 1);
      setBoxState('opened');
    }, 1500);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div>
          <h1 className="title">Dostt</h1>
          <p className="subtitle">Daily check-in</p>
        </div>
        <div className="coins-badge">
          <Coins size={18} color="var(--primary-purple)" />
          <span>{coins}</span>
        </div>
      </header>

      <div className="streak-card">
        <div className="streak-content">
          <div className="fire-icon">
            <Flame size={48} color="#f97316" fill="#f97316" />
          </div>
          <h2 className="streak-title">{streak} Day Streak!</h2>
          <p className="streak-desc">You're on fire! Keep it up to earn bigger rewards.</p>
          
          <div className="days-row">
            {days.map((d, i) => (
              <div key={i} className="day-bubble">
                <div className={`day-circle ${d.completed ? 'completed' : ''} ${d.active && boxState === 'opened' ? 'completed' : d.active ? 'active' : ''}`}>
                  {d.completed || (d.active && boxState === 'opened') ? '✓' : i + 1}
                </div>
                <span className="day-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-section">
        <div 
          className={`mystery-box-container ${boxState}`}
          onClick={handleOpenBox}
        >
          <div className="box-image">
            {boxState === 'opened' ? '🎁' : '📦'}
          </div>
        </div>
        
        <h3 className="action-title">
          {boxState === 'opened' ? "Today's reward claimed!" : "Open today's Mystery Box"}
        </h3>
        <p className="action-desc">
          {boxState === 'opened' 
            ? "Come back tomorrow to keep your streak alive." 
            : "Tap to reveal what's inside!"}
        </p>

        <button 
          className="primary-btn" 
          onClick={handleOpenBox}
          disabled={boxState !== 'closed'}
        >
          {boxState === 'closed' ? 'Claim Reward' : 
           boxState === 'opening' ? 'Opening...' : 'See you tomorrow!'}
        </button>
      </div>

      {boxState === 'opened' && reward > 0 && (
        <div className="reward-overlay">
          <Sparkles size={64} color="var(--primary-purple)" />
          <div className="reward-amount">+{reward} Coins</div>
          <h2 className="reward-title">Awesome!</h2>
          <p className="reward-subtitle">You can use these coins to talk to expert listeners.</p>
          <button className="primary-btn" onClick={() => setReward(0)}>
            Continue to Dostt
          </button>
        </div>
      )}

      <footer className="footer">
        <p>Built with ❤️ for Dostt</p>
        <p>by Srikanth Amsa</p>
      </footer>
    </div>
  );
}

export default App;
