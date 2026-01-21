import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useRegister = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()

    const register = async (payload: any) => {
        loading.value = true
        error.value = null
        try {
            const res = (await auth_api.register(payload)) as any
            if (res.status === 201 || res.status === 200) {
                showToast({
                    title: "Success",
                    message: "Registration successful",
                    toastType: "success",
                    duration: 3000,
                })
                return res.data
            }
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return { loading, error, register }
}
