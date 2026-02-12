import { consultation_api } from "@/api_factory/modules/consultation";
import { ref } from "vue";

export const useGetConsultationSlots = () => {
    const loading = ref(false);
    const slots = ref([]);

    const getSlots = async (subdomain: string, date: string, packageId: string) => {
        loading.value = true;
        try {
            const res = await consultation_api.getSlots(subdomain, { date, packageId });
            slots.value = res.data;
            return res.data;
        } catch (error) {
            console.error("Error fetching consultation slots:", error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        slots,
        getSlots,
    };
};
