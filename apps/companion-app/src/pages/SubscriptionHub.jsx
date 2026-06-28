// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : SubscriptionHub.jsx                                  ║
// ║ WHAT    : Displays pricing tiers and subscription options.     ║
// ║ WHY     : Monetization strategy (Immediate goal)               ║
// ╚═════════════════════════════════════════════════════════════════╝

import React from 'react';
import { motion } from 'framer-motion';
import { SUBSCRIPTION_TIERS, SERVICES } from '../data/pricingData';
import { useLocale } from '../hooks/useLocale';

export default function SubscriptionHub() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-cf-void text-cf-ink font-body p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="font-heading text-4xl text-cf-ink-bright mb-4">
            Mentorship & Access
          </h1>
          <p className="text-xl text-cf-muted max-w-2xl mx-auto">
            The Voix Vive curriculum is 100% free. Upgrade for cloud AI features, community access, and direct mentorship from Bertrand Laurence.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="font-heading text-2xl text-cf-gold mb-6 border-b border-white/10 pb-2">
            Subscription Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map(tier => (
              <motion.div
                key={tier.id}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col"
                style={{ borderColor: tier.badge ? 'var(--cf-gold)' : 'rgba(255,255,255,0.08)' }}
              >
                {tier.badge && (
                  <div className="absolute top-0 right-0 bg-cf-gold text-cf-void text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg">
                    {tier.badge}
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{tier.icon}</span>
                  <h3 className="font-heading text-2xl" style={{ color: tier.color }}>{tier.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">${tier.price}</span>
                  {tier.price > 0 && <span className="text-cf-muted text-sm ml-1">/{tier.unit}</span>}
                </div>
                
                <p className="text-sm italic text-cf-slate mb-6 min-h-[40px]">{tier.tagline}</p>
                
                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex gap-2 text-sm text-cf-whisper">
                      <span className="text-cf-gold opacity-50">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                {tier.stripeLink ? (
                  <a
                    href={tier.stripeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center premium-button py-3 mt-auto block"
                  >
                    Select {tier.name}
                  </a>
                ) : (
                  <div className="w-full text-center bg-white/5 border border-white/10 text-white/50 rounded-lg py-3 mt-auto font-mono text-xs uppercase tracking-wider">
                    Current Plan
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-cf-gold mb-6 border-b border-white/10 pb-2">
            À La Carte Services & Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map(service => (
              <div key={service.id} className="glass-card rounded-2xl p-6 border-l-4" style={{ borderLeftColor: service.color }}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <h3 className="font-heading text-xl text-white">{service.name}</h3>
                  </div>
                </div>
                <p className="text-cf-gold-dim text-xs font-mono tracking-wider uppercase mb-4">{service.subtitle}</p>
                
                <p className="text-sm text-cf-slate mb-6 line-clamp-3">{service.description}</p>
                
                <div className="space-y-2 mt-auto">
                  {service.pricing.map((opt, i) => (
                    <a
                      key={i}
                      href={opt.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-cf-gold/30 group"
                    >
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                        {opt.label}
                        {opt.badge && <span className="ml-2 text-[10px] bg-cf-gold/20 text-cf-gold px-1.5 py-0.5 rounded uppercase">{opt.badge}</span>}
                      </span>
                      <span className="font-mono text-cf-gold">
                        ${opt.price}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
