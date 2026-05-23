import { useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Sparkles, Send, Tag, Lightbulb, ArrowRight } from "lucide-react";
import { topicDatabase, type ChatMessage } from "./RelatedWordData";

export function RelatedWordChat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      content:
        "Hi! I'm your word discovery assistant. Tell me a topic and I'll find all the related words for you. Try: character, determination, kindness, communication, description, or skills.",
    },
  ]);


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

    const matchedTopic = Object.keys(topicDatabase).find(
      (key) => key === term || term.includes(key) || key.includes(term)
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

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Related Words</h1>
        <p className="text-gray-600">
          Chat with our word assistant to discover words by topic
        </p>
      </div>

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
                <p className={`text-base leading-relaxed ${msg.role === "bot" ? "text-gray-700" : ""}`}>
                  {msg.content}
                </p>

                {msg.words && msg.words.length > 0 && (
                  <div className="mt-4 text-sm text-gray-700">
                    <ul className="list-disc ml-5 space-y-2">
                      {msg.words.map((w, index) => (
                        <li key={index}>
                          <span className="font-semibold text-gray-800">{w.word}</span>: {w.meaning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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

              {msg.role === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
