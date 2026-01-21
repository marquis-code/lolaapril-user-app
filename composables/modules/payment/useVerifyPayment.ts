import { payment_api } from "@/api_factory/modules/payment"

export const useVerifyPayment = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const verifyPayment = async (reference: string) => {
        loading.value = true
        try {
            const res = (await payment_api.verifyPayment(reference)) as any
            console.log("Verify Payment Response:", res)
            return res.data.data
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return { loading, error, verifyPayment }
}
