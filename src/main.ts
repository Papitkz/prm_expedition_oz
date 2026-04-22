import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createHead } from '@unhead/vue/client'  // Updated import
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'expeditionDark',
    themes: {
      expeditionDark: {
        dark: true,
        colors: {
          primary: '#c9a84c',
          secondary: '#0d6e7a',
          background: '#071a2b',
          surface: '#0a2e4a',
          error: '#e07b5a',
          info: '#0d6e7a',
          success: '#4caf50',
          warning: '#c9a84c',
        }
      }
    }
  }
})

const app = createApp(App)

app.use(createHead())  // Now safe to use
app.use(router)
app.use(vuetify)

app.mount('#app')