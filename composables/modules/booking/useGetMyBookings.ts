// import { booking_api } from "@/api_factory/modules/booking"

// export const useGetMyBookings = () => {
//     // Returns promise for useAsyncData, or can be used directly
//     const getMyBookings = async () => {
//         return booking_api.getMyBookings()
//     }
//     return { getMyBookings }
// }


import { booking_api } from "@/api_factory/modules/booking"

export const useGetMyBookings = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const bookings = ref<any[]>([]) // Array of date objects with availability info

    const getMyBookings = async () => {
        loading.value = true
        try {
            const res = (await booking_api.getMyBookings()) as any
            console.log("All Slots Response: here", res)
            if (res.status === 200) {
                const result = res.data
                bookings.value = result
            }
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {getMyBookings()})

    return { loading, error, bookings,  getMyBookings }
}