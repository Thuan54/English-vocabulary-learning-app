import { useState } from 'react';
import type { ParaphraseStep } from '../../api/ai.api';

interface Props {
  steps: ParaphraseStep[];
  originalSentence: string;
}

const STEP_ICONS = ['🎯', '🔄', '✨'];
const STEP_COLORS = [
  { border: 'border-blue-200', bg: 'bg-blue-50/50', accent: 'text-blue-600', dot: 'bg-blue-500' },
  { border: 'border-amber-200', bg: 'bg-amber-50/50', accent: 'text-amber-600', dot: 'bg-amber-500' },
  { border: 'border-green-200', bg: 'bg-green-50/50', accent: 'text-green-600', dot: 'bg-green-500' },
];

export function ParaphraseStepsView({ steps, originalSentence }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-[10px]">📝</span>
        Paraphrase Guide
      </div>

      {/* Original */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Original</div>
        <p className="text-sm text-gray-700 italic">"{originalSentence}"</p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-1">
        {steps.map((s, i) => (
          <div key={s.step} className="flex items-center">
            <button
              type="button"
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                activeStep === i
                  ? `${STEP_COLORS[i].bg} ${STEP_COLORS[i].accent} ${STEP_COLORS[i].border} border shadow-sm`
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{STEP_ICONS[i]}</span>
              Step {s.step}
            </button>
            {i < steps.length - 1 && (
              <div className="w-4 h-px bg-gray-300 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      {/* Active Step Content */}
      {steps[activeStep] && (
        <div
          className={`rounded-lg border ${STEP_COLORS[activeStep].border} ${STEP_COLORS[activeStep].bg} p-3 transition-all`}
        >
          <div className={`text-[10px] font-bold uppercase tracking-wider ${STEP_COLORS[activeStep].accent} mb-1.5`}>
            {steps[activeStep].title}
          </div>
          <p className="text-sm text-gray-900 font-medium leading-relaxed mb-2">
            {steps[activeStep].content}
          </p>
          <div className="rounded-md bg-white/60 border border-white/80 px-2.5 py-2">
            <p className="text-xs text-gray-600 leading-relaxed">
              💡 {steps[activeStep].explanation}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition px-2 py-1 rounded-md hover:bg-gray-100"
        >
          ← Back
        </button>
        <span className="text-[10px] text-gray-400">
          {activeStep + 1} / {steps.length}
        </span>
        <button
          type="button"
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition px-2 py-1 rounded-md hover:bg-gray-100"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
