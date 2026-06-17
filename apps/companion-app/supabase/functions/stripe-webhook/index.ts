// ═══════════════════════════════════════════════════════════
// Stripe Webhook — Supabase Edge Function
// Handles Stripe webhook events to update user subscription tiers.
//
// Deploy: supabase functions deploy stripe-webhook
// Required env vars:
//   STRIPE_SECRET_KEY — sk_live_... or sk_test_...
//   STRIPE_WEBHOOK_SECRET — whsec_... (from Stripe Dashboard)
//   SUPABASE_SERVICE_ROLE_KEY — service_role key (NOT anon)
//
// Webhook events to register in Stripe Dashboard:
//   - checkout.session.completed
//   - customer.subscription.updated
//   - customer.subscription.deleted
// ═══════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

serve(async (req) => {
  // Webhooks must be POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2023-10-16",
  });

  // Use service_role to update user metadata (bypasses RLS)
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // 1. Verify Stripe signature
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!sig || !webhookSecret) {
      return new Response("Missing signature or webhook secret", { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("[stripe-webhook] Signature verification failed:", err.message);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    // 2. Handle events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const tier = session.metadata?.tier;

        if (userId && tier) {
          console.log(`[stripe-webhook] Upgrading user ${userId} to tier: ${tier}`);

          const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { subscription_tier: tier },
          });

          if (error) {
            console.error("[stripe-webhook] Failed to update user metadata:", error);
          } else {
            console.log(`[stripe-webhook] Successfully upgraded ${userId} to ${tier}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle plan changes (upgrade/downgrade)
        console.log(`[stripe-webhook] Subscription updated: ${subscription.id}, status: ${subscription.status}`);

        if (subscription.status === "past_due" || subscription.status === "unpaid") {
          // Could downgrade the user here
          console.warn(`[stripe-webhook] Subscription ${subscription.id} is ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Downgrade to free tier
        const customerEmail = (subscription as any).customer_email;
        console.log(`[stripe-webhook] Subscription cancelled for: ${customerEmail}`);

        // Look up the user by email and downgrade
        if (customerEmail) {
          const { data: users } = await supabaseAdmin.auth.admin.listUsers();
          const user = users?.users?.find(u => u.email === customerEmail);
          if (user) {
            await supabaseAdmin.auth.admin.updateUserById(user.id, {
              user_metadata: { subscription_tier: "free" },
            });
            console.log(`[stripe-webhook] Downgraded ${user.id} to free`);
          }
        }
        break;
      }

      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[stripe-webhook] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
