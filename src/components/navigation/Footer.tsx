'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Heart, Shield, Phone, Gamepad2, Sparkles, MapPin, Radio } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { healthScores } = useApp();

  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Vision */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="text-base font-extrabold tracking-wider text-white">COZY DEN</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Where modern living meets hostel soul. A multi-layer digital experience crafted for 
              residents, mentors, and management.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Smart IoT Grid: 99.9% uptime</span>
            </div>
          </div>

          {/* Quick Hub Portals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Living Portals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/student" className="hover:text-blue-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/management" className="hover:text-blue-400 transition-colors">
                  Management Control Room
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-blue-400 transition-colors">
                  Teacher & Warden Desk
                </Link>
              </li>
              <li>
                <Link href="/food" className="hover:text-blue-400 transition-colors">
                  Mess Menu & Food Ratings
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="hover:text-blue-400 transition-colors">
                  Grievance & Escalation Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Nostalgic Memory Corner & AI */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Hostel Soul</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/game" className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  <Gamepad2 className="h-3.5 w-3.5" />
                  <span>Hostel Life Memory Game (8-Bit)</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Ask Cozy Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-blue-400 transition-colors">
                  Campus Digital Bulletin
                </Link>
              </li>
              <li>
                <span className="inline-block rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] text-emerald-400">
                  Hostel Health Score: {healthScores.overall}/100
                </span>
              </li>
            </ul>
          </div>

          {/* Emergency & Safe Harbor */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">24/7 Safe Harbor</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-rose-400" />
                <span className="font-semibold text-rose-400">Emergency SOS: +91 99887 76655</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-blue-400" />
                <span>Warden Cabin: Ground Floor, Wing A</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                <span>Night Curfew: 10:30 PM (Bio-metric Gate)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 COZY DEN. Engineered with Next.js, Three.js & Supabase.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for real hostel memories with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>& spatial vision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
