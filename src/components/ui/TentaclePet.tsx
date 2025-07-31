'use client'

import { useEffect, useRef } from 'react'

interface TentaclePetProps {
  className?: string
  opacity?: number
}

export function TentaclePet({ className = '', opacity = 0.3 }: TentaclePetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const c = canvas.getContext('2d')
    if (!c) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    // 设置透明背景
    c.fillStyle = `rgba(30,30,30,${opacity * 0.1})`
    c.fillRect(0, 0, w, h)

    // 定义requestAnimFrame函数（修复了bug）
    const requestAnimFrame = (() => {
      return (
        window.requestAnimationFrame ||
        (window as any).webkitRequestAnimationFrame ||
        (window as any).mozRequestAnimationFrame ||
        (window as any).oRequestAnimationFrame ||
        (window as any).msRequestAnimationFrame ||
        function (callback: FrameRequestCallback) {
          window.setTimeout(callback, 1000 / 60) // 修复：添加了延迟参数
        }
      )
    })()

    // 鼠标对象
    const mouse = { x: false as number | false, y: false as number | false }
    const last_mouse = { x: 0, y: 0 }

    // 计算两点距离的函数
    function dist(p1x: number, p1y: number, p2x: number, p2y: number): number {
      return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2))
    }

    // Segment类
    class Segment {
      pos: { x: number; y: number }
      l: number
      ang: number
      nextPos: { x: number; y: number }
      first: boolean

      constructor(parent: any, l: number, a: number, first: boolean) {
        this.first = first
        if (first) {
          this.pos = {
            x: parent.x,
            y: parent.y,
          }
        } else {
          this.pos = {
            x: parent.nextPos.x,
            y: parent.nextPos.y,
          }
        }
        this.l = l
        this.ang = a
        this.nextPos = {
          x: this.pos.x + this.l * Math.cos(this.ang),
          y: this.pos.y + this.l * Math.sin(this.ang),
        }
      }

      update(t: { x: number; y: number }) {
        this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x)
        this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI)
        this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI)
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang)
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang)
      }

      fallback(t: { x: number; y: number }) {
        this.pos.x = t.x
        this.pos.y = t.y
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang)
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang)
      }

      show() {
        c!.lineTo(this.nextPos.x, this.nextPos.y)
      }
    }

    // Tentacle类
    class Tentacle {
      x: number
      y: number
      l: number
      n: number
      t: { x?: number; y?: number }
      rand: number
      segments: Segment[]
      angle: number = 0
      dt: number = 0

      constructor(x: number, y: number, l: number, n: number, a: number) {
        this.x = x
        this.y = y
        this.l = l
        this.n = n
        this.t = {}
        this.rand = Math.random()
        this.segments = [new Segment(this, this.l / this.n, 0, true)]
        for (let i = 1; i < this.n; i++) {
          this.segments.push(
            new Segment(this.segments[i - 1], this.l / this.n, 0, false)
          )
        }
      }

      move(last_target: { x: number; y: number }, target: { x: number; y: number }) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x)
        this.dt = dist(last_target.x, last_target.y, target.x, target.y)
        this.t = {
          x: target.x - 0.8 * this.dt * Math.cos(this.angle),
          y: target.y - 0.8 * this.dt * Math.sin(this.angle)
        }
        
        if (this.t.x !== undefined && this.t.y !== undefined) {
          this.segments[this.n - 1].update(this.t as { x: number; y: number })
        } else {
          this.segments[this.n - 1].update(target)
        }
        
        for (let i = this.n - 2; i >= 0; i--) {
          this.segments[i].update(this.segments[i + 1].pos)
        }
        
        if (
          dist(this.x, this.y, target.x, target.y) <=
          this.l + dist(last_target.x, last_target.y, target.x, target.y)
        ) {
          this.segments[0].fallback({ x: this.x, y: this.y })
          for (let i = 1; i < this.n; i++) {
            this.segments[i].fallback(this.segments[i - 1].nextPos)
          }
        }
      }

      show(target: { x: number; y: number }) {
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
          c!.globalCompositeOperation = "lighter"
          c!.beginPath()
          c!.moveTo(this.x, this.y)
          for (let i = 0; i < this.n; i++) {
            this.segments[i].show()
          }
          // 高级配色：深蓝到紫色渐变，低饱和度
          const hue = this.rand * 80 + 200 // 200-280度：深蓝到紫色
          const saturation = this.rand * 30 + 40 // 40-70%：低饱和度更高级
          const lightness = this.rand * 25 + 60 // 60-85%：适中亮度
          c!.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`
          c!.lineWidth = this.rand * 3 * opacity
          c!.lineCap = "round"
          c!.lineJoin = "round"
          c!.stroke()
          c!.globalCompositeOperation = "source-over"
        }
      }

      show2(target: { x: number; y: number }) {
        c!.beginPath()
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
          c!.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI)
          c!.fillStyle = `rgba(255, 255, 255, ${opacity * 0.4})` // 修复拼写错误并调整透明度
        } else {
          c!.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI)
          c!.fillStyle = `rgba(0, 139, 139, ${opacity * 0.3})` // darkcyan with opacity
        }
        c!.fill()
      }
    }

    // 初始化变量
    const maxl = 260 // 缩短触手长度（原400的2/3）
    const minl = 35
    const n = 25 // 增加段数让触手更流畅
    const numt = 250 // 增加触手数量到250根，确保至少20根可见
    const tent: Tentacle[] = []
    const target = { x: w / 2, y: h / 2, errx: 0, erry: 0 }
    const last_target = { x: w / 2, y: h / 2 }
    let t = 0
    const q = 10

    // 创建触手对象
    for (let i = 0; i < numt; i++) {
      tent.push(
        new Tentacle(
          Math.random() * w,
          Math.random() * h,
          Math.random() * (maxl - minl) + minl,
          n,
          Math.random() * 2 * Math.PI,
        )
      )
    }

    // 绘制函数
    function draw() {
      if (mouse.x !== false && mouse.y !== false) {
        target.errx = mouse.x - target.x
        target.erry = mouse.y - target.y
      } else {
        target.errx =
          w / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
          (Math.pow(Math.sin(t), 2) + 1) -
          target.x
        target.erry =
          h / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
          (Math.pow(Math.sin(t), 2) + 1) -
          target.y
      }

      target.x += target.errx / 10
      target.y += target.erry / 10
      t += 0.01

      // 绘制目标点（更透明）
      c!.beginPath()
      c!.arc(
        target.x,
        target.y,
        dist(last_target.x, last_target.y, target.x, target.y) + 5,
        0,
        2 * Math.PI
      )
      c!.fillStyle = `hsla(240, 50%, 75%, ${opacity * 0.4})`
      c!.fill()

      // 绘制触手
      for (let i = 0; i < numt; i++) {
        tent[i].move(last_target, target)
        tent[i].show2(target)
      }
      for (let i = 0; i < numt; i++) {
        tent[i].show(target)
      }

      last_target.x = target.x
      last_target.y = target.y
    }

    // 动画循环
    function loop() {
      animationRef.current = requestAnimFrame(loop)
      c!.clearRect(0, 0, w, h)
      draw()
    }

    // 窗口大小改变处理（修复了bug）
    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight // 修复：应该是h而不是w
    }

    // 鼠标事件处理
    const handleMouseMove = (e: MouseEvent) => {
      last_mouse.x = mouse.x as number
      last_mouse.y = mouse.y as number
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = false
      mouse.y = false
    }

    // 添加事件监听器
    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // 启动动画
    loop()

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{
        zIndex: 1,
        opacity: opacity,
        mixBlendMode: 'normal' // 改为normal模式，让触手更明显
      }}
    />
  )
}
