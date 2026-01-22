import { booking_api } from "@/api_factory/modules/booking"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useLoader } from "@/composables/core/useLoader"

export const useCancelBooking = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()
    const { startLoading, stopLoading } = useLoader()

    const cancelBooking = async (id: string, reason: string) => {
        loading.value = true
        error.value = null
         startLoading('Cancelling your booking...')
        try {
            const res = (await booking_api.cancelBooking(id, reason)) as any
            showToast({
                title: 'Success',
                message: 'Booking cancelled successfully',
                toastType: 'success'
            })
            return res.data
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, cancelBooking }
}
