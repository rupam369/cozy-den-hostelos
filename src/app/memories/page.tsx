'use client';

import React from 'react';
import Link from 'next/link';
import MemoriesWall from '@/components/memories/MemoriesWall';
import { Heart, Sparkles, Camera, Users, VideoOff, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

export default function MemoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
      
      {/* =========================================================================
          HERO & SOUL OF COZY DEN
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-pink-400">
                DreamCast Rooftop Memory Vault
              </span>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-300 font-medium">
                Photos Only
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Moments That Turn Four Walls Into Home.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              From impromptu rooftop guitar jam sessions under the Bhopal sky to midnight chai in the courtyard 
              and hostel festival feasts — every photograph here captures the authentic soul of living together.
            </p>
          </div>

          <Link
            href="/picbot"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-pink-600/25 hover:opacity-90 transition-all shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch AI Face Search (PicBot)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE MEMORIES PHOTO WALL
         ========================================================================= */}
      <section>
        <MemoriesWall />
      </section>

    </div>
  );
}
