import { ref } from 'vue'
import { analytics_api } from '@/api_factory/modules/analytics'

export const useAnalytics = () => {
    const visitorIdKey = 'lola_visitor_id'
    const sessionIdKey = 'lola_session_id'
    const sessionExpiry = 30 * 60 * 1000 // 30 minutes

    const getVisitorId = () => {
        if (!import.meta.client) return ''
        let id = localStorage.getItem(visitorIdKey)
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem(visitorIdKey, id)
        }
        return id
    }

    const getSessionId = () => {
        if (!import.meta.client) return ''
        let sessionData = sessionStorage.getItem(sessionIdKey)
        let id: string

        if (sessionData) {
            try {
                const { sessionId, expiry } = JSON.parse(sessionData)
                if (Date.now() < expiry) {
                    // Extend session
                    id = sessionId
                    const newExpiry = Date.now() + sessionExpiry
                    sessionStorage.setItem(sessionIdKey, JSON.stringify({ sessionId: id, expiry: newExpiry }))
                    return id
                }
            } catch (e) {
                console.error('Failed to parse session data', e)
            }
        }

        // New session
        id = crypto.randomUUID()
        const expiry = Date.now() + sessionExpiry
        sessionStorage.setItem(sessionIdKey, JSON.stringify({ sessionId: id, expiry }))
        return id
    }

    const getSubdomain = () => {
        if (!import.meta.client) return 'lola-beauty'
        const route = useRoute()

        // 1. Check route params (e.g., from /book/[subdomain])
        if (route.params.subdomain) {
            return route.params.subdomain as string
        }

        // 2. Check route query
        if (route.query.subdomain) {
            return route.query.subdomain as string
        }

        // 3. Check hostname
        const hostname = window.location.hostname
        const parts = hostname.split('.')
        if (parts.length > 2 && parts[0] !== 'www') {
            return parts[0]
        }

        // 4. Default fallback
        return 'lola-beauty'
    }

    const trackEvent = async (
        eventType: 'page_view' | 'click' | 'form_submit' | 'booking_intent' | 'callback_request',
        label: string,
        action: string,
        extraData = {}
    ) => {
        if (!import.meta.client) return

        try {
            const payload = {
                subdomain: getSubdomain(),
                visitorId: getVisitorId(),
                sessionId: getSessionId(),
                pagePath: window.location.pathname,
                pageTitle: document.title,
                eventType,
                metadata: {
                    label,
                    action,
                    ...extraData
                }
            }

            await analytics_api.track(payload)
        } catch (error) {
            // Silently fail analytics to not break user experience
            console.warn('Analytics tracking failed:', error)
        }
    }

    return {
        trackEvent
    }
}
