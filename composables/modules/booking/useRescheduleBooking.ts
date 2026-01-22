import { booking_api } from "@/api_factory/modules/booking"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useLoader } from "@/composables/core/useLoader"

export const useRescheduleBooking = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()
        const { startLoading, stopLoading } = useLoader()

    const rescheduleBooking = async (id: string, payload: { newPreferredDate: string, newPreferredStartTime: string, reason: string }) => {
        loading.value = true
        error.value = null
         startLoading('Rescheduling your booking...')
        try {
            const res = (await booking_api.rescheduleBooking(id, payload)) as any
            showToast({
                title: 'Success',
                message: 'Booking rescheduled successfully',
                toastType: 'success'
            })
            return res.data
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, rescheduleBooking }
}
