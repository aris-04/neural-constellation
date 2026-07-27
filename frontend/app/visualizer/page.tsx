'use client';

import dynamic from 'next/dynamic';
import { useAudioStore } from '@/lib/audioStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ParticleUniverse = dynamic(() => import('@/components/ParticleUniverse'), { ssr: false });
const UploadPanel = dynamic(() => import('@/components/UploadPanel'), { ssr: false });
const LyricDisplay = dynamic(() => import('@/components/LyricDisplay'), { ssr: false });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false });

export default function Visualizer() {
  const { trackName, artistName, isPlaying } = useAudioStore();

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#000', position: 'relative', overflow: 'hidden'
    }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 70 }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={1}
      >
        <ParticleUniverse />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.3}
          zoomSpeed={0.5}
        />
      </Canvas>

      <UploadPanel />
      <LyricDisplay />
      <SettingsPanel />

      {(trackName || artistName) && (
        <div style={{
          position: 'absolute', bottom: '1rem', left: '22rem',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', padding: '12px 16px',
          pointerEvents: 'none',
        }}>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '16px', margin: 0 }}>{trackName}</p>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: '2px 0 0' }}>{artistName}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: isPlaying ? '#4ade80' : '#4b5563',
            }} />
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>
              {isPlaying ? 'Playing' : 'Paused'}
            </span>
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', top: '1rem', left: '50%',
        transform: 'translateX(-50%)', pointerEvents: 'none',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.15)', fontSize: '11px',
          letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0,
        }}>
          Neural Constellation
        </p>
      </div>
    </div>
  );
}