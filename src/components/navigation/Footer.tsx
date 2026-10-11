'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Heart, Shield, Phone, Sparkles, MapPin, Radio, Compass } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { healthScores } = useApp();

  return (
    <footer className="mt-32 border-t border-white/[0.08] bg-gradient-to-b from-transparent via-[#070b18]/80 to-[#040711] backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Architectural Vision */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-wider text-white">COZY DEN</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              A digital sanctuary where architectural beauty meets real hostel soul. 
              Built for residents, mentors, and staff.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-wide">Campus Residence Online</span>
            </div>
          </div>

          {/* Core Sanctuaries */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
              Hostel Spaces
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <Link href="/student" className="hover:text-amber-300 transition-colors">
                  My Hostel Suite
                </Link>
              </li>
              <li>
                <Link href="/food" className="hover:text-amber-300 transition-colors">
                  The Dining Hall &amp; Menu
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="hover:text-amber-300 transition-colors">
                  Grievance &amp; 48h Escalation
                </Link>
              </li>
              <li>
                <Link href="/memories" className="hover:text-amber-300 transition-colors">
                  DreamCast Photo Lounge
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-amber-300 transition-colors">
                  Cozy Assistant AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Living Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
              Daily Living
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>
                <Link href="/announcements" className="hover:text-amber-300 transition-colors">
                  Digital Bulletin Notices
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-amber-300 transition-colors">
                  Digital Resident Pass
                </Link>
              </li>
              <li>
                <Link href="/game" className="hover:text-amber-300 transition-colors">
                  Hostel Nostalgia Game (8-Bit)
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] text-amber-300 mt-1 font-medium">
                  Hostel Health: {healthScores.overall}/100
                </span>
              </li>
            </ul>
          </div>

          {/* 24/7 Care & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-4">
              24/7 Resident Care
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 font-light">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-slate-300 font-medium">Health Pod / Warden Desk: Ext. 108</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-blue-400" />
                <span>Head Warden Dr. Anita Desai (+91 98765-43210)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>Main Gate Curfew: 10:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="mt-14 border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light">
          <p>© 2026 COZY DEN HostelOS. Built for student dignity, warmth &amp; community.</p>
          <div className="flex items-center gap-1.5">
            <span>Render AI Workers</span>
            <span>•</span>
            <span>Supabase Realtime</span>
            <span>•</span>
            <span className="text-amber-400">Warm Hostel Lights</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
