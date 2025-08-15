'use client'

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTheme } from 'next-themes'

export function LiquidHeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!)
  const { resolvedTheme } = useTheme()

  const materialProps = useMemo(
    () => ({
      color: resolvedTheme === 'dark' ? '#6B5FFF' : '#0A0A0A',
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.4,
      ior: 1.4,
    }),
    [resolvedTheme]
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <mesh ref={meshRef} scale={2.5}>
      <icosahedronGeometry args={[1, 128]} />
      <meshStandardMaterial ref={materialRef} {...materialProps} />
    </mesh>
  )
}
