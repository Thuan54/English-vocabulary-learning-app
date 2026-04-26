import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bot,
  User,
  BookmarkPlus,
  Check,
  Sparkles,
  Send,
  Tag,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useVocabulary, Word } from "../contexts/VocabularyContext";

// Mock topic → related words database
const topicDatabase: {
  [topic: string]: {
    description: string;
    words: {
      word: string;
      meaning: string;
      pronunciation: string;
      synonyms: string[];
      example: string;
    }[];
    relatedTopics: string[];
  };
} = {
  "character": {
    description: "Words related to personality traits and moral qualities that describe who a person is.",
    words: [
      { word: "Tenacious", meaning: "Tending to keep a firm hold of something; persistent", pronunciation: "/təˈneɪʃəs/", synonyms: ["persistent", "determined", "resolute"], example: "She was tenacious in her pursuit of excellence." },
      { word: "Benevolent", meaning: "Well meaning and kindly; showing goodwill", pronunciation: "/bəˈnevələnt/", synonyms: ["kind", "generous", "compassionate"], example: "The benevolent ruler was loved by all citizens." },
      { word: "Resilient", meaning: "Able to recover quickly from difficult conditions", pronunciation: "/rɪˈzɪliənt/", synonyms: ["tough", "adaptable", "hardy"], example: "Children are remarkably resilient and can adapt to change." },
      { word: "Pragmatic", meaning: "Dealing with things sensibly and realistically", pronunciation: "/præɡˈmætɪk/", synonyms: ["practical", "realistic", "sensible"], example: "She took a pragmatic approach to solving the problem." },
    ],
    relatedTopics: ["determination", "kindness", "leadership"],
  },
  "determination": {
    description: "Words that express firmness of purpose and the drive to achieve goals.",
    words: [
      { word: "Tenacious", meaning: "Tending to keep a firm hold of something; persistent", pronunciation: "/təˈneɪʃəs/", synonyms: ["persistent", "determined", "steadfast"], example: "She was tenacious in her pursuit of excellence." },
      { word: "Steadfast", meaning: "Resolutely or dutifully firm and unwavering", pronunciation: "/ˈstɛdfæst/", synonyms: ["loyal", "faithful", "committed"], example: "He remained steadfast in his beliefs despite opposition." },
      { word: "Indefatigable", meaning: "Persisting tirelessly; untiring", pronunciation: "/ˌɪndɪˈfætɪɡəbəl/", synonyms: ["tireless", "unrelenting", "unwearied"], example: "Her indefatigable efforts finally paid off." },
      { word: "Persevering", meaning: "Continuing in a course of action despite difficulty", pronunciation: "/ˌpɜːrsɪˈvɪərɪŋ/", synonyms: ["persistent", "determined", "tenacious"], example: "The persevering student eventually mastered the language." },
    ],
    relatedTopics: ["character", "goals", "courage"],
  },
  "kindness": {
    description: "Words that describe acts of goodwill, compassion, and generosity toward others.",
    words: [
      { word: "Benevolent", meaning: "Well meaning and kindly; showing goodwill", pronunciation: "/bəˈnevələnt/", synonyms: ["kind", "generous", "charitable"], example: "She made a benevolent donation to the charity." },
      { word: "Compassionate", meaning: "Feeling or showing sympathy and concern for others", pronunciation: "/kəmˈpæʃənət/", synonyms: ["empathetic", "caring", "tender"], example: "The compassionate nurse cared for every patient." },
      { word: "Altruistic", meaning: "Showing selfless concern for the well-being of others", pronunciation: "/ˌæltruˈɪstɪk/", synonyms: ["selfless", "generous", "charitable"], example: "Her altruistic nature led her to volunteer every weekend." },
      { word: "Magnanimous", meaning: "Very generous or forgiving, especially toward rivals", pronunciation: "/mæɡˈnænɪməs/", synonyms: ["generous", "forgiving", "noble"], example: "He was magnanimous in victory, praising his opponent." },
    ],
    relatedTopics: ["character", "emotions", "relationships"],
  },
  "communication": {
    description: "Words related to the exchange of information, ideas, and feelings.",
    words: [
      { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing", pronunciation: "/ˈɛləkwənt/", synonyms: ["articulate", "fluent", "persuasive"], example: "The speaker gave an eloquent speech about climate change." },
      { word: "Articulate", meaning: "Able to express ideas clearly and effectively", pronunciation: "/ɑːrˈtɪkjələt/", synonyms: ["expressive", "fluent", "coherent"], example: "She was remarkably articulate for her age." },
      { word: "Persuasive", meaning: "Good at convincing someone to do or believe something", pronunciation: "/pərˈsweɪsɪv/", synonyms: ["convincing", "compelling", "influential"], example: "His persuasive argument won over the jury." },
      { word: "Lucid", meaning: "Expressed clearly; easy to understand", pronunciation: "/ˈluːsɪd/", synonyms: ["clear", "coherent", "intelligible"], example: "She gave a lucid explanation of the complex theory." },
    ],
    relatedTopics: ["skills", "writing", "character"],
  },
  "description": {
    description: "Words used to vividly depict or characterize people, places, and things.",
    words: [
      { word: "Ubiquitous", meaning: "Present, appearing, or found everywhere", pronunciation: "/juːˈbɪkwɪtəs/", synonyms: ["omnipresent", "pervasive", "universal"], example: "Smartphones have become ubiquitous in modern society." },
      { word: "Ephemeral", meaning: "Lasting for a very short time", pronunciation: "/ɪˈfɛmərəl/", synonyms: ["fleeting", "transient", "momentary"], example: "The ephemeral beauty of cherry blossoms attracts millions." },
      { word: "Pristine", meaning: "In its original condition; unspoiled", pronunciation: "/ˈprɪstiːn/", synonyms: ["unspoiled", "immaculate", "flawless"], example: "The pristine beach was untouched by tourism." },
      { word: "Vivid", meaning: "Producing powerful feelings or clear images in the mind", pronunciation: "/ˈvɪvɪd/", synonyms: ["striking", "graphic", "intense"], example: "She gave a vivid description of the sunset." },
    ],
    relatedTopics: ["nature", "common", "writing"],
  },
  "skills": {
    description: "Words describing abilities, competencies, and ways of thinking.",
    words: [
      { word: "Adept", meaning: "Very skilled or proficient at something", pronunciation: "/əˈdɛpt/", synonyms: ["skilled", "proficient", "expert"], example: "She is adept at solving complex puzzles." },
      { word: "Astute", meaning: "Having an ability to accurately assess situations", pronunciation: "/əˈstjuːt/", synonyms: ["shrewd", "perceptive", "sharp"], example: "The astute investor spotted the trend early." },
      { word: "Methodical", meaning: "Done according to a systematic or established procedure", pronunciation: "/məˈθɒdɪkəl/", synonyms: ["systematic", "organized", "structured"], example: "His methodical approach ensured no detail was missed." },
      { word: "Versatile", meaning: "Able to adapt or be adapted to many different functions", pronunciation: "/ˈvɜːrsətaɪl/", synonyms: ["adaptable", "flexible", "multifaceted"], example: "She is a versatile musician who plays five instruments." },
    ],
    relatedTopics: ["communication", "character", "learning"],
  },
};

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  words?: {
    word: string;
    meaning: string;
    pronunciation: string;
    synonyms: string[];
    example: string;
  }[];
  relatedTopics?: string[];
  topic?: string;
}

// Add this interface near the top, after ChatMessage
interface WordData {
  word: string;
  meaning: string;
  pronunciation: string;
  synonyms: string[];
  example: string;
}

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

  const handleAddWord = (wordData: WordData ) => {
    if (!wordData || isWordSaved(wordData.word)) return;
    const newWord: Word = {
      id: Date.now().toString(),
      word: wordData.word,
      meaning: wordData.meaning,
      pronunciation: wordData.pronunciation,
      examples: [wordData.example],
      synonyms: wordData.synonyms,
      topics: [],
      category: "want-to-learn",
      addedDate: new Date(),
      reviewCount: 0,
    };
    addWord(newWord);
  };

  const handleSend = () => {
    const term = inputValue.toLowerCase().trim();
    if (!term) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Find matching topic
    const matchedTopic = Object.keys(topicDatabase).find(
      (key) =>
        key === term ||
        term.includes(key) ||
        key.includes(term)
    );

    setTimeout(() => {
      let botMessage: ChatMessage;

      if (matchedTopic) {
        const data = topicDatabase[matchedTopic];
        botMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: `Here are the words related to **${matchedTopic}**. ${data.description}`,
          words: data.words,
          relatedTopics: data.relatedTopics,
          topic: matchedTopic,
        };
      } else {
        // Suggest available topics
        const available = Object.keys(topicDatabase);
        botMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: `I couldn't find a topic matching "${term}". Here are some topics you can explore:`,
          relatedTopics: available,
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleTopicClick = (topic: string) => {
    setInputValue(topic);
    // Auto-search
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: topic,
    };

    setMessages((prev) => [...prev, userMessage]);

    const data = topicDatabase[topic];
    if (data) {
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: `Here are the words related to **${topic}**. ${data.description}`,
          words: data.words,
          relatedTopics: data.relatedTopics,
          topic,
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 500);
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
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Bot avatar */}
              {msg.role === "bot" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl p-5 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-white shadow-lg border border-gray-200"
                }`}
              >
                {/* Text content */}
                <p className={`text-base leading-relaxed ${msg.role === "bot" ? "text-gray-700" : ""}`}>
                  {msg.content}
                </p>

                {/* Word cards */}
                {msg.words && msg.words.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {msg.words.map((w, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-800">{w.word}</span>
                              <span className="text-sm text-gray-500">{w.pronunciation}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{w.meaning}</p>
                            <p className="text-gray-500 text-sm mt-2 italic">&ldquo;{w.example}&rdquo;</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {w.synonyms.map((syn, i) => (
                                <span key={i} className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {syn}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddWord(w)}
                            disabled={isWordSaved(w.word)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                              isWordSaved(w.word)
                                ? "bg-green-100 text-green-700"
                                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
                            }`}
                          >
                            {isWordSaved(w.word) ? (
                              <>
                                <Check className="w-4 h-4" />
                                Saved
                              </>
                            ) : (
                              <>
                                <BookmarkPlus className="w-4 h-4" />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Related topics */}
                {msg.relatedTopics && msg.relatedTopics.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                        Related Topics
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.relatedTopics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => handleTopicClick(topic)}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full font-medium transition-colors inline-flex items-center gap-1.5"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          {topic}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a topic (e.g. character, kindness, communication...)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
          <button
            onClick={handleSend}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow inline-flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}