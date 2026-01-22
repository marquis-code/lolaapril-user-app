import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useLoader } from "@/composables/core/useLoader"

export const useVerifyResetPasswordOtp = () => {
    const loading = ref(false)
    const { startLoading, stopLoading } = useLoader()

    const verifyResetPasswordOtp = async (payload: any) => {
        loading.value = true
        startLoading("Verifying OTP...")

        try {
            const res = await auth_api.verifyResetPasswordOtp(payload)
            return res
        } finally {
            loading.value = false
            stopLoading()
        }
    }

    return {
        loading,
        verifyResetPasswordOtp,
    }
}
