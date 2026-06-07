import { Send, X, FileText } from 'lucide-react';
import { truncateText } from '../utils';

export type PdfContext = { text: string; pageNumber: number | null };

interface Props {
  context: PdfContext | null;
  explainError: string | null;
  manualInput: string;
  isLoading: boolean;
  onContextClear: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export function ChatInput({ 
  context, explainError, manualInput, isLoading, 
  onContextClear, onInputChange, onSendMessage 
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleInputResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const t = e.currentTarget;
    t.style.height = 'auto';
    t.style.height = Math.min(t.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t border-gray-200 px-4 py-3 space-y-2">
      {/* Context Card */}
      {context && (
        <div className="group relative rounded-xl border border-blue-200 bg-blue-50/60 px-3 py-2.5 transition-all hover:border-blue-300 hover:shadow-sm">
          <button
            type="button"
            onClick={onContextClear}
            className="absolute top-1.5 right-1.5 p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Remove context"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-2 pr-5">
            <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              {context.pageNumber && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Page {context.pageNumber}:
                </span>
              )}
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mt-0.5">
                {truncateText(context.text, 100)}
              </p>
            </div>
          </div>
        </div>
      )}

      {explainError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
          {explainError}
        </div>
      )}

      {/* Input row */}
      <div className="relative flex items-end gap-2">
        <textarea
          value={manualInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInputResize}
          rows={1}
          placeholder={context ? "Ask about the highlighted text..." : "Ask anything about this paper or highlight text..."}
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none resize-none transition-colors"
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          type="button"
          onClick={onSendMessage}
          disabled={isLoading || (!manualInput.trim() && !context)}
          className="shrink-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-2.5 text-white shadow-sm hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}