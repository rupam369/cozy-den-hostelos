'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Bell, 
  Bot, 
  Gamepad2, 
  UserCheck, 
  UtensilsCrossed, 
  AlertCircle, 
  Megaphone, 
  ShieldAlert, 
  ChevronDown, 
  Menu, 
  X,
  Sparkles,
  ExternalLink,
  Camera
} from 'lucide-react';
import { UserRole, HostelPosition } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchRole, notifications, markAsRead, markAllAsRead } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const redAlertCount = notifications.filter((n) => !n.is_read && n.type === 'red').length;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/student', label: 'Student' },
    { href: '/teacher', label: 'Teacher' },
    { href: '/management', label: 'Management' },
    { href: '/picbot', label: 'PicBot AI', icon: Sparkles, badge: 'Face AI' },
    { href: '/memories', label: 'Memories', icon: Camera, badge: 'Photos' },
    { href: '/food', label: 'Food Reviews' },
    { href: '/complaints', label: 'Complaints' },
    { href: '/announcements', label: 'Notices' },
    { href: '/ai-assistant', label: 'AI Assistant', badge: 'Cozy AI' },
    { href: '/game', label: 'Memory Game', icon: Gamepad2 },
  ];

  const positionsByRole: Record<UserRole, HostelPosition[]> = {
    student: ['Room leader', 'Floor representative', 'Resident'],
    teacher: ['Faculty Advisor', 'Warden'],
    management: ['Warden', 'Mess manager', 'Admin'],
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 transition-all">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl px-4 py-2.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/80 backdrop-blur-sm">
                <Building2 className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-white text-base bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                  COZY DEN
                </span>
                <span className="rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/30">
                  Spatial 3D
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Digital Hostel Ecosystem</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5 text-amber-400" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-1.5 py-0.2 text-[9px] font-semibold text-white">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Suite: Notifications, Role Switcher, Profile */}
          <div className="flex items-center gap-2">

            {/* Notification Bell with Real-time Alerts */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsRoleMenuOpen(false);
                }}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 transition-all ${
                  isNotifOpen
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title="Hostel Live Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white shadow-lg ${
                      redAlertCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/15 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl z-50">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-white">
                        Hostel Pulse Alerts
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">No new alerts.</p>
                    ) : (
                      notifications.slice(0, 6).map((n) => {
                        const typeStyles = {
                          red: 'border-red-500/30 bg-red-950/30 text-red-200',
                          yellow: 'border-amber-500/30 bg-amber-950/30 text-amber-200',
                          green: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-200',
                        }[n.type];

                        const badgeColor = {
                          red: 'bg-red-500',
                          yellow: 'bg-amber-500',
                          green: 'bg-emerald-500',
                        }[n.type];

                        return (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`cursor-pointer rounded-xl border p-2.5 transition-all hover:bg-white/5 ${typeStyles} ${
                              !n.is_read ? 'ring-1 ring-white/15' : 'opacity-75'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${badgeColor}`} />
                              <div className="flex-1">
                                <h4 className="text-xs font-semibold text-white">{n.title}</h4>
                                <p className="mt-0.5 text-[11px] text-slate-300 leading-relaxed">
                                  {n.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-2 border-t border-white/10 pt-2 text-center">
                    <Link
                      href="/complaints"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs font-medium text-blue-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <span>View All Grievances & Status</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher (Apple Vision Pro Pill) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsRoleMenuOpen(!isRoleMenuOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white hover:bg-white/10 transition-all"
              >
                <div className={`h-2 w-2 rounded-full ${
                  currentUser.role === 'student' ? 'bg-cyan-400' :
                  currentUser.role === 'teacher' ? 'bg-violet-400' : 'bg-emerald-400'
                }`} />
                <span className="capitalize font-medium">{currentUser.role}</span>
                <span className="hidden sm:inline text-[10px] text-slate-400 font-normal">
                  ({currentUser.position})
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/15 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
                  <p className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Switch Persona View
                  </p>
                  {(['student', 'teacher', 'management'] as UserRole[]).map((r) => (
                    <div key={r} className="mb-1">
                      <button
                        onClick={() => {
                          switchRole(r);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                          currentUser.role === r
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="capitalize">{r} Dashboard</span>
                        {currentUser.role === r && <UserCheck className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-1.5 mt-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsRoleMenuOpen(false)}
                      className="block rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 text-center"
                    >
                      Edit Profile & Position →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Button */}
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden border border-white/15 bg-gradient-to-tr from-slate-800 to-indigo-900 shadow-md hover:scale-105 transition-transform"
              title="My Cozy Den Profile"
            >
              <span className="text-xs font-bold text-white">
                {currentUser.full_name.charAt(0)}
              </span>
            </Link>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden mt-3 border-t border-white/10 pt-3 pb-1 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-amber-400" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded-full bg-purple-500/80 px-2 py-0.5 text-[10px] text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
