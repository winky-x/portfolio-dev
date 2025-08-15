'use client'

import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTheme } from 'next-themes'

interface LiquidCursorProps {
  containerRef: React.RefObject<HTMLElement>
  intensity?: number
  trail?: number // number of points in the trail
}

export function LiquidCursor({ containerRef, intensity = 0.35, trail = 5 }: LiquidCursorProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
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

  // Track last N mouse positions
  const pointsRef = useRef<Array<[number, number]>>([])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onMove(e: MouseEvent) {
      const target = containerRef.current
      if (!target) return
      const rect = target.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      const pts = pointsRef.current
      pts.unshift([x, y])
      if (pts.length > (trail || 5)) pts.pop()
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [containerRef, trail])

  const uniforms = useMemo(() => {
    const u: Record<string, any> = {
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uColor: { value: new THREE.Color(resolvedTheme === 'dark' ? 0xffffff : 0x000000) },
      uAccent: { value: new THREE.Color('#FDFBD4') },
      uTrailCount: { value: trail || 5 },
      uPoints: { value: new Array(10).fill([0, 0]).map(() => new THREE.Vector2(0, 0)) },
    }
    return u
  }, [intensity, resolvedTheme, trail])

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uColor.value = new THREE.Color(
      resolvedTheme === 'dark' ? 0xffffff : 0x000000
    )
  }, [resolvedTheme])

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()

    // Write latest points into uniforms
    const pts = pointsRef.current
    const uniArray: THREE.Vector2[] = materialRef.current.uniforms.uPoints.value
    for (let i = 0; i < uniArray.length; i++) {
      const p = pts[i]
      if (p) {
        uniArray[i].set(p[0], p[1])
      } else {
        // decay to offscreen to avoid constant draw if no movement
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
    uniform vec3 uColor;
    uniform vec3 uAccent;
    uniform int uTrailCount;
    uniform vec2 uPoints[10];

    // Smooth circular field for each point
    float field(vec2 uv, vec2 p, float r) {
      float d = distance(uv, p);
      float f = exp(- (d*d) / (2.0 * r*r));
      return f;
    }

    void main() {
      // Base transparency
      float alpha = 0.0;

      // Sum fields from trail points with diminishing influence
      float radius;
      for (int i = 0; i < 10; i++) {
        if (i >= uTrailCount) break;
        radius = mix(0.18, 0.06, float(i) / float(max(uTrailCount-1, 1)));
        alpha += field(vUv, uPoints[i], radius);
      }

      // Normalize and scale
      alpha = clamp(alpha * uIntensity, 0.0, 0.6);

      // Subtle color blend towards accent for a liquid glow look
      vec3 col = mix(uColor, uAccent, 0.25);

      gl_FragColor = vec4(col, alpha);
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