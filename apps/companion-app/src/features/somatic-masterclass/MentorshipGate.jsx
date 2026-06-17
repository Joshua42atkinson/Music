import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Lock, Crown, Users, Sparkles, LogIn, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

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

  // Tier Hierarchy Logic
  const hasAccess = () => {
    if (!user) return false;
    if (subscriptionTier === 'inner_circle') return true; // Has everything
    if (requiredTier === 'community' && subscriptionTier === 'community') return true;
    return false;
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
    // In Production, this routes to a Stripe Checkout Session
    // For local testing, we immediately patch the Supabase profile
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
            Join the inner circle to unlock this space.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8 w-full">
          {/* COMMUNITY TIER */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl py-12 px-8 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Users size={24} style={{ color: '#5a90a0' }} />
              <h2 className="m-0 text-[1.5rem] text-[#a0a0c0] font-heading">The Guild</h2>
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-[1.5rem] text-white/50 font-semibold">$</span>
              <span className="text-[4rem] text-white font-mono font-bold tracking-tight">1</span>
              <span className="text-base text-white/40 ml-1">/mo</span>
            </div>
            <p className="text-[0.9rem] text-white/40 leading-[1.6] mb-8 min-h-[60px]">
              Access the private community hub. Share your progress, find accountability partners, and jam with other students.
            </p>
            <ul className="list-none p-0 m-0 mb-12 flex flex-col gap-3 flex-1">
              <li className="flex items-start gap-2.5 text-[0.9rem] text-white/60 leading-[1.4]"><CheckCircle2 size={16} color="#5a90a0" /> Global Community Forums</li>
              <li className="flex items-start gap-2.5 text-[0.9rem] text-white/60 leading-[1.4]"><CheckCircle2 size={16} color="#5a90a0" /> Accountability Groups</li>
              <li className="flex items-start gap-2.5 text-[0.9rem] text-white/60 leading-[1.4]"><CheckCircle2 size={16} color="#5a90a0" /> Share Audio/Video Practice</li>
            </ul>
            <button
              onClick={() => handleUpgrade('community')}
              disabled={upgrading || subscriptionTier === 'inner_circle'}
              className="w-full py-4 rounded-xl border border-transparent text-base font-semibold cursor-pointer font-mono uppercase tracking-wide transition-all duration-300 ease-out disabled:opacity-50"
              style={{ background: 'rgba(90, 144, 160, 0.1)', color: '#5a90a0', borderColor: 'rgba(90, 144, 160, 0.3)' }}
            >
              {user ? (upgrading ? 'Unlocking...' : 'Join The Guild') : 'Sign In to Join'}
            </button>
          </div>

          {/* INNER CIRCLE TIER */}
          <div className="bg-cf-gold/[0.03] border border-cf-gold/15 rounded-3xl py-12 px-8 flex flex-col relative overflow-hidden -translate-y-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] bg-[radial-gradient(circle,rgba(var(--cf-gold-rgb),0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <Crown size={24} style={{ color: 'var(--cf-gold)' }} />
              <h2 className="m-0 text-[1.5rem] text-vv-text font-heading">The Inner Circle</h2>
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-[1.5rem] text-cf-gold font-semibold">$</span>
              <span className="text-[4rem] text-vv-text font-mono font-bold tracking-tight">5</span>
              <span className="text-base text-white/40 ml-1">/mo</span>
            </div>
            <p className="text-[0.9rem] text-white/70 leading-[1.6] mb-8 min-h-[60px]">
              Direct mentorship from Bertrand. Daily meditations, guitar history, and personalized video feedback on your playing.
            </p>
            <ul className="list-none p-0 m-0 mb-12 flex flex-col gap-3 flex-1">
              <li className="flex items-start gap-2.5 text-[0.9rem] text-white/60 leading-[1.4]"><Sparkles size={16} color="var(--cf-gold)" /> <strong className="text-cf-gold font-medium">Everything in The Guild</strong></li>
              <li className="flex items-start gap-2.5 text-[0.9rem] text-white/60 leading-[1.4]"><CheckCircle2 size={16} color="var(--cf-gold)" /> Bertrand's Daily Mentorship Blog</li>
              <li className="flex items-start gap-2.5 text-[0.9rem] text-white/60 leading-[1.4]"><CheckCircle2 size={16} color="var(--cf-gold)" /> Submit Videos for Mentor Review</li>
              <li className="flex items-start gap-2.5 text-[0.9rem] text-white/60 leading-[1.4]"><CheckCircle2 size={16} color="var(--cf-gold)" /> Exclusive History & Meditation Feeds</li>
            </ul>
            <button
              onClick={() => handleUpgrade('inner_circle')}
              disabled={upgrading}
              className="w-full py-4 rounded-xl border text-base font-semibold cursor-pointer font-mono uppercase tracking-wide transition-all duration-300 ease-out disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.2), rgba(var(--cf-gold-rgb),0.05))', color: 'var(--cf-gold)', borderColor: 'rgba(var(--cf-gold-rgb),0.5)', boxShadow: '0 0 20px rgba(var(--cf-gold-rgb),0.2)' }}
            >
              {user ? (upgrading ? 'Unlocking...' : 'Enter the Inner Circle') : 'Sign In to Join'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
