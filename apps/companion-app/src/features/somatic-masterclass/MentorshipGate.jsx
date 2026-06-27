import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Lock, Crown, Users, Sparkles, LogIn, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SUBSCRIPTION_TIERS } from '../../data/pricingData';

const TIER_ICONS = {
  'free': Lock,
  'community': Users,
  'apprentice': Sparkles,
  'journeyman': Star,
  'master': Crown,
};

export default function MentorshipGate({ children, requiredTier = 'community' }) {
  const { user, subscriptionTier, upgradeTier, signInWithGoogle, loading } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  // If we are still checking auth, show nothing or a spinner
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-[30px] h-[30px] border-2 border-cf-gold/20 border-t-cf-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Tier hierarchy: free < community < apprentice < journeyman < master
  const TIER_RANK = { free: 0, community: 1, apprentice: 2, journeyman: 3, master: 4 };

  const hasAccess = () => {
    if (!user) return false;
    const userRank = TIER_RANK[subscriptionTier] ?? 0;
    const requiredRank = TIER_RANK[requiredTier] ?? 0;
    return userRank >= requiredRank;
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  const handleUpgrade = async (tier) => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    setUpgrading(true);
    // In production, this routes to Stripe Checkout
    await upgradeTier(tier);
    setUpgrading(false);
  };

  return (
    <div className="min-h-[100svh] bg-[#050508] flex items-center justify-center p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[900px] w-full flex flex-col items-center"
      >
        <div className="text-center mb-16 max-w-[600px]">
          <Lock size={32} className="text-white/20 mb-4 mx-auto" />
          <h1 className="font-heading text-[3rem] text-vv-text m-0 mb-4 font-normal tracking-tight">The Human Element</h1>
          <p className="text-[1.1rem] text-white/60 leading-[1.6] m-0">
            The curriculum is free forever. But mastery requires community and mentorship.
            Choose your path below.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 w-full">
          {SUBSCRIPTION_TIERS.filter(t => t.price > 0).map(tier => {
            const Icon = TIER_ICONS[tier.id] || Lock;
            const isFeatured = tier.badge === 'Most Popular';
            return (
              <div
                key={tier.id}
                className={`rounded-3xl py-10 px-6 flex flex-col relative overflow-hidden ${isFeatured ? '-translate-y-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : ''}`}
                style={{
                  background: isFeatured ? `${tier.color}10` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isFeatured ? tier.color + '40' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                {isFeatured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${tier.color}30 0%, transparent 70%)` }}
                  />
                )}
                {tier.badge && (
                  <span className="absolute top-4 right-4 text-[0.65rem] font-mono uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{ background: `${tier.color}20`, color: tier.color }}
                  >
                    {tier.badge}
                  </span>
                )}
                <div className="flex items-center gap-3 mb-6">
                  <Icon size={24} style={{ color: tier.color }} />
                  <h2 className="m-0 text-[1.5rem] text-vv-text font-heading">{tier.name}</h2>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-[1.5rem] font-semibold" style={{ color: tier.color }}>$</span>
                  <span className="text-[4rem] text-vv-text font-mono font-bold tracking-tight">{tier.price}</span>
                  <span className="text-base text-white/40 ml-1">/{tier.unit}</span>
                </div>
                <p className="text-[0.85rem] text-white/50 leading-[1.6] mb-6 min-h-[50px]">{tier.tagline}</p>
                <ul className="list-none p-0 m-0 mb-10 flex flex-col gap-2.5 flex-1">
                  {tier.features.slice(0, 5).map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[0.85rem] text-white/60 leading-[1.4]">
                      <CheckCircle2 size={16} style={{ color: tier.color, flexShrink: 0 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={upgrading}
                  className="w-full py-4 rounded-xl border text-base font-semibold cursor-pointer font-mono uppercase tracking-wide transition-all duration-300 ease-out disabled:opacity-50"
                  style={{
                    background: isFeatured ? `linear-gradient(135deg, ${tier.color}30, ${tier.color}10)` : `${tier.color}15`,
                    color: tier.color,
                    borderColor: `${tier.color}50`,
                  }}
                >
                  {user ? (upgrading ? 'Unlocking...' : `Choose ${tier.name}`) : 'Sign In to Join'}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
