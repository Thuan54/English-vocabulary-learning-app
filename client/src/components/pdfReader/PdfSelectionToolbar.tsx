import { Search, MessageSquareQuote, BookmarkPlus, Check } from 'lucide-react';
import { type Word } from '../../types/review';
import { useState } from 'react';

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
  const [justAdded, setJustAdded] = useState(false)

  const isSingleWord = selectedText.trim().split(/\s+/).length === 1;

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

  return (
    <div
      className="absolute z-20 inline-flex items-center gap-0.5 rounded-lg bg-white border border-gray-200 shadow-xl px-1 py-1"
      style={{ top: selectionPosition.top, left: Math.max(selectionPosition.left, 130), transform: 'translate(-50%, -100%)' }}
    >
      <button type="button" onClick={() => onExplainRequest(selectedText, selectedPage ?? undefined)} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition">
        <Search className="w-3.5 h-3.5" /> Ask AI
      </button>
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