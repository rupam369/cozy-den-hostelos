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
  UserCheck, 
  Sparkles,
  Radio
} from 'lucide-react';

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
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-rose-950/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-500/30">
                Cozy Den Grievance Radar
              </span>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] text-blue-300 font-bold">
                48h SLA Automation
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Hostel Grievance &amp; Escalation Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Submit issues with location, priority, photo evidence, or anonymous reporting.
              Issues unattended for &gt; 48 hours automatically trigger broadcast Red Alerts.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Lodge New Grievance</span>
          </button>
        </div>
      </div>

      {/* TABS & CATEGORY FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Main Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Grievances ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'mine'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Room&apos;s Issues
          </button>
          <button
            onClick={() => setActiveTab('escalated')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'escalated'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>48h Red Alerts ({escalatedCount})</span>
          </button>
        </div>

        {/* Category Pill Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All 7 Categories</option>
            <option value="WiFi">WiFi</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Food">Food</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Security">Security</option>
            <option value="Room Maintenance">Room Maintenance</option>
          </select>
        </div>

      </div>

      {/* COMPLAINTS STREAM */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-2" />
            <h3 className="text-base font-bold text-white">No Grievances Found in this Category</h3>
            <p className="text-xs text-slate-400 mt-1">All issues resolved or no records match your filter.</p>
          </div>
        ) : (
          filteredComplaints.map((comp) => {
            const isResolved = comp.status === 'Resolved';
            const statusBadge = {
              Pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
              Resolved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            }[comp.status];

            const priorityColor = {
              Low: 'text-slate-400',
              Medium: 'text-amber-400',
              High: 'text-orange-400',
              Critical: 'text-rose-400 font-bold',
            }[comp.priority];

            return (
              <div
                key={comp.id}
                className={`rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                  comp.is_escalated && !isResolved
                    ? 'border-rose-500/50 bg-rose-950/20 shadow-xl'
                    : isResolved
                    ? 'border-white/5 bg-slate-900/40 opacity-75'
                    : 'border-white/10 bg-slate-900/70 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-white/5 px-2.5 py-0.5 text-xs font-mono text-slate-300 border border-white/10">
                        {comp.category}
                      </span>
                      <span className={`text-xs ${priorityColor}`}>
                        {comp.priority} Priority
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusBadge}`}>
                        {comp.status}
                      </span>
                      {comp.is_anonymous && (
                        <span className="flex items-center gap-1 text-[10px] text-purple-400">
                          <EyeOff className="h-3 w-3" />
                          <span>Anonymous</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{comp.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{comp.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                        <span>{comp.location}</span>
                      </span>
                      <span>
                        👤 Logged by: {comp.is_anonymous ? 'Anonymous Resident' : comp.user_name}
                      </span>
                      {comp.assigned_name && (
                        <span className="text-blue-400 font-medium">
                          Assigned: {comp.assigned_name}
                        </span>
                      )}
                    </div>

                    {/* RED ALERT BANNER */}
                    {comp.is_escalated && !isResolved && (
                      <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200 mt-2 space-y-1">
                        <p className="font-bold flex items-center gap-1.5 text-rose-400">
                          <ShieldAlert className="h-4 w-4" />
                          <span>48-HOUR AUTOMATIC ESCALATION ACTIVE</span>
                        </p>
                        <p className="text-[11px] text-rose-300">
                          &quot;Students are facing this issue. Management attention required.&quot;
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Dispatched to: Chief Warden, Floor Representative, and Faculty Advisor.
                        </p>
                      </div>
                    )}

                    {comp.resolution_notes && (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300 mt-2">
                        <strong>Resolution Note:</strong> {comp.resolution_notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isResolved && !comp.is_escalated && (
                    <div className="shrink-0">
                      <button
                        onClick={() => simulateEscalation(comp.id)}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center gap-1"
                        title="Simulate 48 hours overdue without resolution"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        <span>Test 48h Escalation</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <ComplaintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}
