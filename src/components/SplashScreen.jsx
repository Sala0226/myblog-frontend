import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → pulse → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('pulse'), 600);
    const t2 = setTimeout(() => setPhase('exit'), 1800);
    const t3 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #534AB7 0%, #7F77DD 50%, #AFA9EC 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.6s ease',
      opacity: phase === 'exit' ? 0 : 1,
    }}>

      {/* Logo animé */}
      <div style={{
        transform: phase === 'enter' ? 'scale(0.5) translateY(20px)' :
                   phase === 'pulse' ? 'scale(1.08) translateY(0)' :
                   'scale(1) translateY(0)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
      }}>

        {/* Logo dans cercle blanc */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '28px',
          background: 'white', display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          animation: phase === 'pulse' ? 'logoPulse 0.6s ease' : 'none'
        }}>
          <img src="/logo.png" alt="MyBlog"
            style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
        </div>

        {/* Nom */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: 0, fontSize: '32px', fontWeight: '900',
            color: 'white', letterSpacing: '-0.5px',
            textShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>My</span>Blog
          </p>
          <p style={{
            margin: '4px 0 0', fontSize: '13px',
            color: 'rgba(255,255,255,0.7)',
            fontStyle: 'italic', letterSpacing: '0.5px',
            opacity: phase === 'enter' ? 0 : 1,
            transform: phase === 'enter' ? 'translateY(8px)' : 'translateY(0)',
            transition: 'all 0.5s ease 0.3s'
          }}>
            Partagez vos idées, inspirez le monde
          </p>
        </div>
      </div>

      {/* Points de chargement */}
      <div style={{
        position: 'absolute', bottom: '60px',
        display: 'flex', gap: '8px',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.4s ease 0.5s'
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            animation: `dotBounce 1.2s ease ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes logoPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}