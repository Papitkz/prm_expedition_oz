import { ref, onMounted } from 'vue'
import {
  getFirebaseDb,
  isFirebaseInitialized,
  initFirebase,
  type FirebaseConfig,
} from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const companyCode = ref('')
const sylviaProductId = ref('')
const milleniumProductId = ref('')
const loaded = ref(false)

export function useRezdy() {
  async function loadRezdyConfig() {
    if (loaded.value) return
    if (!isFirebaseInitialized()) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('firebase_config')
        if (saved) {
          try { initFirebase(JSON.parse(saved) as FirebaseConfig) } catch { return }
        } else return
      } else return
    }

    try {
      const db = getFirebaseDb()
      const keys = ['rezdy_company_code', 'rezdy_sylvia_product_id', 'rezdy_millenium_product_id']
      for (const key of keys) {
        const snap = await getDoc(doc(db, 'cms_settings', key))
        if (snap.exists()) {
          const val = snap.data().value as string
          if (key === 'rezdy_company_code') companyCode.value = val
          if (key === 'rezdy_sylvia_product_id') sylviaProductId.value = val
          if (key === 'rezdy_millenium_product_id') milleniumProductId.value = val
        }
      }
    } catch { /* ignore */ }

    loaded.value = true
  }

  function getBookingUrl(slug: string): string | null {
    if (!companyCode.value) return null
    const productId = slug === 'sylvia' ? sylviaProductId.value : milleniumProductId.value
    if (!productId) return null
    return `https://${companyCode.value}.rezdy.com/catalog/${productId}`
  }

  function getBookingWidgetUrl(slug: string): string | null {
    if (!companyCode.value) return null
    const productId = slug === 'sylvia' ? sylviaProductId.value : milleniumProductId.value
    if (!productId) return null
    return `https://${companyCode.value}.rezdy.com/widget/${productId}`
  }

  function hasRezdyIntegration(): boolean {
    return !!(companyCode.value && (sylviaProductId.value || milleniumProductId.value))
  }

  onMounted(loadRezdyConfig)

  return {
    companyCode,
    sylviaProductId,
    milleniumProductId,
    getBookingUrl,
    getBookingWidgetUrl,
    hasRezdyIntegration,
    loadRezdyConfig,
  }
}
