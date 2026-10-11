'use client';

import React from 'react';
import { 
  X, 
  UtensilsCrossed, 
  Clock, 
  Users, 
  Star, 
  ShieldCheck, 
  Flame, 
  Coffee, 
  HeartHandshake,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sound } from '@/lib/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenRating: () => void;
}

export default function MessInspectorModal({ isOpen, onClose, onOpenRating }: Props) {
  const { meals, healthScores, reviews } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-white/10 pr-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/80">
              <UtensilsCrossed className="h-7 w-7 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Ground Floor • Central Dining Wing
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                FSSAI Grade A+ Hygiene
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Cozy Mess &amp; Dining Hall</h2>
            <p className="text-xs text-slate-400">
              Four-Pillar Dining Quality System • Breakfast, Lunch, High Tea &amp; Dinner
            </p>
          </div>
        </div>

        {/* Live Capacity & Meal Health Overview */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Dining Score</span>
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">{healthScores.food}%</div>
            <p className="text-[10px] text-amber-300 mt-0.5">Top Resident Rated</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Hall Capacity</span>
              <Users className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">42%</div>
            <p className="text-[10px] text-blue-300 mt-0.5">50 / 120 Seated</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Today&apos;s Reviews</span>
              <HeartHandshake className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-white">{reviews.length} Logs</div>
            <p className="text-[10px] text-emerald-300 mt-0.5">96% Positive</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Hygiene Inspection</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400">100%</div>
            <p className="text-[10px] text-slate-400 mt-0.5">UV Sanitized</p>
          </div>
        </div>

        {/* Today's 4-Meal Menu Schedule */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              Today&apos;s 4-Meal Culinary Schedule
            </span>
            <span className="text-amber-300 text-[11px] normal-case">Freshly Prepared Hot Meals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-3.5 backdrop-blur-md space-y-2 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-bold text-amber-300">
                    {meal.meal_type}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{meal.start_time} - {meal.end_time}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-orange-400" />
                    <span>Special: {meal.chef_special || 'Chef Special Assortment'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {meal.menu_items?.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-slate-300 border border-white/5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mess Sanitation Protocols */}
        <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Cozy Den Dining Hygiene &amp; Quality Mandate</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All kitchen ingredients are locally sourced fresh daily. RO water tested every 24 hours. Cutlery passes through a 3-stage thermal &amp; UV sterilization tunnel before every serving session.
          </p>
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
              onOpenRating();
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
          >
            <Star className="h-4 w-4 fill-white" />
            <span>Rate Today&apos;s Meal (Taste, Quality, Hygiene)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
          >
            Close Mess Hub
          </button>
        </div>

      </div>
    </div>
  );
}
