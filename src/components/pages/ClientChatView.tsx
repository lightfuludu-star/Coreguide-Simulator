import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCheck,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ClientChatView: React.FC = () => {
  const { client, chatMessages, sendChatMessage, isClientTyping, currentDay, activeService } = useSimulation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCustomerService = activeService.id === 'customer_service';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isClientTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const quickQuestions = isCustomerService
    ? [
        `I am truly sorry about this mix-up! We are arranging an immediate fresh replacement with express courier right now.`,
        `I completely understand your frustration. Would you prefer an immediate replacement, or a full refund plus a $15 courtesy credit?`,
        `Could you confirm if there were any allergy concerns so I can flag this with our operations team immediately?`,
      ]
    : [
        `Hi ${client.ceoName.split(' ')[0]}, can you clarify what you need for Day ${currentDay}?`,
        `Do you have a preferred deadline time today?`,
        `I am preparing your deliverable right now!`,
      ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[560px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header: Familiar Professional Messenger Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={client.avatarUrl}
              alt={client.ceoName}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900">{client.ceoName}</h1>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isCustomerService
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {isCustomerService ? 'Live Customer Scenario' : 'Online'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {client.ceoRole} at <strong className="text-slate-700 font-semibold">{client.companyName}</strong>
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right text-xs text-slate-500">
          <span className="block font-medium text-slate-700">{client.workingHours}</span>
          <span>{client.timezone}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
        {/* Simple helper pill */}
        <div className="text-center my-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            isCustomerService
              ? 'bg-amber-100 text-amber-900 border border-amber-200'
              : 'bg-slate-200/70 text-slate-600'
          }`}>
            {isCustomerService
              ? `Real-Time Customer Support Simulator • Respond with empathy, de-escalation, and clear solutions`
              : `This is your direct message conversation with ${client.ceoName}`}
          </span>
        </div>

        {chatMessages.map((msg) => {
          const isStudent = msg.sender === 'student';
          return (
            <div
              key={msg.id}
              className={`flex items-end space-x-2.5 ${isStudent ? 'justify-end' : 'justify-start'}`}
            >
              {!isStudent && (
                <img
                  src={client.avatarUrl}
                  alt={client.ceoName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              )}

              <div
                className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isStudent
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="flex items-center justify-between space-x-3 mb-1">
                  <span className={`text-[10px] font-bold ${isStudent ? 'text-indigo-200' : 'text-indigo-600'}`}>
                    {isStudent ? 'You' : client.ceoName}
                  </span>
                  <span className={`text-[10px] ${isStudent ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {isStudent && (
                <div className="w-8 h-8 rounded-full bg-indigo-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  VA
                </div>
              )}
            </div>
          );
        })}

        {/* Client Typing Indicator */}
        {isClientTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 animate-pulse">
            <img
              src={client.avatarUrl}
              alt={client.ceoName}
              className="w-7 h-7 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center space-x-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping" />
              <span>{client.ceoName} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Subtle Quick Questions */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto shrink-0 flex items-center space-x-2">
        <span className="text-[11px] font-medium text-slate-400 shrink-0">
          Quick ask:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(q)}
            className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 px-3 py-1 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type a message to ${client.ceoName}...`}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
