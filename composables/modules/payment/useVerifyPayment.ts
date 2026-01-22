import { payment_api } from "@/api_factory/modules/payment"
import { useLoader } from "@/composables/core/useLoader"

export const useVerifyPayment = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { startLoading, stopLoading } = useLoader()

    const verifyPayment = async (reference: string) => {
        loading.value = true
        startLoading('Verifying your payment...')
        try {
            const res = (await payment_api.verifyPayment(reference)) as any
            console.log("Verify Payment Response:", res)
            return res.data.data
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, verifyPayment }
}
