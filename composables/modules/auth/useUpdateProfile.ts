import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useLoader } from "@/composables/core/useLoader"

export const useUpdateProfile = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { showToast } = useCustomToast()
     const { startLoading, stopLoading } = useLoader()

    const updateProfile = async (payload: any) => {
        // loading.value = true
        error.value = null
         startLoading('Updating profile...')
        try {
            await auth_api.updateProfile(payload)
            showToast({
                title: "Success",
                message: "Profile updated",
                toastType: "success",
                duration: 3000,
            })
        } finally {
            stopLoading()
            // loading.value = false
        }
    }

    return { loading, error, updateProfile }
}
