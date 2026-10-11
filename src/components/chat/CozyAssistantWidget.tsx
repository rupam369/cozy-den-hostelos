'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  Send,
  X,
  Sparkles,
  HelpCircle,
  PhoneCall,
  UtensilsCrossed,
  FileText,
  ShieldAlert,
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { getCurrentMealStatus } from '@/lib/utils';
import { MealType } from '@/types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  chips?: string[];
}

export default function CozyAssistantWidget({ isFullPage = false }: { isFullPage?: boolean }) {
  const { complaints, healthScores, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(isFullPage);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [mealStatus, setMealStatus] = useState<{ current: MealType; status: 'active' | 'upcoming'; nextTime: string }>({
    current: 'Lunch',
    status: 'active',
    nextTime: 'Ends at 2:00 PM',
  });

  useEffect(() => {
    setMealStatus(getCurrentMealStatus());
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${currentUser.full_name}! 👋 I'm Cozy Assistant, your 24/7 AI hostel intelligence. How can I assist you with your Cozy Den experience today?`,
      time: 'Just now',
      chips: [
        '🍽️ Today\'s Food Timings',
        '📜 Hostel Rules & Curfew',
        '🚨 Emergency Help SOS',
        '⚡ Open Complaints Status',
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate intelligent response
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('food') || q.includes('timing') || q.includes('meal') || q.includes('breakfast') || q.includes('lunch') || q.includes('dinner')) {
        reply = `🍽️ **Today's Cozy Den Meal Schedule**:\n\n• **Breakfast**: 9:00 AM – 9:30 AM (Masala Dosa, Idli, Boiled Eggs, Filter Coffee)\n• **Lunch**: 1:00 PM – 2:00 PM (Paneer Makhani, Dal Tadka, Naan, Gulab Jamun)\n• **High Tea**: 6:00 PM – 6:30 PM (Pakoras, Samosa, Kadak Chai)\n• **Dinner**: 8:00 PM – 9:00 PM (Kadai Paneer, Phulka, Moong Dal Halwa)\n\n📍 *Current Status*: ${mealStatus.current} is ${mealStatus.status} (${mealStatus.nextTime})!`;
      } else if (q.includes('rule') || q.includes('curfew') || q.includes('gate') || q.includes('entry')) {
        reply = `📜 **Cozy Den Hostel Rules & Curfew**:\n\n1. **Night Curfew**: 10:30 PM sharp via biometric smart gates on Ground Floor.\n2. **Quiet Study Hours**: 10:00 PM – 6:00 AM across all corridors & rooms.\n3. **Visitors**: Permitted in the Ground Floor Lounge until 8:00 PM.\n4. **Sky Terrace**: Open till 11:00 PM for acoustic sessions and stargazing.\n5. **Late Passes**: Apply via your student dashboard at least 2 hours in advance.`;
      } else if (q.includes('emergency') || q.includes('sos') || q.includes('doctor') || q.includes('medical') || q.includes('warden')) {
        reply = `🚨 **Emergency Assistance & Safe Harbor**:\n\n• **Campus Medical SOS**: +91 99887 76655 (24/7 Ambulance & First Aid)\n• **Chief Warden (Dr. Anita Desai)**: +91 98765 11223 (Cabin: Ground Floor, Wing A)\n• **Electrical & Fire Control**: Ext: 108\n• **Night Security Desk**: Ext: 101\n\nIf someone is unwell, the First Aid room is on Floor 0 next to the Reception.`;
      } else if (q.includes('complaint') || q.includes('wifi') || q.includes('water') || q.includes('issue')) {
        const activeCount = complaints.filter(c => c.status !== 'Resolved').length;
        reply = `⚡ **Complaints & Grievance Radar**:\n\nCurrently, there are **${activeCount} active complaints** in Cozy Den. Our smart 48-hour escalation system ensures issues are resolved swiftly.\n\n• Overall Hostel Health Score is **${healthScores.overall}/100**.\n• WiFi Health: **${healthScores.wifi}%**\n• Water Health: **${healthScores.water}%**\n\nYou can click the **Log Grievance** button on your dashboard to submit an issue with photos or anonymous reporting!`;
      } else if (q.includes('announcement') || q.includes('notice') || q.includes('event')) {
        reply = `📢 **Latest Hostel Announcements**:\n\n1. **Fiber WiFi Upgrade**: 1 Gbps Mesh access points now active on all floors.\n2. **Saturday Rooftop BBQ**: Sky Terrace acoustic jam this Saturday at 7:30 PM!\n3. **Exam Quiet Hours**: Strictly enforced 10 PM - 6 AM.`;
      } else {
        reply = `I'm happy to help with anything regarding Cozy Den! You can ask me about:\n\n• **Food Schedule & Today's Menu**\n• **Curfew & Hostel Living Rules**\n• **Submitting or tracking a Complaint**\n• **Latest Announcements**\n• **Emergency Medical / Warden SOS Contacts**`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  // If used as embedded full page
  if (isFullPage) {
    return (
      <div className="w-full h-[680px] rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Cozy Assistant</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Hostel Intelligence & Support Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>AI Knowledge Base v2.4</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${m.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'border border-white/10 bg-white/5 text-slate-200 backdrop-blur-md whitespace-pre-wrap'
                  }`}
              >
                {m.text}
              </div>
              <span className="mt-1 text-[10px] text-slate-500 px-1">{m.time}</span>

              {/* Quick Chips */}
              {m.chips && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.chips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-all shadow-sm"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span>Cozy Assistant is synthesizing hostel records...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/10 p-4 bg-slate-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about hostel rules, mess schedule, complaints, WiFi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Floating Widget Mode
  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 p-0.5 shadow-2xl shadow-purple-500/30 hover:scale-110 transition-all"
        >
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/80 backdrop-blur-md">
            <Bot className="h-6 w-6 text-purple-400 group-hover:text-white transition-colors" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 animate-pulse text-[9px] font-bold text-white" />
        </button>
      </div>

      {/* Floating Spatial Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] rounded-3xl border border-white/15 bg-slate-900/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Cozy Assistant</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-400">AI Hostel Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${m.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border border-white/10 bg-white/5 text-slate-200 whitespace-pre-wrap'
                    }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 text-[9px] text-slate-500 px-1">{m.time}</span>

                {m.chips && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="rounded-xl border border-purple-500/25 bg-purple-500/10 px-2.5 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-500/20 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                <span>Synthesizing response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-white/10 p-3 bg-slate-950/70">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about rules, food, complaints..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md disabled:opacity-50 hover:bg-purple-500 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
