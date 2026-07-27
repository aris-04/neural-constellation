'use client';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 30%, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(37,99,235,0.2) 0%, transparent 60%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '2.5rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <h1 style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 900,
            letterSpacing: '-0.04em', margin: 0,
            background: 'linear-gradient(135deg, #fff 0%, #e9d5ff 50%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Neural
          </h1>
          <h1 style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 900,
            letterSpacing: '-0.04em', margin: 0,
            background: 'linear-gradient(135deg, #60a5fa 0%, #c4b5fd 50%, #fff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Constellation
          </h1>
        </div>

        <button
          onClick={() => { window.location.href = '/visualizer'; }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', padding: '16px 48px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: '#fff', fontWeight: 700, fontSize: '1.1rem',
            border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', letterSpacing: '0.01em',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 20px 60px rgba(124,58,237,0.5)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Launch Visualizer
        </button>
      </div>
    </main>
  );
}