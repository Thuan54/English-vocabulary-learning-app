
type Props = {
  searchedWord: string;
  loading: boolean;
  error: string;
  explanation: string;
};

export function AiExplanation({ searchedWord, loading, error, explanation }: Props) {
  if (!searchedWord) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-200">
      <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">AI Explanation</h3>
      <p className="text-gray-500 mb-3">Explanation for: <span className="font-semibold text-gray-800">{searchedWord}</span></p>
      {loading && <p className="text-gray-500">AI is generating explanation...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && explanation && <p className="text-lg text-gray-700 leading-relaxed">{explanation}</p>}
    </div>
  );
}

export default AiExplanation;
