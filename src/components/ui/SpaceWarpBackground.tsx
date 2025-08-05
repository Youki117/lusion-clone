'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface SpaceWarpBackgroundProps {
  progress: number
  className?: string
}

export function SpaceWarpBackground({ progress, className = '' }: SpaceWarpBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const starsRef = useRef<THREE.InstancedMesh>()
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create enhanced stars with better geometry
    const COUNT = 3000
    const geometry = new THREE.SphereGeometry(0.015, 6, 6)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    })

    const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT)
    starsRef.current = instancedMesh
    scene.add(instancedMesh)

    // Add nebula background
    const nebulaGeometry = new THREE.PlaneGeometry(50, 50)
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a0e4e,
      transparent: true,
      opacity: 0.1
    })
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial)
    nebula.position.z = -15
    scene.add(nebula)

    // Initialize enhanced star positions
    const tempObject = new THREE.Object3D()
    const tempColor = new THREE.Color()

    for (let i = 0; i < COUNT; i++) {
      // Random position in a larger sphere with depth
      const radius = Math.random() * 25 + 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      tempObject.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi) - 15
      )

      // Vary star sizes
      const scale = 0.5 + Math.random() * 1.5
      tempObject.scale.set(scale, scale, 1)
      tempObject.updateMatrix()
      instancedMesh.setMatrixAt(i, tempObject.matrix)

      // Set varied colors for more realistic stars
      const hue = 0.55 + Math.random() * 0.3 // Blue to cyan range
      const saturation = 0.6 + Math.random() * 0.4
      const lightness = 0.7 + Math.random() * 0.3
      tempColor.setHSL(hue, saturation, lightness)
      instancedMesh.setColorAt(i, tempColor)
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (starsRef.current && cameraRef.current && rendererRef.current && sceneRef.current) {
        const time = Date.now() * 0.001
        const warpSpeed = Math.max(0.2, Math.pow(0.5, time * 0.3)) * 8

        // Update star positions and scales with enhanced warp effect
        const tempMatrix = new THREE.Matrix4()
        const tempPosition = new THREE.Vector3()
        const tempScale = new THREE.Vector3()
        const tempColor = new THREE.Color()
        const tempQuaternion = new THREE.Quaternion()

        for (let i = 0; i < COUNT; i++) {
          starsRef.current.getMatrixAt(i, tempMatrix)
          tempPosition.setFromMatrixPosition(tempMatrix)

          // Enhanced movement with acceleration
          const acceleration = warpSpeed * 0.15
          tempPosition.z += acceleration

          // Add slight spiral motion for more dynamic effect
          const spiralEffect = Math.sin(time + i * 0.01) * 0.02
          tempPosition.x += spiralEffect
          tempPosition.y += Math.cos(time + i * 0.01) * 0.02

          // Reset position if star is too close
          if (tempPosition.z > 15) {
            const radius = Math.random() * 25 + 5
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI

            tempPosition.set(
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.sin(phi) * Math.sin(theta),
              -20 - Math.random() * 10
            )
          }

          // Enhanced scale based on speed (more dramatic warp effect)
          const baseScale = 0.5 + Math.random() * 1.5
          const scaleZ = Math.max(1, warpSpeed * 3)
          const scaleXY = Math.max(0.5, 2 - warpSpeed * 0.1)
          tempScale.set(baseScale * scaleXY, baseScale * scaleXY, baseScale * scaleZ)

          // Update matrix with rotation for more dynamic effect
          tempQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), time * 0.1 + i * 0.001)
          tempMatrix.compose(tempPosition, tempQuaternion, tempScale)
          starsRef.current.setMatrixAt(i, tempMatrix)

          // Enhanced color based on distance and speed
          const distance = tempPosition.z + 20
          const brightness = Math.max(0.1, Math.min(1, distance / 25))
          const speedEffect = Math.min(1, warpSpeed / 5)

          // Color shift based on speed (blue shift effect)
          const hue = 0.55 + speedEffect * 0.2
          const saturation = 0.6 + speedEffect * 0.4
          const lightness = brightness * (0.7 + speedEffect * 0.3)

          tempColor.setHSL(hue, saturation, lightness)
          starsRef.current.setColorAt(i, tempColor)
        }
        
        starsRef.current.instanceMatrix.needsUpdate = true
        if (starsRef.current.instanceColor) {
          starsRef.current.instanceColor.needsUpdate = true
        }
        
        // Render
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    
    animate()

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}
