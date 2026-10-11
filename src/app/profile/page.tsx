'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserRole, HostelPosition } from '@/types';
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
  RotateCcw
} from 'lucide-react';

const POSITIONS: HostelPosition[] = [
  'Room leader',
  'Floor representative',
  'Warden',
  'Mess manager',
  'Admin',
  'Resident',
  'Faculty Advisor',
];

export default function ProfilePage() {
  const { currentUser, setCurrentUser, switchRole } = useApp();
  
  const [name, setName] = useState(currentUser.full_name);
  const [age, setAge] = useState(currentUser.age);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [position, setPosition] = useState<HostelPosition>(currentUser.position);
  const [room, setRoom] = useState(currentUser.room_number);
  const [wing, setWing] = useState(currentUser.wing);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      full_name: name,
      age: Number(age),
      email,
      phone,
      role,
      position,
      room_number: room,
      wing,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-3xl font-black text-white shadow-xl">
            {currentUser.full_name.charAt(0)}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.full_name}</h1>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30 capitalize">
                {currentUser.role}
              </span>
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                {currentUser.position}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {currentUser.email} • {currentUser.room_number} (Wing {currentUser.wing})
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ROLE SWITCHER FOR TESTING */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Instant Persona &amp; Role Switcher</span>
            </h3>
            <p className="text-xs text-slate-400">
              Easily toggle between student, teacher, or management views to test the platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              switchRole('student', 'Room leader');
              setRole('student');
              setPosition('Room leader');
            }}
            className={`rounded-2xl border p-4 text-left transition-all ${
              currentUser.role === 'student'
                ? 'border-cyan-500 bg-cyan-950/30 shadow-lg'
                : 'border-white/5 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Student View</span>
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Meal timings, food review forms, and personal grievance reporting.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('teacher', 'Faculty Advisor');
              setRole('teacher');
              setPosition('Faculty Advisor');
            }}
            className={`rounded-2xl border p-4 text-left transition-all ${
              currentUser.role === 'teacher'
                ? 'border-purple-500 bg-purple-950/30 shadow-lg'
                : 'border-white/5 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Teacher / Mentor</span>
              <span className="h-2 w-2 rounded-full bg-purple-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Quiet study hours audit, welfare index, and student rep directory.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              switchRole('management', 'Warden');
              setRole('management');
              setPosition('Warden');
            }}
            className={`rounded-2xl border p-4 text-left transition-all ${
              currentUser.role === 'management'
                ? 'border-emerald-500 bg-emerald-950/30 shadow-lg'
                : 'border-white/5 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Management Control</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Hostel Health Scores, staff assignment, and 48h Smart Escalation.
            </p>
          </button>
        </div>
      </div>

      {/* EDIT PROFILE FORM */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4">Edit Resident Information</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hostel Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="management">Management Member</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hostel Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as HostelPosition)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Room Number</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Profile updated successfully!</span>
              </span>
            )}
            <button
              type="submit"
              className="ml-auto rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
