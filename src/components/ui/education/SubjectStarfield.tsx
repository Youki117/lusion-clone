'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: string
  x: number
  y: number
  z: number
  size: number
  opacity: number
  color: string
  vx?: number
  vy?: number
  vz?: number
  angle?: number
  radius?: number
  centerX?: number
  centerY?: number
}

interface SubjectStarfieldProps {
  subject: string
  width: number
  height: number
  className?: string
}

export default function SubjectStarfield({ 
  subject, 
  width, 
  height, 
  className = '' 
}: SubjectStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [stars, setStars] = useState<Star[]>([])

  // 生成基础星星
  const generateBaseStars = (count: number): Star[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `star-${i}`,
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1000,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      color: '#ffffff',
      vx: (Math.random() - 0.5) * 0.1, // 从0.5降低到0.1
      vy: (Math.random() - 0.5) * 0.1, // 从0.5降低到0.1
      vz: (Math.random() - 0.5) * 0.3  // 从2降低到0.3
    }))
  }

  // 数学主题：几何图形和函数曲线
  const generateMathStars = (): Star[] => {
    const stars: Star[] = []
    const centerX = width / 2
    const centerY = height / 2

    // 生成多个同心圆
    const circles = [
      { radius: 100, color: '#60a5fa', count: 40 },
      { radius: 160, color: '#34d399', count: 60 },
      { radius: 220, color: '#fbbf24', count: 80 }
    ]

    circles.forEach((circle, circleIndex) => {
      for (let i = 0; i < circle.count; i++) {
        const angle = (i / circle.count) * Math.PI * 2
        stars.push({
          id: `circle-${circleIndex}-${i}`,
          x: centerX + Math.cos(angle) * circle.radius,
          y: centerY + Math.sin(angle) * circle.radius,
          z: 500 + circleIndex * 100,
          size: 1.5,
          opacity: 0.8,
          color: circle.color,
          angle,
          radius: circle.radius,
          centerX,
          centerY,
          vx: 0.005 * (circleIndex + 1)
        })
      }
    })

    // 生成抛物线 y = x²
    for (let i = 0; i < 80; i++) {
      const x = centerX - 200 + (i / 80) * 400
      const normalizedX = (x - centerX) / 100
      const y = centerY - 100 + normalizedX * normalizedX * 50
      if (y >= 0 && y <= height) {
        stars.push({
          id: `parabola-${i}`,
          x,
          y,
          z: 300,
          size: 1.2,
          opacity: 0.7,
          color: '#ec4899',
          vy: 0.3
        })
      }
    }

    // 生成正弦波和余弦波
    for (let i = 0; i < 120; i++) {
      const x = (i / 120) * width
      const t = (i / 120) * Math.PI * 6

      // 正弦波
      const ySin = centerY + Math.sin(t) * 60
      stars.push({
        id: `sine-${i}`,
        x,
        y: ySin,
        z: 250,
        size: 1,
        opacity: 0.6,
        color: '#34d399',
        vx: 0.8
      })

      // 余弦波（稍微偏移）
      const yCos = centerY + 120 + Math.cos(t) * 60
      stars.push({
        id: `cosine-${i}`,
        x,
        y: yCos,
        z: 250,
        size: 1,
        opacity: 0.6,
        color: '#f59e0b',
        vx: 0.8
      })
    }

    // 生成黄金螺旋
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.2
      const radius = angle * 8
      const x = centerX + 300 + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        stars.push({
          id: `spiral-${i}`,
          x,
          y,
          z: 400,
          size: 1.5,
          opacity: 0.8,
          color: '#8b5cf6',
          angle,
          radius,
          centerX: centerX + 300,
          centerY,
          vx: 0.01
        })
      }
    }

    // 添加基础星星
    stars.push(...generateBaseStars(150))
    return stars
  }

  // 物理主题：原子轨道和波动
  const generatePhysicsStars = (): Star[] => {
    const stars: Star[] = []
    const centerX = width / 2
    const centerY = height / 2

    // 原子核
    stars.push({
      id: 'nucleus',
      x: centerX,
      y: centerY,
      z: 100,
      size: 10,
      opacity: 1,
      color: '#ef4444'
    })

    // 电子轨道（椭圆轨道）- 大幅降低速度
    const orbits = [
      { radiusX: 80, radiusY: 60, electrons: 2, color: '#60a5fa', speed: 0.005 }, // 从0.03降低到0.005
      { radiusX: 140, radiusY: 120, electrons: 6, color: '#34d399', speed: 0.003 }, // 从0.02降低到0.003
      { radiusX: 200, radiusY: 180, electrons: 8, color: '#fbbf24', speed: 0.002 } // 从0.015降低到0.002
    ]

    orbits.forEach((orbit, orbitIndex) => {
      // 轨道路径
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2
        const x = centerX + Math.cos(angle) * orbit.radiusX
        const y = centerY + Math.sin(angle) * orbit.radiusY
        stars.push({
          id: `orbit-path-${orbitIndex}-${i}`,
          x,
          y,
          z: 400,
          size: 0.5,
          opacity: 0.3,
          color: orbit.color
        })
      }

      // 电子
      for (let i = 0; i < orbit.electrons; i++) {
        const angle = (i / orbit.electrons) * Math.PI * 2
        stars.push({
          id: `electron-${orbitIndex}-${i}`,
          x: centerX + Math.cos(angle) * orbit.radiusX,
          y: centerY + Math.sin(angle) * orbit.radiusY,
          z: 200,
          size: 4,
          opacity: 1,
          color: orbit.color,
          angle,
          radius: orbit.radiusX,
          centerX,
          centerY,
          vx: orbit.speed
        })
      }
    })

    // 电磁波
    for (let i = 0; i < 100; i++) {
      const x = (i / 100) * width
      const t = (i / 100) * Math.PI * 8

      // 电场波
      const yE = centerY - 200 + Math.sin(t) * 40
      stars.push({
        id: `electric-${i}`,
        x,
        y: yE,
        z: 300,
        size: 1.5,
        opacity: 0.7,
        color: '#3b82f6',
        vx: 1.5
      })

      // 磁场波（垂直于电场）
      const yB = centerY - 200 + Math.cos(t) * 40
      stars.push({
        id: `magnetic-${i}`,
        x,
        y: yB,
        z: 320,
        size: 1.5,
        opacity: 0.7,
        color: '#ef4444',
        vx: 1.5
      })
    }

    // 引力场线（从中心向外辐射）
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2
      for (let j = 1; j <= 10; j++) {
        const radius = j * 30
        const x = centerX - 300 + Math.cos(angle) * radius
        const y = centerY + 200 + Math.sin(angle) * radius

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          stars.push({
            id: `gravity-${i}-${j}`,
            x,
            y,
            z: 350,
            size: 1,
            opacity: 0.6 - j * 0.05,
            color: '#8b5cf6'
          })
        }
      }
    }

    // 量子能级
    const energyLevels = [
      { y: centerY + 250, energy: 1, color: '#ef4444' },
      { y: centerY + 280, energy: 2, color: '#f59e0b' },
      { y: centerY + 300, energy: 3, color: '#34d399' },
      { y: centerY + 315, energy: 4, color: '#60a5fa' }
    ]

    energyLevels.forEach((level, levelIndex) => {
      for (let i = 0; i < 40; i++) {
        const x = centerX + 200 + (i / 40) * 200
        stars.push({
          id: `energy-${levelIndex}-${i}`,
          x,
          y: level.y,
          z: 250,
          size: 1.5,
          opacity: 0.8,
          color: level.color,
          vx: 0.2
        })
      }
    })

    // 添加基础星星
    stars.push(...generateBaseStars(100))
    return stars
  }

  // 化学主题：分子结构和化学键
  const generateChemistryStars = (): Star[] => {
    const stars: Star[] = []
    const centerX = width / 2
    const centerY = height / 2

    // 水分子 H2O（左上角）
    const waterCenter = { x: centerX - 200, y: centerY - 150 }
    const waterMolecule = [
      { x: waterCenter.x, y: waterCenter.y, color: '#ef4444', size: 8, label: 'O' },
      { x: waterCenter.x - 50, y: waterCenter.y - 35, color: '#60a5fa', size: 6, label: 'H' },
      { x: waterCenter.x + 50, y: waterCenter.y - 35, color: '#60a5fa', size: 6, label: 'H' }
    ]

    waterMolecule.forEach((atom, i) => {
      stars.push({
        id: `water-${i}`,
        x: atom.x,
        y: atom.y,
        z: 100,
        size: atom.size,
        opacity: 1,
        color: atom.color
      })
    })

    // 化学键连线（水分子）
    for (let i = 0; i < 10; i++) {
      const ratio = i / 10
      // O-H键1
      const x1 = waterCenter.x + (waterCenter.x - 50 - waterCenter.x) * ratio
      const y1 = waterCenter.y + (waterCenter.y - 35 - waterCenter.y) * ratio
      stars.push({
        id: `bond1-${i}`,
        x: x1,
        y: y1,
        z: 150,
        size: 1,
        opacity: 0.6,
        color: '#ffffff'
      })

      // O-H键2
      const x2 = waterCenter.x + (waterCenter.x + 50 - waterCenter.x) * ratio
      const y2 = waterCenter.y + (waterCenter.y - 35 - waterCenter.y) * ratio
      stars.push({
        id: `bond2-${i}`,
        x: x2,
        y: y2,
        z: 150,
        size: 1,
        opacity: 0.6,
        color: '#ffffff'
      })
    }

    // 苯环 C6H6（右上角）
    const benzeneCenter = { x: centerX + 200, y: centerY - 100 }
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const radius = 80
      const x = benzeneCenter.x + Math.cos(angle) * radius
      const y = benzeneCenter.y + Math.sin(angle) * radius

      // 碳原子
      stars.push({
        id: `benzene-c-${i}`,
        x,
        y,
        z: 200,
        size: 6,
        opacity: 1,
        color: '#374151',
        angle,
        radius,
        centerX: benzeneCenter.x,
        centerY: benzeneCenter.y,
        vx: 0.005
      })

      // 氢原子（外围）
      const hx = benzeneCenter.x + Math.cos(angle) * (radius + 30)
      const hy = benzeneCenter.y + Math.sin(angle) * (radius + 30)
      stars.push({
        id: `benzene-h-${i}`,
        x: hx,
        y: hy,
        z: 220,
        size: 4,
        opacity: 0.9,
        color: '#60a5fa',
        angle,
        radius: radius + 30,
        centerX: benzeneCenter.x,
        centerY: benzeneCenter.y,
        vx: 0.005
      })
    }

    // 甲烷分子 CH4（左下角）
    const methaneCenter = { x: centerX - 150, y: centerY + 150 }
    // 中心碳原子
    stars.push({
      id: 'methane-c',
      x: methaneCenter.x,
      y: methaneCenter.y,
      z: 100,
      size: 8,
      opacity: 1,
      color: '#374151'
    })

    // 四个氢原子（四面体结构的投影）
    const hydrogenPositions = [
      { x: methaneCenter.x, y: methaneCenter.y - 60 },
      { x: methaneCenter.x + 52, y: methaneCenter.y + 30 },
      { x: methaneCenter.x - 52, y: methaneCenter.y + 30 },
      { x: methaneCenter.x, y: methaneCenter.y + 20 }
    ]

    hydrogenPositions.forEach((pos, i) => {
      stars.push({
        id: `methane-h-${i}`,
        x: pos.x,
        y: pos.y,
        z: 120,
        size: 5,
        opacity: 1,
        color: '#60a5fa'
      })

      // C-H键
      for (let j = 0; j < 8; j++) {
        const ratio = j / 8
        const bondX = methaneCenter.x + (pos.x - methaneCenter.x) * ratio
        const bondY = methaneCenter.y + (pos.y - methaneCenter.y) * ratio
        stars.push({
          id: `methane-bond-${i}-${j}`,
          x: bondX,
          y: bondY,
          z: 110,
          size: 0.8,
          opacity: 0.5,
          color: '#ffffff'
        })
      }
    })

    // DNA碱基对（右下角）
    const dnaCenter = { x: centerX + 180, y: centerY + 120 }

    // 腺嘌呤-胸腺嘧啶碱基对
    const atPair = [
      // 腺嘌呤（A）
      { x: dnaCenter.x - 40, y: dnaCenter.y, color: '#34d399', size: 6 },
      { x: dnaCenter.x - 60, y: dnaCenter.y - 20, color: '#34d399', size: 4 },
      { x: dnaCenter.x - 60, y: dnaCenter.y + 20, color: '#34d399', size: 4 },
      // 胸腺嘧啶（T）
      { x: dnaCenter.x + 40, y: dnaCenter.y, color: '#f59e0b', size: 6 },
      { x: dnaCenter.x + 60, y: dnaCenter.y - 15, color: '#f59e0b', size: 4 },
      { x: dnaCenter.x + 60, y: dnaCenter.y + 15, color: '#f59e0b', size: 4 }
    ]

    atPair.forEach((base, i) => {
      stars.push({
        id: `at-pair-${i}`,
        x: base.x,
        y: base.y,
        z: 180,
        size: base.size,
        opacity: 1,
        color: base.color
      })
    })

    // 氢键连接
    for (let i = 0; i < 12; i++) {
      const ratio = i / 12
      const bondX = (dnaCenter.x - 40) + ((dnaCenter.x + 40) - (dnaCenter.x - 40)) * ratio
      const bondY = dnaCenter.y
      stars.push({
        id: `hydrogen-bond-${i}`,
        x: bondX,
        y: bondY,
        z: 190,
        size: 0.5,
        opacity: 0.4,
        color: '#ec4899'
      })
    }

    // 添加基础星星
    stars.push(...generateBaseStars(120))
    return stars
  }

  // 生物主题：DNA双螺旋和细胞结构
  const generateBiologyStars = (): Star[] => {
    const stars: Star[] = []
    const centerX = width / 2
    const centerY = height / 2

    // 主DNA双螺旋（中央）
    for (let i = 0; i < 150; i++) {
      const t = (i / 150) * Math.PI * 6 // 6圈螺旋
      const y = centerY - 250 + (i / 150) * 500
      const helixRadius = 50

      // 第一条链（磷酸-糖骨架）
      const x1 = centerX + Math.cos(t) * helixRadius
      const z1 = Math.sin(t) * 25 + 300

      // 第二条链
      const x2 = centerX + Math.cos(t + Math.PI) * helixRadius
      const z2 = Math.sin(t + Math.PI) * 25 + 300

      stars.push({
        id: `dna1-${i}`,
        x: x1,
        y,
        z: z1,
        size: 2.5,
        opacity: 0.9,
        color: '#34d399', // 绿色链
        angle: t,
        centerX,
        centerY: y,
        radius: helixRadius,
        vx: 0.008
      })

      stars.push({
        id: `dna2-${i}`,
        x: x2,
        y,
        z: z2,
        size: 2.5,
        opacity: 0.9,
        color: '#f59e0b', // 橙色链
        angle: t + Math.PI,
        centerX,
        centerY: y,
        radius: helixRadius,
        vx: 0.008
      })

      // 碱基对连接（更密集）
      if (i % 6 === 0) {
        const baseColors = ['#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'] // A, T, G, C
        const baseColor = baseColors[i % 4]

        const steps = 8
        for (let j = 0; j <= steps; j++) {
          const ratio = j / steps
          const x = x1 + (x2 - x1) * ratio
          const z = z1 + (z2 - z1) * ratio
          const size = j === 0 || j === steps ? 2 : 1.2 // 端点更大

          stars.push({
            id: `base-${i}-${j}`,
            x,
            y,
            z,
            size,
            opacity: 0.8,
            color: baseColor
          })
        }
      }
    }

    // 细胞膜（左侧圆形）
    const cellCenter = { x: centerX - 300, y: centerY }
    const cellRadius = 120
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2
      const x = cellCenter.x + Math.cos(angle) * cellRadius
      const y = cellCenter.y + Math.sin(angle) * cellRadius

      stars.push({
        id: `cell-membrane-${i}`,
        x,
        y,
        z: 200,
        size: 1.5,
        opacity: 0.7,
        color: '#06b6d4',
        angle,
        radius: cellRadius,
        centerX: cellCenter.x,
        centerY: cellCenter.y,
        vx: 0.01
      })
    }

    // 细胞核（细胞内部）
    const nucleusRadius = 40
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2
      const x = cellCenter.x + Math.cos(angle) * nucleusRadius
      const y = cellCenter.y + Math.sin(angle) * nucleusRadius

      stars.push({
        id: `nucleus-${i}`,
        x,
        y,
        z: 150,
        size: 2,
        opacity: 0.9,
        color: '#8b5cf6',
        angle,
        radius: nucleusRadius,
        centerX: cellCenter.x,
        centerY: cellCenter.y,
        vx: -0.015
      })
    }

    // 线粒体（椭圆形，右侧）
    const mitoCenter = { x: centerX + 280, y: centerY - 80 }
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2
      const radiusX = 80
      const radiusY = 40
      const x = mitoCenter.x + Math.cos(angle) * radiusX
      const y = mitoCenter.y + Math.sin(angle) * radiusY

      stars.push({
        id: `mitochondria-${i}`,
        x,
        y,
        z: 180,
        size: 1.8,
        opacity: 0.8,
        color: '#ef4444',
        angle,
        radius: radiusX,
        centerX: mitoCenter.x,
        centerY: mitoCenter.y,
        vx: 0.012
      })
    }

    // 蛋白质折叠（右上角）
    const proteinCenter = { x: centerX + 200, y: centerY - 200 }
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 4
      const radius = 30 + Math.sin(t * 3) * 20
      const x = proteinCenter.x + Math.cos(t) * radius
      const y = proteinCenter.y + Math.sin(t) * radius

      stars.push({
        id: `protein-${i}`,
        x,
        y,
        z: 220,
        size: 1.5,
        opacity: 0.7,
        color: '#10b981',
        angle: t,
        radius,
        centerX: proteinCenter.x,
        centerY: proteinCenter.y,
        vx: 0.02
      })
    }

    // 神经元树突（左下角）
    const neuronCenter = { x: centerX - 250, y: centerY + 200 }

    // 神经元胞体
    stars.push({
      id: 'neuron-body',
      x: neuronCenter.x,
      y: neuronCenter.y,
      z: 100,
      size: 12,
      opacity: 1,
      color: '#fbbf24'
    })

    // 树突分支
    const branches = [
      { angle: 0, length: 80 },
      { angle: Math.PI / 3, length: 60 },
      { angle: Math.PI * 2 / 3, length: 70 },
      { angle: Math.PI, length: 90 },
      { angle: Math.PI * 4 / 3, length: 50 },
      { angle: Math.PI * 5 / 3, length: 65 }
    ]

    branches.forEach((branch, branchIndex) => {
      for (let i = 1; i <= 15; i++) {
        const ratio = i / 15
        const x = neuronCenter.x + Math.cos(branch.angle) * branch.length * ratio
        const y = neuronCenter.y + Math.sin(branch.angle) * branch.length * ratio
        const size = 2 - ratio * 1.5 // 越远越小

        stars.push({
          id: `dendrite-${branchIndex}-${i}`,
          x,
          y,
          z: 160,
          size,
          opacity: 0.8 - ratio * 0.3,
          color: '#f59e0b'
        })
      }
    })

    // 添加基础星星
    stars.push(...generateBaseStars(80))
    return stars
  }

  // 根据学科生成对应的星星
  const generateStarsBySubject = () => {
    switch (subject) {
      case 'mathematics':
        return generateMathStars()
      case 'physics':
        return generatePhysicsStars()
      case 'chemistry':
        return generateChemistryStars()
      case 'biology':
        return generateBiologyStars()
      default:
        return generateBaseStars(300)
    }
  }

  // 初始化星星
  useEffect(() => {
    setStars(generateStarsBySubject())
  }, [subject, width, height])

  // 动画循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let currentStars = [...stars]

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // 更新星星位置
      currentStars = currentStars.map(star => {
        let newStar = { ...star }

        // 基础星星的移动
        if (star.vx !== undefined && !star.angle) {
          newStar.x += star.vx
          if (newStar.x > width) newStar.x = 0
          if (newStar.x < 0) newStar.x = width
        }

        if (star.vy !== undefined && !star.angle) {
          newStar.y += star.vy
          if (newStar.y > height) newStar.y = 0
          if (newStar.y < 0) newStar.y = height
        }

        // 轨道运动（用于原子轨道、DNA螺旋等）- 降低默认速度
        if (star.angle !== undefined && star.radius !== undefined && star.centerX !== undefined && star.centerY !== undefined) {
          newStar.angle = (newStar.angle || 0) + (star.vx || 0.002) // 从0.01降低到0.002
          newStar.x = star.centerX + Math.cos(newStar.angle) * star.radius
          newStar.y = star.centerY + Math.sin(newStar.angle) * star.radius
        }

        return newStar
      })

      // 绘制所有星星
      currentStars.forEach(star => {
        const size = star.size * (1000 / (1000 + star.z))
        const opacity = star.opacity * (1000 / (1000 + star.z))

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [stars, width, height])

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
    </div>
  )
}
