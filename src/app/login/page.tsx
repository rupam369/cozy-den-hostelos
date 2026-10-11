'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole, HostelPosition, UserProfile } from '@/types';
import { 
  Building2, 
  Mail, 
  Phone, 
  Lock, 
  User, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Sparkles,
  KeyRound
} from 'lucide-react';

import { supabaseService } from '@/lib/supabaseService';
import { sound } from '@/lib/sound';

const POSITIONS_BY_ROLE: Record<UserRole, HostelPosition[]> = {
  student: ['Room leader', 'Floor representative', 'Resident'],
  teacher: ['Faculty Advisor', 'Warden'],
  management: ['Warden', 'Mess manager', 'Admin'],
};

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  // Onboarding Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(20);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [selectedPosition, setSelectedPosition] = useState<HostelPosition>('Room leader');
  const [roomNumber, setRoomNumber] = useState('Room 304');
  const [floor, setFloor] = useState<number>(3);
  const [wing, setWing] = useState('A');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number with country code (e.g. +91 98765 43210)');
      return;
    }
    sound.playClick();
    setIsLoading(true);
    await supabaseService.signInWithPhoneOtp(phone);
    setIsLoading(false);
    setIsOtpSent(true);
    sound.playChime();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      alert('Please enter the 6-digit verification code.');
      return;
    }
    sound.playClick();
    setIsLoading(true);
    await supabaseService.verifyPhoneOtp(phone, otpCode);

    if (authMode === 'signup') {
      setIsLoading(false);
      setStep(2); // Advance to Persona details
    } else {
      const user: UserProfile = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        email: email || 'resident@cozyden.edu',
        phone,
        full_name: fullName || 'Aryan Sharma',
        age: 21,
        role: selectedRole,
        position: selectedPosition,
        room_number: roomNumber,
        floor,
        wing,
        avatar_url: avatarUrl,
      };
      await supabaseService.upsertProfile(user);
      setCurrentUser(user);
      setIsLoading(false);
      sound.playChime();

      if (user.role === 'student') router.push('/student');
      else if (user.role === 'teacher') router.push('/teacher');
      else router.push('/management');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsLoading(true);

    if (authMethod === 'email') {
      await supabaseService.signInWithEmail(email, password);
    }

    const user: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: email || 'resident@cozyden.edu',
      phone: phone || '+91 98765 43210',
      full_name: fullName || 'Aryan Sharma',
      age: 21,
      role: selectedRole,
      position: selectedPosition,
      room_number: roomNumber,
      floor,
      wing,
      avatar_url: avatarUrl,
    };

    await supabaseService.upsertProfile(user);
    setCurrentUser(user);
    setIsLoading(false);
    sound.playChime();

    if (user.role === 'student') router.push('/student');
    else if (user.role === 'teacher') router.push('/teacher');
    else router.push('/management');
  };

  const handleSignUpComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCameraSwoosh();
    setIsLoading(true);

    const generatedEmail = email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@cozyden.edu`;

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: generatedEmail,
      phone,
      full_name: fullName,
      age: Number(age),
      role: selectedRole,
      position: selectedPosition,
      room_number: roomNumber,
      floor: Number(floor),
      wing,
      avatar_url: avatarUrl,
    };

    if (email && password) {
      await supabaseService.signUpWithEmail(email, password, newUser);
    }
    await supabaseService.upsertProfile(newUser);

    setCurrentUser(newUser);
    setIsLoading(false);
    sound.playChime();

    if (selectedRole === 'student') router.push('/student');
    else if (selectedRole === 'teacher') router.push('/teacher');
    else router.push('/management');
  };

  return (
    <div className="mx-auto max-w-md py-10 px-4">
      <div className="relative rounded-3xl border border-white/15 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-2xl">
        
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Brand Icon & Heading */}
        <div className="text-center mb-6 space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white">COZY DEN</h2>
          <p className="text-xs text-slate-400">
            {authMode === 'signup' 
              ? 'New Resident, Mentor or Warden Registration'
              : 'Sign In to Your Hostel Digital Experience'}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-slate-950/60 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setStep(1);
            }}
            className={`rounded-xl py-2 text-xs font-semibold transition-all ${
              authMode === 'signin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setStep(1);
            }}
            className={`rounded-xl py-2 text-xs font-semibold transition-all ${
              authMode === 'signup'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register / Onboard
          </button>
        </div>

        {/* SIGN IN FORM */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Email or Phone switch */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Sign in using:</span>
              <button
                type="button"
                onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}
                className="text-blue-400 hover:underline font-medium"
              >
                Use {authMethod === 'email' ? 'Phone Number' : 'Email Address'} instead
              </button>
            </div>

            {authMethod === 'email' ? (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@cozyden.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Role preview for signin */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Sign in As Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  const r = e.target.value as UserRole;
                  setSelectedRole(r);
                  setSelectedPosition(POSITIONS_BY_ROLE[r][0]);
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher / Faculty</option>
                <option value="management">Management Member</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Cozy Den'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* MULTI-STEP REGISTRATION & ONBOARDING */}
        {authMode === 'signup' && (
          <div>
            
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-5 px-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      step === s
                        ? 'bg-blue-600 text-white shadow-md'
                        : step > s
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {s === 1 ? 'Credentials' : s === 2 ? 'Persona' : 'Position'}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Credentials (Email/Phone + Password) */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Register with:</span>
                  <button
                    type="button"
                    onClick={() => setAuthMethod(authMethod === 'email' ? 'phone' : 'email')}
                    className="text-blue-400 hover:underline font-medium"
                  >
                    Use {authMethod === 'email' ? 'Phone' : 'Email'}
                  </button>
                </div>

                {authMethod === 'email' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@cozyden.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Set Secret Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue: Persona Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Name & Age & Role Selection */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aryan Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      required
                      min={16}
                      max={80}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Role selection buttons */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary Hostel Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'student', label: 'Student' },
                      { role: 'teacher', label: 'Teacher' },
                      { role: 'management', label: 'Management Member' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.role}
                        onClick={() => {
                          const r = item.role as UserRole;
                          setSelectedRole(r);
                          setSelectedPosition(POSITIONS_BY_ROLE[r][0]);
                        }}
                        className={`rounded-xl p-2.5 text-xs font-semibold border transition-all text-center ${
                          selectedRole === item.role
                            ? 'border-blue-500 bg-blue-600/20 text-white shadow-md'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!fullName.trim()}
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Next: Hostel Position</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Manual Hostel Position Selection & Room */}
            {step === 3 && (
              <form onSubmit={handleSignUpComplete} className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Hostel Position (Manual Selection)
                  </label>
                  <p className="text-[10px] text-slate-400 mb-2">
                    Designated role within the Cozy Den hostel governance hierarchy.
                  </p>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value as HostelPosition)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Room leader">Room leader</option>
                    <option value="Floor representative">Floor representative</option>
                    <option value="Warden">Warden</option>
                    <option value="Mess manager">Mess manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Resident">Resident</option>
                    <option value="Faculty Advisor">Faculty Advisor</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">
                      Room No.
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">
                      Floor
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={floor}
                      onChange={(e) => setFloor(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">
                      Wing
                    </label>
                    <select
                      value={wing}
                      onChange={(e) => setWing(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white"
                    >
                      <option value="A">Wing A</option>
                      <option value="B">Wing B</option>
                      <option value="C">Wing C</option>
                    </select>
                  </div>
                </div>

                {/* Profile Photo Selector (Used by PicBot & Resident Card) */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
                    Profile Photo &amp; Facial Key
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/20 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 flex-1">
                      {[
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                      ].map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setAvatarUrl(url);
                          }}
                          className={`relative h-9 rounded-lg overflow-hidden border transition-all ${
                            avatarUrl === url ? 'border-blue-400 ring-2 ring-blue-500/50 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary badge */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    <span>Role-Based Access Assigned</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Signing up as <strong className="text-white capitalize">{selectedRole}</strong> with position{' '}
                    <strong className="text-white">{selectedPosition}</strong> in {roomNumber}.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-xs font-bold text-white shadow-xl shadow-blue-500/25 hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{isLoading ? 'Creating Digital Profile...' : 'Complete Registration'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
