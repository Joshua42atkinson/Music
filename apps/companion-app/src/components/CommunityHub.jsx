// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : CommunityHub.jsx                                     ║
// ║ WHAT    : The Guild — community feed for $1/mo Community tier  ║
// ║ WHY     : Students need a space to share progress, ask         ║
// ║           questions, find jam partners, and build connection    ║
// ║ WHO     : Students with community tier or above                ║
// ║ OWNS    : Post feed, compose, comments, categories, likes      ║
// ║ NEEDS   : MentorshipGate, supabase, useAuth, useLocale         ║
// ║ ROUTE   : /community                                           ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Send, MessageCircle, Heart, Pin, Filter, Plus, X } from 'lucide-react';
import MentorshipGate from '../features/somatic-masterclass/MentorshipGate';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useLocale } from '../hooks/useLocale';
import { useScaffolding } from './ScaffoldingProvider';

const CATEGORIES = [
  { key: 'all', label: 'All', emoji: '🏠' },
  { key: 'progress', label: 'Progress', emoji: '🏔️' },
  { key: 'question', label: 'Questions', emoji: '❓' },
  { key: 'jam-request', label: 'Jam Together', emoji: '🎶' },
  { key: 'resource', label: 'Resources', emoji: '📚' },
  { key: 'general', label: 'General', emoji: '💬' },
];

const FRET_COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db',
  '#9b59b6', '#e91e63', '#ff5722', '#ffc107', '#00bcd4', '#8bc34a',
];

// ── Seed data for offline/demo mode ──
const SEED_POSTS = [
  {
    id: 'seed-1', content: 'Just completed Fret 3! The Major 2nd is starting to click. Anyone else feel like humming helps the pitch land faster?',
    category: 'progress', fret_tag: 3, likes_count: 4, comments_count: 2,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    user: { display_name: 'Sofia M.', avatar_url: null },
  },
  {
    id: 'seed-2', content: 'Looking for someone to practice intervals with over video call. Fret 1-4 range. Weekday evenings EST?',
    category: 'jam-request', fret_tag: null, likes_count: 7, comments_count: 5,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: { display_name: 'Marcus K.', avatar_url: null },
  },
  {
    id: 'seed-3', content: 'The breathing gate before each session has genuinely changed how I approach practice. Three breaths. That\'s it. But it resets everything.',
    category: 'general', fret_tag: 1, likes_count: 12, comments_count: 3,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    user: { display_name: 'Amara J.', avatar_url: null },
  },
  {
    id: 'seed-4', content: 'Question: When doing the audiation pause in PitchRoom, should I close my eyes or keep them open? Bertrand mentions "seeing with the ear" but I\'m not sure how literal that is.',
    category: 'question', fret_tag: 2, likes_count: 3, comments_count: 8,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    user: { display_name: 'Leo T.', avatar_url: null },
  },
];

export default function CommunityHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { locale: _locale } = useLocale();
  const { bardLevel: _bardLevel, currentFret: _currentFret } = useScaffolding();

  const [posts, setPosts] = useState(SEED_POSTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newFretTag, setNewFretTag] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newComment, setNewComment] = useState('');

  // ── Fetch posts from Supabase on mount ──
  useEffect(() => {
    if (!supabase || !user) return;
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*, profiles:user_id(display_name, avatar_url)')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(50);
        if (!error && data?.length > 0) {
          setPosts(data.map(p => ({
            ...p,
            user: p.profiles || { display_name: 'Fellow Truebadour', avatar_url: null },
          })));
        }
      } catch {
        // Keep seed data on failure
      }
    };
    fetchPosts();
  }, [user]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [posts, activeCategory]);

  const handleSubmitPost = useCallback(async () => {
    if (!newPost.trim() || submitting) return;
    setSubmitting(true);

    if (supabase && user) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .insert({
            user_id: user.id,
            content: newPost.trim(),
            category: newCategory,
            fret_tag: newFretTag,
          })
          .select()
          .single();

        if (!error && data) {
          setPosts(prev => [{
            ...data,
            user: { display_name: user.user_metadata?.full_name || 'You', avatar_url: user.user_metadata?.avatar_url },
          }, ...prev]);
        }
      } catch {
        // Fall through to local-only
      }
    } else {
      // Offline mode — add locally
      setPosts(prev => [{
        id: `local-${Date.now()}`,
        content: newPost.trim(),
        category: newCategory,
        fret_tag: newFretTag,
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        user: { display_name: 'You', avatar_url: null },
      }, ...prev]);
    }

    setNewPost('');
    setNewCategory('general');
    setNewFretTag(null);
    setShowCompose(false);
    setSubmitting(false);
  }, [newPost, newCategory, newFretTag, submitting, user]);

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = Math.floor((now - d) / 3600000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return d.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <MentorshipGate requiredTier="community">
      <div className="min-h-svh bg-cf-void text-[#e8edf2] font-body pb-10">
        {/* Header */}
        <div className="flex items-center pt-[max(16px,env(safe-area-inset-top))] px-5 py-3 gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-[10px] bg-white/5 border border-white/[0.08] text-[#5a90a0] cursor-pointer flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-heading text-[1.6rem] font-semibold text-[#5a90a0] m-0">The Guild</h1>
            <p className="text-[0.75rem] text-white/40 mt-1">Share your journey with fellow truebadours</p>
          </div>
          <button onClick={() => navigate('/')} className="w-9 h-9 rounded-[10px] bg-white/5 border border-white/[0.08] text-[#5a90a0] cursor-pointer flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors" aria-label="Home">
            <Home size={18} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex items-center gap-1 py-1.5 px-3 rounded-[20px] border text-[0.72rem] font-mono cursor-pointer shrink-0 whitespace-nowrap transition-colors"
              style={{
                background: activeCategory === cat.key ? 'rgba(90,144,160,0.25)' : 'rgba(255,255,255,0.03)',
                borderColor: activeCategory === cat.key ? '#5a90a0' : 'rgba(255,255,255,0.06)',
                color: activeCategory === cat.key ? '#5a90a0' : 'rgba(255,255,255,0.5)',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Compose Button */}
        <div className="px-4 pb-4">
          {!showCompose ? (
            <button onClick={() => setShowCompose(true)} className="w-full py-3.5 rounded-xl bg-[rgba(90,144,160,0.08)] border border-dashed border-[rgba(90,144,160,0.25)] text-[#5a90a0] cursor-pointer flex items-center justify-center gap-2 text-[0.85rem] font-body hover:bg-[rgba(90,144,160,0.15)] transition-colors">
              <Plus size={16} />
              Share with the Guild
            </button>
          ) : (
            <div className="bg-white/[0.03] rounded-xl border border-[rgba(90,144,160,0.2)] p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[0.85rem] font-semibold text-[#5a90a0]">New Post</span>
                <button onClick={() => setShowCompose(false)} className="bg-transparent border-none text-white/30 cursor-pointer p-1 hover:text-white/50 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="What's on your mind, truebadour?"
                className="w-full bg-black/30 border border-white/[0.08] rounded-lg text-[#e8edf2] p-3 text-[0.85rem] font-body resize-y min-h-[80px] outline-none focus:border-white/15 transition-colors"
                rows={4}
                maxLength={1000}
                autoFocus
              />
              <div className="flex gap-2 mt-3 items-center flex-wrap">
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="bg-black/30 border border-white/[0.08] rounded-md text-[#e8edf2] py-1.5 px-2 text-[0.75rem] outline-none"
                >
                  {CATEGORIES.filter(c => c.key !== 'all').map(c => (
                    <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                  ))}
                </select>
                <select
                  value={newFretTag || ''}
                  onChange={e => setNewFretTag(e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-black/30 border border-white/[0.08] rounded-md text-[#e8edf2] py-1.5 px-2 text-[0.75rem] outline-none"
                >
                  <option value="">No fret tag</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Fret {i + 1}</option>
                  ))}
                </select>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() || submitting}
                  className="ml-auto flex items-center gap-1.5 py-2 px-4 rounded-lg bg-gradient-to-br from-[#5a90a0] to-[#4a7888] border-none text-white cursor-pointer text-[0.8rem] font-semibold transition-opacity"
                  style={{ opacity: !newPost.trim() || submitting ? 0.4 : 1 }}
                >
                  <Send size={14} />
                  Post
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post Feed */}
        <div className="px-4 flex flex-col gap-2.5">
          {filteredPosts.length === 0 ? (
            <div className="text-center p-10 text-white/30 text-[0.85rem]">
              <p className="text-[1.2rem]">🎸</p>
              <p>No posts in this category yet. Be the first!</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4 transition-[border-color] duration-200">
                {post.is_pinned && (
                  <div className="inline-flex items-center gap-1 text-[0.6rem] text-amber-400 mb-2 font-mono uppercase tracking-[0.08em]">
                    <Pin size={10} /> Pinned
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-[rgba(90,144,160,0.15)] border border-[rgba(90,144,160,0.3)] flex items-center justify-center text-[0.65rem] font-bold text-[#5a90a0] shrink-0 overflow-hidden">
                    {post.user?.avatar_url ? (
                      <img src={post.user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(post.user?.display_name)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="block text-[0.8rem] font-semibold text-vv-text">{post.user?.display_name || 'Anonymous'}</span>
                    <span className="block text-[0.65rem] text-white/30 font-mono">{formatTime(post.created_at)}</span>
                  </div>
                  {post.fret_tag && (
                    <span className="py-px px-2 rounded-[10px] border text-[0.6rem] font-mono font-bold"
                      style={{
                        background: `${FRET_COLORS[(post.fret_tag - 1) % 12]}20`,
                        color: FRET_COLORS[(post.fret_tag - 1) % 12],
                        borderColor: `${FRET_COLORS[(post.fret_tag - 1) % 12]}40`,
                      }}
                    >
                      Fret {post.fret_tag}
                    </span>
                  )}
                </div>
                <p className="text-[0.88rem] leading-[1.6] text-white/80 mb-3">{post.content}</p>
                <div className="flex items-center gap-4 border-t border-white/[0.04] pt-2.5">
                  <button className="flex items-center gap-1 bg-transparent border-none text-white/35 cursor-pointer text-[0.75rem] font-mono hover:text-white/50 transition-colors">
                    <Heart size={14} />
                    <span>{post.likes_count || 0}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 bg-transparent border-none text-white/35 cursor-pointer text-[0.75rem] font-mono hover:text-white/50 transition-colors"
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  >
                    <MessageCircle size={14} />
                    <span>{post.comments_count || 0}</span>
                  </button>
                  <span className="ml-auto text-[0.65rem] text-white/25">
                    {CATEGORIES.find(c => c.key === post.category)?.emoji}{' '}
                    {CATEGORIES.find(c => c.key === post.category)?.label}
                  </span>
                </div>

                {/* Expanded comments */}
                {expandedPost === post.id && (
                  <div className="mt-3 pt-3 border-t border-white/[0.04]">
                    <div className="mb-2.5">
                      <p className="text-white/40 text-[0.8rem] italic">
                        Comments load from the Guild when connected.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Reply..."
                        className="flex-1 bg-black/30 border border-white/[0.08] rounded-lg text-[#e8edf2] py-2 px-3 text-[0.8rem] outline-none focus:border-white/15 transition-colors"
                      />
                      <button className="w-8 h-8 rounded-lg bg-[rgba(90,144,160,0.15)] border border-[rgba(90,144,160,0.25)] text-[#5a90a0] cursor-pointer flex items-center justify-center hover:bg-[rgba(90,144,160,0.25)] transition-colors" onClick={() => setNewComment('')}>
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </MentorshipGate>
  );
}

