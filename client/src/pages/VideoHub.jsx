import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const VIDEO_META = {
  impact: {
    number: 1,
    title: 'Impact',
    subtitle: 'The Architecture of Impact',
    coreQuestion: 'What impact are we assuming control over when a student allows influence?',
    heroJourney: 'The journey of the teacher moving past the superficial transactional system, recognizing the profound vulnerability of the student, and earning the sacred consent to guide them.',
    colorClass: 'text-impact',
    borderClass: 'border-impact',
    bgClass: 'bg-impact',
    stages: [
      { number: 1, power: 'TRANSACTION', title: 'The Ordinary World', context: 'The baseline illusion of education as a mere exchange of data.' },
      { number: 2, power: 'SYMPTOM', title: 'Call to Adventure', context: 'Seeing beyond the academic symptom to the hidden human reality.' },
      { number: 3, power: 'COMPLIANCE', title: 'Refusal of the Call', context: 'The temptation to ignore the human and just enforce the institutional rule.' },
      { number: 4, power: 'PRESENCE', title: 'Meeting the Mentor', context: 'The unspoken connection beyond the ego; true eye contact.' },
      { number: 5, power: 'VULNERABILITY', title: 'Crossing the Threshold', context: 'The moment the student\'s inner defense drops.' },
      { number: 6, power: 'DIAGNOSIS', title: 'Tests, Allies, Enemies', context: 'Looking past the confusion to evaluate the root cause in the student\'s inner world.' },
      { number: 7, power: 'CONSENT', title: 'Approach to Inmost Cave', context: 'The internal permission slip the student must sign to allow you into their framework.' },
      { number: 8, power: 'SURRENDER', title: 'The Supreme Ordeal', context: 'Letting go of the illusion of control.' },
      { number: 9, power: 'CONNECTION', title: 'Seizing the Reward', context: 'The pure, human-to-human bond where true learning is born.' },
      { number: 10, power: 'INFLUENCE', title: 'The Road Back', context: 'The heavy, sacred responsibility of altering another human\'s reality.' },
      { number: 11, power: 'EMPOWERMENT', title: 'Resurrection', context: 'The permanent shift in the student\'s Point of View.' },
      { number: 12, power: 'IMPACT', title: 'Return with the Elixir', context: 'Teaching is not producing results, but holding space.' },
    ],
  },
  authority: {
    number: 2,
    title: 'Authority',
    subtitle: 'The Architecture of Authority',
    coreQuestion: 'Who is in charge of the definition of truth, quality, and the expansion of perspective?',
    heroJourney: 'The journey of relinquishing the teacher\'s ego as the "Gatekeeper of Truth" and awakening the student as the ultimate sovereign author of meaning through play and autonomy.',
    colorClass: 'text-authority',
    borderClass: 'border-authority',
    bgClass: 'bg-authority',
    stages: [
      { number: 1, power: 'INSTITUTION', title: 'The Ordinary World', context: 'The rigid environment where truth is dictated from the top down.' },
      { number: 2, power: 'ABUNDANCE', title: 'Call to Adventure', context: 'The realization that information is infinite and free.' },
      { number: 3, power: 'LABOR', title: 'Refusal of the Call', context: 'The anxiety of losing authority, trying to force "work" upon the student.' },
      { number: 4, power: 'CURIOSITY', title: 'Meeting the Mentor', context: 'The spark of self-driven interest that cannot be assigned or graded.' },
      { number: 5, power: 'PLAY', title: 'Crossing the Threshold', context: 'Stepping into the sandbox of serious, self-directed discovery.' },
      { number: 6, power: 'FRICTION', title: 'Tests, Allies, Enemies', context: 'The messy, beautiful process of self-directed failure and boundary testing.' },
      { number: 7, power: 'INITIATIVE', title: 'Approach to Inmost Cave', context: 'The student taking charge without a predefined map.' },
      { number: 8, power: 'MEANING', title: 'The Supreme Ordeal', context: 'The exact moment subject matter collides with the student\'s Self.' },
      { number: 9, power: 'OWNERSHIP', title: 'Seizing the Reward', context: 'The knowledge is no longer borrowed; it belongs to the student.' },
      { number: 10, power: 'VALIDATION', title: 'The Road Back', context: 'Recognizing and honoring the student\'s internal truth.' },
      { number: 11, power: 'SOVEREIGNTY', title: 'Resurrection', context: 'The student claims absolute authority over their own perspective.' },
      { number: 12, power: 'AUTHORITY', title: 'Return with the Elixir', context: 'Learning is put fully back into the student\'s hands.' },
    ],
  },
  'the-self': {
    number: 3,
    title: 'The Self',
    subtitle: 'The Architecture of the Self',
    coreQuestion: 'How is the "Self" impacted when the curriculum does not include the full relationship?',
    heroJourney: 'The journey of healing the divided student, recognizing cognitive dissonance as a plea for space, and evolving the classroom into a living community of grace.',
    colorClass: 'text-self',
    borderClass: 'border-self',
    bgClass: 'bg-self',
    stages: [
      { number: 1, power: 'FRAGMENTATION', title: 'The Ordinary World', context: 'The violent disconnect of treating the student merely as a brain.' },
      { number: 2, power: 'DISSONANCE', title: 'Call to Adventure', context: 'Boredom, exhaustion, and confusion as a cry for help from a neglected Self.' },
      { number: 3, power: 'SUPPRESSION', title: 'Refusal of the Call', context: 'The institutional reflex to label pain as laziness and punish the symptom.' },
      { number: 4, power: 'GRACE', title: 'Meeting the Mentor', context: 'The radical act of truly seeing and holding space for the whole human.' },
      { number: 5, power: 'ENVIRONMENT', title: 'Crossing the Threshold', context: 'Shifting focus from academic result to grooming the ecosystem.' },
      { number: 6, power: 'SPACE', title: 'Tests, Allies, Enemies', context: 'Allowing the Self the room to exist without judgment.' },
      { number: 7, power: 'EXPERIENCE', title: 'Approach to Inmost Cave', context: 'Engaging physical, mental, and emotional realities simultaneously.' },
      { number: 8, power: 'INTEGRATION', title: 'The Supreme Ordeal', context: 'Pulling the fragmented pieces back together.' },
      { number: 9, power: 'RESONANCE', title: 'Seizing the Reward', context: 'Deep harmony when identity aligns with environment.' },
      { number: 10, power: 'STEWARDSHIP', title: 'The Road Back', context: 'Tending to the ecosystem instead of manipulating behavior.' },
      { number: 11, power: 'SELF-MASTERY', title: 'Resurrection', context: 'Internal regulation replacing external discipline.' },
      { number: 12, power: 'EVOLUTION', title: 'Return with the Elixir', context: 'The fully realized, growing individual.' },
    ],
  },
};

export { VIDEO_META };

export default function VideoHub() {
  const { videoId } = useParams();
  const video = VIDEO_META[videoId];

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cf-void text-cf-ink">
        <div className="text-center">
          <h1 className="text-4xl font-heading text-cf-ink-bright mb-4">Class Not Found</h1>
          <Link to="/" className="text-cf-gold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0d1219] text-cf-ink"
    >
      <Helmet>
        <title>{`Class ${video.number}: ${video.title} — The Conscious Framework`}</title>
        <meta name="description" content={video.coreQuestion} />
      </Helmet>

      {/* Cinematic Header Slide */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-6 lg:px-24 hero-gradient border-b border-cf-border/30 overflow-hidden">
        
        {/* Background glow specific to the module */}
        <div className={`absolute inset-0 opacity-5`} style={{
          backgroundImage: `radial-gradient(circle at 70% 50%, var(--color-${videoId}), transparent 50%)`
        }} />

        <div className="relative z-10 max-w-7xl w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-cf-whisper hover:text-cf-gold transition-colors text-sm mb-16 uppercase tracking-widest font-mono">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
            Return to Framework
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="font-mono text-sm tracking-[0.4em] uppercase text-cf-muted mb-6 block">
              Class {String(video.number).padStart(2, '0')}
            </span>

            <h1 className={`text-6xl md:text-8xl lg:text-[9rem] font-heading font-light mb-8 leading-none tracking-tight ${video.colorClass}`}>
              {video.title}
            </h1>
            
            <p className="text-2xl md:text-4xl font-quote italic text-cf-whisper mb-16 max-w-4xl leading-tight">
              {video.subtitle}
            </p>

            {/* Audio Narration Placeholder */}
            <div className="flex items-center gap-6 p-6 bg-cf-surface/40 backdrop-blur-sm border border-cf-border/50 max-w-xl rounded-sm">
              <button className="w-16 h-16 rounded-full bg-cf-gold text-cf-void flex items-center justify-center hover:scale-105 transition-transform shrink-0">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
              </button>
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-cf-gold-dim mb-1">Introduction</p>
                <p className="text-cf-whisper text-lg">Listen to Joshua's Narration (12:45)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Concept Slide */}
      <section className="py-32 px-6 bg-cf-void border-b border-cf-border/30">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-mono text-cf-gold-dim uppercase tracking-[0.3em] mb-12">The Core Question</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-quote italic text-cf-ink-bright leading-tight max-w-4xl mx-auto">
              "{video.coreQuestion}"
            </h2>
            <div className="w-24 h-px bg-cf-gold-dim/50 mx-auto mt-16 mb-16" />
            <p className="text-xl md:text-2xl text-cf-ink/80 leading-relaxed font-light max-w-3xl mx-auto">
              {video.heroJourney}
            </p>
          </motion.div>
        </div>
      </section>

      {/* The 12 Stages Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-mono uppercase tracking-[0.3em] text-cf-muted mb-20 text-center">
            The Twelve Stages
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {video.stages.map((stage, i) => (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              >
                <Link
                  to={`/video/${videoId}/${stage.number}`}
                  className="group block h-full"
                  id={`stage-link-${stage.number}`}
                >
                  <div className={`h-full flex flex-col p-8 bg-cf-surface/20 border-t-2 border-cf-border hover:border-cf-gold/50 transition-colors duration-500`}>
                    
                    <div className="flex justify-between items-start mb-12">
                      <span className={`font-mono text-lg font-bold ${video.colorClass} opacity-50`}>
                        {String(stage.number).padStart(2, '0')}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cf-gold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mb-auto">
                      <h3 className="text-2xl font-heading text-cf-ink-bright group-hover:text-cf-gold transition-colors mb-4">
                        {stage.power}
                      </h3>
                      <p className="text-sm font-mono uppercase tracking-widest text-cf-muted mb-6">
                        {stage.title}
                      </p>
                      <p className="text-lg text-cf-whisper font-light leading-relaxed">
                        {stage.context}
                      </p>
                    </div>
                    
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Start Link */}
      <section className="py-24 px-6 border-t border-cf-border/30 bg-cf-void text-center">
        <Link
          to={`/video/${videoId}/1`}
          className="inline-flex items-center gap-4 px-12 py-6 bg-cf-gold/10 border border-cf-gold-dim text-cf-gold rounded-sm hover:bg-cf-gold/20 transition-all text-xl font-mono tracking-widest uppercase"
        >
          Begin Stage 01
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </section>
    </motion.div>
  );
}
