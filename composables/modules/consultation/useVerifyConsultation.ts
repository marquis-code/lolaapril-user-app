import { consultation_api } from "@/api_factory/modules/consultation";
import { ref } from "vue";

export const useVerifyConsultation = () => {
    const loading = ref(false);
    const verificationResult = ref<any>(null);
    const error = ref<string | null>(null);

    const verifyPayment = async (reference: string) => {
        if (!reference) {
            error.value = "Invalid payment reference";
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const res = await consultation_api.verifyPayment(reference);
            if ([200, 201].includes(res.status)) {
                verificationResult.value = res.data;
            } else {
                error.value = res.data?.message || "Payment verification failed. Please contact support.";
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || "An error occurred during verification.";
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        verificationResult,
        error,
        verifyPayment,
    };
};
