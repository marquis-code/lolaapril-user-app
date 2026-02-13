import { defineNuxtPlugin, useRouter } from '#app'
import { useAnalytics } from '@/composables/useAnalytics'

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const { trackEvent } = useAnalytics()

    // Ensure it only runs on the client side
    if (import.meta.client) {
        router.afterEach((to) => {
            // Small delay to ensure document.title is updated if needed
            setTimeout(() => {
                trackEvent('page_view', 'Page View', 'navigate', {
                    pagePath: to.fullPath,
                    pageTitle: document.title,
                    referrer: document.referrer
                })
            }, 100)
        })

        // Track initial page load
        setTimeout(() => {
            trackEvent('page_view', 'Page View', 'load', {
                pagePath: router.currentRoute.value.fullPath,
                pageTitle: document.title,
                referrer: document.referrer
            })
        }, 100)
    }
})
