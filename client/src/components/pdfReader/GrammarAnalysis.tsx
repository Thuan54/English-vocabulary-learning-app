import { useState } from 'react';
import type { GrammarAnalysis } from '../../api/ai.api';

const POS_COLORS: Record<string, string> = {
  Noun: 'bg-blue-100 text-blue-800 border-blue-200',
  Verb: 'bg-red-100 text-red-800 border-red-200',
  Adjective: 'bg-purple-100 text-purple-800 border-purple-200',
  Adverb: 'bg-amber-100 text-amber-800 border-amber-200',
  Preposition: 'bg-gray-100 text-gray-700 border-gray-200',
  Conjunction: 'bg-teal-100 text-teal-800 border-teal-200',
  Pronoun: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Determiner: 'bg-gray-100 text-gray-600 border-gray-200',
};

interface Props {
  data: GrammarAnalysis;
}

export function GrammarAnalysisView({ data }: Props) {
  const { analysis } = data;
  const [showPosDetail, setShowPosDetail] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-[10px]">🔬</span>
        Grammar Analysis
      </div>

      {/* Main Clause */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">Main Clause</div>
        <p className="text-sm text-gray-900 font-medium">{analysis.mainClause}</p>
      </div>

      {/* Dependent Clauses */}
      {analysis.dependentClauses.length > 0 && (
        <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
            Dependent Clause{analysis.dependentClauses.length > 1 ? 's' : ''}
          </div>
          {analysis.dependentClauses.map((clause, i) => (
            <p key={i} className="text-sm text-gray-800 italic">• {clause}</p>
          ))}
        </div>
      )}

      {/* S-V-O Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-2 text-center">
          <div className="text-[9px] font-bold uppercase tracking-wider text-blue-500">Subject</div>
          <p className="text-xs font-semibold text-blue-900 mt-0.5">{analysis.subject}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-2 text-center">
          <div className="text-[9px] font-bold uppercase tracking-wider text-red-500">Verb</div>
          <p className="text-xs font-semibold text-red-900 mt-0.5">{analysis.mainVerb}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2 text-center">
          <div className="text-[9px] font-bold uppercase tracking-wider text-amber-500">Object</div>
          <p className="text-xs font-semibold text-amber-900 mt-0.5">{analysis.object || '—'}</p>
        </div>
      </div>

      {/* POS Labels */}
      {analysis.posLabels.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowPosDetail(!showPosDetail)}
            className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
          >
            <span className="transition-transform" style={{ transform: showPosDetail ? 'rotate(90deg)' : '' }}>▶</span>
            Parts of Speech ({analysis.posLabels.length} words)
          </button>
          {showPosDetail && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysis.posLabels.map((label, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${POS_COLORS[label.pos] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                >
                  {label.word}
                  <span className="text-[9px] opacity-70">{label.pos}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
