import { useState } from 'react';
import { Volume2, BookmarkPlus, Check } from 'lucide-react';
import { Word } from '../../types/review';

type Props = {
  selectedWord: Omit<Word, "wordId"> | null;
  isSaved?: boolean;
  onAdd?: () => void;
};

export function WordDetails({ selectedWord, isSaved, onAdd }: Props) {
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedWord) return null;

  const handleAdd = () => {
    if (isSaved || !onAdd) return;

    try {
      onAdd();

      setJustAdded(true);

      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add word:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">
            {selectedWord.word}
          </h2>

          <div className="flex items-center gap-3 mt-2">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Volume2 className="w-5 h-5" />
              <span className="text-lg text-gray-600">
                {selectedWord.pronunciation}
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={isSaved}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isSaved || justAdded
              ? 'bg-green-100 text-green-700'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-5 h-5" />
              Added!
            </>
          ) : isSaved ? (
            <>
              <Check className="w-5 h-5" />
              Saved
            </>
          ) : (
            <>
              <BookmarkPlus className="w-5 h-5" />
              Add to List
            </>
          )}
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Meaning
        </h3>
        <p className="text-xl text-gray-700">
          {selectedWord.meaning}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Example Sentences
        </h3>
        <div className="space-y-3">
          {selectedWord.example ?? 'No example yet'}
        </div>
      </div>
    </div>
  );
}

export default WordDetails;