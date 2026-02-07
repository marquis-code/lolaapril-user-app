import { GATEWAY_ENDPOINT } from '../axios.config'

export const storefront_api = {
    /**
     * Get storefront data by subdomain
     * Returns business info, theme, categories, services, and staff
     */
    getBySubdomain: (subdomain: string) => {
        const url = `/businesses/storefront/${subdomain}`
        return GATEWAY_ENDPOINT.get(url)
    }
}
