import { ref } from 'vue'
import { mobile_spa_api } from '@/api_factory/modules/mobileSpa'

export function useGetMyMobileSpaRequests() {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const requests = ref<any[]>([])

    async function getMobileSpaRequests() {
        loading.value = true
        error.value = null
        try {
            const res = await mobile_spa_api.getMyRequests()
            requests.value = res.data?.data || []
        } catch (e: any) {
            error.value = e?.response?.data?.message || e?.message || 'Failed to fetch mobile spa requests.'
        } finally {
            loading.value = false
        }
    }

    return {
        getMobileSpaRequests,
        loading,
        error,
        requests
    }
}
