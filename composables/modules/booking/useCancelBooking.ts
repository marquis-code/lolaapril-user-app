import { booking_api } from "@/api_factory/modules/booking"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useCancelBooking = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()

    const cancelBooking = async (id: string, reason: string) => {
        loading.value = true
        error.value = null
        try {
            const res = (await booking_api.cancelBooking(id, reason)) as any
            showToast({
                title: 'Success',
                message: 'Booking cancelled successfully',
                toastType: 'success'
            })
            return res.data
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return { loading, error, cancelBooking }
}
