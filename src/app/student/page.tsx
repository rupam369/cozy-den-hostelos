'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getCurrentMealStatus } from '@/lib/utils';
import ComplaintModal from '@/components/modals/ComplaintModal';
import FoodRatingModal from '@/components/modals/FoodRatingModal';
import { MealType } from '@/types';
import { 
  Building2, 
  UtensilsCrossed, 
  AlertTriangle, 
  Clock, 
  Star, 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  Moon, 
  Sun, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  User,
  Radio,
  ArrowRight
} from 'lucide-react';
import { sound } from '@/lib/sound';

export default function StudentDashboardPage() {
  const { currentUser, meals, complaints, reviews } = useApp();
  const [mealStatus, setMealStatus] = useState<{ current: MealType; status: 'active' | 'upcoming'; nextTime: string }>({
    current: 'Dinner',
    status: 'active',
    nextTime: 'Ends at 9:00 PM',
  });

  useEffect(() => {
    setMealStatus(getCurrentMealStatus());
  }, []);
  
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Filter complaints logged by student (or all if demo)
  const myComplaints = complaints.filter(
    (c) => c.user_id === currentUser.id || c.user_name === currentUser.full_name
  );

  const activeMealData = meals.find((m) => m.meal_type === mealStatus.current) || meals[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
      
      {/* =========================================================================
          RESIDENT ARRIVAL HEADER
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300">
                {currentUser.room_number || 'Room 304'} • Wing {currentUser.wing || 'A'}
              </span>
              <span className="text-xs text-slate-400 font-light">• Level {currentUser.floor || 3} Residence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Welcome to Your Space, {currentUser.full_name?.split(' ')[0] || 'Resident'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                setIsComplaintModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-rose-600/90 hover:bg-rose-500 border border-rose-500/30 px-5 py-2.5 text-xs font-bold text-white shadow-xl shadow-rose-600/20 transition-all"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Report an Issue</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setIsRatingModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-5 py-2.5 text-xs font-bold text-amber-300 transition-all"
            >
              <Star className="h-3.5 w-3.5" />
              <span>Rate Today&apos;s Meal</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DIGITAL RESIDENT SUITE PASS & AMBIENT LIVING STATUS
         ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Apple Vision Pro Digital Keycard Pass */}
        <div className="lg:col-span-1 vision-glass-warm rounded-3xl p-7 space-y-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Digital Hostel Pass
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div>
              <div className="text-4xl font-black text-white font-mono tracking-tight">
                {currentUser.room_number || 'ROOM 304'}
              </div>
              <p className="text-xs text-slate-300 font-light mt-1">
                Wing {currentUser.wing || 'A'} • Position: {currentUser.position || 'Room Leader'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/[0.08] text-xs text-slate-300 font-light">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Resident Name</span>
              <span className="text-white font-medium">{currentUser.full_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Curfew Gate Access</span>
              <span className="text-emerald-300 font-medium">Valid until 10:00 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">WiFi SSID</span>
              <span className="text-blue-300 font-mono text-[11px]">COZY_DEN_MEMBER_5G</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Emergency Ext.</span>
              <span className="text-amber-400 font-bold">108</span>
            </div>
          </div>
        </div>

        {/* Live Dining & Kitchen Gathering Status */}
        <div className="lg:col-span-2 vision-glass rounded-3xl p-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Active Dining Service
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                <UtensilsCrossed className="h-3 w-3" />
                <span>{mealStatus.current} Service Active</span>
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">
              {activeMealData?.title || 'Comfort Dining Feast'}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              {activeMealData?.menu_items?.join(', ') || activeMealData?.title || 'Comfort Dining Feast'}
            </p>

            {activeMealData?.chef_special && (
              <div className="inline-block rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300 font-medium">
                Chef Highlight: {activeMealData.chef_special}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-light">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Timings: {activeMealData?.start_time} - {activeMealData?.end_time}</span>
            </div>
            <Link
              href="/food"
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold"
            >
              <span>View Full 4-Meal Menu</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </section>

      {/* =========================================================================
          MY REPORTED GRIEVANCES & RESOLUTION TRACKING
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Your Living Requests &amp; Care Log
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Track the progress of any room or amenity requests under our 48-hour resolution SLA.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsComplaintModalOpen(true);
            }}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Request</span>
          </button>
        </div>

        {myComplaints.length === 0 ? (
          <div className="vision-glass rounded-3xl p-10 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Your Suite is Serene</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto font-light">
              No active complaints or repair requests logged. Everything in Room {currentUser.room_number || '304'} is running smoothly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myComplaints.map((c) => (
              <div 
                key={c.id} 
                className="vision-glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/[0.14] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] text-slate-300 font-medium">
                      {c.category}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      c.status === 'Resolved' 
                        ? 'bg-emerald-500/15 text-emerald-300' 
                        : c.is_escalated 
                        ? 'bg-rose-500/20 text-rose-300 animate-pulse' 
                        : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                    {c.is_escalated && (
                      <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-black text-white uppercase">
                        48h Red Alert
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                  <p className="text-xs text-slate-400 font-light">{c.description}</p>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-400 font-light shrink-0">
                  <div>Logged: {new Date(c.created_at).toLocaleDateString()}</div>
                  <div className="text-[11px] text-slate-500">Location: {c.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Global Modals */}
      <ComplaintModal isOpen={isComplaintModalOpen} onClose={() => setIsComplaintModalOpen(false)} />
      <FoodRatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} defaultMeal={mealStatus.current} />

    </div>
  );
}
