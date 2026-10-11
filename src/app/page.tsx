'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HostelCanvasWrapper from '@/components/canvas/HostelCanvasWrapper';
import { useApp } from '@/context/AppContext';
import { getCurrentMealStatus } from '@/lib/utils';
import { MealType } from '@/types';
import ComplaintModal from '@/components/modals/ComplaintModal';
import FoodRatingModal from '@/components/modals/FoodRatingModal';
import { 
  Building2, 
  Sparkles, 
  UtensilsCrossed, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Wifi, 
  Bot, 
  Gamepad2, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Layers, 
  Heart,
  ChevronRight,
  Clock,
  Radio
} from 'lucide-react';
import HostelMemoryGame from '@/components/game/HostelMemoryGame';

export default function HomePage() {
  const { healthScores, complaints, currentUser } = useApp();
  const [mealStatus, setMealStatus] = useState<{ current: MealType; status: 'active' | 'upcoming'; nextTime: string }>({
    current: 'Lunch',
    status: 'active',
    nextTime: 'Ends at 2:00 PM',
  });

  useEffect(() => {
    setMealStatus(getCurrentMealStatus());
  }, []);

  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isFoodRatingOpen, setIsFoodRatingOpen] = useState(false);

  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  return (
    <div className="mx-auto max-w-7xl space-y-16 py-4">
      
      {/* Hero Section */}
      <section className="relative space-y-6 pt-4 text-center">
        
        {/* Spatial Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 shadow-lg backdrop-blur-xl animate-in fade-in duration-300">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Next-Generation Living Ecosystem</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Cinematic Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              COZY DEN
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-3xl sm:text-5xl lg:text-6xl font-extrabold">
              Real 3D Multi-Layer Hostel Platform
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            A real digital experience fusing Apple Vision Pro spatial elegance, smart building metrics,
            live meal schedules, rapid 48-hour escalation, and nostalgic hostel soul.
          </p>
        </div>

        {/* CTA Button Group */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/student"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:scale-105 transition-all"
          >
            <span>Enter Student Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/management"
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg backdrop-blur-md hover:bg-white/10 hover:border-white/25 transition-all"
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Management Control Room</span>
          </Link>
          <Link
            href="/picbot"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-purple-500/25 hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>DreamCast PicBot AI</span>
          </Link>
          <button
            onClick={() => setIsComplaintOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 text-xs sm:text-sm font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Report Grievance</span>
          </button>
        </div>

        {/* Real-time Hostel Pulse Ticker */}
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl text-left shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Health Score</span>
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white">{healthScores.overall}/100</div>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Optimal Building Vitals</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl text-left shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Next Meal</span>
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">{mealStatus.current}</div>
            <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" />
              <span>{mealStatus.nextTime}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl text-left shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>WiFi Network</span>
              <Wifi className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-white">{healthScores.wifi}%</div>
            <p className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
              <Radio className="h-3 w-3" />
              <span>1 Gbps Optical Mesh</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl text-left shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active Issues</span>
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-black text-white">{activeComplaintsCount}</div>
            <p className="text-[10px] text-rose-400 flex items-center gap-1 mt-0.5">
              <span>48h Escalation Active</span>
            </p>
          </div>

        </div>

      </section>

      {/* 3D INTERACTIVE HOSTEL ENVIRONMENT */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Spatial 3D Architecture
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              The Living 3D Hostel Twin
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Inspect all 5 architectural floors. Switch from Twilight to Day mode, explode floor layers, or click markers to explore.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/food"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Today&apos;s Mess Menu →
            </Link>
          </div>
        </div>

        {/* 3D Canvas Box */}
        <HostelCanvasWrapper />
      </section>

      {/* CORE MODULES (Apple Vision Pro Glass Grid) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            Engineered Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Everything A Real Hostel Demands
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From smart 48-hour grievance alerts to four-pillar food ratings and AI support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Student Dashboard */}
          <Link
            href="/student"
            className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-blue-500/40 hover:bg-slate-900/80 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
              <span>Student Dashboard</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Live meal schedule (Breakfast, Lunch, High Tea, Dinner), one-click food reviews, room details, and personal complaint radar.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-blue-400 font-medium">
              <span>Enter Resident Suite</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 2: Management Control */}
          <Link
            href="/management"
            className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
              <span>Management Control</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Live building vitals (Food, WiFi, Water, Electricity, Cleanliness). Assign staff, resolve issues, and monitor health scores.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <span>Open Control Room</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 3: Smart Escalation System */}
          <Link
            href="/complaints"
            className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-rose-500/40 hover:bg-slate-900/80 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
              <span>48h Smart Escalation</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Zero ignored grievances. Unresolved issues after 48h instantly trigger broadcast Red Alerts to Management, Teachers & Student Reps.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-rose-400 font-medium">
              <span>Test Escalation Radar</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 4: Four-Pillar Food Ratings */}
          <Link
            href="/food"
            className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-amber-500/40 hover:bg-slate-900/80 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
              <span>Mess Food Rating System</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Rate Taste, Quality, Hygiene, and Quantity with real 5-star precision. Real-time feedback pushes accountability to the kitchen.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-amber-400 font-medium">
              <span>Explore Weekly Menu</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 5: Cozy Assistant AI */}
          <Link
            href="/ai-assistant"
            className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-purple-500/40 hover:bg-slate-900/80 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
              <span>Cozy Assistant (AI)</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ask about curfew timings, mess specials, lodge anonymous complaints, or get emergency medical assistance with intelligent synthesis.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-purple-400 font-medium">
              <span>Start AI Dialogue</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 6: Retro Memory Game */}
          <Link
            href="/game"
            className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4 group-hover:scale-110 transition-transform">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              <span>Hostel Memory Game</span>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Relive late-night corridor runs in nostalgic 8-bit retro arcade style. Dodge the warden&apos;s flashlight & collect Chai and Maggi!
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-cyan-400 font-medium">
              <span>Play 8-Bit Arcade</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 7: DreamCast PicBot (AI Personal Memory Finder) */}
          <Link
            href="/picbot"
            className="group relative rounded-3xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl shadow-xl hover:border-purple-500/40 hover:bg-slate-900/80 transition-all sm:col-span-2 lg:col-span-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 mb-2 sm:mb-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-300 uppercase tracking-wider border border-purple-500/30">
                      Module 8 • AI Vision Agent
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                      512-Dim pgvector
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mt-1 flex items-center gap-2">
                    <span>COZY DEN DreamCast PicBot</span>
                    <span className="text-xs font-normal text-slate-400 italic">
                      — &ldquo;Give me your photo, I&apos;ll find your memories.&rdquo;
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-2xl">
                    Students never manually search thousands of hostel event photos again. Upload one reference selfie, and our AI locates every frame of cricket matches, rooftop jams, and celebrations where you appear.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-all">
                <span>Launch PicBot AI</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* QUICK ACTIONS & INTERACTIVE TEST DRIVE */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 p-8 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Interactive Resident Experience
            </span>
            <h3 className="text-2xl font-black text-white">
              Try Logging An Issue Or Rating Today&apos;s Lunch
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Experience the instant reactive state in action. Test complaint submissions with photo evidence,
              submit anonymous grievances, or rate the four pillars of hostel dining.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsComplaintOpen(true)}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Grievance</span>
            </button>
            <button
              onClick={() => setIsFoodRatingOpen(true)}
              className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-2"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span>Rate Today&apos;s Meal</span>
            </button>
          </div>
        </div>
      </section>

      {/* RETRO NOSTALGIC GAME EMBEDDED AT BOTTOM */}
      <section className="space-y-4 pt-4">
        <HostelMemoryGame />
      </section>

      {/* Modals */}
      <ComplaintModal isOpen={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} />
      <FoodRatingModal isOpen={isFoodRatingOpen} onClose={() => setIsFoodRatingOpen(false)} />

    </div>
  );
}
