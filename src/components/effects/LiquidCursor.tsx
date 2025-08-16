'use client'

import * as THREE from 'three'
import { useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTheme } from 'next-themes'

interface LiquidCursorProps {
  containerRef: React.RefObject<HTMLElement>
  intensity?: number
  trail?: number
}

export function LiquidCursor({ containerRef, intensity = 0.35, trail = 6 }: LiquidCursorProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        className="pointer-events-none"
      >
        <FullscreenQuad containerRef={containerRef} intensity={intensity} trail={trail} />
      </Canvas>
    </div>
  )
}

function FullscreenQuad({ containerRef, intensity, trail }: LiquidCursorProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const { resolvedTheme } = useTheme()

  const pointsRef = useRef<Array<[number, number]>>([])
  const [hoverBoost, setHoverBoost] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onMove(e: MouseEvent) {
      const targetEl = containerRef.current
      if (!targetEl) return
      const rect = targetEl.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      const pts = pointsRef.current
      pts.unshift([x, y])
      if (pts.length > (trail || 6)) pts.pop()

      // detect interactive hover (buttons, links, inputs, cards) to enhance liquid effect
      const elUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      if (elUnder) {
        const tag = elUnder.tagName.toLowerCase()
        const isInteractive = ['a', 'button', 'input', 'textarea', 'select', 'label'].includes(tag) || 
                             elUnder.closest('a,button,[role="button"],input,textarea,select,label') ||
                             elUnder.closest('.liquid-glass-card, .group, [data-interactive]') ||
                             elUnder.classList.contains('cursor-pointer') ||
                             getComputedStyle(elUnder).cursor === 'pointer'
        
        setHoverBoost(isInteractive ? 1 : 0)
      } else {
        setHoverBoost(0)
      }
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [containerRef, trail])

  const uniforms = useMemo(() => {
    const u: Record<string, any> = {
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      // Pure white base, warm tint accent for Apple-like glass
      uBase: { value: new THREE.Color(0xffffff) },
      uAccent: { value: new THREE.Color('#FDFBD4') },
      uDarkBoost: { value: resolvedTheme === 'dark' ? 0.08 : 0.0 },
      uTrailCount: { value: trail || 6 },
      uHoverBoost: { value: 0.0 },
      uPoints: { value: new Array(10).fill([0, 0]).map(() => new THREE.Vector2(0, 0)) },
    }
    return u
  }, [intensity, resolvedTheme, trail])

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uDarkBoost.value = resolvedTheme === 'dark' ? 0.08 : 0.0
  }, [resolvedTheme])

  useFrame((state) => {
    if (!materialRef.current) return
    const u = materialRef.current.uniforms
    u.uTime.value = state.clock.getElapsedTime()
    u.uHoverBoost.value = hoverBoost

    const pts = pointsRef.current
    const uniArray: THREE.Vector2[] = u.uPoints.value
    for (let i = 0; i < uniArray.length; i++) {
      const p = pts[i]
      if (p) {
        uniArray[i].set(p[0], p[1])
      } else {
        uniArray[i].set(-10, -10)
      }
    }
  })

  const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `

  const fragment = `
    precision highp float;
    varying vec2 vUv;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uBase;
    uniform vec3 uAccent;
    uniform float uDarkBoost;
    uniform float uHoverBoost;
    uniform int uTrailCount;
    uniform vec2 uPoints[10];

    // High-quality noise for organic movement
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractal noise for realistic liquid texture
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }

    // Dramatic liquid distortion with refraction
    vec2 liquidDistortion(vec2 uv, vec2 p, float r, float strength) {
      float d = distance(uv, p);
      float influence = exp(-(d * d) / (2.0 * r * r));
      
      // Create complex swirling distortion like Copilot
      float angle = atan(uv.y - p.y, uv.x - p.x);
      float swirl = sin(angle * 5.0 + uTime * 4.0) * 0.25;
      float pulse = sin(uTime * 6.0) * 0.1;
      float wave = sin(d * 20.0 - uTime * 3.0) * 0.05;
      
      vec2 distortion = vec2(
        sin(angle + uTime + pulse + wave) * swirl * influence * strength,
        cos(angle + uTime + pulse + wave) * swirl * influence * strength
      );
      
      // Add merging effect when near other points
      for (int i = 0; i < 10; i++) {
        if (i >= uTrailCount) break;
        float otherDist = distance(p, uPoints[i]);
        if (otherDist < 0.4 && otherDist > 0.0) {
          float mergeStrength = exp(-(otherDist * otherDist) / 0.15) * 0.5;
          vec2 mergeDir = normalize(p - uPoints[i]);
          distortion += mergeDir * mergeStrength * influence;
        }
      }
      
      return distortion;
    }

    void main() {
      vec2 uv = vUv;
      vec2 distortedUV = uv;
      
      // Apply dramatic liquid distortion from cursor trail
      for (int i = 0; i < 10; i++) {
        if (i >= uTrailCount) break;
        float strength = mix(2.0, 4.0, uHoverBoost); // Much stronger like Copilot
        float radius = mix(0.25, 0.12, float(i) / float(max(uTrailCount-1, 1)));
        vec2 distortion = liquidDistortion(uv, uPoints[i], radius, strength);
        distortedUV += distortion;
      }
      
      // Add fractal noise for realistic liquid texture
      float liquidNoise = fbm(distortedUV * 30.0 + uTime * 1.2) * 0.2;
      distortedUV += liquidNoise;
      
      // Calculate liquid effect intensity with enhanced merging
      float liquidEffect = 0.0;
      for (int i = 0; i < 10; i++) {
        if (i >= uTrailCount) break;
        float d = distance(uv, uPoints[i]);
        float r = mix(0.35, 0.18, float(i) / float(max(uTrailCount-1, 1)));
        liquidEffect += exp(-(d * d) / (2.0 * r * r));
      }
      
      // Dramatic hover effect like Copilot
      float hoverIntensity = mix(1.0, 5.0, uHoverBoost);
      liquidEffect *= hoverIntensity;
      
      // Create dramatic liquid glass appearance with depth
      float alpha = clamp(liquidEffect * uIntensity, 0.0, 0.95);
      
      // Premium liquid glass colors with enhanced depth
      vec3 baseColor = mix(uBase, uAccent, 0.4);
      vec3 liquidColor = mix(baseColor, vec3(1.0, 1.0, 1.0), 0.5);
      
      // Add dramatic color variation based on distortion
      float distortionAmount = length(distortedUV - uv);
      liquidColor = mix(liquidColor, uAccent, distortionAmount * 1.2);
      
      // Add premium rainbow effect for Copilot-like feel
      float rainbow = sin(distortionAmount * 15.0 + uTime * 3.0) * 0.15;
      liquidColor += vec3(rainbow, rainbow * 0.6, rainbow * 0.4) * 0.15;
      
      // Add depth with subtle shadows
      float depth = noise(uv * 50.0 + uTime * 0.5) * 0.1;
      liquidColor += vec3(depth) * 0.1;
      
      gl_FragColor = vec4(liquidColor, alpha);
    }
  `

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}