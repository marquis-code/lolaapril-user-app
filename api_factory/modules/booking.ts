import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const booking_api = {
    createBooking: (payload: any) => {
        const url = "/booking-flow/create"
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    getMyBookings: () => {
        const url = "/bookings/my/bookings"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    },

    cancelBooking: (id: string, reason: string) => {
        const url = `/bookings/${id}/cancel`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, { reason })
    },

    rescheduleBooking: (id: string, payload: { newPreferredDate: string, newPreferredStartTime: string, reason: string }) => {
        const url = `/bookings/${id}/reschedule`
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    }
}
