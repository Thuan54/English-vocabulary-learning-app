import { Lightbulb, Tag, ArrowRight, User, Bot } from 'lucide-react';
import WordCard from './WordCard';
import { ChatMessage, RelatedWordData } from '../../types/related';

type Props = {
  msg: ChatMessage;
  isWordSaved: (word: string) => boolean;
  handleAddWord: (wd: RelatedWordData) => void;
  handleTopicClick: (topic: string) => void;
};

export function MessageBubble({ msg, isWordSaved, handleAddWord, handleTopicClick }: Props) {
  return (
    <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.role === 'bot' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`max-w-[75%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-white shadow-lg border border-gray-200'}`}>
        <p className={`text-base leading-relaxed ${msg.role === 'bot' ? 'text-gray-700' : ''}`}>{msg.content}</p>

        {msg.words && msg.words.length > 0 && (
          <div className="mt-4 space-y-3">
            {msg.words.map((w: any, index: number) => (
              <WordCard key={index} w={w} isSaved={isWordSaved(w.word)} onAdd={handleAddWord} />
            ))}
          </div>
        )}

        {msg.relatedTopics && msg.relatedTopics.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Related Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {msg.relatedTopics.map((topic: string, index: number) => (
                <button key={index} onClick={() => handleTopicClick(topic)} className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full font-medium transition-colors inline-flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {topic}
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {msg.role === 'user' && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
