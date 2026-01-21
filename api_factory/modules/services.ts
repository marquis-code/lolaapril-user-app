import { GATEWAY_ENDPOINT } from '../axios.config'

export const services_api = {
    getServices: (subdomain: string) => {
        const url = `/services?subdomain=${subdomain}`
        return GATEWAY_ENDPOINT.get(url)
    }
}
