// ═══════════════════════════════════════════════════════════
// Stripe Checkout — Supabase Edge Function
// Creates a Stripe Checkout Session for tier upgrades.
//
// Deploy: supabase functions deploy stripe-checkout
// Required env vars:
//   STRIPE_SECRET_KEY — sk_live_... or sk_test_...
//   STRIPE_PRICE_COMMUNITY — price_... (the $1/mo price ID)
//   STRIPE_PRICE_INNER_CIRCLE — price_... (the $5/mo price ID)
//   FRONTEND_URL — https://voixvive.com (for success/cancel redirects)
// ═══════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRICE_MAP: Record<string, string | undefined> = {
  community: Deno.env.get("STRIPE_PRICE_COMMUNITY"),
  inner_circle: Deno.env.get("STRIPE_PRICE_INNER_CIRCLE"),
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the user via Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Parse the requested tier
    const { tier } = await req.json();
    const priceId = PRICE_MAP[tier];
    if (!priceId) {
      return new Response(JSON.stringify({ error: `Invalid tier: ${tier}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Create Stripe Checkout Session
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/?checkout=success&tier=${tier}`,
      cancel_url: `${frontendUrl}/?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        tier,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[stripe-checkout] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
