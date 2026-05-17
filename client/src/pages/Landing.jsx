import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VIDEOS = [
  {
    id: 'impact',
    number: 1,
    title: 'Impact',
    subtitle: 'The Architecture of Impact',
    coreQuestion: 'What impact are we assuming control over when a student allows influence?',
    description: 'The journey of the teacher moving past the superficial transactional system, recognizing the profound vulnerability of the student, and earning the sacred consent to guide them.',
    colorClass: 'text-impact',
    borderClass: 'border-impact',
    bgClass: 'bg-impact',
  },
  {
    id: 'authority',
    number: 2,
    title: 'Authority',
    subtitle: 'The Architecture of Authority',
    coreQuestion: 'Who is in charge of the definition of truth, quality, and the expansion of perspective?',
    description: 'The journey of relinquishing the teacher\'s ego as the "Gatekeeper of Truth" and awakening the student as the ultimate sovereign author of meaning through play and autonomy.',
    colorClass: 'text-authority',
    borderClass: 'border-authority',
    bgClass: 'bg-authority',
  },
  {
    id: 'the-self',
    number: 3,
    title: 'The Self',
    subtitle: 'The Architecture of the Self',
    coreQuestion: 'How is the "Self" impacted when the curriculum does not include the full relationship?',
    description: 'The journey of healing the divided student, recognizing cognitive dissonance as a plea for space, and evolving the classroom into a living community of grace.',
    colorClass: 'text-self',
    borderClass: 'border-self',
    bgClass: 'bg-self',
  },
];

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-cf-void text-cf-ink"
    >
      <Helmet>
        <title>The Conscious Framework</title>
        <meta name="description" content="An interactive e-learning module exploring the philosophy of education and student psychology." />
      </Helmet>

      {/* Slide 1: The Cinematic Hero */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212,168,85,0.8) 0%, transparent 60%)`
        }} />

        <div className="relative z-10 w-full px-6 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full"
          >
            <p className="font-mono text-sm tracking-[0.4em] uppercase text-cf-gold-dim mb-8">
              A Perspective Enhancement Module
            </p>
            
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-heading font-light text-cf-ink-bright mb-6 leading-none tracking-tight">
              The Conscious<br />
              <span className="text-cf-gold italic pr-4">Framework</span>
            </h1>

            <p className="text-xl md:text-3xl text-cf-whisper max-w-4xl mx-auto mt-12 mb-8 font-light leading-relaxed">
              An experiential journey for educators who are ready to see past the transaction
              and into the human being sitting across the desk.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-16 animate-bounce"
            >
              <a href="#observable-experience" className="text-cf-gold-dim hover:text-cf-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Slide 2: The Single Observable Experience */}
      <section id="observable-experience" className="py-32 px-6 relative border-t border-cf-border/30 bg-[#151b26]">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="font-mono text-sm tracking-[0.3em] uppercase text-cf-gold-dim mb-6">
              The Complete Film
            </p>
            <h2 className="mb-16">The Single Observable Experience</h2>

            {/* Cinematic YouTube Placeholder */}
            <div className="aspect-video w-full max-w-6xl mx-auto bg-cf-deep border border-cf-border shadow-2xl relative group cursor-pointer overflow-hidden rounded-sm">
              <div className="absolute inset-0 bg-cf-void/40 group-hover:bg-cf-void/20 transition-colors duration-500 z-10" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="w-24 h-24 rounded-full bg-cf-gold/90 text-cf-void flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 shadow-[0_0_40px_rgba(201,169,110,0.5)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <p className="mt-8 font-mono tracking-widest text-cf-gold uppercase text-sm">Play Masterclass (2h 45m)</p>
              </div>

              {/* Placeholder image (optional, or just a dark gradient) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e2838] to-[#0a0f18]" />
            </div>

            <div className="mt-20 flex flex-col items-center">
              <p className="text-2xl text-cf-whisper font-quote italic mb-8">
                Or, journey through the modules at your own pace.
              </p>
              <a href="#the-three-mysteries" className="text-cf-gold hover:text-cf-gold-dim transition-colors flex items-center gap-2 text-lg font-mono uppercase tracking-widest">
                Explore the Modules
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Slide 3: The Three Mysteries */}
      <section id="the-three-mysteries" className="py-32 px-6 relative border-t border-cf-border/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <p className="font-mono text-sm tracking-[0.3em] uppercase text-cf-gold-dim mb-6">
              Interactive Delivery
            </p>
            <h2 className="mb-8">
              Three Classes.<br/>Thirty-Six Stages.
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {VIDEOS.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="h-full"
              >
                <Link
                  to={`/video/${video.id}`}
                  className="block group h-full"
                  id={`video-card-${video.id}`}
                >
                  <div className={`h-full flex flex-col p-12 bg-cf-surface/30 border-t-4 ${video.borderClass} hover:bg-cf-surface/60 transition-all duration-500`}>
                    <div className="mb-auto">
                      <span className="font-mono text-sm tracking-widest uppercase text-cf-muted mb-8 block">
                        Class {String(video.number).padStart(2, '0')}
                      </span>
                      
                      <h3 className={`text-4xl lg:text-5xl font-heading mb-4 ${video.colorClass} group-hover:scale-105 transform origin-left transition-transform duration-500`}>
                        {video.title}
                      </h3>
                      
                      <p className="text-xl text-cf-whisper italic font-quote mb-12">
                        {video.subtitle}
                      </p>
                    </div>

                    <div>
                      <p className="text-cf-ink/80 text-lg leading-relaxed mb-12 font-light">
                        {video.description}
                      </p>

                      <div className="flex items-center gap-3 text-lg font-mono tracking-widest uppercase text-cf-gold group-hover:text-cf-ink-bright transition-colors">
                        <span>Enter Class</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-2 transition-transform duration-300">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Slide 4: Philosophy & Footer */}
      <section className="py-24 px-6 border-t border-cf-border/30 bg-cf-deep/50 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-cf-muted text-sm font-mono tracking-wider uppercase mb-8">The Iron Road</p>
          <p className="text-2xl font-quote italic text-cf-whisper leading-relaxed mb-16">
            Establishing a shared reality that respects the complex interplay between the conscious intellect and the unconscious mind.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-cf-muted font-mono tracking-widest uppercase">
            <Link to="/manifesto" className="text-cf-gold hover:text-cf-gold-dim transition-colors mb-4 border border-cf-gold/30 px-6 py-3 rounded-sm hover:bg-cf-gold/5">
              View Your Reflection Manifesto
            </Link>
            <p>&copy; {new Date().getFullYear()} Joshua Atkinson.</p>
            <p>EDCI 57300 · Purdue University</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
