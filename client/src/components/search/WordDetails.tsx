import { Volume2, BookmarkPlus, Check } from 'lucide-react';

type WordType = any;

type Props = {
  selectedWord: WordType | null;
  isSaved?: boolean;
  onAdd?: () => void;
};

export function WordDetails({ selectedWord, isSaved, onAdd }: Props) {
  if (!selectedWord) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">{selectedWord.word}</h2>
          <div className="flex items-center gap-3 mt-2">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700"><Volume2 className="w-5 h-5" /><span className="text-lg text-gray-600">{selectedWord.pronunciation}</span></button>
          </div>
        </div>
        <button onClick={onAdd} disabled={isSaved} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isSaved ? 'bg-green-100 text-green-700' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'}`}>
          {isSaved ? (<><Check className="w-5 h-5" />Saved</>) : (<><BookmarkPlus className="w-5 h-5" />Add to List</>) }
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Meaning</h3>
        <p className="text-xl text-gray-700">{selectedWord.meaning}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Example Sentences</h3>
        <div className="space-y-3">{selectedWord.examples.map((ex: string, i: number) => <div key={i} className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500"><p className="text-gray-700">{ex}</p></div>)}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Synonyms</h3>
        <div className="flex flex-wrap gap-2">{selectedWord.synonyms.map((s: string, i: number) => <button key={i} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors font-medium">{s}</button>)}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Topics</h3>
        <div className="flex flex-wrap gap-2">{selectedWord.topics.map((t: string, i: number) => <span key={i} className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">{t}</span>)}</div>
      </div>
    </div>
  );
}

export default WordDetails;
