'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioStore } from '@/lib/audioStore';
import vertexShader from '@/shaders/particle.vert.glsl';
import fragmentShader from '@/shaders/particle.frag.glsl';

const PARTICLE_COUNT = 50000;

function generateGalaxyPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const arms = 4;
  for (let i = 0; i < count; i++) {
    const arm = i % arms;
    const t = Math.random();
    const radius = Math.pow(t, 0.5) * 20 + 0.5;
    const spin = radius * 0.4;
    const angle =
      (arm / arms) * Math.PI * 2 + spin + (Math.random() - 0.5) * 0.6;
    const scatter = (1 - t) * 2.5 + 0.8;
    positions[i * 3] =
      Math.cos(angle) * radius + (Math.random() - 0.5) * scatter;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
    positions[i * 3 + 2] =
      Math.sin(angle) * radius + (Math.random() - 0.5) * scatter;
  }
  return positions;
}

function generateSpiralPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * Math.PI * 2 * 10;
    const radius = t * 8;
    positions[i * 3] =
      Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 1] =
      (t - 0.5) * 6 + (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 2] =
      Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3;
  }
  return positions;
}

function generateClockPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 * 24;
    const radius = 2.5 + Math.random() * 4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return positions;
}

function generateSpherePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 5 + (Math.random() - 0.5) * 2;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
}

export default function ParticleUniverse() {
  const meshRef = useRef<THREE.Points>(null);
  const morphProgressRef = useRef<number>(0);
  const targetMorphRef = useRef<number>(0);
  const currentMorphTargetRef = useRef<Float32Array | null>(null);

  const uTime = useRef({ value: 0 });
  const uBeat = useRef({ value: 0 });
  const uTurbulence = useRef({ value: 0 });
  const uMorphProgress = useRef({ value: 0 });
  const uGravity = useRef({ value: 0.3 });
  const uParticleSize = useRef({ value: 0.5 });

  const { analysis, currentTime, isPlaying, gravity, particleSize } =
    useAudioStore();

  const {
    basePositions,
    spiralPositions,
    clockPositions,
    spherePositions,
    randoms,
    phases,
  } = useMemo(() => {
    const base = generateGalaxyPositions(PARTICLE_COUNT);
    const spiral = generateSpiralPositions(PARTICLE_COUNT);
    const clock = generateClockPositions(PARTICLE_COUNT);
    const sphere = generateSpherePositions(PARTICLE_COUNT);
    const rnd = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      rnd[i] = Math.random();
      ph[i] = Math.random() * Math.PI * 2;
    }
    currentMorphTargetRef.current = base;
    return {
      basePositions: base,
      spiralPositions: spiral,
      clockPositions: clock,
      spherePositions: sphere,
      randoms: rnd,
      phases: ph,
    };
  }, []);

  useEffect(() => {
    uGravity.current.value = gravity;
  }, [gravity]);

  useEffect(() => {
    uParticleSize.current.value = particleSize * 0.5;
  }, [particleSize]);

  useEffect(() => {
    if (!analysis || !isPlaying) return;

    const trigger = analysis.morphTriggers.find(
      (t) => Math.abs(t.timestamp - currentTime) < 0.5
    );
    if (trigger) {
      if (trigger.shape === 'spiral') {
        currentMorphTargetRef.current = spiralPositions;
      } else if (trigger.shape === 'clock') {
        currentMorphTargetRef.current = clockPositions;
      } else if (trigger.shape === 'sphere') {
        currentMorphTargetRef.current = spherePositions;
      } else {
        currentMorphTargetRef.current = basePositions;
      }
      targetMorphRef.current = 1;
      setTimeout(() => {
        targetMorphRef.current = 0;
      }, 4000);
    }

    const turb = analysis.turbulenceMap.find(
      (t) => Math.abs(t.timestamp - currentTime) < 0.5
    );
    if (turb) {
      uTurbulence.current.value = turb.intensity;
      setTimeout(() => {
        uTurbulence.current.value = 0;
      }, 2000);
    }

    const isBeat = analysis.beats.some(
      (b) => Math.abs(b - currentTime) < 0.05
    );
    if (isBeat) {
      uBeat.current.value = 1.0;
    }
  }, [
    currentTime,
    analysis,
    isPlaying,
    basePositions,
    spiralPositions,
    clockPositions,
    spherePositions,
  ]);

  useFrame((state) => {
    if (!meshRef.current) return;

    uTime.current.value = state.clock.elapsedTime;
    uBeat.current.value = Math.max(0, uBeat.current.value - 0.03);

    morphProgressRef.current +=
      (targetMorphRef.current - morphProgressRef.current) * 0.02;
    uMorphProgress.current.value = morphProgressRef.current;

    if (currentMorphTargetRef.current) {
      const attr = meshRef.current.geometry.getAttribute(
        'aMorphPosition'
      ) as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      if (arr !== currentMorphTargetRef.current) {
        attr.set(currentMorphTargetRef.current);
        attr.needsUpdate = true;
      }
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(basePositions.slice(), 3)
    );
    geo.setAttribute(
      'aBasePosition',
      new THREE.BufferAttribute(basePositions.slice(), 3)
    );
    geo.setAttribute(
      'aMorphPosition',
      new THREE.BufferAttribute(basePositions.slice(), 3)
    );
    geo.setAttribute(
      'aRandom',
      new THREE.BufferAttribute(randoms, 1)
    );
    geo.setAttribute(
      'aPhase',
      new THREE.BufferAttribute(phases, 1)
    );
    return geo;
  }, [basePositions, randoms, phases]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: uTime.current,
          uBeat: uBeat.current,
          uTurbulence: uTurbulence.current,
          uMorphProgress: uMorphProgress.current,
          uGravity: uGravity.current,
          uParticleSize: uParticleSize.current,
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  );
}