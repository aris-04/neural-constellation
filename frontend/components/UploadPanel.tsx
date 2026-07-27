'use client';

import { useRef, useState } from 'react';
import { useAudioStore } from '@/lib/audioStore';

const BACKEND = 'http://localhost:8000';

export default function UploadPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const lyricsRef = useRef<HTMLTextAreaElement>(null);
  const [trackInput, setTrackInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    setTrack, setAnalysis, setLyrics,
    setAudioElement, setIsAnalyzing, isAnalyzing,
    audioElement, isPlaying, setPlaying,
    setCurrentTime, updateCurrentLyric,
  } = useAudioStore();

  const handleFile = (file: File) => {
    if (!file.type.includes('audio')) return;
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);

    const trackName = trackInput || selectedFile.name.replace('.mp3', '');
    const artistName = artistInput || 'Unknown Artist';
    const trackId = `${trackName}-${artistName}`.replace(/\s+/g, '-').toLowerCase();

    setTrack(trackId, trackName, artistName);

    const lyricsRaw = lyricsRef.current?.value ?? '';
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('track_id', trackId);
    formData.append('lyrics', lyricsRaw);

    try {
      console.log('Fetching:', `${BACKEND}/analysis/upload`);
      const r = await fetch(`${BACKEND}/analysis/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await r.json();
      setAnalysis(data.analysis);
      setLyrics(data.lyrics);
    } catch (err) {
      console.error('Analysis failed', err);
    }

    const url = URL.createObjectURL(selectedFile);
    const audio = new Audio(url);
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      updateCurrentLyric(audio.currentTime);
    });
    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => setPlaying(false));
    setAudioElement(audio);
    setIsAnalyzing(false);
  };

  const togglePlay = () => {
    if (!audioElement) return;
    if (isPlaying) audioElement.pause();
    else audioElement.play();
  };

  return (
    <div style={{
      position: 'absolute', top: '1rem', left: '1rem', zIndex: 20,
      width: '300px',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <p style={{ color: '#fff', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
        Upload Track
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#a855f7' : selectedFile ? '#22c55e' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '10px', padding: '16px', textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? 'rgba(168,85,247,0.1)' : selectedFile ? 'rgba(34,197,94,0.05)' : 'transparent',
        }}
      >
        <input
          ref={fileRef} type="file" accept="audio/mp3,audio/mpeg"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <p style={{ color: selectedFile ? '#22c55e' : '#6b7280', fontSize: '13px', margin: 0 }}>
          {selectedFile ? selectedFile.name : 'Drop MP3 or click to browse'}
        </p>
      </div>

      <input
        type="text" placeholder="Track name (optional)"
        value={trackInput} onChange={(e) => setTrackInput(e.target.value)}
        style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px',
          outline: 'none', fontFamily: 'inherit',
        }}
      />

      <input
        type="text" placeholder="Artist name (optional)"
        value={artistInput} onChange={(e) => setArtistInput(e.target.value)}
        style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px',
          outline: 'none', fontFamily: 'inherit',
        }}
      />

      <textarea
        ref={lyricsRef}
        placeholder={'Paste lyrics here (optional)\nOne line per row'}
        rows={3}
        style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px',
          outline: 'none', resize: 'none', fontFamily: 'inherit',
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={!selectedFile || isAnalyzing}
        style={{
          background: (!selectedFile || isAnalyzing) ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
          color: (!selectedFile || isAnalyzing) ? '#6b7280' : '#fff',
          border: 'none', borderRadius: '8px', padding: '10px',
          fontWeight: 600, fontSize: '14px', cursor: (!selectedFile || isAnalyzing) ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze & Load'}
      </button>

      {audioElement && (
        <button
          onClick={togglePlay}
          style={{
            background: 'rgba(255,255,255,0.08)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
            padding: '10px', fontWeight: 600, fontSize: '14px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      )}
    </div>
  );
}