import { useState } from "react";
import { Word } from "../types/review";
import { addWordAPI, fetchWordSearch } from "../api/vocabulary.api";
import { chatWithAi } from "../api/ai.api"; // Note: Ensure this function exists in your API file
import SearchBar from "../components/search/SearchBar";
import AiExplanation, { ChatMessage } from "../components/search/AiExplanation";
import WordDetails from "../components/search/WordDetails";

export function VocabularySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWord, setSelectedWord] = useState<Omit<Word,"wordId"> | null>(null);
  
  // AI Chat State
  const [searchedWord, setSearchedWord] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  
  const [lookupError, setLookupError] = useState("");

  const clearAiState = () => {
    setChatHistory([]);
    setChatInput("");
    setIsChatLoading(false);
    setSearchedWord("");
    setIsAiChatOpen(false);
  };

  const handleDictionarySearch = async () => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setSelectedWord(null);
      setLookupError("");
      clearAiState();
      return;
    }

    // Clean out AI session if searching a different word
    if (term !== searchedWord) {
      clearAiState();
    }

    setLookupError("");
    try {
      const result = await fetchWordSearch(term);
      setSelectedWord(result);
    } catch (error) {
      setSelectedWord(null);
      setLookupError(error instanceof Error ? error.message : "Failed to fetch word details.");
    }
  };

  const handleSendMessage = async (content: string, wordContext?: string) => {
    const currentWord = wordContext || searchedWord;
    if (!currentWord) return;
    
    const userMessage: ChatMessage = { role: 'user', content };
    const newHistory = [...chatHistory, userMessage];
    
    setChatHistory(newHistory);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Pass the word context and the full history to maintain conversation flow
      const response = await chatWithAi(currentWord, newHistory);
      const aiMessage: ChatMessage = { role: 'assistant', content: response };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: "Sorry, I encountered an error connecting to the AI. Please try again." 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAskAi = () => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return;

    let isNewWord = false;
    if (term !== searchedWord) {
      clearAiState();
      setSearchedWord(term);
      isNewWord = true;
    }
    
    setIsAiChatOpen(true);
    
    // Auto-send an initial prompt if starting a fresh chat for this word
    if (isNewWord || chatHistory.length === 0) {
      handleSendMessage(
        `Can you explain the word "${term}"? Include its meaning, pronunciation, and some example sentences.`, 
        term
      );
    }
  };

  const handleAddWord = () => {
    if (selectedWord) {
      const newWord = {word: selectedWord.word, meaning: selectedWord.meaning};
      addWordAPI(newWord.word,newWord.meaning);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleDictionarySearch();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex gap-8 items-start">
      {/* Left Column: Search & Dictionary Results */}
      <div className="flex-1 min-w-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover New Words</h1>
          <p className="text-gray-600">Search for words and expand your vocabulary</p>
        </div>

        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          onKeyPress={handleKeyPress} 
          onDictionarySearch={handleDictionarySearch}
          onAskAi={handleAskAi}
        />

        {lookupError && (
          <div className="bg-red-50 text-red-700 rounded-2xl shadow-sm p-4 mb-6 border border-red-200 text-center">
            {lookupError}
          </div>
        )}

        {selectedWord && (
          <WordDetails selectedWord={selectedWord} onAdd={handleAddWord} />
        )}

        {selectedWord === null && searchedWord && !isAiChatOpen && (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No dictionary result found.</p>
          </div>
        )}
      </div>

      {/* Right Column: AI Chat Window */}
      {isAiChatOpen && (
        <div className="w-96 flex-shrink-0 sticky top-8">
          <AiExplanation 
            searchedWord={searchedWord}
            messages={chatHistory}
            isLoading={isChatLoading}
            onSendMessage={handleSendMessage}
            onClose={() => setIsAiChatOpen(false)}
            inputValue={chatInput}
            onInputChange={setChatInput}
          />
        </div>
      )}
    </div>
  );
}

export default VocabularySearch;