uniform float uTime;
uniform float uBeat;
varying float vRandom;
varying float vBeat;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  if (dist > 0.5) discard;

  float sparkle = abs(sin(uv.x * 20.0)) * abs(cos(uv.y * 20.0));
  sparkle = pow(sparkle, 8.0) * 0.8;

  float core = 1.0 - smoothstep(0.0, 0.15, dist);
  float glow = 1.0 - smoothstep(0.0, 0.5, dist);
  glow = pow(glow, 2.0);

  float alpha = core * 0.9 + glow * 0.1 + sparkle * 0.4;
  alpha *= 0.15 + vRandom * 0.2;
  alpha *= 1.0 + vBeat * 1.5;

  float hue = vRandom * 0.5 + uTime * 0.04;
  vec3 coreColor = vec3(
    0.6 + 0.4 * sin(hue * 6.28318 + 1.5),
    0.6 + 0.4 * sin(hue * 6.28318 + 3.0),
    0.9 + 0.1 * sin(hue * 6.28318 + 4.5)
  );

  vec3 sparkleColor = vec3(1.0, 1.0, 1.0);
  vec3 col = mix(coreColor, sparkleColor, sparkle * 0.6);
  col = mix(col, vec3(1.0, 0.8, 0.3), vBeat * 0.5);
  col *= 0.3 + vBeat * 0.4;

  gl_FragColor = vec4(col, alpha);
}