import { booking_api } from "@/api_factory/modules/booking"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useLoader } from "@/composables/core/useLoader"

export const useCreateBooking = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()
        const { startLoading, stopLoading } = useLoader()

    const createBooking = async (payload: any) => {
        loading.value = true
        error.value = null
        startLoading('Creating your booking...')
        try {
            const res = (await booking_api.createBooking(payload)) as any
            if (res.data?.success) {
                return res.data.data
            } else {
                showToast({
                    title: "Error",
                    message: res.data?.error || res.data.message || 'Booking creation failed',
                    toastType: "error",
                    duration: 3000,
                })
                throw new Error(res.data?.message || 'Booking creation failed')
            }
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, createBooking }
}
