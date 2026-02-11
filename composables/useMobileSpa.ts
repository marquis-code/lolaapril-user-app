import { ref } from 'vue'
import { mobile_spa_api } from '@/api_factory/modules/mobileSpa'

export interface MobileSpaService {
  serviceId: string
  quantity?: number
}

export interface MobileSpaLocation {
  address: string
  lat: number
  lng: number
  placeId?: string
  additionalDirections?: string
}

export interface CreateMobileSpaPayload {
  businessId: string
  services: MobileSpaService[]
  numberOfPeople: number
  location: MobileSpaLocation
  requestedDate: string
  requestedTime?: string
  clientNotes?: string
}

export function useMobileSpa() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  async function createMobileSpa(payload: CreateMobileSpaPayload) {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const res = await mobile_spa_api.createMobileSpa(payload)
      success.value = true
      return res
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.message || 'Failed to book mobile spa.'
      return null
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    success.value = false
  }

  return {
    createMobileSpa,
    loading,
    error,
    success,
    reset
  }
}
