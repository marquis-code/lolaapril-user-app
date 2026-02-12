import { consultation_api } from "@/api_factory/modules/consultation";
import { ref } from "vue";

export const useGetConsultationPackages = () => {
    const loading = ref(false);
    const packages = ref([]);

    const getPackages = async (subdomain: string) => {
        loading.value = true;
        try {
            const res = await consultation_api.getPackages(subdomain);
            packages.value = res.data;
            return res.data;
        } catch (error) {
            console.error("Error fetching consultation packages:", error);
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        packages,
        getPackages,
    };
};
