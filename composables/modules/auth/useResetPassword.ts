import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useLoader } from "@/composables/core/useLoader"

export const useResetPassword = () => {
    const loading = ref(false)
    const { startLoading, stopLoading } = useLoader()

    const resetPassword = async (payload: any) => {
        loading.value = true
        startLoading("Resetting password...")

        try {
            const res = await auth_api.resetPassword(payload)
            return res
        } finally {
            loading.value = false
            stopLoading()
        }
    }

    return {
        loading,
        resetPassword,
    }
}
