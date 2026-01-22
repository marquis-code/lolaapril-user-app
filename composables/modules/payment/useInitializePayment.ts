import { payment_api } from "@/api_factory/modules/payment"
import { useLoader } from "@/composables/core/useLoader"

export const useInitializePayment = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
        const { startLoading, stopLoading } = useLoader()

    const initializePayment = async (payload: any) => {
        loading.value = true
        error.value = null
        startLoading('Initializing payment...')
        try {
            const res = (await payment_api.initializePayment(payload)) as any
            console.log("Initialize Payment Response:", res)
            if (res.data?.success) {
                const data = res.data.data
                
                // Check if authorization_url exists in the response
                if (data?.authorizationUrl) {
                    // Open Paystack payment UI in a new window
                    window.open(data.authorizationUrl, '_blank', 'width=600,height=700')
                }
                
                return data
            }
            throw new Error('Payment initialization failed')
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, initializePayment }
}
