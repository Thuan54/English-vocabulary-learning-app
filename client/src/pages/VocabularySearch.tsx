import { useState } from "react";
import { useVocabulary } from "../contexts/VocabularyContext";
import { Word } from "../types/word";
import { fetchWordSearch } from "../api/vocabulary.api";
import { getAiExplanation } from "../api/ai.api";
import SearchBar from "../components/search/SearchBar";
import AiExplanation from "../components/search/AiExplanation";
import WordDetails from "../components/search/WordDetails";

export function VocabularySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const { words, addWord } = useVocabulary();

  // add
  const [searchedWord, setSearchedWord] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [lookupError, setLookupError] = useState("");

  const fetchAiExplanation = async (word: string) => {
    try {
      setAiLoading(true);
      setAiError("");
      setAiExplanation("");

      const explanation = await getAiExplanation(word);
      setAiExplanation(explanation);
    } catch {
      setAiError("Cannot load AI explanation.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSearch = async () => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      setSelectedWord(null);
      setSearchedWord("");
      setAiExplanation("");
      setAiError("");
      setLookupError("");
      return;
    }

    setSearchedWord(term);
    setLookupError("");

    try {
      const result = await fetchWordSearch(term);
      setSelectedWord(result);
    } catch (error) {
      setSelectedWord(null);
      if (error instanceof Error) {
        setLookupError(error.message);
      } else {
        setLookupError("Failed to fetch word details.");
      }
    }

    await fetchAiExplanation(term);
  };

  const handleAddWord = () => {
    if (selectedWord) {
      const newWord: Word = {
        ...selectedWord,
        id: Date.now().toString(),
        category: "want-to-learn",
        addedDate: new Date(),
        reviewCount: 0
      };
      addWord(newWord);
    }
  };

  const isWordSaved: boolean | undefined =
  selectedWord
    ? words.some(w => w.word.toLowerCase() === selectedWord.word.toLowerCase())
    : undefined;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover New Words</h1>
        <p className="text-gray-600">Search for words and expand your vocabulary</p>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} onKeyPress={handleKeyPress} onSearch={handleSearch} />

      <AiExplanation searchedWord={searchedWord} loading={aiLoading} error={aiError} explanation={aiExplanation} />

      {lookupError && (
        <div className="bg-red-50 text-red-700 rounded-2xl shadow-sm p-4 mb-6 border border-red-200 text-center">
          {lookupError}
        </div>
      )}

      {selectedWord && (
        <WordDetails selectedWord={selectedWord} isSaved={isWordSaved} onAdd={handleAddWord} />
      )}

      {selectedWord === null && searchedWord && (
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">No dictionary result found. AI explanation is still available above.</p>
        </div>
      )}
    </div>
  );
}
