'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Bell, 
  Sparkles, 
  Menu, 
  X,
  User,
  ShieldCheck,
  ChevronDown,
  AlertTriangle,
  LogOut,
  Compass
} from 'lucide-react';
import { UserRole } from '@/types';
import { sound } from '@/lib/sound';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole, notifications, markAllAsRead } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const redAlertCount = notifications.filter((n) => !n.is_read && n.type === 'red').length;

  // Exact simplified navigation required by user
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'My Hostel', href: '/student' },
    { label: 'Food', href: '/food' },
    { label: 'Issues', href: '/complaints' },
    { label: 'Memories', href: '/memories' },
    { label: 'AI Assistant', href: '/ai-assistant' },
    { label: 'Profile', href: '/profile' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    sound.playClick();
    switchRole(role);
    setIsRoleMenuOpen(false);
    if (role === 'management') router.push('/management');
    else if (role === 'teacher') router.push('/teacher');
    else router.push('/student');
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-2 transition-all">
      <div className="mx-auto max-w-7xl">
        <div className="vision-pill flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 rounded-full">
          
          {/* Brand Emblem */}
          <Link 
            href="/" 
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500/20 to-blue-500/20 border border-white/10 group-hover:border-amber-400/40 transition-colors">
              <Building2 className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-sm sm:text-base text-white">
                COZY DEN
              </span>
              <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => sound.playClick()}
                  className={`relative px-3.5 py-1.5 text-xs tracking-wide transition-all rounded-full ${
                    isActive
                      ? 'text-white font-semibold bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-3 rounded-full bg-amber-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Notification & Profile Role */}
          <div className="flex items-center gap-2">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsNotifOpen(!isNotifOpen);
                  setIsRoleMenuOpen(false);
                }}
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ${
                    redAlertCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl vision-glass p-4 text-left shadow-2xl z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Hostel Radar</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-slate-400 hover:text-white transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04] py-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No active alerts. All systems serene.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="py-2.5 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-semibold ${n.type === 'red' ? 'text-rose-400' : 'text-slate-200'}`}>
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Resident Pill / Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsRoleMenuOpen(!isRoleMenuOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.18] transition-all"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {currentUser.full_name?.charAt(0) || 'R'}
                </div>
                <div className="hidden sm:block text-left text-xs leading-none">
                  <div className="font-semibold text-white">{currentUser.room_number || 'Room 101'}</div>
                  <div className="text-[9px] text-amber-400/90 capitalize">{currentUser.role}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl vision-glass p-2 text-left shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-white/[0.08]">
                    <div className="text-xs font-semibold text-white">{currentUser.full_name}</div>
                    <div className="text-[10px] text-slate-400">{currentUser.email || 'resident@cozyden.internal'}</div>
                  </div>

                  <div className="py-1 text-xs">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Switch Role View
                    </div>
                    {(['student', 'teacher', 'management'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left capitalize transition-colors ${
                          currentUser.role.toLowerCase() === role
                            ? 'bg-amber-500/15 text-amber-300 font-semibold'
                            : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <span>{role === 'management' ? 'Management Member' : role}</span>
                        {currentUser.role.toLowerCase() === role && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-white/[0.08]">
                    <Link
                      href="/profile"
                      onClick={() => setIsRoleMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Resident Profile &amp; Pass</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

          </div>

        </div>

        {/* Mobile Fullscreen Glass Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-3xl vision-glass p-5 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      sound.playClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-semibold'
                        : 'text-slate-200 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between px-2 text-xs text-slate-400">
              <span>{currentUser.room_number} • Wing {currentUser.wing}</span>
              <span className="text-amber-400 capitalize">{currentUser.role}</span>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
