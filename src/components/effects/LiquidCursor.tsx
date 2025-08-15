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

      // detect interactive hover (buttons, links, inputs) to sharpen effect
      const elUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      if (elUnder) {
        const tag = elUnder.tagName.toLowerCase()
        const interactive = ['a', 'button', 'input', 'textarea', 'select', 'label'].includes(tag) || elUnder.closest('a,button,[role="button"],input,textarea,select,label')
        setHoverBoost(interactive ? 1 : 0)
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

    float field(vec2 uv, vec2 p, float r) {
      float d = distance(uv, p);
      return exp(- (d*d) / (2.0 * r*r));
    }

    void main() {
      float alpha = 0.0;
      float radius;
      for (int i = 0; i < 10; i++) {
        if (i >= uTrailCount) break;
        float sharp = mix(1.0, 0.7, uHoverBoost);
        radius = sharp * mix(0.20, 0.08, float(i) / float(max(uTrailCount-1, 1)));
        alpha += field(vUv, uPoints[i], radius);
      }

      // Only draw near points; no base fill
      alpha = clamp(alpha * uIntensity, 0.0, 0.45 + 0.15 * uHoverBoost);

      // Apple-like liquid glass color: mostly white with warm tint
      vec3 col = mix(uBase, uAccent, 0.3);

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