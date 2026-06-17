import { useRef, useEffect, useState } from 'react';
import { Sparkles, MessageSquare, BookOpen } from 'lucide-react';
import { ChatHistory, type ChatMessage } from './ChatHistory';
import { ChatInput, type PdfContext } from './ChatInput';
import { VocabularyDeck } from './VocabularyDeck';
import type { FlashcardData } from '../../api/ai.api';

type TabId = 'chat' | 'vocab';

interface Props {
  history: ChatMessage[];
  isLoading: boolean;
  context: PdfContext | null;
  explainError: string | null;
  manualInput: string;
  vocabDeck: FlashcardData[];
  onContextClear: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onRemoveFlashcard: (word: string) => void;
}

export function AssistantPanel({
  history, isLoading, context, explainError, manualInput,
  vocabDeck,
  onContextClear, onInputChange, onSendMessage,
  onRemoveFlashcard
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const historyScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (activeTab !== 'chat') return;
    const el = historyScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }
      catch { el.scrollTop = el.scrollHeight; }
    });
  }, [history, isLoading, activeTab]);

  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'vocab', label: 'Vocab Deck', icon: <BookOpen className="w-3.5 h-3.5" />, badge: vocabDeck.length || undefined },
  ];

  return (
    <section className="flex-1 flex flex-col bg-white border-l border-gray-200 min-w-[360px] max-w-[480px]">
      {/* Header */}
      <div className="px-5 pt-4 pb-0 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-xl bg-gradient-to-br from-red-500 to-pink-500 p-2 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Assistant</h2>
            <p className="text-xs text-gray-400">Highlight text to ask questions</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors relative ${
                activeTab === tab.id
                  ? 'text-gray-900 bg-white border border-gray-200 border-b-white -mb-px z-10'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="inline-flex items-center justify-center min-w-[16px] h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold px-1">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' && (
        <>
          <ChatHistory 
            history={history} 
            isLoading={isLoading} 
            historyScrollRef={historyScrollRef} 
          />
          <ChatInput
            context={context}
            explainError={explainError}
            manualInput={manualInput}
            isLoading={isLoading}
            onContextClear={onContextClear}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
          />
        </>
      )}

      {activeTab === 'vocab' && (
        <VocabularyDeck
          deck={vocabDeck}
          onRemove={onRemoveFlashcard}
        />
      )}
    </section>
  );
}