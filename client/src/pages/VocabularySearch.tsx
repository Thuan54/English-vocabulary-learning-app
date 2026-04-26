import { useState } from "react";
import { Search, Volume2, BookmarkPlus, Check } from "lucide-react";
import { useVocabulary, Word } from "../contexts/VocabularyContext";

// Mock dictionary data
const dictionaryData: { [key: string]: Omit<Word, "id" | "category" | "addedDate" | "reviewCount"> } = {
  "tenacious": {
    word: "Tenacious",
    meaning: "Tending to keep a firm hold of something; persistent",
    pronunciation: "/təˈneɪʃəs/",
    examples: [
      "She was tenacious in her pursuit of excellence.",
      "The team showed tenacious spirit despite losing."
    ],
    synonyms: ["persistent", "determined", "resolute", "steadfast"],
    topics: ["Character", "Determination"]
  },
  "benevolent": {
    word: "Benevolent",
    meaning: "Well meaning and kindly; showing goodwill",
    pronunciation: "/bəˈnevələnt/",
    examples: [
      "The benevolent ruler was loved by all citizens.",
      "She made a benevolent donation to the charity."
    ],
    synonyms: ["kind", "generous", "compassionate", "charitable"],
    topics: ["Character", "Kindness"]
  },
  "ubiquitous": {
    word: "Ubiquitous",
    meaning: "Present, appearing, or found everywhere",
    pronunciation: "/juːˈbɪkwɪtəs/",
    examples: [
      "Smartphones have become ubiquitous in modern society.",
      "Coffee shops are ubiquitous in this neighborhood."
    ],
    synonyms: ["omnipresent", "everywhere", "pervasive", "universal"],
    topics: ["Description", "Common"]
  },
  "eloquent": {
    word: "Eloquent",
    meaning: "Fluent or persuasive in speaking or writing",
    pronunciation: "/ˈɛləkwənt/",
    examples: [
      "The speaker gave an eloquent speech about climate change.",
      "Her eloquent writing style captivated readers."
    ],
    synonyms: ["articulate", "fluent", "persuasive", "expressive"],
    topics: ["Communication", "Skills"]
  }
};

export function VocabularySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState<typeof dictionaryData[string] | null>(null);
  const { words, addWord } = useVocabulary();

  const handleSearch = () => {
    const term = searchTerm.toLowerCase().trim();
    if (dictionaryData[term]) {
      setSelectedWord(dictionaryData[term]);
    } else {
      setSelectedWord(null);
    }
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
      {/* Search Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover New Words</h1>
        <p className="text-gray-600">Search for words and expand your vocabulary</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a word (try: tenacious, benevolent, ubiquitous, eloquent)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            Search
          </button>
        </div>
      </div>

      {/* Word Details */}
      {selectedWord && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">{selectedWord.word}</h2>
              <div className="flex items-center gap-3 mt-2">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <Volume2 className="w-5 h-5" />
                  <span className="text-lg text-gray-600">{selectedWord.pronunciation}</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleAddWord}
              disabled={isWordSaved}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isWordSaved
                  ? "bg-green-100 text-green-700"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
              }`}
            >
              {isWordSaved ? (
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

          {/* Meaning */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Meaning
            </h3>
            <p className="text-xl text-gray-700">{selectedWord.meaning}</p>
          </div>

          {/* Examples */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Example Sentences
            </h3>
            <div className="space-y-3">
              {selectedWord.examples.map((example, index) => (
                <div key={index} className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <p className="text-gray-700">{example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Synonyms */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Synonyms
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedWord.synonyms.map((synonym, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(synonym);
                    const term = synonym.toLowerCase().trim();
                    if (dictionaryData[term]) {
                      setSelectedWord(dictionaryData[term]);
                    }
                  }}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors font-medium"
                >
                  {synonym}
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedWord.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedWord === null && searchTerm && (
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 text-center">
          <p className="text-gray-500 text-lg">No results found. Try searching for: tenacious, benevolent, ubiquitous, or eloquent</p>
        </div>
      )}
    </div>
  );
}
