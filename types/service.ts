export interface ServicePrice {
    amount: number;
    currency: string;
}

export interface ServiceDuration {
    value: number;
    unit: 'min' | 'h';
}

export interface Service {
    _id: string;
    basicDetails: {
        serviceName: string;
        description?: string;
        category: string;
    };
    pricingAndDuration: {
        price: ServicePrice;
        duration: {
            servicingTime: ServiceDuration;
        };
    };
    variants?: any[]; // Simplified for now
}
