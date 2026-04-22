// vite-ssg.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    noExternal: ['vuetify'],
  },
})