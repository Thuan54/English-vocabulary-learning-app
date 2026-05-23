import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import PdfViewer from '../components/PdfViewer';
import { explainText } from '../api/ai.api';

type ChatMessage = { id: string; role: 'user' | 'bot'; content: string };

export function PdfExplain() {
  const [manualInput, setManualInput] = useState<string>('');
  const [history, setHistory] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'bot', content: 'Upload a PDF, highlight a word or sentence directly inside the PDF viewer, and click the icon to explain it.' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);
  const historyScrollRef = useRef<HTMLDivElement | null>(null);

  const handleExplainRequest = async (textToExplain: string) => {
    setExplainError(null);
    if (!textToExplain) {
      setExplainError('Highlight text in the PDF or type a word/sentence to explain.');
      return;
    }
    // Optimistic UI: add user message and a placeholder bot message immediately
    const userId = `user-${Date.now()}`;
    const botId = `bot-${Date.now()}`;
    setHistory((prev) => [...prev, { id: userId, role: 'user', content: textToExplain }, { id: botId, role: 'bot', content: 'Thinking...' }]);
    setIsLoading(true);
    try {
      const result = await explainText(textToExplain);
      // replace placeholder bot message with real content
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: result.explanation } : m)));
      setManualInput('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error.';
      setExplainError(msg);
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: 'Unable to get explanation from the AI service' } : m)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const el = historyScrollRef.current;
    if (!el) return;
    // smooth scroll to bottom when new messages arrive
    requestAnimationFrame(() => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } catch {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [history, isLoading]);

  return (
    <div className="p-8 max-w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">PDF Word Explainer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Upload a PDF and highlight a word or sentence directly inside the PDF viewer. Use the icon to send it to the AI.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6">
          <PdfViewer onExplainRequest={handleExplainRequest} />
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 flex flex-col lg:sticky lg:top-6 self-start">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">AI Explanation Chat</h2>
              <p className="text-sm text-gray-500">Your selection will appear here once explained.</p>
            </div>
          </div>

          <div ref={(el) => { historyScrollRef.current = el; }} className="flex-1 overflow-y-auto space-y-4 mb-6">
            <div className="space-y-4">
              {history.map((message) => (
                <div key={message.id} className={`rounded-3xl p-5 shadow-sm border ${message.role === 'bot' ? 'bg-gray-50 border-gray-200' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent'}`}>
                  <div className="text-sm font-semibold mb-2 uppercase tracking-[0.12em]">{message.role === 'bot' ? 'Explanation' : 'You'}</div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Or paste a custom word/sentence</label>
            <textarea value={manualInput} onChange={(e) => setManualInput(e.target.value)} rows={4} placeholder="Type a word or sentence to explain…" className="w-full rounded-3xl border border-gray-200 p-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none" />
            {explainError && <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{explainError}</div>}
            <button type="button" onClick={() => handleExplainRequest(manualInput.trim())} disabled={isLoading} className="w-full inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 text-white font-semibold shadow-lg hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
              {isLoading ? 'Explaining...' : 'Explain Selection'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
