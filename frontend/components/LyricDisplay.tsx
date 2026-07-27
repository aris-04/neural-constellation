'use client';

import { useAudioStore } from '@/lib/audioStore';
import { useEffect, useRef } from 'react';

export default function LyricDisplay() {
  const { currentLyric } = useAudioStore();
  const prevRef = useRef('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLyric !== prevRef.current) {
      prevRef.current = currentLyric;
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
        containerRef.current.style.transform = 'translateY(10px)';
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.opacity = '1';
            containerRef.current.style.transform = 'translateY(0)';
          }
        }, 50);
      }
    }
  }, [currentLyric]);

  return (
    <div className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-none">
      <div
        ref={containerRef}
        className="text-center px-8 py-2 transition-all duration-300"
        style={{ opacity: 1, transform: 'translateY(0)' }}
      >
        <p className="text-white text-2xl font-light tracking-wide drop-shadow-lg">
          {currentLyric}
        </p>
      </div>
    </div>
  );
}