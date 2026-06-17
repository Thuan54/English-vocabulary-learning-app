import { useState, useEffect } from 'react';
import PdfViewer from '../components/pdfReader/PdfViewer';
import { AssistantPanel } from '../components/chat/AssistantPanel';
import { chatWithAi, analyzeGrammar, paraphraseText, smartFlashcard } from '../api/ai.api';
import type { FlashcardData } from '../api/ai.api';
import type { ChatMessage } from '../components/chat/ChatHistory';
import { truncateText } from '../components/utils';
import { loadVocabDeck, saveVocabDeck } from '../components/chat/VocabularyDeck';

type PdfContext = { text: string; pageNumber: number | null };

export function PdfReader() {
  const [manualInput, setManualInput] = useState<string>('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [context, setContext] = useState<PdfContext | null>(null);
  const [vocabDeck, setVocabDeck] = useState<FlashcardData[]>(() => loadVocabDeck());

  // Persist vocab deck changes
  useEffect(() => {
    saveVocabDeck(vocabDeck);
  }, [vocabDeck]);

  // ─── Existing Handlers ──────────────────────────────────────────────────────

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
      const result = await chatWithAi(textToExplain, [{ role: 'user', content: '' }]);
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

  // ─── CT Feature Handlers ────────────────────────────────────────────────────

  /** CT Step 1 — Decomposition: Analyze Grammar */
  const handleAnalyzeRequest = async (text: string) => {
    const userId = `user-${Date.now()}`;
    const botId = `bot-${Date.now()}`;

    setHistory((prev) => [
      ...prev,
      { id: userId, role: 'user', content: `🔬 Analyze: "${truncateText(text, 80)}"` },
      { id: botId, role: 'bot', content: 'Analyzing grammar structure...' },
    ]);
    setIsLoading(true);

    try {
      const result = await analyzeGrammar(text);
      setHistory((prev) => prev.map((m) =>
        m.id === botId
          ? { ...m, content: '', grammarAnalysis: result }
          : m
      ));
    } catch (e: any) {
      const msg = e?.message || (typeof e === 'string' ? e : 'Grammar analysis failed.');
      setHistory((prev) => prev.map((m) =>
        m.id === botId ? { ...m, content: `⚠ ${msg}` } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  /** CT Step 4 — Algorithm Design: Paraphrase Guide */
  const handleParaphraseRequest = async (text: string) => {
    const userId = `user-${Date.now()}`;
    const botId = `bot-${Date.now()}`;

    setHistory((prev) => [
      ...prev,
      { id: userId, role: 'user', content: `📝 Paraphrase: "${truncateText(text, 80)}"` },
      { id: botId, role: 'bot', content: 'Creating paraphrase guide...' },
    ]);
    setIsLoading(true);

    try {
      const result = await paraphraseText(text);
      setHistory((prev) => prev.map((m) =>
        m.id === botId
          ? { ...m, content: '', paraphraseSteps: { steps: result.steps, originalSentence: text } }
          : m
      ));
    } catch (e: any) {
      const msg = e?.message || (typeof e === 'string' ? e : 'Paraphrase failed.');
      setHistory((prev) => prev.map((m) =>
        m.id === botId ? { ...m, content: `⚠ ${msg}` } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  /** CT Step 3 — Abstraction: Smart Add (Flashcard) */
  const handleSmartAdd = async (word: string, surroundingText: string) => {
    try {
      const result = await smartFlashcard(word, surroundingText);
      setVocabDeck((prev) => {
        // Avoid duplicates
        if (prev.some(c => c.word.toLowerCase() === result.flashcard.word.toLowerCase())) {
          return prev;
        }
        return [result.flashcard, ...prev];
      });
    } catch (e) {
      console.error('Smart flashcard failed:', e);
      // Fallback: add basic card
      setVocabDeck((prev) => {
        if (prev.some(c => c.word.toLowerCase() === word.toLowerCase())) return prev;
        return [{
          word,
          pronunciation: '',
          partOfSpeech: '',
          definition: '',
          contextSentence: surroundingText,
          minimalContext: '',
        }, ...prev];
      });
    }
  };

  /** Remove flashcard from vocab deck */
  const handleRemoveFlashcard = (word: string) => {
    setVocabDeck((prev) => prev.filter(c => c.word !== word));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* ─── LEFT: PDF Viewer ─── */}
      <section className="flex-[1.6] overflow-hidden bg-gray-100">
        <PdfViewer
          onExplainRequest={handleExplainRequest}
          onContextSet={handleContextSet}
          onAnalyzeRequest={handleAnalyzeRequest}
          onParaphraseRequest={handleParaphraseRequest}
          onSmartAdd={handleSmartAdd}
        />
      </section>

      {/* ─── RIGHT: Assistant Panel ─── */}
      <AssistantPanel
        history={history}
        isLoading={isLoading}
        context={context}
        explainError={explainError}
        manualInput={manualInput}
        vocabDeck={vocabDeck}
        onContextClear={() => setContext(null)}
        onInputChange={setManualInput}
        onSendMessage={() => handleSendMessage()}
        onRemoveFlashcard={handleRemoveFlashcard}
      />
    </div>
  );
}