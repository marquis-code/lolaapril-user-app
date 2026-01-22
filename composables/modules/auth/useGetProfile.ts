import { auth_api } from "@/api_factory/modules/auth"
import { useUser } from "@/composables/modules/auth/user"
import { useLoader } from "@/composables/core/useLoader"

const user = ref({})
export const useGetProfile = () => {
    const loading = ref(false)
    const { createUser } = useUser()
     const { startLoading, stopLoading } = useLoader()

    const getProfile = async () => {
        loading.value = true
        startLoading('Fetching profile...')
        try {
            const res = (await auth_api.getProfile()) as any
            if (res.data?.user) {
                user.value = res.data.user
                return res.data.user
            }
        } finally {
             stopLoading()
            // loading.value = false
        }
    }

    onMounted(() => {
        getProfile()
    })

    return { loading, user, getProfile }
}
