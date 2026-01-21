import { payment_api } from "@/api_factory/modules/payment"

export const useInitializePayment = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const initializePayment = async (payload: any) => {
        loading.value = true
        error.value = null
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
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return { loading, error, initializePayment }
}
