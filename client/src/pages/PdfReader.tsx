import { useState } from 'react';
import PdfViewer from '../components/pdfReader/PdfViewer';
import { AssistantPanel } from '../components/chat/AssistantPanel';
import { chatWithAi } from '../api/ai.api';
import { truncateText } from '../components/utils';

type ChatMessage = { id: string; role: 'user' | 'bot'; content: string };
type PdfContext = { text: string; pageNumber: number | null };

export function PdfReader() {
  const [manualInput, setManualInput] = useState<string>('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [context, setContext] = useState<PdfContext | null>(null);

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
      const result = await chatWithAi(textToSend, [{ role: 'user', content: '' }]);
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: result } : m)));
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
      // const result = await chatWithAi(textToExplain, [{ role: 'user', content: '' }]);
      const result = 'good-job'; // Placeholder from your original code
      setHistory((prev) => prev.map((m) => (m.id === botId ? { ...m, content: result } : m)));
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

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* ─── LEFT: PDF Viewer ─── */}
      <section className="flex-[1.6] overflow-hidden bg-gray-100">
        <PdfViewer onExplainRequest={handleExplainRequest} onContextSet={handleContextSet} />
      </section>

      {/* ─── RIGHT: Assistant Panel ─── */}
      <AssistantPanel
        history={history}
        isLoading={isLoading}
        context={context}
        explainError={explainError}
        manualInput={manualInput}
        onContextClear={() => setContext(null)}
        onInputChange={setManualInput}
        onSendMessage={() => handleSendMessage()}
      />
    </div>
  );
}