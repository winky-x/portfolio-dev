'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useTheme } from 'next-themes'

export function HeroSection() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!mountRef.current) return

    const currentMount = mountRef.current
    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    currentMount.appendChild(renderer.domElement)

    const particleCount = 5000
    const particles = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      particles[i] = (Math.random() - 0.5) * 10
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.015,
      transparent: true,
      color: resolvedTheme === 'dark' ? 0xffffff : 0x000000
    })
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    camera.position.z = 5

    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }
    document.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      requestAnimationFrame(animate)
      particleSystem.rotation.x += 0.0001
      particleSystem.rotation.y += 0.0002
      
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    }
    window.addEventListener('resize', onResize)
    
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousemove', onMouseMove)
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if (sceneRef.current) {
      const newColor = resolvedTheme === 'dark' ? 0xffffff : 0x000000
      const particleSystem = sceneRef.current.getObjectByProperty('type', 'Points') as THREE.Points
      if(particleSystem && particleSystem.material instanceof THREE.PointsMaterial) {
        particleSystem.material.color.setHex(newColor)
      }
    }
  }, [resolvedTheme])


  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter leading-tight">
          Creative Developer & Digital Artisan
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground">
          Crafting beautiful, interactive, and performant web experiences to bring your ideas to life.
        </p>
      </div>
    </section>
  )
}
