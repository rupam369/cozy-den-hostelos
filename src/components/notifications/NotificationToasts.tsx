'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  ExternalLink,
  Camera,
  UtensilsCrossed
} from 'lucide-react';
import Link from 'next/link';
import { sound } from '@/lib/sound';

export interface ActiveToast {
  id: string;
  title: string;
  message: string;
  type: 'red' | 'yellow' | 'green' | 'blue' | 'purple';
  link?: string;
  linkText?: string;
  timestamp: number;
}

export default function NotificationToasts() {
  const { notifications } = useApp();
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initial welcome toast and periodic hostel heartbeat
  useEffect(() => {
    // Pop initial toast after 1.5 seconds
    const initialTimer = setTimeout(() => {
      const initialToast: ActiveToast = {
        id: 'toast-init',
        title: '🌟 COZY DEN 3D Digital Twin Active',
        message: 'Spatial hostel environment loaded. Try the 3D walkthrough tour or click individual floors to inspect rooms.',
        type: 'blue',
        link: '/',
        linkText: 'Explore Twin',
        timestamp: Date.now(),
      };
      setToasts([initialToast]);
      sound.playChime(659.25);
    }, 1500);

    return () => clearTimeout(initialTimer);
  }, []);

  // Sync when critical unread notification exists
  useEffect(() => {
    const unreadCritical = notifications.find((n) => !n.is_read && n.type === 'red');
    if (unreadCritical) {
      setToasts((prev) => {
        if (prev.some((t) => t.id === unreadCritical.id)) return prev;
        const newToast: ActiveToast = {
          id: unreadCritical.id,
          title: unreadCritical.title,
          message: unreadCritical.message,
          type: 'red',
          link: '/complaints',
          linkText: 'View Grievance',
          timestamp: Date.now(),
        };
        sound.playAlert();
        return [newToast, ...prev].slice(0, 4);
      });
    }
  }, [notifications]);

  const removeToast = (id: string) => {
    sound.playClick();
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  return (
    <aside aria-label="Hostel Notifications" className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-2 sm:px-0">
      
      {/* Sound toggle pill */}
      {toasts.length > 0 && (
        <button
          onClick={toggleSound}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
          title={soundEnabled ? 'Mute Notification Chimes' : 'Enable Notification Chimes'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-3 w-3 text-emerald-400" />
              <span>Chimes On</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3 w-3 text-slate-400" />
              <span>Chimes Muted</span>
            </>
          )}
        </button>
      )}

      {/* Animated Stack */}
      <AnimatePresence>
        {toasts.map((toast) => {
          const typeConfig = {
            red: {
              border: 'border-red-500/40',
              bg: 'bg-slate-950/90',
              accent: 'bg-red-500 text-white',
              glow: 'shadow-[0_0_25px_rgba(239,68,68,0.25)]',
              icon: ShieldAlert,
              iconColor: 'text-red-400',
            },
            yellow: {
              border: 'border-amber-500/40',
              bg: 'bg-slate-950/90',
              accent: 'bg-amber-500 text-slate-950',
              glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
              icon: AlertTriangle,
              iconColor: 'text-amber-400',
            },
            green: {
              border: 'border-emerald-500/40',
              bg: 'bg-slate-950/90',
              accent: 'bg-emerald-500 text-slate-950',
              glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
              icon: CheckCircle2,
              iconColor: 'text-emerald-400',
            },
            blue: {
              border: 'border-blue-500/40',
              bg: 'bg-slate-950/90',
              accent: 'bg-blue-500 text-white',
              glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
              icon: Bell,
              iconColor: 'text-blue-400',
            },
            purple: {
              border: 'border-purple-500/40',
              bg: 'bg-slate-950/90',
              accent: 'bg-purple-500 text-white',
              glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
              icon: Camera,
              iconColor: 'text-purple-400',
            },
          }[toast.type];

          const IconComponent = typeConfig.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`pointer-events-auto relative w-full rounded-2xl border p-4 backdrop-blur-2xl text-left ${typeConfig.border} ${typeConfig.bg} ${typeConfig.glow} overflow-hidden shadow-2xl`}
            >
              {/* Animated Progress Bar (5s auto-dismiss) */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 7, ease: 'linear' }}
                onAnimationComplete={() => removeToast(toast.id)}
                className={`absolute top-0 left-0 h-0.5 ${typeConfig.accent}`}
              />

              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 ${typeConfig.iconColor}`}>
                  <IconComponent className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    {toast.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                    {toast.message}
                  </p>

                  {toast.link && (
                    <div className="mt-2.5">
                      <Link
                        href={toast.link}
                        onClick={() => removeToast(toast.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        <span>{toast.linkText || 'Inspect Details'}</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
}
