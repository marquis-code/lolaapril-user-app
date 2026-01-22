import { business_api } from "@/api_factory/modules/business"
import type { Business } from "@/types/business"

export const useGetBusiness = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    // Global state for business
    const business = useState<Business | null>('active_business', () => null)

    const getBusiness = async (subdomain: string) => {
        loading.value = true
        error.value = null
        try {
            const res = (await business_api.getBySubdomain(subdomain)) as any
            if (res.data?.success) {
                business.value = res.data.data
            } else {
                throw new Error('Business not found')
            }
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        const route = useRoute()
        const subdomain = route.query.subdomain as string
        if (subdomain) {
            getBusiness(subdomain)
        }
    })

    return { loading, error, business, getBusiness }
}
