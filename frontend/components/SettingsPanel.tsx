'use client';

import { useState } from 'react';
import { useAudioStore } from '@/lib/audioStore';

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { particleSize, gravity, setParticleSize, setGravity } = useAudioStore();

  return (
    <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 20 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', fontSize: '18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ⚙
      </button>
      {open && (
        <div style={{
          marginTop: '8px', padding: '16px', width: '240px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            GPU Controls
          </p>
          <SliderRow label="Particle Size" value={particleSize} min={0.2} max={3} step={0.1} onChange={setParticleSize} />
          <SliderRow label="Gravity" value={gravity} min={0} max={2} step={0.05} onChange={setGravity} />
        </div>
      )}
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>{label}</span>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value.toFixed(1)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#a855f7' }}
      />
    </div>
  );
}