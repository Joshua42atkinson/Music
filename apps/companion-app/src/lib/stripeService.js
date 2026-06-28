import { devWarn, devLog } from './devLog';

// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : stripeService.js                                     ║
// ║ WHAT    : Handles Stripe Checkout session initialization       ║
// ║ WHY     : To process premium upgrades (post-V1)                ║
// ║ WHO     : MentorDashboard / Pricing components                 ║
// ╚════════════════════════════════════════════════════════════════╝

export const PLAN_PRICES = {
  PREMIUM_MONTHLY: 'price_1XXXXXXXXXXXXXXX', // Replace with actual Stripe price ID
  PREMIUM_YEARLY: 'price_2YYYYYYYYYYYYYYY',
};

/**
 * Initiates a Stripe Checkout session.
 * Since this is a stub for the V1 release, it will simulate a checkout redirect
 * or open the actual Stripe checkout if the environment variables are set.
 * 
 * @param {string} priceId - The Stripe price ID to purchase
 * @param {string} userEmail - (Optional) To pre-fill checkout
 */
export async function initiateStripeCheckout(priceId, userEmail = '') {
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const isMockMode = !stripePublicKey;

  devLog(`[stripeService] Initiating checkout for price: ${priceId}`);

  if (isMockMode) {
    devWarn('[stripeService] No VITE_STRIPE_PUBLIC_KEY found. Running in MOCK checkout mode.');
    // Simulate a successful checkout by storing a flag in localStorage
    alert(`(MOCK) Stripe Checkout opened for ${priceId}.\n\nIn production, this would redirect to Stripe.`);
    localStorage.setItem('voixvive_premium_unlocked', 'true');
    window.location.reload();
    return;
  }

  try {
    // In a real implementation, you would call your Firebase Cloud Function or backend here 
    // to create a Checkout Session and get a session ID.
    // e.g. const sessionId = await createCheckoutSession(priceId, userEmail);
    // const stripe = await loadStripe(stripePublicKey);
    // await stripe.redirectToCheckout({ sessionId });

    devLog('[stripeService] Live checkout redirect logic goes here once backend is connected.');
  } catch (error) {
    devWarn('[stripeService] Checkout failed:', error);
  }
}
