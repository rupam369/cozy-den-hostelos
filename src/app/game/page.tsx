'use client';

import React from 'react';
import HostelMemoryGame from '@/components/game/HostelMemoryGame';
import { Gamepad2, Sparkles, Heart, Trophy } from 'lucide-react';

export default function GamePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 py-4">
      
      {/* Page Header */}
      <div className="text-center space-y-2 mb-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-xl">
          <Gamepad2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>8-Bit Nostalgic Arcade</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-mono">
          CURFEW RUN: HOSTEL LIFE
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Sprint through the hostel corridor after lights out. Dodge the roaming warden&apos;s beam,
          jump laundry buckets, and collect Chai, Samosas, Maggi &amp; Exam Notes to unlock unforgettable hostel memories!
        </p>
      </div>

      {/* Embedded Game Component */}
      <HostelMemoryGame />

      {/* Memory Lore Card */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl text-center space-y-2">
        <Heart className="mx-auto h-6 w-6 text-rose-500 fill-rose-500" />
        <h3 className="text-sm font-bold text-white">Why We Built This</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Hostel isn&apos;t just walls, keys, and meal tokens. It&apos;s boiling midnight Maggi in room kettles,
          sharing notes an hour before exams, singing guitar chords on breezy rooftops, and lifetime friendships.
        </p>
      </div>

    </div>
  );
}
