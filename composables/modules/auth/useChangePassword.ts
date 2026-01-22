import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useLoader } from "@/composables/core/useLoader"

export const useChangePassword = () => {
    const loading = ref(false)
    const { startLoading, stopLoading } = useLoader()
    const { showToast } = useCustomToast()

    const changePassword = async (payload: any) => {
        loading.value = true
        startLoading("Changing password...")

        try {
            const res = await auth_api.changePassword(payload)
            return res
        } finally {
            loading.value = false
            stopLoading()
        }
    }

    return {
        loading,
        changePassword,
    }
}
