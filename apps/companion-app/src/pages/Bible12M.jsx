import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bibleContent from '../../docs/pedagogy/12M.md?raw';

export default function Bible12M() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8dcc8] font-sans selection:bg-violet-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050508]/80 backdrop-blur-xl border-b border-violet-500/20 px-6 py-4 flex items-center justify-between shadow-2xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-widest font-mono text-sm group flex-1"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Studio
        </button>
        <div className="font-serif text-xl tracking-wide text-[var(--cf-gold)] text-center flex-1">
          Maturation Map
        </div>
        <div className="flex-1 flex justify-end">
          <a 
            href="/Maturation_Map_Submission.docx" 
            download 
            className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-lg hover:bg-violet-600/40 hover:text-white transition-all text-sm font-mono uppercase tracking-wider"
          >
            <Download size={16} />
            Download APA DOCX
          </a>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        {/* Typographic Wrapper for Markdown */}
        <div className="prose prose-invert prose-violet md:prose-lg max-w-none
                        prose-headings:font-serif prose-headings:text-[var(--cf-gold)] prose-headings:font-normal
                        prose-p:text-[#e8dcc8]/80 prose-p:leading-relaxed
                        prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300
                        prose-strong:text-[#e8dcc8] prose-strong:font-bold
                        prose-blockquote:border-l-violet-500/50 prose-blockquote:bg-violet-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                        prose-code:text-lime-300 prose-code:bg-lime-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-[#12100e] prose-pre:border prose-pre:border-white/5
                        prose-hr:border-white/10
                        prose-th:text-[var(--cf-gold)] prose-td:text-[#e8dcc8]/70 prose-tr:border-white/10">
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {bibleContent}
          </ReactMarkdown>

        </div>
      </main>

    </div>
  );
}
