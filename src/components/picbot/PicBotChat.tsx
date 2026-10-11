'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Image as ImageIcon, 
  Trash2, 
  Calendar, 
  MapPin, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import Image from 'next/image';
import { PicBotChatMessage, PicBotMemory } from '@/types';
import { parsePicBotNaturalQuery } from '@/lib/picbotEngine';
import { sound } from '@/lib/sound';

interface Props {
  onSelectMemoryForLightbox: (memory: PicBotMemory) => void;
}

export default function PicBotChat({ onSelectMemoryForLightbox }: Props) {
  const { currentUser, picBotMemories, recordPicBotSearch } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: PicBotChatMessage = {
    id: 'msg-init',
    sender: 'bot',
    text: `Hello ${currentUser.full_name}! 👋 I am DreamCast PicBot, your personal AI hostel memory search engine. You never have to scroll through thousands of gallery photos again. Ask me anything, or tap a suggestion below!`,
    timestamp: '10:00 AM',
    metaBadge: 'AI Memory Assistant',
  };

  const [messages, setMessages] = useState<PicBotChatMessage[]>([initialGreeting]);

  const quickPrompts = [
    'Show my hostel memories',
    'Find my cricket photos',
    'Show photos with my roommate',
    'Diwali terrace memories',
    'Mess food diaries',
    'Memories from 2024',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendQuery = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    sound.playClick();

    const userMsg: PicBotChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const parsed = parsePicBotNaturalQuery(
        q,
        picBotMemories,
        currentUser.full_name,
        'Kabir Bedi'
      );

      const botMsg: PicBotChatMessage = {
        id: `msg-b-${Date.now()}`,
        sender: 'bot',
        text: parsed.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        results: parsed.results,
        metaBadge: parsed.metaBadge,
      };

      recordPicBotSearch(q, parsed.results.length);
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
      sound.playChime();
    }, 550);
  };

  const clearChat = () => {
    sound.playClick();
    setMessages([initialGreeting]);
  };

  return (
    <div className="flex flex-col h-[600px] rounded-3xl border border-white/15 bg-slate-950/90 shadow-2xl backdrop-blur-2xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/80">
              <Bot className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white tracking-wide">DreamCast PicBot AI</h4>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.2 text-[9px] font-bold text-emerald-300">
                Online
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Natural Language Face Search &amp; Vector Indexer</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
          title="Reset Conversation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-lg backdrop-blur-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                  : 'border border-white/10 bg-slate-900/80 text-slate-100 rounded-tl-none'
              }`}
            >
              {/* Header Badge */}
              {msg.metaBadge && (
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>{msg.metaBadge}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>

              {/* Inline Matched Memories Preview Grid */}
              {msg.results && msg.results.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <ImageIcon className="h-3 w-3 text-cyan-400" />
                    <span>Matched Memories ({msg.results.length})</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {msg.results.slice(0, 6).map((mem) => (
                      <div
                        key={mem.id}
                        onClick={() => onSelectMemoryForLightbox(mem)}
                        className="group relative h-28 rounded-xl overflow-hidden border border-white/15 cursor-pointer shadow-md transition-all hover:scale-105 hover:border-blue-400"
                      >
                        <Image
                          src={mem.image_url}
                          alt={mem.event}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

                        {/* Confidence Badge */}
                        <div className="absolute top-1.5 right-1.5 rounded-full bg-emerald-500/90 px-1.5 py-0.2 text-[9px] font-black text-slate-950 shadow">
                          {mem.match_confidence || 98.5}%
                        </div>

                        {/* Title caption overlay */}
                        <div className="absolute bottom-1.5 inset-x-1.5">
                          <p className="text-[10px] font-bold text-white truncate">{mem.event}</p>
                          <p className="text-[8px] text-slate-300 truncate">{mem.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {msg.results.length > 6 && (
                    <p className="text-[10px] text-blue-300 font-medium text-center pt-1">
                      + {msg.results.length - 6} more memories displayed in gallery below
                    </p>
                  )}
                </div>
              )}

              <span className="block text-[9px] text-slate-400 text-right mt-1.5 font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2.5 text-slate-300 text-xs pl-2 animate-in fade-in duration-200">
            <div className="relative h-8 w-8 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                <Bot className="h-4 w-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900/90 via-blue-950/70 to-slate-900/90 px-4 py-2.5 shadow-xl backdrop-blur-xl">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.3s]" />
              </span>
              <span className="text-xs font-semibold bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                Searching your COZY DEN memories...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/40 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Ask:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(prompt)}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-white/10 hover:border-blue-500/30 whitespace-nowrap transition-all shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Box */}
      <div className="p-3 bg-slate-900/80 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="E.g., 'Find my cricket photos' or 'Show photos with my roommate'..."
            className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition-all disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
