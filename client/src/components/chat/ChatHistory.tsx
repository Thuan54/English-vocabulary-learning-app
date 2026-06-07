import { MessageSquare } from 'lucide-react';
import { MarkdownContent } from '../pdfReader/MarkdownContent';

export type ChatMessage = { id: string; role: 'user' | 'bot'; content: string };

interface Props {
  history: ChatMessage[];
  isLoading: boolean;
  historyScrollRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatHistory({ history, isLoading, historyScrollRef }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="rounded-2xl bg-gray-50 p-4 mb-4">
          <MessageSquare className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Highlight & Ask</h3>
        <p className="text-xs text-gray-400 leading-relaxed">Select any part of the paper to ask specific questions</p>
        <div className="mt-6 text-xs text-gray-400 italic">
          Try asking "What's the intuition behind this section?"
        </div>
      </div>
    );
  }

  return (
    <div ref={historyScrollRef} className="flex-1 overflow-y-auto px-4 py-4 min-h-0 space-y-3">
      {history.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${
            msg.role === 'user'
              ? 'bg-gray-900 text-white rounded-br-md'
              : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-md'
          }`}>
            {msg.role === 'bot' ? (
              <MarkdownContent content={msg.content} />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}