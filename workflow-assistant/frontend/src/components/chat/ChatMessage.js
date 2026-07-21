import React from 'react';

export default function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end gap-2 max-w-2xl ml-auto">
        <div className="bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm leading-relaxed max-w-lg">
          {msg.text}
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
          {msg.initials || 'U'}
        </div>
      </div>
    );
  }

  if (msg.isTyping) {
    return (
      <div className="flex gap-2 items-end max-w-2xl">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">WA</div>
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex gap-1 items-center h-4">
            <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
            <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
            <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start max-w-2xl">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">WA</div>
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed text-gray-800 flex-1 min-w-0">
        <div className="text-xs text-gray-400 font-medium mb-1.5">WorkFlow Assistant</div>
        <div dangerouslySetInnerHTML={{ __html: msg.html || msg.text }} />
      </div>
    </div>
  );
}
