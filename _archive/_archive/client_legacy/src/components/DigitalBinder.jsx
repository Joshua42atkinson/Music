import React, { useState, useEffect } from 'react';

const DigitalBinder = () => {
  const [practiceTime, setPracticeTime] = useState(() => {
    const saved = localStorage.getItem('bertrand_practice_time');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('bertrand_habits');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Checked Shoulder Posture", completed: false },
      { id: 2, name: "Tuned Guitar", completed: false },
      { id: 3, name: "Reviewed CAGED Maps", completed: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bertrand_practice_time', practiceTime.toString());
  }, [practiceTime]);

  useEffect(() => {
    localStorage.setItem('bertrand_habits', JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const resetDaily = () => {
    setHabits(habits.map(h => ({ ...h, completed: false })));
  };

  const binderStyle = {
    background: 'linear-gradient(145deg, #1e1e2f, #2a2a40)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
    color: '#e0e0ff',
    fontFamily: "'Inter', sans-serif",
    maxWidth: '500px',
    margin: '2rem auto',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  };

  const headerStyle = {
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    background: '-webkit-linear-gradient(#ff8a00, #ff4e50)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  };

  const listItemStyle = (completed) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '1.2rem',
    background: completed ? 'rgba(46, 229, 113, 0.05)' : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    marginBottom: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderLeft: completed ? '4px solid #2ee571' : '4px solid transparent',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
  });

  return (
    <div style={binderStyle}>
      <h2 style={headerStyle}>The Digital Binder</h2>
      <p style={{ textAlign: 'center', color: '#a0a0c0', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Track your mindful repetition. Your progress is saved automatically.
      </p>
      
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '3.5rem', margin: '0', color: '#ff8a00', fontWeight: '800' }}>
          {practiceTime} <span style={{ fontSize: '1.2rem', color: '#a0a0c0', fontWeight: '500' }}>MINUTES</span>
        </h3>
        <button 
          onClick={() => setPracticeTime(t => t + 5)}
          style={{
            background: 'linear-gradient(90deg, rgba(255, 138, 0, 0.2), rgba(255, 78, 80, 0.2))',
            border: '1px solid rgba(255, 138, 0, 0.5)',
            color: '#ff8a00',
            padding: '0.8rem 2rem',
            borderRadius: '30px',
            marginTop: '1.5rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => e.target.style.background = 'linear-gradient(90deg, rgba(255, 138, 0, 0.4), rgba(255, 78, 80, 0.4))'}
          onMouseLeave={(e) => e.target.style.background = 'linear-gradient(90deg, rgba(255, 138, 0, 0.2), rgba(255, 78, 80, 0.2))'}
        >
          + Log 5 Mins
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Pre-Practice Checklist</h4>
          <button 
            onClick={resetDaily}
            style={{ background: 'none', border: 'none', color: '#a0a0c0', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
          >
            Reset Daily
          </button>
        </div>
        
        {habits.map(habit => (
          <div 
            key={habit.id} 
            style={listItemStyle(habit.completed)}
            onClick={() => toggleHabit(habit.id)}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '6px',
              border: '2px solid',
              borderColor: habit.completed ? '#2ee571' : '#555',
              background: habit.completed ? '#2ee571' : 'rgba(0,0,0,0.3)',
              marginRight: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}>
              {habit.completed && <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>✓</span>}
            </div>
            <span style={{ 
              textDecoration: habit.completed ? 'line-through' : 'none',
              color: habit.completed ? '#666' : '#fff',
              fontSize: '1.05rem',
              transition: 'all 0.3s ease'
            }}>
              {habit.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalBinder;
