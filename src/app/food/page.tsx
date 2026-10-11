'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { getCurrentMealStatus } from '@/lib/utils';
import FoodRatingModal from '@/components/modals/FoodRatingModal';
import { MealType } from '@/types';
import { 
  UtensilsCrossed, 
  Star, 
  Sparkles, 
  Clock, 
  Heart, 
  Coffee, 
  Sun, 
  Moon, 
  Flame, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  Award,
  LucideIcon
} from 'lucide-react';

export default function FoodReviewsPage() {
  const { reviews, meals } = useApp();
  const [mealStatus, setMealStatus] = useState<{ current: MealType; status: 'active' | 'upcoming'; nextTime: string }>({
    current: 'Lunch',
    status: 'active',
    nextTime: 'Ends at 2:00 PM',
  });

  useEffect(() => {
    setMealStatus(getCurrentMealStatus());
  }, []);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Lunch');
  const [filterMeal, setFilterMeal] = useState<string>('all');

  // Compute 4-pillar averages
  const totalRev = reviews.length || 1;
  const avgTaste = (reviews.reduce((sum, r) => sum + r.taste_rating, 0) / totalRev).toFixed(1);
  const avgQuality = (reviews.reduce((sum, r) => sum + r.quality_rating, 0) / totalRev).toFixed(1);
  const avgHygiene = (reviews.reduce((sum, r) => sum + r.hygiene_rating, 0) / totalRev).toFixed(1);
  const avgQuantity = (reviews.reduce((sum, r) => sum + r.quantity_rating, 0) / totalRev).toFixed(1);
  const overallAvg = (
    (parseFloat(avgTaste) + parseFloat(avgQuality) + parseFloat(avgHygiene) + parseFloat(avgQuantity)) /
    4
  ).toFixed(2);

  const filteredReviews = filterMeal === 'all'
    ? reviews
    : reviews.filter((r) => r.meal_type === filterMeal);

  const mealIcons: Record<MealType, LucideIcon> = {
    Breakfast: Sun,
    Lunch: UtensilsCrossed,
    'High Tea': Coffee,
    Dinner: Moon,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-amber-950/60 via-slate-900/80 to-orange-950/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                Ground Floor Mess &amp; Dining Hall
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] text-emerald-300 font-bold">
                Chef Verified Kitchen
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Food Ratings &amp; Mess Menu
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Transparent democratic dining. Four-pillar reviews from residents directly calibrate kitchen standards.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedMeal(mealStatus.current);
              setIsRatingModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all w-fit"
          >
            <Star className="h-4 w-4 fill-white" />
            <span>Rate Today&apos;s Meal</span>
          </button>
        </div>
      </div>

      {/* FOUR-PILLAR RATINGS HERO (Taste, Quality, Hygiene, Quantity) */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Student Verified Metrics
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              The Four Pillars of Dining Quality
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-300">
            <Award className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xs font-bold">Composite Rating</p>
              <p className="text-lg font-black text-white">{overallAvg} / 5.0 ⭐</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Taste */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Taste</span>
              <span className="text-sm font-black text-amber-400">{avgTaste} / 5.0</span>
            </div>
            <p className="text-[11px] text-slate-400">Seasoning, authenticity, spice balance &amp; flavor</p>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full" 
                style={{ width: `${(parseFloat(avgTaste) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 2: Quality */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Quality</span>
              <span className="text-sm font-black text-amber-400">{avgQuality} / 5.0</span>
            </div>
            <p className="text-[11px] text-slate-400">Farm fresh vegetables, pure dairy &amp; grains</p>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-orange-400 rounded-full" 
                style={{ width: `${(parseFloat(avgQuality) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 3: Hygiene */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Hygiene</span>
              <span className="text-sm font-black text-emerald-400">{avgHygiene} / 5.0</span>
            </div>
            <p className="text-[11px] text-slate-400">UV sanitized cutlery, steam counters &amp; gloves</p>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full" 
                style={{ width: `${(parseFloat(avgHygiene) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 4: Quantity */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Quantity</span>
              <span className="text-sm font-black text-blue-400">{avgQuantity} / 5.0</span>
            </div>
            <p className="text-[11px] text-slate-400">Unlimited servings, warm refills &amp; healthy portions</p>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full" 
                style={{ width: `${(parseFloat(avgQuantity) / 5) * 100}%` }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* TODAY'S SCHEDULE (Breakfast, Lunch, High Tea, Dinner) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Today&apos;s Four Meal Timings
          </h2>
          <span className="text-xs text-amber-400 font-medium">Ground Floor Mess</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {meals.map((meal) => {
            const Icon = mealIcons[meal.meal_type];
            const isCurrent = mealStatus.current === meal.meal_type && mealStatus.status === 'active';

            return (
              <div
                key={meal.id}
                className={`rounded-3xl border p-5 backdrop-blur-xl ${
                  isCurrent
                    ? 'border-amber-500/50 bg-amber-950/20 ring-1 ring-amber-500/40'
                    : 'border-white/10 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    {meal.start_time} - {meal.end_time}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{meal.meal_type}</h3>
                <p className="text-xs text-slate-300 mt-1">{meal.title}</p>
                <div className="mt-3 border-t border-white/5 pt-2">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Items:</p>
                  <ul className="text-xs text-slate-300 space-y-0.5">
                    {meal.menu_items.map((it, i) => (
                      <li key={i} className="truncate">• {it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STUDENT REVIEWS FEED */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Resident Feedback Stream
            </h2>
            <p className="text-xs text-slate-400">
              Live reviews logged by students after each meal session.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/80 p-1">
            {['all', 'Breakfast', 'Lunch', 'High Tea', 'Dinner'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMeal(m)}
                className={`rounded-xl px-3 py-1 text-xs font-medium transition-all ${
                  filterMeal === m
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.user_name}</h4>
                  <p className="text-[10px] text-amber-400 font-semibold">{rev.meal_type} Review</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>{rev.average_rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{rev.comments}&rdquo;
              </p>

              {/* 4 Pillar Badges */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/5 text-[10px]">
                <div className="rounded-lg bg-white/5 px-2 py-1 flex items-center justify-between text-slate-300">
                  <span>Taste:</span>
                  <strong className="text-amber-400">{rev.taste_rating}★</strong>
                </div>
                <div className="rounded-lg bg-white/5 px-2 py-1 flex items-center justify-between text-slate-300">
                  <span>Quality:</span>
                  <strong className="text-orange-400">{rev.quality_rating}★</strong>
                </div>
                <div className="rounded-lg bg-white/5 px-2 py-1 flex items-center justify-between text-slate-300">
                  <span>Hygiene:</span>
                  <strong className="text-emerald-400">{rev.hygiene_rating}★</strong>
                </div>
                <div className="rounded-lg bg-white/5 px-2 py-1 flex items-center justify-between text-slate-300">
                  <span>Quantity:</span>
                  <strong className="text-blue-400">{rev.quantity_rating}★</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <FoodRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        defaultMeal={selectedMeal}
      />

    </div>
  );
}
