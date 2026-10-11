'use client';

import React from 'react';
import MemoriesWall from '@/components/memories/MemoriesWall';
import { Heart, Sparkles, Camera, Users, VideoOff } from 'lucide-react';

export default function MemoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      
      {/* Page Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-pink-950/60 via-slate-900/80 to-purple-950/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-300 border border-pink-500/30 flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-pink-400 fill-pink-400" />
              <span>Cozy Memories Vault</span>
            </span>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
              <VideoOff className="h-3 w-3" />
              <span>Strictly Photos Only (No Videos)</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Hostel Life Photo Memories
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Welcome to the community photo wall of COZY DEN. Browse authentic moments from our rooms,
            central atrium, evening terrace guitar jams, mess laughter, and campus walks.
            Upload your memories to keep them alive forever.
          </p>
        </div>
      </div>

      {/* Main Interactive Memories Wall */}
      <MemoriesWall />

    </div>
  );
}
