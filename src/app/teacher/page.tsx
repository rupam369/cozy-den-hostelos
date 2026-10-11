'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  Bell, 
  Users, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Radio,
  Sparkles,
  Shield
} from 'lucide-react';
import { sound } from '@/lib/sound';

export default function TeacherDashboardPage() {
  const { complaints, currentUser, announcements, addAnnouncement } = useApp();
  const [memoTitle, setMemoTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');
  const [isPosted, setIsPosted] = useState(false);

  // Red alert complaints that require teacher/mentor awareness
  const escalatedComplaints = complaints.filter((c) => c.is_escalated && c.status !== 'Resolved');

  const handlePostMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoTitle.trim() || !memoContent.trim()) return;
    sound.playClick();

    addAnnouncement({
      title: memoTitle,
      content: memoContent,
      author_name: currentUser.full_name,
      author_role: currentUser.position || 'Faculty Advisor',
      priority: 'normal',
      tags: ['Academics', 'Mentorship'],
    });

    setIsPosted(true);
    setMemoTitle('');
    setMemoContent('');
    setTimeout(() => setIsPosted(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
      
      {/* Teacher / Warden Header */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Faculty &amp; Warden Mentorship Desk
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Academic Welfare &amp; Guidance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Logged in as <strong className="text-white font-semibold">{currentUser.full_name}</strong> ({currentUser.position}). 
              Guiding student floor representatives, quiet study hours compliance, and pastoral care.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300 font-medium">
              Academic Season: Mid-Terms
            </span>
          </div>
        </div>
      </section>

      {/* Critical 48h Escalations Feed */}
      {escalatedComplaints.length > 0 && (
        <section className="vision-glass rounded-3xl p-6 sm:p-8 border border-rose-500/30 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              Critical Overdue Complaints ({escalatedComplaints.length})
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-light">
            These student issues have remained unresolved past 48 hours and require immediate mentor/warden intervention.
          </p>

          <div className="space-y-3 pt-2">
            {escalatedComplaints.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-rose-300">{c.category}: {c.title}</span>
                  <p className="text-slate-300 text-[11px] font-light mt-0.5">{c.description}</p>
                </div>
                <div className="text-left sm:text-right text-[11px] text-slate-400 font-light shrink-0">
                  <div>Location: {c.location}</div>
                  <div className="text-rose-400 font-bold uppercase">48h Escalated</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Broadcast Academic Advisory */}
      <section className="vision-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white">Post Academic Memo or Guidance</h2>
          <p className="text-xs text-slate-400 font-light">Direct advisory broadcast to residents regarding quiet hours or study sessions.</p>
        </div>

        <form onSubmit={handlePostMemo} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Advisory Title</label>
            <input
              type="text"
              value={memoTitle}
              onChange={(e) => setMemoTitle(e.target.value)}
              placeholder="e.g. Quiet Hours Protocol: Mid-Term Examination Week"
              className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Guidance Details</label>
            <textarea
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              rows={3}
              placeholder="Quiet hours will be observed strictly from 10:00 PM across all resident corridors..."
              className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-amber-500 hover:bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-lg"
          >
            {isPosted ? '✓ Broadcasted to Residents' : 'Broadcast to Residents'}
          </button>
        </form>
      </section>

    </div>
  );
}
