'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  size: number
  color: THREE.Color
  life: number
  maxLife: number
}

export function FloatingParticles({ count = 100, intensity = 1.0 }) {
  const meshRef = useRef<THREE.Points>(null)
  const { camera, mouse } = useThree()

  const particles = useMemo(() => {
    const temp: Particle[] = []
    const colors = [
      new THREE.Color('#6366f1'), // Indigo
      new THREE.Color('#8b5cf6'), // Violet
      new THREE.Color('#06b6d4'), // Cyan
      new THREE.Color('#10b981'), // Emerald
      new THREE.Color('#f59e0b'), // Amber
    ]

    for (let i = 0; i < count; i++) {
      const particle: Particle = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random(),
        maxLife: Math.random() * 0.5 + 0.5,
      }
      temp.push(particle)
    }
    return temp
  }, [count])

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z

      colors[i * 3] = particle.color.r
      colors[i * 3 + 1] = particle.color.g
      colors[i * 3 + 2] = particle.color.b

      sizes[i] = particle.size
    })

    return { positions, colors, sizes }
  }, [particles, count])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const material = meshRef.current.material as THREE.PointsMaterial

    // Update particle positions
    particles.forEach((particle) => {
      // Add subtle movement
      particle.position.add(particle.velocity)
      particle.life += 0.01

      // Reset particles that go out of bounds
      if (particle.position.length() > 15) {
        particle.position.setLength(15)
        particle.velocity.multiplyScalar(-0.5)
      }

      // Add mouse interaction
      const mouseVector = new THREE.Vector3(mouse.x * 10, -mouse.y * 10, 0)
      const distance = particle.position.distanceTo(mouseVector)
      if (distance < 3) {
        const force = new THREE.Vector3()
          .subVectors(particle.position, mouseVector)
          .normalize()
          .multiplyScalar(0.1)
        particle.velocity.add(force)
      }

      // Add wave effect
      particle.position.y += Math.sin(time + particle.position.x * 0.1) * 0.001
      particle.position.x += Math.cos(time + particle.position.z * 0.1) * 0.001
    })

    // Update geometry
    const geometry = meshRef.current.geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions.positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(positions.colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(positions.sizes, 1))

    // Animate material properties
    material.opacity = 0.6 + Math.sin(time * 0.5) * 0.2
    material.size = 1 + Math.sin(time * 0.3) * 0.3
  })

  return (
    <points
      ref={meshRef}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={positions.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={positions.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}