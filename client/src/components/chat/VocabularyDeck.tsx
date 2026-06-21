import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { FlashcardData } from '../../api/ai.api';

const VOCAB_DECK_KEY = 'pdf-vocab-deck-v1';

export function loadVocabDeck(): FlashcardData[] {
  try {
    const raw = localStorage.getItem(VOCAB_DECK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVocabDeck(deck: FlashcardData[]) {
  try {
    localStorage.setItem(VOCAB_DECK_KEY, JSON.stringify(deck));
  } catch {}
}

interface Props {
  deck: FlashcardData[];
  onRemove: (word: string) => void;
}

export function VocabularyDeck({ deck, onRemove }: Props) {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="rounded-2xl bg-gray-50 p-4 mb-4">
          <BookOpen className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Vocabulary Deck</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Highlight a word in the PDF and click <strong>Add</strong> to create smart flashcards with context.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0 space-y-2">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {deck.length} card{deck.length !== 1 ? 's' : ''}
        </span>
      </div>

      {deck.map((card) => {
        const isExpanded = expandedWord === card.word;
        return (
          <div
            key={card.word}
            className={`rounded-xl border transition-all duration-200 ${
              isExpanded
                ? 'border-blue-200 bg-blue-50/30 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
            }`}
          >
            {/* Collapsed Header */}
            <button
              type="button"
              onClick={() => setExpandedWord(isExpanded ? null : card.word)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{card.word}</span>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
                    {card.partOfSpeech}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">{card.pronunciation}</span>
              </div>
              {isExpanded
                ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                : <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              }
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2">
                {/* Definition */}
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-blue-500 mb-0.5">Định nghĩa</div>
                  <p className="text-xs text-gray-800 leading-relaxed">{card.definition}</p>
                </div>

                {/* Context Sentence */}
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-green-500 mb-0.5">Ngữ cảnh</div>
                  <p className="text-xs text-gray-600 italic leading-relaxed">"{card.contextSentence}"</p>
                </div>

                {/* Minimal Context */}
                <div className="rounded-md bg-amber-50 border border-amber-100 px-2 py-1.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-amber-500 mb-0.5">Fill-in</div>
                  <p className="text-xs text-gray-700 font-mono">{card.minimalContext}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(card.word);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition px-2 py-1 rounded-md hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
