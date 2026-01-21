import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config'

export const auth_api = {
    register: (payload: {
        firstName: string
        lastName: string
        email: string
        phone: string
        password: string
    }) => {
        const url = "/auth/register"
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    login: (payload: { email: string; password: string }) => {
        const url = "/auth/login"
        return GATEWAY_ENDPOINT.post(url, payload)
    },

    getProfile: () => {
        const url = "/auth/profile"
        return GATEWAY_ENDPOINT_WITH_AUTH.get(url) // Authenticated
    },

    updateProfile: (payload: any) => {
        const url = "/auth/profile" // PATCH
        return GATEWAY_ENDPOINT_WITH_AUTH.patch(url, payload)
    },
}
