import { auth_api } from "@/api_factory/modules/auth"
import { useUser } from "@/composables/modules/auth/user"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useLoader } from "@/composables/core/useLoader"

export const useLogin = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { setToken, createUser } = useUser()
    const { showToast } = useCustomToast()
    const { startLoading, stopLoading } = useLoader()

    const login = async (payload: any) => {
        // loading.value = true
        error.value = null
        startLoading('Logging you in...')
        try {
            const res = (await auth_api.login(payload)) as any
            console.log("Login Response:", res)
            if (res.data?.accessToken) {
                createUser(res.data)
                showToast({
                    title: "Success",
                    message: "Login successful",
                    toastType: "success",
                    duration: 3000,
                })
                return true
            }
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, login }
}
