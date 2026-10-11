'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ComplaintCategory, 
  ComplaintStatus, 
  Complaint, 
  UserProfile, 
  UserRole, 
  HostelPosition,
  AnnouncementItem,
  PicBotMemory
} from '@/types';
import { 
  Activity, 
  Wifi, 
  Droplets, 
  Zap, 
  UtensilsCrossed, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  Filter, 
  Send, 
  Wrench, 
  Radio,
  Users,
  UserPlus,
  Image as ImageIcon,
  Bell,
  BarChart3,
  Search,
  Check,
  X,
  Flag,
  Trash2,
  Edit,
  TrendingUp,
  PieChart,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { sound } from '@/lib/sound';

const STAFF_LIST = [
  'Vikram Roy (IT & Network Lead)',
  'Sharma Ji (Master Electrician)',
  'Ramesh Verma (Chief Plumber)',
  'Anita Desai (Mess Supervisor)',
  'Sunita Devi (Housekeeping Head)',
  'Dr. Rajesh Gupta (Chief Warden)',
];

type AdminTab = 'complaints' | 'users' | 'memories' | 'broadcast' | 'analytics';

export default function ManagementDashboardPage() {
  const { 
    healthScores, 
    complaints, 
    updateComplaintStatus, 
    assignComplaint, 
    resolveComplaint, 
    simulateEscalation,
    currentUser,
    users,
    updateUser,
    addUser,
    deleteUser,
    memories,
    picBotMemories,
    approveMemory,
    flagMemory,
    deleteMemory,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    addNotification,
    reviews
  } = useApp();

  // Active Admin Tool Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('complaints');

  // Tab 1: Complaints filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});
  const [assigningTo, setAssigningTo] = useState<Record<string, string>>({});

  // Tab 2: User management states
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // New User Form State
  const [newUserForm, setNewUserForm] = useState<{
    full_name: string;
    email: string;
    phone: string;
    age: number;
    role: UserRole;
    position: HostelPosition;
    room_number: string;
    floor: number;
    wing: string;
    avatar_url: string;
  }>({
    full_name: '',
    email: '',
    phone: '+91 ',
    age: 20,
    role: 'student',
    position: 'Resident',
    room_number: 'Room 101',
    floor: 1,
    wing: 'A',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });

  // Tab 3: Memory moderation filter
  const [memoryFilter, setMemoryFilter] = useState<'all' | 'pending' | 'approved' | 'flagged'>('all');

  // Tab 4: Announcement broadcaster state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState<'normal' | 'urgent' | 'critical'>('normal');
  const [broadcastAudience, setBroadcastAudience] = useState<'all' | 'student' | 'teacher' | 'management'>('all');
  const [broadcastTag, setBroadcastTag] = useState('Official Notice');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const escalatedCount = complaints.filter((c) => c.is_escalated && c.status !== 'Resolved').length;

  // Filter users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = u.full_name.toLowerCase().includes(q);
      const matchRoom = u.room_number.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPos = u.position.toLowerCase().includes(q);
      if (!matchName && !matchRoom && !matchEmail && !matchPos) return false;
    }
    return true;
  });

  // Filter memories for moderation
  const filteredMemories = useMemo(() => {
    return picBotMemories.filter((m) => {
      const status = m.approval_status || 'approved';
      if (memoryFilter === 'all') return true;
      return status === memoryFilter;
    });
  }, [picBotMemories, memoryFilter]);

  // Handle Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.full_name || !newUserForm.email) return;

    sound.playClick();
    const created: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      ...newUserForm,
      name: newUserForm.full_name,
      hostel_position: newUserForm.position,
      profile_image: newUserForm.avatar_url,
      created_at: new Date().toISOString(),
      status: 'Active',
    };

    addUser(created);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      full_name: '',
      email: '',
      phone: '+91 ',
      age: 20,
      role: 'student',
      position: 'Resident',
      room_number: 'Room 101',
      floor: 1,
      wing: 'A',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    });
    sound.playChime();
  };

  // Handle Save Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    sound.playClick();
    updateUser(editingUser);
    setEditingUser(null);
    sound.playChime();
  };

  // Handle Broadcast Dispatch
  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    sound.playCameraSwoosh();
    addAnnouncement({
      title: broadcastTitle,
      content: broadcastContent,
      author_name: currentUser.full_name,
      author_role: currentUser.position,
      priority: broadcastPriority,
      tags: [broadcastTag, broadcastAudience.toUpperCase()],
    });

    // Also push a live notification toast to target audience
    addNotification({
      title: `📢 ${broadcastTitle}`,
      message: broadcastContent,
      type: broadcastPriority === 'critical' ? 'red' : broadcastPriority === 'urgent' ? 'yellow' : 'green',
      target_role: broadcastAudience,
    });

    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastContent('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
    sound.playChime();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4 px-2 sm:px-4">
      
      {/* Management Control Header */}
      <div className="vision-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/[0.08]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Executive Command Center • Sector 4</span>
              </span>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] text-amber-300 font-bold border border-amber-500/30">
                Management Member
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Hostel Operations &amp; Facility Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Logged in as <strong className="text-white font-semibold">{currentUser.full_name}</strong> ({currentUser.position}). Overseeing building operations, resident welfare, and 3D digital twin telemetry.
            </p>
          </div>

          {/* 48h Escalation Warning Banner */}
          {escalatedCount > 0 && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 backdrop-blur-xl animate-pulse flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-lg">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-200">
                  {escalatedCount} Critical 48h Escalation Alert(s)
                </h4>
                <p className="text-[11px] text-rose-300">
                  Dispatched to Management, Teachers &amp; Student Reps.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 5 ADMIN TOOL SWITCHER TABS */}
        <div className="relative z-10 flex items-center gap-2 pt-6 overflow-x-auto border-t border-white/[0.08] mt-6">
          
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('complaints');
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'complaints'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Facility Radar &amp; Grievances</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {complaints.filter((c) => c.status !== 'Resolved').length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('users');
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Resident Directory</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('memories');
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'memories'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Memory Moderation</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {picBotMemories.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('broadcast');
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'broadcast'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Notice Broadcaster</span>
            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
              {announcements.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('analytics');
            }}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>IoT Analytics &amp; SLAs</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FACILITY RADAR & COMPLAINTS WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* HOSTEL HEALTH SCORES (Live Monitoring Grid) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Live Vitals
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Hostel Health Score Matrix
                </h2>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>Telemetry Refresh: Realtime</span>
              </div>
            </div>

            {/* 6 Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Overall Composite */}
              <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/50 to-indigo-950/50 p-4 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between text-blue-300 text-xs mb-2">
                  <span>Overall Health</span>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="text-3xl font-black text-white">{healthScores.overall}</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${healthScores.overall}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">5-metric weighted avg</span>
              </div>

              {/* Food Health */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-amber-300 text-xs mb-2">
                  <span>Food Health</span>
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <div className="text-3xl font-black text-white">{healthScores.food}%</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${healthScores.food}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Derived from student reviews</span>
              </div>

              {/* WiFi Health */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-cyan-300 text-xs mb-2">
                  <span>WiFi Network</span>
                  <Wifi className="h-4 w-4" />
                </div>
                <div className="text-3xl font-black text-white">{healthScores.wifi}%</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${healthScores.wifi}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Fiber mesh node status</span>
              </div>

              {/* Water Health */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-blue-300 text-xs mb-2">
                  <span>Water &amp; Solar</span>
                  <Droplets className="h-4 w-4" />
                </div>
                <div className="text-3xl font-black text-white">{healthScores.water}%</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${healthScores.water}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Flow &amp; heater telemetry</span>
              </div>

              {/* Electricity Health */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-yellow-300 text-xs mb-2">
                  <span>Power Grid</span>
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-3xl font-black text-white">{healthScores.electricity}%</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${healthScores.electricity}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Circuit breaker integrity</span>
              </div>

              {/* Cleanliness Health */}
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between text-emerald-300 text-xs mb-2">
                  <span>Cleanliness</span>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-3xl font-black text-white">{healthScores.cleanliness}%</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${healthScores.cleanliness}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Floor sanitation audits</span>
              </div>

            </div>
          </section>

          {/* ACTIVE COMPLAINTS & ACTION WORKFLOW */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    Action Center
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Grievance Resolution &amp; Staff Assignment
                </h2>
                <p className="text-xs text-slate-400">
                  Assign technical personnel, update resolution stages, and trigger the 48-hour Smart Escalation broadcast.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-transparent text-white focus:outline-none"
                  >
                    <option value="all" className="bg-slate-900">All Categories</option>
                    <option value="WiFi" className="bg-slate-900">WiFi</option>
                    <option value="Water" className="bg-slate-900">Water</option>
                    <option value="Electricity" className="bg-slate-900">Electricity</option>
                    <option value="Food" className="bg-slate-900">Food</option>
                    <option value="Cleaning" className="bg-slate-900">Cleaning</option>
                    <option value="Security" className="bg-slate-900">Security</option>
                    <option value="Room Maintenance" className="bg-slate-900">Room Maintenance</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-white focus:outline-none"
                  >
                    <option value="all" className="bg-slate-900">All Statuses</option>
                    <option value="Pending" className="bg-slate-900">Pending</option>
                    <option value="In Progress" className="bg-slate-900">In Progress</option>
                    <option value="Resolved" className="bg-slate-900">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
              {filteredComplaints.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-10 text-center backdrop-blur-xl">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-2" />
                  <h4 className="text-base font-bold text-white">No Matching Complaints</h4>
                  <p className="text-xs text-slate-400 mt-1">Change your filters or check other categories.</p>
                </div>
              ) : (
                filteredComplaints.map((comp) => {
                  const isResolved = comp.status === 'Resolved';
                  return (
                    <div
                      key={comp.id}
                      className={`rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                        comp.is_escalated && !isResolved
                          ? 'border-rose-500/50 bg-rose-950/20 shadow-xl shadow-rose-500/10'
                          : isResolved
                          ? 'border-emerald-500/20 bg-slate-900/40 opacity-80'
                          : 'border-white/10 bg-slate-900/70 hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        
                        {/* Left: Info */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                              {comp.category}
                            </span>
                            <span className={`text-xs font-semibold ${
                              comp.priority === 'Critical' ? 'text-rose-400 font-bold' :
                              comp.priority === 'High' ? 'text-orange-400' : 'text-slate-400'
                            }`}>
                              {comp.priority} Priority
                            </span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                              comp.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                              comp.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                              'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {comp.status}
                            </span>
                            {comp.is_escalated && (
                              <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 animate-pulse">
                                🚨 48h Escalated
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-white">{comp.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed">{comp.description}</p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                            <span>📍 {comp.location}</span>
                            <span>👤 {comp.is_anonymous ? 'Anonymous Resident' : comp.user_name}</span>
                            {comp.assigned_name && (
                              <span className="text-blue-400 font-medium">
                                Staff Assigned: {comp.assigned_name}
                              </span>
                            )}
                          </div>

                          {/* Escalation Alert Display */}
                          {comp.is_escalated && !isResolved && (
                            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200 mt-2">
                              <p className="font-bold flex items-center gap-1.5">
                                <ShieldAlert className="h-4 w-4 text-rose-400" />
                                <span>RED ALERT DISPATCHED:</span>
                              </p>
                              <p className="mt-0.5 text-[11px] text-rose-300">
                                &quot;Students are facing this issue. Management attention required.&quot;
                              </p>
                            </div>
                          )}

                          {comp.resolution_notes && (
                            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300 mt-2">
                              <strong>Resolution Summary:</strong> {comp.resolution_notes}
                            </div>
                          )}
                        </div>

                        {/* Right: Actions Suite */}
                        {!isResolved && (
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[260px] border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-4">
                            
                            {/* Assign Personnel */}
                            <div>
                              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                Assign Responsible Staff
                              </label>
                              <div className="flex items-center gap-1.5">
                                <select
                                  value={assigningTo[comp.id] || comp.assigned_name || ''}
                                  onChange={(e) =>
                                    setAssigningTo({ ...assigningTo, [comp.id]: e.target.value })
                                  }
                                  className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                                >
                                  <option value="">Select Staff...</option>
                                  {STAFF_LIST.map((staff) => (
                                    <option key={staff} value={staff}>{staff}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    const chosen = assigningTo[comp.id];
                                    if (chosen) assignComplaint(comp.id, chosen);
                                  }}
                                  disabled={!assigningTo[comp.id]}
                                  className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
                                >
                                  Assign
                                </button>
                              </div>
                            </div>

                            {/* Status Toggle (In Progress / Resolve) */}
                            <div className="pt-1">
                              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                Resolution Workflow
                              </label>
                              <div className="space-y-1.5">
                                <input
                                  type="text"
                                  placeholder="Add resolution note..."
                                  value={resolutionNotes[comp.id] || ''}
                                  onChange={(e) =>
                                    setResolutionNotes({ ...resolutionNotes, [comp.id]: e.target.value })
                                  }
                                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                                />
                                <div className="flex items-center gap-2">
                                  {comp.status === 'Pending' && (
                                    <button
                                      onClick={() => updateComplaintStatus(comp.id, 'In Progress')}
                                      className="flex-1 rounded-xl border border-blue-500/40 bg-blue-500/10 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition-colors"
                                    >
                                      Mark In Progress
                                    </button>
                                  )}
                                  <button
                                    onClick={() => resolveComplaint(comp.id, resolutionNotes[comp.id])}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-1.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Resolve Issue</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Test 48h Escalation button */}
                            {!comp.is_escalated && (
                              <button
                                onClick={() => simulateEscalation(comp.id)}
                                className="mt-1 w-full rounded-xl border border-rose-500/30 bg-rose-500/10 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
                                title="Simulate 48 hours overdue without resolution"
                              >
                                <AlertTriangle className="h-3 w-3 text-rose-400" />
                                <span>Simulate 48h Red Escalation</span>
                              </button>
                            )}

                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER & RESIDENT DIRECTORY (STEP 7: USER MANAGEMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                  Resident Directory
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Hostel User Management &amp; Profiles
              </h2>
              <p className="text-xs text-slate-400">
                Manage room allocations, hostel positions, biometric registration status, and user roles.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsAddUserModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-blue-500 transition-all self-start sm:self-auto"
            >
              <UserPlus className="h-4 w-4" />
              <span>Enroll New Resident</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by resident name, room number, or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none backdrop-blur-xl"
              />
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 backdrop-blur-xl">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-transparent text-white w-full focus:outline-none"
              >
                <option value="all" className="bg-slate-900">All Roles ({users.length})</option>
                <option value="student" className="bg-slate-900">Students Only</option>
                <option value="teacher" className="bg-slate-900">Faculty Mentors</option>
                <option value="management" className="bg-slate-900">Management Staff</option>
              </select>
            </div>
          </div>

          {/* Users Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl shadow-xl hover:border-indigo-500/40 transition-all space-y-4 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-2xl overflow-hidden border border-white/20 bg-slate-800 shrink-0 shadow-md">
                      {user.avatar_url ? (
                        <Image
                          src={user.avatar_url}
                          alt={user.full_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold">
                          {user.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {user.full_name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{user.email}</p>
                      <span className={`inline-block mt-1 rounded-full px-2 py-0.2 text-[9px] font-bold border ${
                        user.role === 'student' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        user.role === 'teacher' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {user.role.toUpperCase()} • {user.position}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setEditingUser(user);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                      title="Edit Resident"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    {user.id !== currentUser.id && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${user.full_name} from Cozy Den roster?`)) {
                            sound.playClick();
                            deleteUser(user.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                        title="Remove User"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/5">
                  <div className="bg-white/5 rounded-xl p-2">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Room &amp; Wing</span>
                    <span className="text-white font-medium">{user.room_number} (Wing {user.wing})</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Floor Level</span>
                    <span className="text-white font-medium">Floor {user.floor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Age: {user.age} yrs</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Biometric Active</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MEMORY APPROVAL & CONTENT MODERATION (STEP 7: MEMORY APPROVAL) */}
      {/* ========================================================================= */}
      {activeTab === 'memories' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                  Content Governance
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Hostel Memory Approval &amp; Photo Moderation
              </h2>
              <p className="text-xs text-slate-400">
                Review photos uploaded by students before or after publishing to the public hostel gallery. Strict photo-only policy enforced.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
              <button
                onClick={() => setMemoryFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  memoryFilter === 'all' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({picBotMemories.length})
              </button>
              <button
                onClick={() => setMemoryFilter('pending')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  memoryFilter === 'pending' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending Review ({picBotMemories.filter((m) => m.approval_status === 'pending').length})
              </button>
              <button
                onClick={() => setMemoryFilter('approved')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  memoryFilter === 'approved' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Approved ({picBotMemories.filter((m) => (m.approval_status || 'approved') === 'approved').length})
              </button>
              <button
                onClick={() => setMemoryFilter('flagged')}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                  memoryFilter === 'flagged' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Flagged ({picBotMemories.filter((m) => m.approval_status === 'flagged').length})
              </button>
            </div>
          </div>

          {/* Grid of Memories for Moderation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMemories.map((mem) => {
              const status = mem.approval_status || 'approved';
              return (
                <div
                  key={mem.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/80 overflow-hidden backdrop-blur-xl shadow-xl flex flex-col group"
                >
                  {/* Photo container */}
                  <div className="relative h-48 w-full bg-slate-950">
                    <Image
                      src={mem.image_url}
                      alt={mem.event}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40 pointer-events-none" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border backdrop-blur-md ${
                        status === 'approved' ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50' :
                        status === 'pending' ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' :
                        'bg-rose-500/30 text-rose-300 border-rose-500/50'
                      }`}>
                        {status.toUpperCase()}
                      </span>
                    </div>

                    {/* Face Detection Pill */}
                    <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 border border-white/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                      {mem.faces_detected.length} Faces Indexed
                    </div>

                    <div className="absolute bottom-2.5 inset-x-3 text-white">
                      <h4 className="text-sm font-bold truncate">{mem.event}</h4>
                      <p className="text-[10px] text-slate-300">📍 {mem.location} • {mem.date}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-300 line-clamp-2">{mem.caption}</p>
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">Tagged:</span>
                        {mem.tagged_residents.map((t, idx) => (
                          <span key={idx} className="rounded-md bg-white/5 px-1.5 py-0.2 text-[9px] text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 pt-1">
                        Uploaded by: <strong className="text-slate-200">{mem.uploaded_by_name}</strong>
                      </p>
                    </div>

                    {/* Moderation Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      {status !== 'approved' && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            approveMemory(mem.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-emerald-600/20 border border-emerald-500/40 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {status !== 'flagged' && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            flagMemory(mem.id);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-rose-600/20 border border-rose-500/40 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition-colors"
                        >
                          <Flag className="h-3.5 w-3.5" />
                          <span>Flag / Hide</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('Permanently delete this memory and purge its face vector embeddings?')) {
                            sound.playClick();
                            deleteMemory(mem.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: NOTICE BROADCASTER & NOTIFICATION CONTROL (STEP 7: NOTIFICATION CONTROL) */}
      {/* ========================================================================= */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Composer Form (Left 1 Col) */}
          <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Instant Dispatch
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <h3 className="text-xl font-black text-white">Broadcast Announcement</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Send emergency alerts, maintenance schedules, or hostel announcements directly to resident devices.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Notice broadcasted and pushed to target audience!</span>
              </div>
            )}

            <form onSubmit={handleDispatchBroadcast} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Water Pipeline Maintenance on Wing B"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Notice Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide complete details, timings, and instructions for residents..."
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value as 'normal' | 'urgent' | 'critical')}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical (Red Alert)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value as 'all' | 'student' | 'teacher' | 'management')}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="all">Entire Hostel (All)</option>
                    <option value="student">Students Only</option>
                    <option value="teacher">Faculty Mentors</option>
                    <option value="management">Management Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. WiFi, Water, Fest, Academics"
                  value={broadcastTag}
                  onChange={(e) => setBroadcastTag(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 py-3 text-xs font-bold text-white shadow-xl shadow-amber-500/25 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Broadcast Instantly</span>
              </button>
            </form>
          </div>

          {/* Live Feed of Existing Announcements (Right 2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Active Notices &amp; Bulletins ({announcements.length})</h3>
              <span className="text-xs text-slate-400">Realtime sync with Student &amp; Teacher dashboards</span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`rounded-3xl border p-5 backdrop-blur-xl transition-all ${
                    ann.priority === 'critical'
                      ? 'border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-500/10'
                      : ann.priority === 'urgent'
                      ? 'border-amber-500/30 bg-amber-950/15'
                      : 'border-white/10 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                          ann.priority === 'critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          ann.priority === 'urgent' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}>
                          {ann.priority} Priority
                        </span>
                        {ann.tags?.map((t, idx) => (
                          <span key={idx} className="rounded-md bg-white/5 px-2 py-0.2 text-[9px] text-slate-300 border border-white/10">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-base font-bold text-white">{ann.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                        <span>👤 Posted by: <strong className="text-slate-300">{ann.author_name}</strong> ({ann.author_role})</span>
                        <span>🕒 {new Date(ann.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete announcement "${ann.title}"?`)) {
                          sound.playClick();
                          deleteAnnouncement(ann.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                      title="Archive Notice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ANALYTICS DASHBOARD & IOT VELOCITY (STEP 7: ANALYTICS DASHBOARD) */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Data Intelligence
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Hostel Facility KPIs &amp; SLA Velocity Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated grievance resolution velocity, meal quality index, and biometric AI indexing metrics.
            </p>
          </div>

          {/* 4 Big KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Avg Resolution Time</span>
                <Clock className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">4.2 hrs</div>
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>88% within 24h SLA</span>
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Resident CSAT Score</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white">4.8 / 5.0</div>
              <p className="text-[10px] text-slate-400 mt-1">Based on {reviews.length} rated dining &amp; stay reviews</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Resolution Rate</span>
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {complaints.length ? Math.round((complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100) : 100}%
              </div>
              <p className="text-[10px] text-blue-400 mt-1">
                {complaints.filter(c => c.status === 'Resolved').length} of {complaints.length} grievances solved
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>PicBot Indexed Faces</span>
                <Shield className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {picBotMemories.reduce((acc, m) => acc + m.faces_detected.length, 0)}
              </div>
              <p className="text-[10px] text-purple-300 mt-1">Across {picBotMemories.length} memories in pgvector</p>
            </div>

          </div>

          {/* 2 Detailed Insight Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Grievance Category Breakdown */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieChart className="h-4 w-4 text-blue-400" />
                <span>Grievance Distribution by Category</span>
              </h3>

              <div className="space-y-3">
                {[
                  { label: 'WiFi & Mesh Network', count: complaints.filter(c => c.category === 'WiFi').length, color: 'bg-cyan-500' },
                  { label: 'Water & Solar Heating', count: complaints.filter(c => c.category === 'Water').length, color: 'bg-blue-500' },
                  { label: 'Electricity & Circuit Breakers', count: complaints.filter(c => c.category === 'Electricity').length, color: 'bg-yellow-500' },
                  { label: 'Mess & Food Quality', count: complaints.filter(c => c.category === 'Food').length, color: 'bg-amber-500' },
                  { label: 'Housekeeping & Cleanliness', count: complaints.filter(c => c.category === 'Cleaning').length, color: 'bg-emerald-500' },
                  { label: 'Room Maintenance', count: complaints.filter(c => c.category === 'Room Maintenance').length, color: 'bg-purple-500' },
                ].map((item, idx) => {
                  const pct = complaints.length ? Math.round((item.count / complaints.length) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-white font-mono font-bold">{item.count} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(5, pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Food Satisfaction Breakdown */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-amber-400" />
                <span>Meal Satisfaction &amp; Daily Food Ratings</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { meal: 'Breakfast', score: '4.8 / 5.0', desc: 'Highest rated: Ghee Roast Dosa', color: 'from-amber-500/20 to-orange-500/20' },
                  { meal: 'Lunch', score: '4.5 / 5.0', desc: 'Top pick: Shahi Paneer & Naan', color: 'from-yellow-500/20 to-amber-500/20' },
                  { meal: 'High Tea', score: '4.9 / 5.0', desc: 'Samosas & Ginger Cardamom Chai', color: 'from-orange-500/20 to-rose-500/20' },
                  { meal: 'Dinner', score: '4.6 / 5.0', desc: 'Comfort Kadai Veg & Dal Halwa', color: 'from-indigo-500/20 to-purple-500/20' },
                ].map((m, idx) => (
                  <div key={idx} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${m.color} p-4 space-y-1`}>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{m.meal}</span>
                    <div className="text-xl font-black text-amber-300">{m.score}</div>
                    <p className="text-[10px] text-slate-300">{m.desc}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Mess hygiene compliance score: 98.4% (Certified by Campus Health Board).</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW USER */}
      {/* ========================================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-400" />
                <span>Enroll New Hostel Resident / Staff</span>
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@cozyden.edu"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    min={17}
                    max={75}
                    value={newUserForm.age}
                    onChange={(e) => setNewUserForm({ ...newUserForm, age: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="management">Management Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Hostel Position</label>
                  <select
                    value={newUserForm.position}
                    onChange={(e) => setNewUserForm({ ...newUserForm, position: e.target.value as HostelPosition })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Resident">Resident</option>
                    <option value="Room leader">Room leader</option>
                    <option value="Floor representative">Floor representative</option>
                    <option value="Faculty Advisor">Faculty Advisor</option>
                    <option value="Warden">Warden</option>
                    <option value="Mess manager">Mess manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 304"
                    value={newUserForm.room_number}
                    onChange={(e) => setNewUserForm({ ...newUserForm, room_number: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Floor Level</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={newUserForm.floor}
                    onChange={(e) => setNewUserForm({ ...newUserForm, floor: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Wing</label>
                  <input
                    type="text"
                    placeholder="e.g. A, B, East"
                    value={newUserForm.wing}
                    onChange={(e) => setNewUserForm({ ...newUserForm, wing: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
                >
                  Enroll Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT USER */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="h-5 w-5 text-indigo-400" />
                <span>Edit Profile: {editingUser.full_name}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.full_name}
                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Hostel Position</label>
                  <select
                    value={editingUser.position}
                    onChange={(e) => setEditingUser({ ...editingUser, position: e.target.value as HostelPosition })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Resident">Resident</option>
                    <option value="Room leader">Room leader</option>
                    <option value="Floor representative">Floor representative</option>
                    <option value="Faculty Advisor">Faculty Advisor</option>
                    <option value="Warden">Warden</option>
                    <option value="Mess manager">Mess manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={editingUser.room_number}
                    onChange={(e) => setEditingUser({ ...editingUser, room_number: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
