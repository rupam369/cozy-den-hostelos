'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getCurrentMealStatus } from '@/lib/utils';
import ComplaintModal from '@/components/modals/ComplaintModal';
import FoodRatingModal from '@/components/modals/FoodRatingModal';
import { MealType } from '@/types';
import { 
  UtensilsCrossed, 
  AlertTriangle, 
  Clock, 
  Star, 
  ShieldCheck, 
  Wifi, 
  Flame, 
  Coffee, 
  Moon, 
  Sun, 
  Plus, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  ChevronRight,
  EyeOff,
  UserCheck,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const { currentUser, meals, complaints, reviews } = useApp();
  const [mealStatus, setMealStatus] = useState<{ current: MealType; status: 'active' | 'upcoming'; nextTime: string }>({
    current: 'Lunch',
    status: 'active',
    nextTime: 'Ends at 2:00 PM',
  });

  useEffect(() => {
    setMealStatus(getCurrentMealStatus());
  }, []);
  
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedMealForRating, setSelectedMealForRating] = useState<MealType>('Lunch');

  // Filter complaints logged by student (or all if demo)
  const myComplaints = complaints.filter(
    (c) => c.user_id === currentUser.id || c.user_name === currentUser.full_name
  );

  const mealIcons: Record<MealType, LucideIcon> = {
    Breakfast: Sun,
    Lunch: UtensilsCrossed,
    'High Tea': Coffee,
    Dinner: Moon,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      
      {/* Resident Welcome Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
                Cozy Resident Hub
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] text-emerald-300 font-bold">
                Level 3 • East Wing
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Welcome back, {currentUser.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
              <span>{currentUser.room_number}</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">Position: {currentUser.position}</span>
              <span>•</span>
              <span className="text-slate-400">Wing {currentUser.wing}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Log Grievance</span>
            </button>
            <button
              onClick={() => {
                setSelectedMealForRating(mealStatus.current);
                setIsRatingModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>Rate Meal ({mealStatus.current})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S MEAL SCHEDULE MODULE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Daily Dining Grid
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Today&apos;s Meal Schedule &amp; Menu
            </h2>
          </div>
          <Link
            href="/food"
            className="text-xs font-medium text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Food Reviews &amp; Kitchen Rating</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {meals.map((meal) => {
            const Icon = mealIcons[meal.meal_type];
            const isCurrent = mealStatus.current === meal.meal_type && mealStatus.status === 'active';
            const isUpcoming = mealStatus.current === meal.meal_type && mealStatus.status === 'upcoming';

            return (
              <div
                key={meal.id}
                className={`relative rounded-3xl border p-5 backdrop-blur-xl transition-all ${
                  isCurrent
                    ? 'border-amber-500/60 bg-amber-950/20 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-900/80'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                    isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-amber-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 animate-pulse">
                      Happening Now
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-medium text-blue-300">
                      Next Up
                    </span>
                  )}
                </div>

                {/* Meal Title & Timeslot */}
                <h3 className="text-base font-bold text-white">{meal.meal_type}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{meal.start_time} - {meal.end_time}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">{meal.title}</p>

                {/* Menu Items List */}
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Items on the Counter
                  </p>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {meal.menu_items.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="h-1 w-1 rounded-full bg-amber-400" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rate Meal Action */}
                <button
                  onClick={() => {
                    setSelectedMealForRating(meal.meal_type);
                    setIsRatingModalOpen(true);
                  }}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Star className="h-3 w-3 text-amber-400" />
                  <span>Rate Taste &amp; Hygiene</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* STUDENT COMPLAINTS RADAR & TRACKER */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Grievance Radar
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              My Registered Grievances &amp; Resolutions
            </h2>
            <p className="text-xs text-slate-400">
              Track progress in real time. Unresolved issues after 48h automatically escalate to warden and faculty.
            </p>
          </div>
          <button
            onClick={() => setIsComplaintModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors w-fit"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Complaint</span>
          </button>
        </div>

        {myComplaints.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 text-center backdrop-blur-xl">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Zero Active Grievances in Room 304</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Everything in your room and floor wing is reported operating normally.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myComplaints.map((comp) => {
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
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-white/10">
                          {comp.category}
                        </span>
                        <span className={`text-[10px] ${priorityColor}`}>
                          {comp.priority} Priority
                        </span>
                        {comp.is_anonymous && (
                          <span className="flex items-center gap-1 text-[10px] text-purple-400">
                            <EyeOff className="h-3 w-3" />
                            <span>Anonymous</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1.5">{comp.title}</h4>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusBadge}`}>
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{comp.description}</p>

                  <div className="border-t border-white/5 pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <span>📍 {comp.location}</span>
                    {comp.assigned_name && (
                      <span className="text-blue-400 font-medium">Assigned: {comp.assigned_name}</span>
                    )}
                  </div>

                  {comp.is_escalated && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-2.5 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span>
                        <strong>48h Red Alert Active:</strong> Management and Faculty notified.
                      </span>
                    </div>
                  )}

                  {comp.resolution_notes && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 text-xs text-emerald-300">
                      <strong>Resolution Note:</strong> {comp.resolution_notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* QUICK RESIDENT UTILITIES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Room 304 Roster
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center justify-between">
              <span>Aryan Sharma (You)</span>
              <span className="text-blue-400 text-[10px] font-bold">Room Leader</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Kunal Ghosh</span>
              <span className="text-slate-500 text-[10px]">Resident</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Zaid Khan</span>
              <span className="text-slate-500 text-[10px]">Resident</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Night Curfew Status
          </h4>
          <div className="text-2xl font-black text-white">10:30 PM</div>
          <p className="text-[11px] text-emerald-400 mt-1">Biometric gate scanner is active</p>
          <p className="text-[10px] text-slate-400 mt-2">
            Late pass requests must be submitted 2 hours in advance to Chief Warden.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            High-Speed WiFi Access
          </h4>
          <div className="text-2xl font-black text-cyan-400">CozyDen_5G</div>
          <p className="text-[11px] text-slate-300 mt-1">Floor 3 AP-3B • 1 Gbps Mesh</p>
          <p className="text-[10px] text-slate-400 mt-2">
            Zero packet loss verified for online proctored exams.
          </p>
        </div>

      </section>

      {/* Modals */}
      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />
      <FoodRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        defaultMeal={selectedMealForRating}
      />

    </div>
  );
}
