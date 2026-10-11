'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import ComplaintModal from '@/components/modals/ComplaintModal';
import { ComplaintCategory, ComplaintStatus } from '@/types';
import { 
  AlertTriangle, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  EyeOff, 
  Filter, 
  Camera, 
  MapPin, 
  Sparkles,
  Radio,
  ArrowRight,
  Shield
} from 'lucide-react';
import { sound } from '@/lib/sound';

export default function ComplaintCenterPage() {
  const { complaints, currentUser, simulateEscalation } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'escalated'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredComplaints = complaints.filter((c) => {
    if (activeTab === 'mine') {
      if (c.user_id !== currentUser.id && c.user_name !== currentUser.full_name) return false;
    } else if (activeTab === 'escalated') {
      if (!c.is_escalated || c.status === 'Resolved') return false;
    }

    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  const escalatedCount = complaints.filter((c) => c.is_escalated && c.status !== 'Resolved').length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
      
      {/* =========================================================================
          HERO & 48-HOUR GUARANTEE SECTION
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
              Hostel Care &amp; Dignity
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Grievance &amp; 48-Hour Escalation Radar.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Living in comfort is your fundamental right as a resident. Report any maintenance, WiFi, 
              water, or room issue with full transparency. Every ticket is monitored in real-time by our 
              background AI workers.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-500 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-rose-600/25 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Report an Issue Now</span>
          </button>
        </div>

        {/* 48-Hour SLA Visual Commitment Banner */}
        <div className="vision-glass rounded-3xl p-6 sm:p-8 border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold">
                The 48-Hour Resolution Guarantee
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-light">Autonomous Background AI Worker Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-1">
              <div className="text-[10px] font-mono text-slate-400">STEP 01</div>
              <div className="text-xs font-bold text-white">Issue Logged</div>
              <p className="text-[11px] text-slate-400 font-light">Instant ticket generated with location &amp; optional photo evidence.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-1">
              <div className="text-[10px] font-mono text-slate-400">STEP 02</div>
              <div className="text-xs font-bold text-white">Facility Dispatch</div>
              <p className="text-[11px] text-slate-400 font-light">Assigned to floor technician or warden desk within 12 hours.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-1">
              <div className="text-[10px] font-mono text-amber-400">STEP 03 (24h - 48h)</div>
              <div className="text-xs font-bold text-amber-300">Resolution Window</div>
              <p className="text-[11px] text-slate-400 font-light">Target fix time. Status updates synced live to resident portal.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="text-[10px] font-mono text-rose-400">STEP 04 (&gt; 48h)</div>
              <div className="text-xs font-bold text-rose-300">Automatic RED ALERT</div>
              <p className="text-[11px] text-slate-300 font-light">Immediate critical dispatch to Head Warden &amp; Management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ISSUE TRACKER & RADAR FILTERS
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 vision-pill p-1 rounded-full w-fit">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('all');
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-white/[0.12] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Issues ({complaints.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('mine');
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'mine'
                  ? 'bg-white/[0.12] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Reported
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('escalated');
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'escalated'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <span>48h Red Alerts</span>
              {escalatedCount > 0 && (
                <span className="rounded-full bg-white/20 px-1.5 text-[10px] font-black">
                  {escalatedCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'WiFi', 'Water', 'Electricity', 'Food', 'Cleaning', 'Room Maintenance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-[11px] whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Stream */}
        {filteredComplaints.length === 0 ? (
          <div className="vision-glass rounded-3xl p-12 text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Issues Found</h3>
            <p className="text-xs text-slate-400 font-light">All reported grievances under this filter are fully resolved.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((c) => (
              <div 
                key={c.id} 
                className={`vision-glass rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                  c.is_escalated && c.status !== 'Resolved' ? 'border-rose-500/40 ring-1 ring-rose-500/20' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/[0.08] px-3 py-0.5 text-xs text-slate-200 font-medium">
                      {c.category}
                    </span>
                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      c.status === 'Resolved' 
                        ? 'bg-emerald-500/15 text-emerald-300' 
                        : c.status === 'In Progress' 
                        ? 'bg-blue-500/15 text-blue-300' 
                        : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                    {c.is_escalated && c.status !== 'Resolved' && (
                      <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-black text-white uppercase animate-pulse">
                        Overdue &gt; 48h Escalated
                      </span>
                    )}
                    {c.is_anonymous && (
                      <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-slate-400 flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        <span>Anonymous</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-300 font-light leading-relaxed max-w-3xl">
                    {c.description}
                  </p>
                </div>

                <div className="text-left md:text-right space-y-1 text-xs text-slate-400 font-light shrink-0">
                  <div className="flex items-center md:justify-end gap-1.5 text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>{c.location}</span>
                  </div>
                  <div>Reported: {new Date(c.created_at).toLocaleDateString()}</div>
                  {c.assigned_name && (
                    <div className="text-emerald-400 font-medium text-[11px]">
                      Assigned: {c.assigned_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      <ComplaintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}
