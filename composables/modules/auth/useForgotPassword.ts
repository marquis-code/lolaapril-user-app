import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useLoader } from "@/composables/core/useLoader"

export const useForgotPassword = () => {
    const loading = ref(false)
    const { startLoading, stopLoading } = useLoader()

    const forgotPassword = async (payload: any) => {
        loading.value = true
        startLoading("Sending reset link...")

        try {
            const res = await auth_api.forgotPassword(payload)
            return res
        } finally {
            loading.value = false
            stopLoading()
        }
    }

    return {
        loading,
        forgotPassword,
    }
}
