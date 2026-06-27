// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : PreScreeningResults.jsx                              ║
// ║ WHAT    : Displays AI pre-screening analysis of a video        ║
// ║ WHY     : Shows student what AI flagged, shows Bertrand draft  ║
// ║ WHO     : Students (Apprentice+), Bertrand (mentor dashboard)  ║
// ║ OWNS    : Read-only display of analysis results                ║
// ║ NEEDS   : useLocale for i18n                                   ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝
import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock, Lightbulb, FileText, Sparkles } from 'lucide-react';
import { useLocale } from '../hooks/useLocale';

const SEVERITY_CONFIG = {
  high: { icon: AlertCircle, color: '#e07070', label: 'High' },
  medium: { icon: AlertTriangle, color: '#e0a050', label: 'Medium' },
  low: { icon: AlertTriangle, color: '#7aaa88', label: 'Low' },
};

const CATEGORY_LABELS = {
  timing: { en: 'Timing', fr: 'Temps' },
  pitch: { en: 'Pitch', fr: 'Justesse' },
  posture: { en: 'Posture', fr: 'Posture' },
  technique: { en: 'Technique', fr: 'Technique' },
  other: { en: 'Other', fr: 'Autre' },
};

export default function PreScreeningResults({ analysis, isMentorView = false }) {
  const { t, isFrench } = useLocale();

  if (!analysis) return null;

  const catLabel = (cat) => {
    const labels = CATEGORY_LABELS[cat] || CATEGORY_LABELS.other;
    return isFrench ? labels.fr : labels.en;
  };

  return (
    <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={18} className="text-cf-gold" />
        <h3 className="font-[Cormorant_Garamond] text-[1.2rem] text-[#f0e6d2] m-0">
          {isFrench ? 'Analyse IA préalable' : 'AI Pre-Screening Analysis'}
        </h3>
        {analysis._mock && (
          <span className="text-[0.6rem] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(255,200,0,0.1)] text-[#e0c050]">
            Mock
          </span>
        )}
      </div>

      {/* Overall Assessment */}
      <div>
        <p className="text-[0.85rem] text-[#a0a8b8] leading-[1.6] font-[EB_Garamond] italic m-0">
          {analysis.overallAssessment}
        </p>
      </div>

      {/* Strengths */}
      {analysis.strengths?.length > 0 && (
        <div>
          <h4 className="text-[0.7rem] font-mono uppercase tracking-[0.1em] text-[#7aaa88] mb-2">
            {isFrench ? 'Points forts' : 'Strengths'}
          </h4>
          <ul className="list-none p-0 m-0 space-y-1.5">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.82rem] text-[#8a9aaa]">
                <CheckCircle2 size={14} className="text-[#7aaa88] flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {analysis.issues?.length > 0 && (
        <div>
          <h4 className="text-[0.7rem] font-mono uppercase tracking-[0.1em] text-[#e0a050] mb-2">
            {isFrench ? 'Points à travailler' : 'Areas to Work On'}
          </h4>
          <div className="space-y-2">
            {analysis.issues.map((issue, i) => {
              const config = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.low;
              const Icon = config.icon;
              return (
                <div
                  key={i}
                  className="rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} style={{ color: config.color }} />
                    <span className="text-[0.75rem] font-mono uppercase tracking-wider" style={{ color: config.color }}>
                      {catLabel(issue.category)}
                    </span>
                    {issue.timestamp && (
                      <span className="flex items-center gap-1 text-[0.7rem] text-[#6a7a8a] font-mono ml-auto">
                        <Clock size={10} /> {issue.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.82rem] text-[#a0a8b8] m-0 mb-1">{issue.description}</p>
                  <p className="text-[0.78rem] text-[#7a8a9a] m-0 italic font-[EB_Garamond]">
                    {isFrench ? 'Suggestion' : 'Suggestion'}: {issue.suggestion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Priority Flags */}
      {analysis.priorityFlags?.length > 0 && (
        <div className="rounded-lg bg-[rgba(224,112,112,0.06)] border border-[rgba(224,112,112,0.15)] p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertCircle size={14} className="text-[#e07070]" />
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[#e07070]">
              {isFrench ? 'Priorités pour Bertrand' : 'Priority Flags for Bertrand'}
            </span>
          </div>
          <ul className="list-none p-0 m-0 space-y-1">
            {analysis.priorityFlags.map((flag, i) => (
              <li key={i} className="text-[0.82rem] text-[#c0a0a0]">• {flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Draft Review — only show in mentor view */}
      {isMentorView && analysis.draftReview && (
        <div className="rounded-lg bg-[rgba(var(--cf-gold-rgb),0.05)] border border-[rgba(var(--cf-gold-rgb),0.15)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-cf-gold" />
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-cf-gold">
              {isFrench ? 'Brouillon de révision (à éditer)' : 'Draft Review (edit before sending)'}
            </span>
          </div>
          <p className="text-[0.85rem] text-[#c8c0b0] leading-[1.7] font-[EB_Garamond] italic m-0 whitespace-pre-wrap">
            {analysis.draftReview}
          </p>
        </div>
      )}

      {/* Recommended Focus */}
      {analysis.recommendedFocus && (
        <div className="flex items-start gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <Lightbulb size={14} className="text-[#7aaa88] flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[#7aaa88] block mb-0.5">
              {isFrench ? 'Focus recommandé' : 'Recommended Focus'}
            </span>
            <span className="text-[0.82rem] text-[#8a9aaa]">{analysis.recommendedFocus}</span>
          </div>
        </div>
      )}

      {/* Estimated Level */}
      {analysis.estimatedLevel && (
        <div className="text-[0.7rem] text-[#5a6a7a] font-mono">
          {isFrench ? 'Niveau estimé' : 'Estimated Level'}: {analysis.estimatedLevel}
        </div>
      )}
    </div>
  );
}
