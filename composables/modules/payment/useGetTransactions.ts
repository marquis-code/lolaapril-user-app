import { payment_api } from "@/api_factory/modules/payment"
import type { Business } from "@/types/business"
import { useLoader } from "@/composables/core/useLoader"

export const useGetTransactions  = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
     const { startLoading, stopLoading } = useLoader()
    // Global state for business
    const transactions = ref([]) as any

    const getTransactions  = async () => {
        loading.value = true
        error.value = null
        startLoading('Fetching transactions...')
        try {
            const res = (await payment_api.myTransactions()) as any
            console.log('Transactions response:', res)
            if (res.data?.success) {
                transactions.value = res.data.data
            } else {
                throw new Error('Business not found')
            }
        } finally {
             stopLoading()
            loading.value = false
        }
    }

    onMounted(() => {
       getTransactions()
    })

    return { loading, error, transactions, getTransactions }
}
