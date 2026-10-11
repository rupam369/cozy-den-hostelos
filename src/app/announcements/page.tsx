'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Megaphone, Plus, Bell, Calendar, Tag, AlertTriangle, ShieldCheck, Sparkles, Send } from 'lucide-react';

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
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
                Official Digital Bulletin
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] text-emerald-300 font-bold">
                Realtime Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Hostel Announcements &amp; Memos
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Verified notices from the Chief Warden, Mess Manager, Facility Leads, and Faculty Mentors.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Memo</span>
          </button>
        </div>
      </div>

      {/* New Memo Form Drawer */}
      {isFormOpen && (
        <div className="rounded-3xl border border-white/15 bg-slate-900/90 p-6 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-blue-400" />
            <span>Publish Official Hostel Notice</span>
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notice Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Solar Water Heater Maintenance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Urgency Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="normal">Normal - General Update</option>
                  <option value="urgent">Urgent - Important Notice</option>
                  <option value="critical">Critical - Immediate Action</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Notice Content
              </label>
              <textarea
                rows={3}
                required
                placeholder="Provide detailed instructions or timeline..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-colors flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publish to Bulletin</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {announcements.map((ann) => {
          const priorityStyle = {
            normal: 'border-white/10 bg-slate-900/60',
            urgent: 'border-amber-500/40 bg-amber-950/20',
            critical: 'border-rose-500/50 bg-rose-950/30 ring-1 ring-rose-500/40',
          }[ann.priority];

          const priorityBadge = {
            normal: 'bg-white/10 text-slate-300',
            urgent: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
            critical: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold',
          }[ann.priority];

          return (
            <div
              key={ann.id}
              className={`rounded-3xl border p-6 backdrop-blur-xl shadow-xl space-y-3 transition-all hover:scale-[1.01] ${priorityStyle}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase font-semibold ${priorityBadge}`}>
                  {ann.priority}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{ann.created_at.slice(0, 10)}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{ann.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">{ann.author_name}</span>
                  <span className="text-[10px] text-blue-400">{ann.author_role}</span>
                </div>
                {ann.tags && ann.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-slate-500" />
                    <span className="text-[10px] text-slate-400">{ann.tags.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
