// import { availability_api } from "@/api_factory/modules/availability"

// export const useGetAllSlots = () => {
//     const loading = ref(false)
//     const error = ref<string | null>(null)
//     const slots = ref<any[]>([]) // Array of date objects with availability info
//     const dateRange = ref<{ start: string; end: string } | null>(null)
//     const summary = ref<any>(null)

//     const getAllSlots = async (params: { subdomain: any; startDate: string; endDate: string }) => {
//         loading.value = true
//         error.value = null
//         slots.value = []
//         dateRange.value = null
//         summary.value = null
//         try {
//             const res = (await availability_api.getAllSlots(params)) as any
//             console.log("All Slots Response:", res)
//             if (res.data?.success) {
//                 const result = res.data.data
//                 // Extract slots array from the response
//                 if (result.slots && Array.isArray(result.slots)) {
//                     slots.value = result.slots
//                 }
//                 // Store additional metadata
//                 if (result.dateRange) {
//                     dateRange.value = result.dateRange
//                 }
//                 if (result.summary) {
//                     summary.value = result.summary
//                 }
//             }
//         } catch (err: any) {
//             error.value = err.message
//         } finally {
//             loading.value = false
//         }
//     }

//     return { loading, error, slots, dateRange, summary, getAllSlots }
// }


// useGetAllSlots.ts
import { availability_api } from "@/api_factory/modules/availability"

export const useGetAllSlots = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const slots = ref<any[]>([])
    const dateRange = ref<{ start: string; end: string } | null>(null)
    const summary = ref<any>(null)

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
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { loading, error, slots, dateRange, summary, getAllSlots }
}