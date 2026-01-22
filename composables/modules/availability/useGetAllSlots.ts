// useGetAllSlots.ts
import { availability_api } from "@/api_factory/modules/availability"
import { useLoader } from "@/composables/core/useLoader"

export const useGetAllSlots = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const slots = ref<any[]>([])
    const dateRange = ref<{ start: string; end: string } | null>(null)
    const summary = ref<any>(null)
    const { startLoading, stopLoading } = useLoader()

    const getAllSlots = async (params: { 
        subdomain?: string
        businessId?: string
        startDate: string
        endDate: string 
    }) => {
        loading.value = true
        error.value = null
        slots.value = []
        dateRange.value = null
        summary.value = null
        startLoading('Fetching available slots...')
        try {
            const res = (await availability_api.getAllSlots(params)) as any
            console.log("All Slots Response:", res)
            if (res.data?.success) {
                const result = res.data.data
                if (result.slots && Array.isArray(result.slots)) {
                    slots.value = result.slots
                }
                if (result.dateRange) {
                    dateRange.value = result.dateRange
                }
                if (result.summary) {
                    summary.value = result.summary
                }
            }
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, slots, dateRange, summary, getAllSlots }
}