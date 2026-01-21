import { booking_api } from "@/api_factory/modules/booking"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useCreateBooking = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()

    const createBooking = async (payload: any) => {
        loading.value = true
        error.value = null
        try {
            const res = (await booking_api.createBooking(payload)) as any
            if (res.data?.success) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || 'Booking creation failed')
            }
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return { loading, error, createBooking }
}
