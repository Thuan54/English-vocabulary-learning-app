import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVocabulary } from "../contexts/VocabularyContext";
import { Word } from "../types/word";
import { ChatMessage, RelatedWordData, RelatedWordsResponse } from "../types/related";
import { fetchRelatedWords } from "../api/related.api";
import MessageBubble from "../components/related/MessageBubble";
import InputBar from "../components/related/InputBar";

export function RelatedWordsPage() {
  const { words, addWord } = useVocabulary();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Hi! I'm your word discovery assistant. Tell me a topic and I'll find all the related words for you. Try: character, determination, kindness, communication, description, or skills.",
    },
  ]);

  const isWordSaved = (word: string) =>
    words.some((w) => w.word.toLowerCase() === word.toLowerCase());

  const handleAddWord = (wordData: RelatedWordData) => {
    if (!wordData || isWordSaved(wordData.word)) return;
    const newWord: Word = {
      id: Date.now().toString(),
      word: wordData.word,
      meaning: wordData.meaning,
      pronunciation: wordData.pronunciation || "",
      examples: wordData.example ? [wordData.example] : [],
      synonyms: wordData.synonyms || [],
      topics: wordData.topics || [],
      category: "want-to-learn",
      addedDate: new Date(),
      reviewCount: 0,
    };
    addWord(newWord);
  };

  const handleSend = async () => {
    const term = inputValue.toLowerCase().trim();
    if (!term) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const data = await fetchRelatedWords(term);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: `Here are the words related to **${data.topic}**. ${data.description}`,
        words: data.words,
        relatedTopics: data.relatedTopics,
        topic: data.topic,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content:
          error instanceof Error
            ? `Unable to load related words: ${error.message}`
            : "Unable to load related words.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  const handleTopicClick = async (topic: string) => {
    setInputValue(topic);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: topic,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const data = await fetchRelatedWords(topic);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: `Here are the words related to **${data.topic}**. ${data.description}`,
        words: data.words,
        relatedTopics: data.relatedTopics,
        topic: data.topic,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content:
          error instanceof Error
            ? `Unable to load related words: ${error.message}`
            : "Unable to load related words.",
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Related Words</h1>
        <p className="text-gray-600">
          Chat with our word assistant to discover words by topic
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <MessageBubble msg={msg} isWordSaved={isWordSaved} handleAddWord={handleAddWord} handleTopicClick={handleTopicClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <InputBar inputValue={inputValue} onChange={setInputValue} onKeyPress={handleKeyPress} onSend={handleSend} />
    </div>
  );
}