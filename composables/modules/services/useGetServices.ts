import { services_api } from "@/api_factory/modules/services"
import type { Service } from "@/types/service"

export const useGetServices = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const services = ref<Service[]>([])

    const getServices = async (subdomain: string) => {
        loading.value = true
        error.value = null
        try {
            const res = (await services_api.getServices(subdomain)) as any
            console.log("Services response:", res);
            if (res.data?.success) {
                services.value = res.data.data || []
            }
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { loading, error, services, getServices }
}
