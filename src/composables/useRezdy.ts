import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const companyCode = ref('')
const sylviaProductId = ref('')
const milleniumProductId = ref('')
const loaded = ref(false)

export function useRezdy() {
  async function loadRezdyConfig() {
    if (loaded.value) return
    const { data } = await supabase
      .from('cms_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['rezdy_company_code', 'rezdy_sylvia_product_id', 'rezdy_millenium_product_id'])

    if (data) {
      for (const row of data) {
        if (row.setting_key === 'rezdy_company_code') companyCode.value = row.setting_value
        if (row.setting_key === 'rezdy_sylvia_product_id') sylviaProductId.value = row.setting_value
        if (row.setting_key === 'rezdy_millenium_product_id') milleniumProductId.value = row.setting_value
      }
    }
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
