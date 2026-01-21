import { auth_api } from "@/api_factory/modules/auth"
import { useUser } from "@/composables/modules/auth/user"

export const useGetProfile = () => {
    const loading = ref(false)
    const { setUser } = useUser()

    const getProfile = async () => {
        loading.value = true
        try {
            const res = (await auth_api.getProfile()) as any
            if (res.data?.user) {
                setUser(res.data.user)
                return res.data.user
            }
        } catch (err) {
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    return { loading, getProfile }
}
