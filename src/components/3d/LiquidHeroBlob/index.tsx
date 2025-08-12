'use client'

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { LiquidMaterial } from './materials/LiquidMaterial'
import { useTheme } from 'next-themes'

export function LiquidHeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const { resolvedTheme } = useTheme()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMetallic: { value: 0.9 },
      uRoughness: { value: 0.1 },
      uTransmission: { value: 0.6 },
      uThickness: { value: 1.4 },
      uIor: { value: 1.4 },
      uChromaticAberration: { value: 0.6 },
      uAnisotropy: { value: 0.8 },
      uLight: { value: new THREE.Color(resolvedTheme === 'dark' ? '#FAFAFA' : '#0A0A0A') },
      uDark: { value: new THREE.Color(resolvedTheme === 'dark' ? '#0A0A0A' : '#FAFAFA') },
      uPrimary: { value: new THREE.Color('#6B5FFF') },
      uSecondary: { value: new THREE.Color('#FF6B5F') },
      uAccent: { value: new THREE.Color('#5FFFB6') },
    }),
    [resolvedTheme]
  );

  useFrame((state) => {
    const { clock } = state
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <mesh ref={meshRef} scale={2.5}>
      <icosahedronGeometry args={[1, 128]} />
      <LiquidMaterial ref={materialRef} uniforms={uniforms} />
    </mesh>
  )
}
