import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'

export default defineNuxtRouteMiddleware(async (to) => {
    const { business, getBusiness } = useGetBusiness()
    const subdomain = to.query.subdomain as string

    // If subdomain exists and we haven't loaded it or it's different, fetch it
    if (subdomain && (
        !business.value ||
        business.value.subdomain !== subdomain
    )) {
        await getBusiness(subdomain)
    }
})
