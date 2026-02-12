import { GATEWAY_ENDPOINT_WITHOUT_VERSION } from '../axios.config'

export const consultation_api = {
    getPackages: (subdomain: string) => {
        const url = `/consultations/subdomain/${subdomain}/packages`
        return GATEWAY_ENDPOINT_WITHOUT_VERSION.get(url)
    },
    getSlots: (subdomain: string, params: { date: string, packageId: string }) => {
        const url = `/consultations/subdomain/${subdomain}/slots`
        return GATEWAY_ENDPOINT_WITHOUT_VERSION.get(url, { params })
    },
    bookConsultation: (subdomain: string, payload: { packageId: string, startTime: string, notes?: string }) => {
        const url = `/consultations/book/subdomain/${subdomain}`
        return GATEWAY_ENDPOINT_WITHOUT_VERSION.post(url, payload)
    },
    verifyPayment: (reference: string) => {
        const url = `/consultations/verify-payment/${reference}`
        return GATEWAY_ENDPOINT_WITHOUT_VERSION.get(url)
    }
}
