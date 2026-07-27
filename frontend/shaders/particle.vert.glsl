uniform float uTime;
uniform float uBeat;
uniform float uTurbulence;
uniform float uMorphProgress;
uniform float uGravity;
uniform float uParticleSize;

attribute vec3 aBasePosition;
attribute vec3 aMorphPosition;
attribute float aRandom;
attribute float aPhase;

varying float vRandom;
varying float vBeat;

float snoise(vec3 v) {
  return sin(v.x * 1.3 + uTime) * cos(v.y * 0.9 + uTime * 0.7) * sin(v.z * 1.1 + uTime * 0.5);
}

void main() {
  vec3 pos = mix(aBasePosition, aMorphPosition, uMorphProgress);
  float noiseAmp = 0.15 + uTurbulence * 1.5;
  pos.x += snoise(pos * 0.4 + vec3(uTime * 0.1)) * noiseAmp;
  pos.y += snoise(pos * 0.4 + vec3(uTime * 0.08 + 10.0)) * noiseAmp;
  pos.z += snoise(pos * 0.4 + vec3(uTime * 0.06 + 20.0)) * noiseAmp;
  pos.y += sin(uTime * 0.3 + aPhase) * uGravity * 0.3;
  pos *= 1.0 + uBeat * 0.25 * sin(aPhase * 6.28);
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vRandom = aRandom;
  vBeat = uBeat;
  float size = uParticleSize * (400.0 / -mvPosition.z);
  size *= 0.8 + aRandom * 1.2;
  size *= 1.0 + uBeat * 1.5;
  gl_PointSize = max(size, 1.5);
  gl_Position = projectionMatrix * mvPosition;
}