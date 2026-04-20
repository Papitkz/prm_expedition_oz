// src/composables/useRippleEffect.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface RippleSettings {
  maxSize: number
  animationSpeed: number
  strokeColor: [number, number, number]
}

interface CanvasSettings {
  blur: number
  ratio: number
}

interface Coords {
  x: number
  y: number
}

class Ripple {
  position: Coords
  circleSize: number
  maxSize: number
  opacity: number
  ctx: CanvasRenderingContext2D
  strokeColor: string
  animationSpeed: number
  opacityStep: number
  status: string = 'active'

  constructor(
    x: number,
    y: number,
    circleSize: number,
    ctx: CanvasRenderingContext2D,
    settings: RippleSettings
  ) {
    this.position = { x, y }
    this.circleSize = circleSize
    this.maxSize = settings.maxSize
    this.opacity = 1
    this.ctx = ctx
    this.animationSpeed = settings.animationSpeed
    
    const [r, g, b] = settings.strokeColor
    this.strokeColor = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${this.opacity})`
    
    this.opacityStep = (this.animationSpeed / (this.maxSize - circleSize)) / 2
  }

  update(settings: RippleSettings) {
    this.circleSize += this.animationSpeed
    this.opacity -= this.opacityStep
    
    const [r, g, b] = settings.strokeColor
    this.strokeColor = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${Math.max(0, this.opacity)})`
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.strokeColor
    this.ctx.arc(this.position.x, this.position.y, this.circleSize, 0, 2 * Math.PI)
    this.ctx.stroke()
  }

  isDead(): boolean {
    return this.opacity <= 0
  }
}

export function useRippleEffect(
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: Partial<RippleSettings & CanvasSettings> = {}
) {
  const rippleSettings: RippleSettings = {
    maxSize: options.maxSize ?? 100,
    animationSpeed: options.animationSpeed ?? 5,
    strokeColor: options.strokeColor ?? [201, 168, 76] // Your gold color #c9a84c
  }

  const canvasSettings: CanvasSettings = {
    blur: options.blur ?? 8,
    ratio: options.ratio ?? window.devicePixelRatio || 1
  }

  const ripples: Ripple[] = []
  let ctx: CanvasRenderingContext2D | null = null
  let animationFrame: number | null = null
  let isActive = true

  const resizeCanvas = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * canvasSettings.ratio
    canvas.height = height * canvasSettings.ratio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.style.filter = `blur(${canvasSettings.blur}px)`
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive || !ctx) return
    
    const x = e.clientX * canvasSettings.ratio
    const y = e.clientY * canvasSettings.ratio
    
    ripples.unshift(new Ripple(x, y, 2, ctx, rippleSettings))
  }

  const animate = () => {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i]
      ripple.update(rippleSettings)
      ripple.draw()

      if (ripple.isDead()) {
        ripples.splice(i, 1)
      }
    }

    animationFrame = requestAnimationFrame(animate)
  }

  const start = () => {
    isActive = true
    if (!animationFrame) animate()
  }

  const stop = () => {
    isActive = false
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  const clear = () => {
    ripples.length = 0
    const canvas = canvasRef.value
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d')
    if (!ctx) return

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('mousemove', handleMouseMove)

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!prefersReducedMotion.matches) {
      animate()
    }

    // Listen for changes
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        stop()
        clear()
      } else {
        start()
      }
    })
  })

  onUnmounted(() => {
    stop()
    window.removeEventListener('resize', resizeCanvas)
    canvasRef.value?.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    start,
    stop,
    clear,
    resizeCanvas
  }
}