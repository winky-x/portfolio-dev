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
    }

    function onTouch(e: TouchEvent) {
      const targetEl = containerRef.current
      if (!targetEl) return
      const touch = e.touches[0]
      const rect = targetEl.getBoundingClientRect()
      const x = (touch.clientX - rect.left) / rect.width
      const y = 1.0 - (touch.clientY - rect.top) / rect.height
      const pts = pointsRef.current
      pts.unshift([x, y])
      if (pts.length > (trail || 6)) pts.pop()
    }

    // Mouse events
    el.addEventListener('mousemove', onMove)
    
    // Touch events for mobile
    el.addEventListener('touchmove', onTouch, { passive: true })
    el.addEventListener('touchstart', onTouch, { passive: true })
    
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('touchmove', onTouch)
      el.removeEventListener('touchstart', onTouch)
    }
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
    precision mediump float; // Mobile-optimized precision
    varying vec2 vUv;

    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uBase;
    uniform vec3 uAccent;
    uniform float uHoverBoost;
    uniform int uTrailCount;
    uniform vec2 uPoints[10];

    // Simple, fast noise for mobile
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    // Mobile-optimized liquid distortion
    vec2 liquidDistortion(vec2 uv, vec2 p, float r, float strength) {
      float d = distance(uv, p);
      float influence = exp(-(d * d) / (2.0 * r * r));
      
      // Simple swirling for mobile performance
      float angle = atan(uv.y - p.y, uv.x - p.x);
      float swirl = sin(angle * 3.0 + uTime * 2.0) * 0.2;
      
      vec2 distortion = vec2(
        sin(angle + uTime) * swirl * influence * strength,
        cos(angle + uTime) * swirl * influence * strength
      );
      
      return distortion;
    }

    void main() {
      vec2 uv = vUv;
      vec2 distortedUV = uv;
      
      // Apply mobile-optimized liquid distortion
      for (int i = 0; i < 10; i++) {
        if (i >= uTrailCount) break;
        float strength = mix(1.5, 3.0, uHoverBoost); // Mobile-optimized strength
        float radius = mix(0.2, 0.1, float(i) / float(max(uTrailCount-1, 1)));
        vec2 distortion = liquidDistortion(uv, uPoints[i], radius, strength);
        distortedUV += distortion;
      }
      
      // Simple noise for mobile
      float liquidNoise = noise(distortedUV * 15.0 + uTime * 0.8) * 0.1;
      distortedUV += liquidNoise;
      
      // Calculate liquid effect intensity
      float liquidEffect = 0.0;
      for (int i = 0; i < 10; i++) {
        if (i >= uTrailCount) break;
        float d = distance(uv, uPoints[i]);
        float r = mix(0.3, 0.15, float(i) / float(max(uTrailCount-1, 1)));
        liquidEffect += exp(-(d * d) / (2.0 * r * r));
      }
      
      // Mobile-optimized hover effect
      float hoverIntensity = mix(1.0, 3.0, uHoverBoost);
      liquidEffect *= hoverIntensity;
      
      // Create liquid glass appearance
      float alpha = clamp(liquidEffect * uIntensity, 0.0, 0.8);
      
      // Mobile-optimized colors
      vec3 baseColor = mix(uBase, uAccent, 0.3);
      vec3 liquidColor = mix(baseColor, vec3(1.0, 1.0, 1.0), 0.4);
      
      // Simple color variation
      float distortionAmount = length(distortedUV - uv);
      liquidColor = mix(liquidColor, uAccent, distortionAmount * 0.6);
      
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