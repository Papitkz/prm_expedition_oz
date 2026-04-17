<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLenis } from '@/composables/useLenis'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import RouteLoader from '@/components/RouteLoader.vue'

useLenis()

const loading = ref(false)
const router = useRouter()

router.beforeEach(() => {
  loading.value = true
})

router.afterEach(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <v-app theme="expeditionDark">
    <RouteLoader :visible="loading" />
    <NavBar />
    <v-main>
      <router-view />
    </v-main>
    <FooterSection />
  </v-app>
</template>
