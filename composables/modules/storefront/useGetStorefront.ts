import { ref, computed } from 'vue'
import { storefront_api } from '@/api_factory/modules/storefront'

export interface StorefrontData {
    success: boolean
    business: any
    theme: any
    layout: any
    componentStyles: any
    categories: any[]
    services: any[]
    staff: any[]
    faqs?: any[]
    isDefaultTheme: boolean
    message?: string
}

export const useStorefront = () => {
    const storefront = ref<StorefrontData | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchStorefront = async (subdomain: string) => {
        loading.value = true
        error.value = null

        try {
            const { data } = await storefront_api.getBySubdomain(subdomain)
            // API returns data at root level, not nested
            storefront.value = data as StorefrontData
            return data
        } catch (err: any) {
            error.value = err?.response?.data?.message || err.message || 'Failed to load storefront'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Grouped services by category
    const servicesByCategory = computed(() => {
        if (!storefront.value) return {}

        const grouped: Record<string, any[]> = {}
        storefront.value.categories.forEach(cat => {
            // categoryId can be an object with _id or a string
            grouped[cat.id] = storefront.value!.services.filter(svc => {
                const catId = typeof svc.categoryId === 'object' ? svc.categoryId?._id : svc.categoryId
                return catId === cat.id
            })
        })
        return grouped
    })

    // Staff that can perform a specific service
    const getStaffForService = (serviceId: string) => {
        if (!storefront.value) return []
        return storefront.value.staff.filter(
            s => s.assignedStaffIds?.includes(serviceId) || s.allTeamMembers
        )
    }

    return {
        storefront,
        loading,
        error,
        fetchStorefront,
        servicesByCategory,
        getStaffForService
    }
}

// Also export as useGetStorefront for backwards compatibility
export const useGetStorefront = useStorefront
