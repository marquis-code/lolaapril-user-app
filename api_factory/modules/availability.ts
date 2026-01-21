import { GATEWAY_ENDPOINT } from '../axios.config'

export const availability_api = {
    // Get available slots for specific date and services
    getAvailableSlots: (params: { 
        subdomain?: string
        businessId?: string
        date: string
        serviceIds: string[] 
    }) => {
        const url = "/availability/slots"
        const urlParams = new URLSearchParams()
        
        // Add either subdomain or businessId
        if (params.subdomain) {
            urlParams.append('subdomain', params.subdomain)
        } else if (params.businessId) {
            urlParams.append('businessId', params.businessId)
        }
        
        urlParams.append('date', params.date)
        
        // Append each serviceId with the same key name
        params.serviceIds.forEach(id => {
            urlParams.append('serviceIds', id)
        })
        
        return GATEWAY_ENDPOINT.get(`${url}?${urlParams.toString()}`)
    },
    
    // Get all slots for a date range (without service filter)
    getAllSlots: (params: { 
        subdomain?: string
        businessId?: string
        startDate: string
        endDate: string 
    }) => {
        const url = "/availability/all-slots"
        const queryParams: Record<string, string> = {
            startDate: params.startDate,
            endDate: params.endDate
        }
        
        // Add either subdomain or businessId
        if (params.subdomain) {
            queryParams.subdomain = params.subdomain
        } else if (params.businessId) {
            queryParams.businessId = params.businessId
        }
        
        return GATEWAY_ENDPOINT.get(url, { params: queryParams })
    }
}