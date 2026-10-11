'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Megaphone, Plus, Bell, Calendar, Tag, AlertTriangle, ShieldCheck, Sparkles, Send, DoorOpen } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement, currentUser } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'critical'>('normal');
  const [tagInput, setTagInput] = useState('Notice');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    sound.playClick();

    addAnnouncement({
      title,
      content,
      author_name: currentUser.full_name,
      author_role: currentUser.position,
      priority,
      tags: [tagInput.trim() || 'General'],
    });

    setTitle('');
    setContent('');
    setIsFormOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
      
      {/* Header */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Hostel Entrance • Digital Bulletin
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Official Campus Announcements
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Official notices, schedule updates, and emergency directives directly from Head Warden 
              Dr. Anita Desai, Facility Managers, and Student Floor Representatives.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsFormOpen(!isFormOpen);
            }}
            className="flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-400 px-6 py-3 text-xs font-bold text-slate-950 shadow-xl shadow-amber-500/20 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{isFormOpen ? 'Close Form' : 'Post Official Notice'}</span>
          </button>
        </div>
      </section>

      {/* Creation Drawer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="vision-glass-warm rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-white">Broadcast New Notice</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Saturday Rooftop Jam & Acoustic Evening"
                className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Category Tag</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. Culture, WiFi, Examination"
                className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
              />
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-medium">Content / Details</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Full details of the announcement..."
              className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
              required
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Urgency:</span>
              {(['normal', 'urgent', 'critical'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize transition-all ${
                    priority === p
                      ? p === 'critical' ? 'bg-rose-600 text-white' : p === 'urgent' ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white'
                      : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="rounded-full bg-amber-500 hover:bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-lg"
            >
              Publish to Bulletin
            </button>
          </div>
        </form>
      )}

      {/* Announcements Stream */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((a) => (
            <div key={a.id} className="vision-glass rounded-3xl p-6 sm:p-7 space-y-4 hover:border-white/[0.15] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/[0.08] px-3 py-0.5 text-[11px] text-slate-300 font-medium">
                    {a.tags?.[0] || 'Notice'}
                  </span>
                  {a.priority !== 'normal' && (
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      a.priority === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {a.priority}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">{a.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {a.content}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-light">
                <span>By {a.author_name}</span>
                <span className="text-amber-400/90 font-medium">{a.author_role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
