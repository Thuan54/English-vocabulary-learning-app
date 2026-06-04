import { useState, useRef, useEffect } from 'react';
import { Send, X, FileText, Sparkles, MessageSquare } from 'lucide-react';
import PdfViewer from '../components/PdfViewer';
import { MarkdownContent } from '../components/MarkdownContent';
import { explainText } from '../api/ai.api';

type ChatMessage = { id: string; role: 'user' | 'bot'; content: string };
type PdfContext = { text: string; pageNumber: number | null };

export function PdfExplain() {
  const [manualInput, setManualInput] = useState<string>('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [context, setContext] = useState<PdfContext | null>(null);
  const historyScrollRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (userText?: string) => {
    setExplainError(null);
    const messageText = userText || manualInput.trim();
    if (!messageText && !context) {
      setExplainError('Highlight text in the PDF or type a word/sentence.');
      return;
    }

    let textToSend = messageText;
    let displayText = messageText;

    if (context) {
      const pageLabel = context.pageNumber ? ` (Page ${context.pageNumber})` : '';
      if (messageText) {
        textToSend = `Context from PDF${pageLabel}: "${context.text}"\n\nQuestion: ${messageText}`;
        displayText = messageText;
      } else {
        textToSend = context.text;
        displayText = `Explain: "${truncateText(context.text, 100)}"`;
      }
    }

    const userId = `user-${Date.now()}`;
    const botId = `bot-${Date.now()}`;
    setHistory((prev) => [...prev, { id: userId, role: 'user', content: displayText }, { id: botId, role: 'bot', content: 'Thinking...' }]);
    setIsLoading(true);
    setManualInput('');

    try {
      const result = await explainText(textToSend);
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: result.explanation } : m)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setExplainError(msg);
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: '⚠ Unable to get explanation.' } : m)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainRequest = async (textToExplain: string, pageNumber?: number) => {
    setContext({ text: textToExplain, pageNumber: pageNumber ?? null });
    setExplainError(null);

    const userId = `user-${Date.now()}`;
    const botId = `bot-${Date.now()}`;
    const pageLabel = pageNumber ? ` (p.${pageNumber})` : '';
    setHistory((prev) => [
      ...prev,
      { id: userId, role: 'user', content: `"${truncateText(textToExplain, 100)}"${pageLabel}` },
      { id: botId, role: 'bot', content: 'Thinking...' },
    ]);
    setIsLoading(true);

    try {
      const result = await explainText(textToExplain);
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: result.explanation } : m)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setExplainError(msg);
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: '⚠ Unable to get explanation.' } : m)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextSet = (text: string, pageNumber?: number) => {
    setContext({ text, pageNumber: pageNumber ?? null });
  };

  const clearContext = () => setContext(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const el = historyScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      try { el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }
      catch { el.scrollTop = el.scrollHeight; }
    });
  }, [history, isLoading]);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* ─── LEFT: PDF Viewer ─── */}
      <section className="flex-[1.6] overflow-hidden bg-gray-100">
        <PdfViewer onExplainRequest={handleExplainRequest} onContextSet={handleContextSet} />
      </section>

      {/* ─── RIGHT: Assistant Panel ─── */}
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

        {/* Chat history */}
        <div ref={(el) => { historyScrollRef.current = el; }} className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="rounded-2xl bg-gray-50 p-4 mb-4">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Highlight & Ask</h3>
              <p className="text-xs text-gray-400 leading-relaxed">Select any part of the paper to ask specific questions</p>
              <div className="mt-6 text-xs text-gray-400 italic">
                Try asking "What's the intuition behind this section?"
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gray-900 text-white rounded-br-md'
                      : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-md'
                  }`}>
                    {msg.role === 'bot' ? (
                      <MarkdownContent content={msg.content} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom input area */}
        <div className="border-t border-gray-200 px-4 py-3 space-y-2">
          {/* Context Card */}
          {context && (
            <div className="group relative rounded-xl border border-blue-200 bg-blue-50/60 px-3 py-2.5 transition-all hover:border-blue-300 hover:shadow-sm">
              <button
                type="button"
                onClick={clearContext}
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
                    {context.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {explainError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">{explainError}</div>
          )}

          {/* Input row */}
          <div className="relative flex items-end gap-2">
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={context ? "Ask about the highlighted text..." : "Ask anything about this paper or highlight text..."}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none resize-none transition-colors"
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 120) + 'px';
              }}
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!manualInput.trim() && !context)}
              className="shrink-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-2.5 text-white shadow-sm hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}
