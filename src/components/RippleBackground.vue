<!-- src/components/RippleBackground.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRippleEffect } from '@/composables/useRippleEffect'

const canvasRef = ref<HTMLCanvasElement | null>(null)

// Expedition theme colors
useRippleEffect(canvasRef, {
  maxSize: 120,
  animationSpeed: 4,
  strokeColor: [201, 168, 76], // Your gold #c9a84c
  blur: 6
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="ripple-canvas"
    aria-hidden="true"
  />
</template>

<style scoped>
.ripple-canvas {
  position: fixed;
  inset: 0;
  pointer-events: auto;
  z-index: 0;
  opacity: 0.6;
  mix-blend-mode: screen;
}

/* Disable on mobile for performance */
@media (max-width: 768px) {
  .ripple-canvas {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ripple-canvas {
    display: none;
  }
}
</style>