'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithPortfolioAI } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatWidgetProps {
  portfolioIdOrSlug: string;
  candidateName?: string;
}

function formatMessageContent(content: string): string {
  if (!content) return '';
  return content
    .replace(/\*{2,3}(.*?)\*{2,3}/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*\*\s+/gm, '- ')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .trim();
}

export default function AIChatWidget({
  portfolioIdOrSlug,
  candidateName = 'the candidate',
}: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const firstName = candidateName.split(' ')[0] || candidateName;

  const suggestions = [
    `What are ${firstName}'s top technical skills?`,
    `Tell me about ${firstName}'s recent projects`,
    `What is ${firstName}'s work experience?`,
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Prepare history format
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await chatWithPortfolioAI(portfolioIdOrSlug, text, history);
      const assistantMsg: Message = { role: 'assistant', content: res.reply };
      setMessages([...updatedMessages, assistantMsg]);
    } catch (err) {
      console.error('Chat AI Error:', err);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Sorry, I ran into an issue fetching information. Please try asking again!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-4 w-[90vw] max-w-[420px] h-[520px] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100"
          >
            {/* Header */}
            <div className="p-4 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">
                    Ask AI about {firstName}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Portfolio AI Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
              {messages.length === 0 && (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Ask anything about {firstName}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
                    Get instant answers about work experience, skills, projects, and achievements.
                  </p>

                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block px-1">
                      Suggested Questions
                    </span>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all hover:border-slate-700"
                      >
                        💡 {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 px-4 text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white font-medium shadow-md rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-sm rounded-bl-none'
                    }`}
                  >
                    {m.role === 'assistant' ? formatMessageContent(m.content) : m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 px-4 text-xs text-slate-400 flex items-center gap-2 rounded-bl-none">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-slate-400 font-medium">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${firstName}'s background...`}
                disabled={loading}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors shadow-md shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-7-9-7-9 7 9 7zm0 0v-8" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3.5 rounded-full bg-slate-950 text-white border border-slate-800 shadow-2xl flex items-center gap-3 hover:border-slate-700 transition-all group"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500 animate-ping absolute opacity-75"></span>
            <span className="w-3 h-3 rounded-full bg-indigo-500 relative"></span>
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-200 group-hover:text-white">
            Ask AI
          </span>
        </motion.button>
      )}
    </div>
  );
}
