import { services_api } from "@/api_factory/modules/services"
import type { Service } from "@/types/service"
import { useLoader } from "@/composables/core/useLoader"

export const useGetServices = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const services = ref<Service[]>([])
    const { startLoading, stopLoading } = useLoader()

    const getServices = async (subdomain: string) => {
        loading.value = true
        error.value = null
         startLoading('Fetching services...')
        try {
            const res = (await services_api.getServices(subdomain)) as any
            console.log("Services response:", res);
            if (res.data?.success) {
                services.value = res.data.data || []
            }
        } finally {
            stopLoading()
            loading.value = false
        }
    }

    return { error, services, getServices, loading }
}
