import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const mobile_spa_api = {
    createMobileSpa: (payload: any) => {
        const url = '/mobile-spa'
        return GATEWAY_ENDPOINT_WITH_AUTH.post(url, payload)
    },
    getMyRequests: () => {
        const url = '/mobile-spa/my-requests'
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url)
    }
}
