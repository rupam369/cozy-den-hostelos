'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HostelCanvasWrapper from '@/components/canvas/HostelCanvasWrapper';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Sparkles, 
  UtensilsCrossed, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Wifi, 
  ArrowRight, 
  Compass,
  Users, 
  Heart,
  ChevronRight,
  Clock,
  Radio,
  DoorOpen,
  Camera,
  Coffee,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import ComplaintModal from '@/components/modals/ComplaintModal';
import FoodRatingModal from '@/components/modals/FoodRatingModal';
import { sound } from '@/lib/sound';

export default function HomePage() {
  const { complaints, currentUser } = useApp();
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isFoodRatingOpen, setIsFoodRatingOpen] = useState(false);

  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  return (
    <div className="space-y-28 pb-20">
      
      {/* =========================================================================
          HERO SECTION: 3D DIGITAL TWIN AS THE CENTRAL ARRIVAL EXPERIENCE
         ========================================================================= */}
      <section className="relative px-4 sm:px-6 pt-6">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Top Architectural Overhead Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xl">
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span>COZY DEN SMART RESIDENCE • SECTOR 4</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Enter Your Hostel
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-orange-300 bg-clip-text text-transparent">
                Digitally.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Step directly into COZY DEN through our interactive 3D digital twin. 
              Click on the building zones below to enter the dining hall, check active announcements, 
              or visit the rooftop memory lounge.
            </p>
          </div>

          {/* Realistic 3D Central Building Viewport */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-white/[0.08]">
            <HostelCanvasWrapper />
          </div>

          {/* Interactive Zone Doorway Ribbon */}
          <div className="pt-2">
            <div className="vision-pill p-2 sm:p-3 rounded-2xl sm:rounded-full flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 px-2 shrink-0">
                Clickable Areas:
              </span>

              <Link
                href="/announcements"
                onClick={() => sound.playClick()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/[0.06] hover:border-amber-500/40 transition-all"
              >
                <DoorOpen className="h-3.5 w-3.5 text-amber-400" />
                <span>Entrance ➔ Announcements</span>
              </Link>

              <Link
                href="/food"
                onClick={() => sound.playClick()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/[0.06] hover:border-amber-500/40 transition-all"
              >
                <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" />
                <span>Mess ➔ Food Reviews</span>
              </Link>

              <Link
                href="/student"
                onClick={() => sound.playClick()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-blue-500/20 text-slate-200 hover:text-blue-300 border border-white/[0.06] hover:border-blue-500/40 transition-all"
              >
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span>Rooms ➔ Student Portal</span>
              </Link>

              <Link
                href="/management"
                onClick={() => sound.playClick()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-purple-500/20 text-slate-200 hover:text-purple-300 border border-white/[0.06] hover:border-purple-500/40 transition-all"
              >
                <Activity className="h-3.5 w-3.5 text-purple-400" />
                <span>Office ➔ Management</span>
              </Link>

              <Link
                href="/memories"
                onClick={() => sound.playClick()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-pink-500/20 text-slate-200 hover:text-pink-300 border border-white/[0.06] hover:border-pink-500/40 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                <span>Rooftop ➔ DreamCast Memories</span>
              </Link>
            </div>
          </div>

          {/* Real-time Atmosphere Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-xs text-slate-400 font-light">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Campus Status: Serene &amp; Operational</span>
            </div>
            <div className="flex items-center gap-6">
              <span>284 Residents Home</span>
              <span>•</span>
              <span>1 Gbps Optical Mesh Active</span>
              <span>•</span>
              <span className="text-amber-400">Mess: Preparing Dinner (8:00 PM)</span>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          STORYTELLING CHAPTER I: ARCHITECTURAL ATMOSPHERE
         ========================================================================= */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="vision-glass-warm rounded-3xl p-8 sm:p-14 space-y-8 relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Chapter I • The Sanctuary
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Built for Deep Focus by Day.<br />
                Vibrant Community by Night.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                COZY DEN was designed from the ground up to replace cold institutional dormitories with 
                an emotionally resonant home. With natural cross-ventilation, chocolate brown balcony alcoves, 
                dedicated 24/7 quiet study pods, and warm evening lighting, every corner is crafted to dignify 
                your university years.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/[0.08]">
              <div className="space-y-2">
                <div className="text-amber-400 font-bold text-lg font-mono">01. Optical Mesh</div>
                <h3 className="text-white font-semibold text-sm">Gigabit WiFi in Every Pod</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Enterprise access points deployed across all corridors with zero packet latency from 
                  your desk to the rooftop terrace.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-amber-400 font-bold text-lg font-mono">02. Restful Hours</div>
                <h3 className="text-white font-semibold text-sm">Strict 10 PM Quiet Protocol</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Automatic noise dampening and peaceful corridor rules so every student can sleep, 
                  recharge, or study undisturbed.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-amber-400 font-bold text-lg font-mono">03. Warm Lighting</div>
                <h3 className="text-white font-semibold text-sm">Comfort-Tuned Kelvin Scale</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Soothing evening tungsten and amber lanterns that reduce screen fatigue and invite 
                  genuine late-night conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          STORYTELLING CHAPTER II: THE DAILY RHYTHM
         ========================================================================= */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Chapter II • The Pulse
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              The Daily Rhythm of COZY DEN
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              How our community moves, feeds, creates, and unwinds through the hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Morning */}
            <div className="vision-glass rounded-3xl p-6 space-y-4 hover:border-amber-400/30 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-amber-400 font-bold">09:00 AM</span>
                <Sun className="h-4 w-4 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Sunrise Feast</h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Crispy ghee roast masala dosa, fluffy idlis, boiled eggs, fresh fruits, and hot filter coffee 
                at the Ground Mess Hall.
              </p>
              <div className="text-[11px] text-amber-400/90 font-medium pt-2 border-t border-white/[0.06]">
                Chef Special: Ghee Roast Dosa
              </div>
            </div>

            {/* Midday */}
            <div className="vision-glass rounded-3xl p-6 space-y-4 hover:border-amber-400/30 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-blue-400 font-bold">01:00 PM</span>
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Grand Lunch Dining</h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Shahi paneer, dal makhani, fragrant jeera rice, butter naan, cucumber raita, and sweet gulab jamun.
              </p>
              <div className="text-[11px] text-blue-400/90 font-medium pt-2 border-t border-white/[0.06]">
                Capacity: 120 Residents
              </div>
            </div>

            {/* Sunset */}
            <div className="vision-glass rounded-3xl p-6 space-y-4 hover:border-amber-400/30 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-orange-400 font-bold">06:00 PM</span>
                <Coffee className="h-4 w-4 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Sunset High Tea</h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Hot samosas with mint chutney, vegetable pakoras, and freshly brewed cardamom ginger chai in the courtyard.
              </p>
              <div className="text-[11px] text-orange-400/90 font-medium pt-2 border-t border-white/[0.06]">
                Courtyard Acoustic Hour
              </div>
            </div>

            {/* Night */}
            <div className="vision-glass rounded-3xl p-6 space-y-4 hover:border-amber-400/30 transition-all">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-purple-400 font-bold">08:00 PM</span>
                <Moon className="h-4 w-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Warm Dinner &amp; Terrace</h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Smoky kadai vegetables, yellow tadka dal, phulkas, followed by stargazing and music on the DreamCast Sky Terrace.
              </p>
              <div className="text-[11px] text-purple-400/90 font-medium pt-2 border-t border-white/[0.06]">
                Sky Lounge Stargazing
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          STORYTELLING CHAPTER III: THE 48-HOUR RESOLUTION GUARANTEE
         ========================================================================= */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="vision-glass rounded-3xl p-8 sm:p-14 border border-rose-500/20 space-y-6 relative overflow-hidden">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400">
                Chapter III • Care &amp; Dignity
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Every Issue Resolved in 48 Hours.<br />
                Or Management Gets a RED ALERT.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                A leaking tap, flickering study lamp, or slow WiFi connection isn&apos;t just an IT ticket — 
                it is your daily peace of mind. We hold ourselves strictly accountable: if any unresolved grievance 
                exceeds 48 hours, our autonomous background worker dispatches an immediate critical alert 
                directly to Head Warden Dr. Anita Desai and faculty leadership.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/complaints"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-500 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-rose-600/25 transition-all"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Open Grievance Radar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsComplaintOpen(true);
                }}
                className="flex items-center gap-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] px-5 py-3 text-xs font-semibold text-slate-200 transition-all"
              >
                <span>Report an Issue Now</span>
              </button>

              <span className="text-xs text-slate-400 font-light pl-2">
                Anonymous reporting strictly supported.
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          STORYTELLING CHAPTER IV: DREAMCAST MEMORY LOUNGE
         ========================================================================= */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="vision-glass rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-widest text-pink-400">
                  Chapter IV • Soul &amp; Brotherhood
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  DreamCast PicBot AI Lounge
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Hostel years fly by in an instant. DreamCast indexes community moments from rooftop jam sessions, 
                  festivals, and late-night mess laughter. Search any memory instantly using AI face recognition, 
                  with guaranteed resident biometric consent and strict privacy safeguards.
                </p>
              </div>

              <Link
                href="/memories"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-pink-600/25 hover:opacity-90 transition-all shrink-0"
              >
                <Camera className="h-4 w-4" />
                <span>Explore Memory Lounge</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          CHAPTER V: DIGITAL SANCTUARY DOORWAYS (ENTER YOUR SPACE)
         ========================================================================= */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Chapter V • Doorways
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Step Into Your Space
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Choose your sanctuary to access tailored services, schedules, and tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link
              href="/student"
              onClick={() => sound.playClick()}
              className="vision-glass p-6 rounded-3xl space-y-4 hover:border-blue-400/40 group transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                My Hostel Suite
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Your personal resident room dashboard, digital pass, active quiet hours, and personal issue history.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold pt-2">
                <span>Enter Room</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/food"
              onClick={() => sound.playClick()}
              className="vision-glass p-6 rounded-3xl space-y-4 hover:border-amber-400/40 group transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                The Dining Hall
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Today&apos;s 4-meal live menu, nutrition insights, chef specials, and verified student culinary reviews.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold pt-2">
                <span>Check Daily Menu</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/complaints"
              onClick={() => sound.playClick()}
              className="vision-glass p-6 rounded-3xl space-y-4 hover:border-rose-400/40 group transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                Grievance Radar
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Report WiFi, plumbing, or room issues with photo attachments and 48-hour automated escalation.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold pt-2">
                <span>File Grievance</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/management"
              onClick={() => sound.playClick()}
              className="vision-glass p-6 rounded-3xl space-y-4 hover:border-purple-400/40 group transition-all"
            >
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Warden Operations
              </h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Management control room with IoT environmental sensors, red alerts, and full floor status.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold pt-2">
                <span>Access Console</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Global Modals */}
      <ComplaintModal isOpen={isComplaintOpen} onClose={() => setIsComplaintOpen(false)} />
      <FoodRatingModal isOpen={isFoodRatingOpen} onClose={() => setIsFoodRatingOpen(false)} defaultMeal="Dinner" />

    </div>
  );
}
