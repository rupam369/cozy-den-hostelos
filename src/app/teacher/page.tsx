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
  Sparkles
} from 'lucide-react';

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
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      
      {/* Teacher / Warden Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-indigo-950/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
                Academic &amp; Student Welfare Portal
              </span>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] text-blue-300 font-bold">
                Faculty Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Faculty &amp; Floor Warden Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Welcome, <strong className="text-white">{currentUser.full_name}</strong> ({currentUser.position}). Overseeing academic environment and resident well-being.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-xs font-bold text-white">Student Welfare Index</p>
              <p className="text-[11px] text-emerald-400">96.8% Satisfied Living</p>
            </div>
          </div>
        </div>
      </div>

      {/* CRITICAL 48h ESCALATION NOTIFICATIONS (Teacher Alert) */}
      {escalatedComplaints.length > 0 && (
        <section className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="h-5 w-5" />
            <span>48-Hour Smart Escalation Alerts Delivered to Mentors</span>
          </div>
          <p className="text-xs text-rose-200">
            The following issues have been unaddressed by facility teams for &gt; 48 hours. Mentors and representatives have been automatically looped in:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {escalatedComplaints.map((comp) => (
              <div key={comp.id} className="rounded-2xl border border-rose-500/40 bg-slate-950/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                    {comp.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{comp.location}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{comp.title}</h4>
                <p className="text-[11px] text-slate-300 leading-snug">{comp.description}</p>
                <div className="pt-1 text-[10px] text-rose-400 font-semibold">
                  🚨 &quot;Students are facing this issue. Management attention required.&quot;
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CORE MENTOR METRICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Quiet Hours Protocol */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span>Quiet Study Hours Compliance</span>
            </h3>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Floor 1 Academic Hub and Library Pods are in Quiet Study Mode (10:00 PM – 6:00 AM).
            Decibel sensors report acoustic levels below 35 dB across all residential wings.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400 block mb-1">Upcoming Exam Schedule:</span>
            <strong>Mid-Term Final Exams: October 18 - 25</strong>
          </div>
        </div>

        {/* Card 2: Student Representatives Directory */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span>Student Representatives Roster</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <div>
                <strong className="text-white">Aryan Sharma</strong>
                <p className="text-[10px] text-slate-400">Room 304, Level 3</p>
              </div>
              <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300 font-semibold">
                Room Leader
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <div>
                <strong className="text-white">Meera Joshi</strong>
                <p className="text-[10px] text-slate-400">Room 201, Level 2</p>
              </div>
              <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300 font-semibold">
                Floor Rep
              </span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <strong className="text-white">Rohan Mehra</strong>
                <p className="text-[10px] text-slate-400">Ground Floor Lounge</p>
              </div>
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-semibold">
                Mess Rep
              </span>
            </li>
          </ul>
        </div>

        {/* Card 3: Post Mentor Announcement */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="h-4 w-4 text-emerald-400" />
            <span>Broadcast Mentor Memo</span>
          </h3>
          <form onSubmit={handlePostMemo} className="space-y-2.5">
            <input
              type="text"
              required
              placeholder="Notice Title (e.g. Study Hall guidelines)"
              value={memoTitle}
              onChange={(e) => setMemoTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <textarea
              rows={2}
              required
              placeholder="Write advice or schedule..."
              value={memoContent}
              onChange={(e) => setMemoContent(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Broadcast to Residents</span>
            </button>
            {isPosted && (
              <p className="text-center text-[11px] text-emerald-400 font-medium">
                ✓ Memo published to Digital Notice Board
              </p>
            )}
          </form>
        </div>

      </section>

    </div>
  );
}
