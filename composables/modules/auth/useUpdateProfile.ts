import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useUpdateProfile = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()

    const updateProfile = async (payload: any) => {
        loading.value = true
        error.value = null
        try {
            await auth_api.updateProfile(payload)
            showToast({
                title: "Success",
                message: "Profile updated",
                toastType: "success",
                duration: 3000,
            })
        } catch (err: any) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return { loading, error, updateProfile }
}
