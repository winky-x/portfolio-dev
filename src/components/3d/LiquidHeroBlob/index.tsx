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
      metalness: 0.3,
      roughness: 0.7,
      transmission: 0.3,
      thickness: 0.5,
      ior: 1.2,
      transparent: true,
      opacity: 0.4,
    }),
    [resolvedTheme]
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005
      meshRef.current.rotation.x += 0.0003
    }
  })

  return (
    <mesh ref={meshRef} scale={1.8} position={[0, 0, -2]}>
      <icosahedronGeometry args={[1, 64]} />
      <meshStandardMaterial ref={materialRef} {...materialProps} />
    </mesh>
  )
}
