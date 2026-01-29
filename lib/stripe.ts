import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Get the Stripe client instance.
 * Uses lazy initialization to avoid build-time failures when
 * STRIPE_SECRET_KEY is not available in the build environment.
 */
export const getStripe = (): Stripe => {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your environment variables.');
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-12-15.clover',
            typescript: true,
        });
    }
    return _stripe;
};

// Legacy export for backwards compatibility - will be removed
// @deprecated Use getStripe() instead
export const stripe = null as unknown as Stripe;
