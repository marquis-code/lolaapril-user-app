import { ref } from 'vue'
import { consultation_api } from '@/api_factory/modules/consultation'

export function useGetMyConsultationBookings() {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const bookings = ref<any[]>([])

    async function getConsultationBookings() {
        loading.value = true
        error.value = null
        try {
            const res = await consultation_api.getMyBookings()
            bookings.value = res.data || []
        } catch (e: any) {
            error.value = e?.response?.data?.message || e?.message || 'Failed to fetch consultation bookings.'
        } finally {
            loading.value = false
        }
    }

    return {
        getConsultationBookings,
        loading,
        error,
        bookings
    }
}
