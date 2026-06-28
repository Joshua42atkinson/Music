// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : MentorshipBlog.jsx                                   ║
// ║ WHAT    : The Inner Circle — Bertrand's mentor blog feed       ║
// ║ WHY     : Community+ subscribers get daily reflections, guitar  ║
// ║           history, meditation prompts, and philosophy           ║
// ║ WHO     : Students with community tier or higher                ║
// ║ OWNS    : Blog feed, article view, category filter              ║
// ║ NEEDS   : MentorshipGate, supabase, useLocale                   ║
// ║ ROUTE   : /inner-circle                                         ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronLeft, Clock, BookOpen } from 'lucide-react';
import MentorshipGate from './MentorshipGate';
import { supabase } from '../../lib/supabase';
import { useLocale } from '../../hooks/useLocale';

const BLOG_CATEGORIES = [
  { key: 'all', label: 'All', emoji: '📜' },
  { key: 'philosophy', label: 'Philosophy', emoji: '🪷' },
  { key: 'meditation', label: 'Meditation', emoji: '🌙' },
  { key: 'history', label: 'History', emoji: '🌳' },
  { key: 'technique', label: 'Technique', emoji: '🎸' },
  { key: 'reflection', label: 'Reflection', emoji: '🪞' },
];

// ── Seed blog posts (used when Supabase not connected) ──
const SEED_POSTS = [
  {
    id: 'seed-blog-1',
    title: 'Why I Teach Guitar Differently',
    content: `## The Body Knows Before The Mind

In thirty years of teaching, I have learned one thing above all: the body knows before the mind. When a student asks me "how do I play this chord," I don't show them a finger diagram. I ask them to breathe.

Why? Because the fingers are servants. The ear is the true instrument. And the breath is the conductor.

### The Three Pillars

Every lesson in Voix Vive follows the same sacred pattern:

1. **BE** — Imagine the sound before you play it
2. **DO** — Hear it, hum it, let your voice find it
3. **PLAY** — Now the fingers know where to go

This is not my invention. This is how truebadours learned in medieval France. This is how jazz musicians learn in New Orleans. This is how the great classical guitarists of Spain pass the torch.

The guitar is a mirror. It reflects what you bring to it.

*— Bertrand*`,
    excerpt: 'In thirty years of teaching, I have learned one thing above all: the body knows before the mind.',
    category: 'philosophy',
    cover_emoji: '🪷',
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'seed-blog-2',
    title: 'The Silence Between Notes',
    content: `## What Debussy Taught Me About Guitar

Claude Debussy once said: "Music is the silence between the notes." I did not understand this until I was 40.

As young guitarists, we rush. We fill every beat. We fear the silence. But the silence is where the music breathes.

### A Practice Exercise

Today, try this:
1. Play a single note — any note
2. Let it ring until it fades completely
3. Wait three seconds in pure silence
4. Play the next note

What happens in that silence? Your ear reaches forward. Your body anticipates. The next note means *more* because it was preceded by nothing.

This is the secret of phrasing. This is what separates a musician from someone who plays notes.

*— Bertrand*`,
    excerpt: 'Claude Debussy once said: "Music is the silence between the notes." I did not understand this until I was 40.',
    category: 'meditation',
    cover_emoji: '🌙',
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'seed-blog-3',
    title: 'Your Guitar Has a History',
    content: `## Every Instrument Carries Stories

Do you know the history of your guitar? Not its brand or model number — its *story*.

The wood in your guitar was once a tree. It stood in rain and sun, grew rings year after year, absorbed vibrations from wind and birds. When a luthier shapes that wood, they are not creating something new. They are releasing the music that was already inside.

### The Truebadour's Instrument

In medieval Occitania, a truebadour's instrument was not a possession. It was a companion. They named their lutes. They spoke to them. This is not superstition — it is relationship.

When you pick up your guitar tomorrow, hold it for a moment before you play. Feel its weight. Its temperature. The smoothness of the neck. This is your partner in music.

*— Bertrand*`,
    excerpt: "Do you know the history of your guitar? Not its brand or model number — its story.",
    category: 'history',
    cover_emoji: '🌳',
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'seed-blog-4',
    title: 'The Minor Second: Tension as Teacher',
    content: `## Learning to Love Dissonance

The minor second is the most dissonant interval in Western music. Two notes, one half-step apart, grinding against each other. Most beginners instinctively avoid it.

But I ask my students to *sit in it*.

### Why Tension Matters

In life, we avoid discomfort. We skip the hard conversations. We scroll past the difficult emotions. But growth lives in the tension.

The minor second teaches us:
- **Tension creates expectation** — when it resolves, the relief is sweeter
- **Dissonance is not error** — it is expression
- **Every interval has a voice** — even the uncomfortable ones deserve to be heard

When you practice the minor second on Fret 2, don't rush to resolve it. Hold the tension. Breathe into it. Ask yourself: what does this discomfort have to teach me?

The guitar is not just an instrument. It is a teacher of patience.

*— Bertrand*`,
    excerpt: 'The minor second is the most dissonant interval in Western music. Most beginners avoid it. But I ask my students to sit in it.',
    category: 'technique',
    cover_emoji: '🔥',
    published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

export default function MentorshipBlog() {
  const navigate = useNavigate();
  const { locale, t } = useLocale();

  const [posts, setPosts] = useState(SEED_POSTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);

  // ── Fetch from Supabase ──
  useEffect(() => {
    if (!supabase) return;
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('mentor_blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(30);
        if (!error && data?.length > 0) {
          setPosts(data);
        }
      } catch {
        // Keep seed data
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [posts, activeCategory]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  const readingTime = (content) => {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // ── Article View ──
  if (selectedPost) {
    return (
      <MentorshipGate requiredTier="community">
        <div className="min-h-[100svh] bg-[#050508] text-[#e8edf2] font-sans pb-10">
          <div className="py-4 px-5" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
            <button onClick={() => setSelectedPost(null)} className="flex items-center gap-1 bg-transparent border-none text-cf-gold cursor-pointer text-[0.85rem] font-sans">
              <ChevronLeft size={18} />
              <span>{t('back')}</span>
            </button>
          </div>

          <article className="max-w-[640px] mx-auto px-6 pb-[60px]">
            <div className="text-[3rem] text-center mb-4">{selectedPost.cover_emoji}</div>
            <h1 className="font-heading text-[2rem] font-semibold text-vv-text text-center leading-[1.2] m-0 mb-4">{selectedPost.title}</h1>
            <div className="flex justify-center gap-2 text-[0.7rem] text-cf-gold/50 font-mono mb-8 flex-wrap items-center">
              <span><Clock size={12} /> {readingTime(selectedPost.content)} min read</span>
              <span>•</span>
              <span>{formatDate(selectedPost.published_at)}</span>
              <span>•</span>
              <span>{BLOG_CATEGORIES.find(c => c.key === selectedPost.category)?.emoji} {selectedPost.category}</span>
            </div>
            <div className="border-t border-cf-gold/10 pt-6">
              {renderMarkdown(selectedPost.content)}
            </div>
            <div className="mt-10 text-center">
              <div className="w-[60px] h-px bg-gradient-to-r from-transparent via-cf-gold/30 to-transparent mx-auto mb-4" />
              <p className="text-[0.7rem] text-cf-gold/30 font-mono tracking-[0.05em]">
                {t('innerCircleExclusive') || 'This content is exclusive to Inner Circle members.'}
              </p>
            </div>
          </article>
        </div>
      </MentorshipGate>
    );
  }

  // ── Feed View ──
  return (
    <MentorshipGate requiredTier="community">
      <div className="min-h-[100svh] bg-[#050508] text-[#e8edf2] font-sans pb-10">
        {/* Header */}
        <div className="flex items-center py-4 px-5 pb-3 gap-3" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-[10px] bg-white/[0.05] border border-white/[0.08] text-cf-gold cursor-pointer flex items-center justify-center shrink-0" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-heading text-[1.6rem] font-semibold text-cf-gold m-0">The Inner Circle</h1>
            <p className="text-[0.75rem] text-white/40 mt-1">
              {t('bertrandReflections') || "Bertrand's daily reflections"}
            </p>
          </div>
          <button onClick={() => navigate('/')} className="w-9 h-9 rounded-[10px] bg-white/[0.05] border border-white/[0.08] text-cf-gold cursor-pointer flex items-center justify-center shrink-0" aria-label="Home">
            <Home size={18} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 px-4 pb-4 overflow-x-auto scrollbar-none">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex items-center gap-1 py-1.5 px-3 rounded-full border text-[0.72rem] font-mono cursor-pointer shrink-0 whitespace-nowrap bg-none"
              style={{
                background: activeCategory === cat.key ? 'rgba(var(--cf-gold-rgb),0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: activeCategory === cat.key ? 'rgba(var(--cf-gold-rgb),0.4)' : 'rgba(255,255,255,0.06)',
                color: activeCategory === cat.key ? 'var(--cf-gold)' : 'rgba(255,255,255,0.5)',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Blog Cards */}
        <div className="px-4 flex flex-col gap-3">
          {filteredPosts.map(post => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="flex gap-4 p-5 bg-white/[0.02] rounded-[14px] border border-cf-gold/[0.08] cursor-pointer text-left w-full transition-colors duration-200 text-inherit"
            >
              <div className="text-[2.2rem] shrink-0 w-12 text-center self-start pt-1">{post.cover_emoji}</div>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading text-[1.2rem] font-semibold text-vv-text m-0 mb-1.5 leading-[1.3]">{post.title}</h2>
                <p className="text-[0.82rem] text-white/50 leading-[1.6] m-0 mb-2.5 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-1.5 text-[0.65rem] text-cf-gold/50 font-mono">
                  <span><Clock size={10} /> {readingTime(post.content)} min</span>
                  <span>•</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MentorshipGate>
  );
}

// ── Simple markdown renderer ──
function renderMarkdown(md) {
  const lines = md.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-heading text-[1.1rem] text-cf-gold mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="font-heading text-[1.4rem] text-vv-text mt-6 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(
        <p key={i} className="pl-4 my-1 text-white/80 text-[0.9rem] leading-[1.7]">
          {renderInline(line)}
        </p>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <p key={i} className="pl-4 my-1 text-white/80 text-[0.9rem] leading-[1.7]">
          • {renderInline(line.slice(2))}
        </p>
      );
    } else if (line.startsWith('*—') || line.startsWith('*— ')) {
      elements.push(
        <p key={i} className="italic text-cf-gold mt-6 text-[0.9rem]">
          {line.replace(/\*/g, '')}
        </p>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="my-1.5 text-white/85 text-[0.92rem] leading-[1.8]">
          {renderInline(line)}
        </p>
      );
    }
    i++;
  }

  return elements;
}

function renderInline(text) {
  // Bold and italic
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-vv-text font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-white/70">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

