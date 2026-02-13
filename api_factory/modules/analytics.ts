import { GATEWAY_ENDPOINT } from '../axios.config'

export const analytics_api = {
    track: (payload: {
        subdomain: string;
        visitorId: string;
        sessionId: string;
        pagePath: string;
        pageTitle: string;
        eventType: 'page_view' | 'click' | 'form_submit' | 'booking_intent' | 'callback_request';

        metadata?: any;
        location?: {
            country?: string;
            region?: string;
            city?: string;
            latitude?: number;
            longitude?: number;
        };
        referrer?: string;
    }) => {
        const url = "/analytics/track"
        return GATEWAY_ENDPOINT.post(url, payload)
    }
}
