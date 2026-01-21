import type { Service } from "@/types/service"

// Replaces useBookingStore state
export const useBookingState = () => {
    const selectedService = useState<Service | null>('booking_service', () => null)
    const selectedDate = useState<string | null>('booking_date', () => null)
    const selectedTime = useState<string | null>('booking_time', () => null)
    const guestInfo = useState<{ name: string, email: string, phone: string }>('booking_guest', () => ({
        name: '', email: '', phone: ''
    }))
    // To store info required for payment page reload if needed
    const bookingDetails = useState<{ bookingId: string | null, clientId: string | null }>('booking_details', () => ({
        bookingId: null, clientId: null
    }))

    const resetBookingState = () => {
        selectedService.value = null
        selectedDate.value = null
        selectedTime.value = null
        bookingDetails.value = { bookingId: null, clientId: null }
        // Keep guest info? Maybe clear.
        guestInfo.value = { name: '', email: '', phone: '' }
    }

    return {
        selectedService,
        selectedDate,
        selectedTime,
        guestInfo,
        bookingDetails,
        resetBookingState
    }
}
