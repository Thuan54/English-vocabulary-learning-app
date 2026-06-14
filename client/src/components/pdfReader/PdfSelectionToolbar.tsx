import { Search, MessageSquareQuote, BookmarkPlus, Check, Languages, Loader2 } from 'lucide-react';
import { type Word } from '../../types/review';
import { useState } from 'react';
import { translateText } from '../../api/ai.api';

interface Props {
  selectedText: string;
  selectedPage: number | null;
  selectionPosition: { top: number; left: number };
  onExplainRequest: (text: string, pageNumber?: number) => Promise<void>;
  onContextSet?: (text: string, pageNumber?: number) => void;
  onHighlight: () => void;
  onAddWord: (word: string, meaning: string) => void;
  isAlreadySaved: boolean;
}

export function PdfSelectionToolbar({ selectedText, selectedPage, selectionPosition, onExplainRequest, onContextSet, onHighlight, onAddWord, isAlreadySaved }: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const isSingleWord = selectedText.trim().split(/\s+/).length === 1;

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const result = await translateText(selectedText);
      setTranslation(result);
    } catch (error) {
      console.error('Failed to translate:', error);
      setTranslation('Error translating word.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddToVocab = () => {
    if (isAlreadySaved) return;
    const newWord: Omit<Word, 'wordId'> = { word: selectedText.trim(), meaning: '', pronunciation: '', example: '' };
    try {
      onAddWord(newWord.word, newWord.meaning);
      setJustAdded(true)

      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add word:', error);
    }

  };

  if (isTranslating) {
    return (
      <div
        className="absolute z-20 inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 shadow-xl px-3 py-2 text-xs text-gray-500 font-medium"
        style={{ top: selectionPosition.top, left: Math.max(selectionPosition.left, 130), transform: 'translate(-50%, -100%)' }}
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
        <span>Dịch...</span>
      </div>
    );
  }

  if (translation) {
    return (
      <div
        className="absolute z-20 inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 shadow-xl px-3 py-2 text-xs text-gray-700 max-w-sm"
        style={{ top: selectionPosition.top, left: Math.max(selectionPosition.left, 130), transform: 'translate(-50%, -100%)' }}
      >
        <Languages className="w-4 h-4 text-blue-600 shrink-0" />
        <div className="flex flex-col">
          <span className="font-semibold text-blue-800 text-[10px] uppercase tracking-wider">Bản dịch</span>
          <span className="text-gray-900 font-medium">{translation}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setTranslation(null);
            window.getSelection()?.removeAllRanges();
          }}
          className="ml-2 text-gray-400 hover:text-gray-600 font-bold text-sm px-1.5 py-0.5 rounded-full hover:bg-gray-100 transition"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute z-20 inline-flex items-center gap-0.5 rounded-lg bg-white border border-gray-200 shadow-xl px-1 py-1"
      style={{ top: selectionPosition.top, left: Math.max(selectionPosition.left, 130), transform: 'translate(-50%, -100%)' }}
    >
      <button type="button" onClick={() => onExplainRequest(selectedText, selectedPage ?? undefined)} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition">
        <Search className="w-3.5 h-3.5" /> Ask AI
      </button>
      {isSingleWord && (
        <button type="button" onClick={handleTranslate} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition">
          <Languages className="w-3.5 h-3.5" /> Translate
        </button>
      )}
      {onContextSet && (
        <button type="button" onClick={() => { onContextSet(selectedText, selectedPage ?? undefined); window.getSelection()?.removeAllRanges(); }} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-50 transition">
          <MessageSquareQuote className="w-3.5 h-3.5" /> Context
        </button>
      )}
      <button type="button" onClick={onHighlight} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition">Highlight</button>
      {isSingleWord && (
        <button type="button" onClick={handleAddToVocab} disabled={isAlreadySaved} className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${isAlreadySaved ? 'text-green-700 bg-green-50' : 'text-blue-700 hover:bg-blue-50'}`}>
          {isAlreadySaved || justAdded ?
          (<>
            <Check className="w-3.5 h-3.5" />
            {justAdded ? 'Added!' : 'Saved'}
          </>) : 
          (<>
            <BookmarkPlus className="w-3.5 h-3.5" />Add
          </>)}
        </button>
      )}
    </div>
  );
}