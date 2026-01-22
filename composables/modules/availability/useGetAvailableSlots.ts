// useGetAvailableSlots.ts
import { availability_api } from "@/api_factory/modules/availability"
import { useLoader } from "@/composables/core/useLoader"

export const useGetAvailableSlots = () => {
    // const loading = ref(false)
    const error = ref<string | null>(null)
    const slots = ref<string[]>([])
    const { startLoading, stopLoading } = useLoader()

    const getAvailableSlots = async (params: { 
        subdomain?: string
        businessId?: string
        date: string
        serviceIds: string[] 
    }) => {
        // loading.value = true
        error.value = null
        slots.value = []
        startLoading('Fetching available slots...')
        try {
            const res = (await availability_api.getAvailableSlots(params)) as any
            if (res.data?.success) {
                const result = res.data.data
                if (Array.isArray(result)) slots.value = result
                else if (result.slots) slots.value = result.slots
                else if (result.availableSlots) slots.value = result.availableSlots
            }
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { error, slots, getAvailableSlots }
}