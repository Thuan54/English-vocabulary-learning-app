import { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatHistory, type ChatMessage } from './ChatHistory';
import { ChatInput, type PdfContext } from './ChatInput';

interface Props {
  history: ChatMessage[];
  isLoading: boolean;
  context: PdfContext | null;
  explainError: string | null;
  manualInput: string;
  onContextClear: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export function AssistantPanel({
  history, isLoading, context, explainError, manualInput,
  onContextClear, onInputChange, onSendMessage
}: Props) {
  const historyScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    const el = historyScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }
      catch { el.scrollTop = el.scrollHeight; }
    });
  }, [history, isLoading]);

  return (
    <section className="flex-1 flex flex-col bg-white border-l border-gray-200 min-w-[360px] max-w-[480px]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
        <div className="rounded-xl bg-gradient-to-br from-red-500 to-pink-500 p-2 text-white">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Assistant</h2>
          <p className="text-xs text-gray-400">Highlight text to ask questions</p>
        </div>
      </div>

      {/* Chat History */}
      <ChatHistory 
        history={history} 
        isLoading={isLoading} 
        historyScrollRef={historyScrollRef} 
      />

      {/* Input Area */}
      <ChatInput
        context={context}
        explainError={explainError}
        manualInput={manualInput}
        isLoading={isLoading}
        onContextClear={onContextClear}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />
    </section>
  );
}