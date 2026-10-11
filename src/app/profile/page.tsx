'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole, HostelPosition } from '@/types';
import { supabaseService } from '@/lib/supabaseService';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  RotateCcw,
  LogOut,
  Building2,
  Shield,
  Eye
} from 'lucide-react';
import { sound } from '@/lib/sound';

const POSITIONS: HostelPosition[] = [
  'Room Leader',
  'Floor Representative',
  'Resident',
  'Warden',
  'Faculty',
  'Faculty Advisor',
  'Admin',
  'Mess Manager',
  'Maintenance Head',
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, switchRole, updateUser, picBotConsent, togglePicBotConsent } = useApp();
  
  const [name, setName] = useState(currentUser.full_name);
  const [age, setAge] = useState(currentUser.age);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [position, setPosition] = useState<HostelPosition>(currentUser.position);
  const [room, setRoom] = useState(currentUser.room_number);
  const [wing, setWing] = useState(currentUser.wing);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const updated = {
      ...currentUser,
      full_name: name,
      name,
      age: Number(age),
      email,
      phone,
      role,
      position,
      hostel_position: position,
      room_number: room,
      wing,
    };
    updateUser(updated);

    // Save to Supabase profiles
    try {
      await supabaseService.upsertProfile(updated);
    } catch {
      // Offline fallback
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRoleChange = (newRole: UserRole) => {
    sound.playClick();
    setRole(newRole);
    switchRole(newRole);
  };

  const handleSignOut = async () => {
    sound.playClick();
    await supabaseService.signOut();
    router.push('/login');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-12">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Resident Identity &amp; Credentials
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Digital Hostel Pass
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light">
          Your official digital identity card, room credentials, and privacy permissions for COZY DEN.
        </p>
      </div>

      {/* =========================================================================
          DIGITAL WALLET RESIDENT PASS CARD
         ========================================================================= */}
      <div className="vision-glass-warm rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-amber-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl">
              {name?.charAt(0) || 'R'}
            </div>
            <div>
              <div className="text-2xl font-black text-white">{name}</div>
              <p className="text-xs text-amber-300 font-medium">{position} • Wing {wing}</p>
              <p className="text-[11px] text-slate-400 font-light">Scope Global Skills University Campus</p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <div className="text-3xl font-black text-white">{room || 'Room 304'}</div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center sm:justify-end gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Keycard Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-xs font-light">
          <div>
            <div className="text-slate-400">Resident Role</div>
            <div className="text-white font-medium capitalize mt-0.5">{role}</div>
          </div>
          <div>
            <div className="text-slate-400">Gate Curfew</div>
            <div className="text-white font-medium mt-0.5">10:00 PM Strict</div>
          </div>
          <div>
            <div className="text-slate-400">Resident Email</div>
            <div className="text-white font-medium truncate mt-0.5">{email || 'resident@cozyden.internal'}</div>
          </div>
          <div>
            <div className="text-slate-400">Biometric Opt-In</div>
            <div className="text-amber-300 font-medium mt-0.5">{picBotConsent?.enabled ? 'Consent Granted' : 'Privacy Locked'}</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROLE PERSPECTIVE SWITCHER
         ========================================================================= */}
      <div className="vision-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Active System Role</h2>
          <p className="text-xs text-slate-400 font-light">
            Toggle your active role view to experience the portal as a Student, Teacher/Warden, or Management Member.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['student', 'teacher', 'management'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === r
                  ? 'border-amber-400/50 bg-amber-500/15 text-white shadow-lg'
                  : 'border-white/[0.06] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06]'
              }`}
            >
              <div className="text-xs font-bold capitalize text-white">
                {r === 'management' ? 'Management Member' : r}
              </div>
              <div className="text-[11px] text-slate-400 font-light mt-1">
                {r === 'student' && 'Resident room suite, dining ratings, issue tracking.'}
                {r === 'teacher' && 'Mentorship console, academic quiet hours review.'}
                {r === 'management' && 'Executive command center, IoT telemetry, red alerts.'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          BIOMETRIC PRIVACY & DREAMCAST SETTINGS
         ========================================================================= */}
      <div className="vision-glass rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">DreamCast Biometric Consent</h2>
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Allow DreamCast PicBot to index your face from hostel campus photos so you can search your memories. 
            You can revoke biometric indexing permissions at any time.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            togglePicBotConsent(!picBotConsent?.enabled);
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            picBotConsent?.enabled
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-white/[0.05] text-slate-400 border border-white/[0.1]'
          }`}
        >
          {picBotConsent?.enabled ? '✓ Consent Enabled' : 'Disabled (Private)'}
        </button>
      </div>

      {/* =========================================================================
          EDITABLE CREDENTIALS FORM
         ========================================================================= */}
      <form onSubmit={handleSave} className="vision-glass rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white">Update Hostel Details</h2>
          <p className="text-xs text-slate-400 font-light">Make changes to your room assignment or emergency contact phone number.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Room Number</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Hostel Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as HostelPosition)}
              className="w-full rounded-2xl bg-[#070b18] border border-white/[0.08] px-4 py-3 text-white focus:outline-none focus:border-amber-400/50"
            >
              {POSITIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            className="rounded-full bg-amber-500 hover:bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-amber-500/20"
          >
            {isSaved ? '✓ Saved Successfully' : 'Save Changes'}
          </button>
        </div>
      </form>

    </div>
  );
}
