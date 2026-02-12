import { consultation_api } from "@/api_factory/modules/consultation";
import { ref } from "vue";

export const useBookConsultation = () => {
  const loading = ref(false);

  const bookConsultation = async (
    subdomain: string,
    payload: { packageId: string; startTime: string; notes?: string },
  ) => {
    loading.value = true;
    const res = await consultation_api.bookConsultation(subdomain, payload);
    if ([200, 201].includes(res.status)) {
      // Redirect to payment page if authorization URL is provided
      if (res.data?.payment?.authorization_url) {
        window.location.href = res.data.payment.authorization_url;
      }
    } else {
          //   showToast({
  //     title: 'Booking Failed',
  //     message: res.error || 'Please try again later',
  //     toastType: 'error'
  //   })
    //   console.warn("Unexpected response status:", res.status, res.data);
    }
    loading.value = false;
  };

  return {
    loading,
    bookConsultation,
  };
};
