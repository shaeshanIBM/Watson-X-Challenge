import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { processIntent } from './chatEngine';

const CHIPS_EMPLOYEE = [
  'Did I submit my hours this week?',
  'Forecast my hours for next week',
  'Add Independence Day to my timesheet',
  'Show my utilization this month',
  'Am I behind on training?',
  'Do I have a CV uploaded?',
];

const CHIPS_MANAGER = [
  'Who didn\'t submit time?',
  'Show team utilization',
  'Who has overdue mandatory training?',
  'Show upcoming vacations',
  'Which team members are underutilized?',
];

export default function ChatPanel({ currentUser }) {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [typing, setTyping]       = useState(false);
  const bottomRef                 = useRef(null);

  // Initial greeting
  useEffect(() => {
    const initHtml = currentUser.isManager
      ? `<p>👋 Welcome back, <strong>${currentUser.name}</strong> (Manager)! I've loaded your team dashboard. You have <strong>5 priority alerts</strong> requiring attention today.</p>`
      : `<p>👋 Good morning, <strong>${currentUser.name}</strong>! I'm your <strong>WorkFlow Assistant</strong> — connected to Time@IBM, MyLearning, SuccessFactors, and MySA.</p>
         <div class="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3 text-red-800 text-sm font-medium">🚨 Today's Priority Alerts</div>
         <ul class="text-sm mt-2 space-y-1">
           <li><span class="bg-red-100 text-red-800 text-xs font-semibold px-1.5 py-0.5 rounded mr-1">High</span><strong>Timesheet not submitted</strong> — Week of Jun 23 (due today)</li>
           <li><span class="bg-red-100 text-red-800 text-xs font-semibold px-1.5 py-0.5 rounded mr-1">High</span><strong>2 mandatory trainings overdue</strong> — Data Privacy, Security Awareness</li>
           <li><span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-1.5 py-0.5 rounded mr-1">Med</span><strong>CV missing</strong> in SuccessFactors</li>
           <li><span class="bg-green-100 text-green-800 text-xs font-semibold px-1.5 py-0.5 rounded mr-1">Low</span>Utilization this week: 34h / 40h (85%)</li>
         </ul>
         <p class="text-sm text-gray-500 mt-3">How can I help you today?</p>`;

    setMessages([{ id: 1, role: 'bot', html: initHtml }]);
  }, [currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg, initials: currentUser.initials };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const response = processIntent(msg, currentUser);
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', html: response.html }]);
    }, 700 + Math.random() * 400);
  };

  const chips = currentUser.isManager ? CHIPS_MANAGER : CHIPS_EMPLOYEE;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
        {messages.map(m => <ChatMessage key={m.id} msg={m} />)}
        {typing && <ChatMessage msg={{ id: 'typing', role: 'bot', isTyping: true }} />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-6 pt-2 pb-1 flex flex-wrap gap-2">
        {chips.map(chip => (
          <button
            key={chip}
            onClick={() => send(chip)}
            className="bg-white border border-gray-300 rounded-full px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 pb-5 pt-2 bg-white border-t border-gray-200 flex gap-3">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-sans"
          placeholder="Ask WorkFlow Assistant anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button
          onClick={() => send()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
