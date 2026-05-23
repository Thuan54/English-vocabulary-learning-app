import { useEffect, useState, type KeyboardEvent } from "react";
import { Search, Volume2, BookmarkPlus, Check } from "lucide-react";
import { useVocabulary, Word } from "../contexts/VocabularyContext";
import { dictionaryData } from "./vocabularyData";

type WordChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function VocabularySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState<typeof dictionaryData[string] | null>(null);
  const [wordChatInput, setWordChatInput] = useState("");
  const [wordChatMessages, setWordChatMessages] = useState<WordChatMessage[]>([]);
  const { words, addWord } = useVocabulary();

  useEffect(() => {
    setWordChatMessages([]);
    setWordChatInput("");
  }, [selectedWord]);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase().trim();
    if (dictionaryData[term]) {
      setSelectedWord(dictionaryData[term]);
    } else {
      setSelectedWord(null);
    }
  };

  const isWordSaved = selectedWord
    ? words.some((w) => w.word.toLowerCase() === selectedWord.word.toLowerCase())
    : false;

  const handleAddWord = () => {
    if (!selectedWord || isWordSaved) return;

    const newWord: Word = {
      ...selectedWord,
      id: Date.now().toString(),
      category: "want-to-learn",
      addedDate: new Date(),
      reviewCount: 0,
    };
    addWord(newWord);
  };

  const generateWordChatResponse = (question: string) => {
    if (!selectedWord) return "";
    const lower = question.toLowerCase();

    if (lower.includes("meaning") || lower.includes("define")) {
      return `“${selectedWord.word}” means ${selectedWord.meaning}.`;
    }
    if (lower.includes("pronunci") || lower.includes("sound") || lower.includes("say")) {
      return `The pronunciation of ${selectedWord.word} is ${selectedWord.pronunciation}.`;
    }
    if (lower.includes("example") || lower.includes("sentence")) {
      return `Example sentences:\n- ${selectedWord.examples.join("\n- ")}`;
    }
    if (lower.includes("synonym") || lower.includes("similar")) {
      return `Synonyms for ${selectedWord.word}: ${selectedWord.synonyms.join(", ")}.`;
    }
    if (lower.includes("topic") || lower.includes("use") || lower.includes("context")) {
      return `${selectedWord.word} is often used in topics like ${selectedWord.topics.join(", ")}.`;
    }
    return `“${selectedWord.word}” means ${selectedWord.meaning}. Pronunciation: ${selectedWord.pronunciation}. Example: ${selectedWord.examples[0]}. Synonyms: ${selectedWord.synonyms.join(", ")}.`;
  };

  const handleWordChatSend = () => {
    if (!selectedWord) return;
    const question = wordChatInput.trim();
    if (!question) return;

    const userMessage: WordChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
    };

    setWordChatMessages((prev) => [...prev, userMessage]);
    setWordChatInput("");

    const botResponse = generateWordChatResponse(question);
    const botMessage: WordChatMessage = {
      id: `bot-${Date.now()}`,
      role: "bot",
      content: botResponse,
    };

    setTimeout(() => {
      setWordChatMessages((prev) => [...prev, botMessage]);
    }, 250);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
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
        <div className="space-y-6 text-gray-800">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-800">{selectedWord.word}</h2>
                <p className="text-lg text-gray-600 mt-2 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  {selectedWord.pronunciation}
                </p>
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
                    Saved to Bank
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-5 h-5" />
                    Add to Word Bank
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Meaning
                </h3>
                <p className="text-lg text-gray-700">{selectedWord.meaning}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Example Sentences
                </h3>
                <div className="space-y-2 text-gray-700">
                  {selectedWord.examples.map((example, index) => (
                    <p key={index}>• {example}</p>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Synonyms
                  </h3>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    {selectedWord.synonyms.map((synonym, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Topics
                  </h3>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    {selectedWord.topics.map((topic, index) => (
                      <span key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ask about {selectedWord.word}</h3>
            <div className="space-y-4 mb-4">
              {wordChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-3xl p-4 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white self-end ml-auto"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={wordChatInput}
                onChange={(e) => setWordChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleWordChatSend();
                  }
                }}
                placeholder={`Ask about ${selectedWord.word} (meaning, example, synonym...)`}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-4 focus:border-blue-500 focus:outline-none text-lg"
              />
              <button
                onClick={handleWordChatSend}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-medium hover:shadow-lg transition-shadow"
              >
                Ask
              </button>
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
