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
  Plus, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { sound } from '@/lib/sound';

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
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Dinner');
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
  ).toFixed(1);

  const filteredReviews = filterMeal === 'all'
    ? reviews
    : reviews.filter((r) => r.meal_type === filterMeal);

  const mealIcons = {
    Breakfast: Sun,
    Lunch: UtensilsCrossed,
    'High Tea': Coffee,
    Dinner: Moon,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
      
      {/* =========================================================================
          HERO & DINING SANCTUARY OVERVIEW
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              The Hostel Dining Hall
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Nourishment Crafted for Minds &amp; Community.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Dining at COZY DEN is where roommates unwind, debate, and bond over steaming meals. 
              Our kitchen prepares 4 daily services with fresh locally-sourced ingredients, strict hygiene protocols, 
              and transparent resident-led quality reviews.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setSelectedMeal(mealStatus.current);
              setIsRatingModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all shrink-0"
          >
            <Star className="h-4 w-4 fill-white" />
            <span>Rate Today&apos;s Meal</span>
          </button>
        </div>

        {/* 4-Pillar Quality Index Banner */}
        <div className="vision-glass-warm rounded-3xl p-6 sm:p-8 mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs text-amber-400 font-mono uppercase tracking-wider">Overall Satisfaction</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white">{overallAvg}</span>
                <span className="text-sm text-slate-400">/ 5.0</span>
              </div>
              <p className="text-xs text-slate-400 font-light">Based on {reviews.length} student tasting reviews</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-4 lg:pt-0 lg:pl-8">
              <div>
                <div className="text-xs text-slate-400 font-light">Taste &amp; Flavor</div>
                <div className="text-xl font-bold text-white mt-0.5">{avgTaste} <span className="text-xs text-amber-400">★</span></div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-light">Ingredient Quality</div>
                <div className="text-xl font-bold text-white mt-0.5">{avgQuality} <span className="text-xs text-amber-400">★</span></div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-light">Kitchen Hygiene</div>
                <div className="text-xl font-bold text-white mt-0.5">{avgHygiene} <span className="text-xs text-amber-400">★</span></div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-light">Serving Portion</div>
                <div className="text-xl font-bold text-white mt-0.5">{avgQuantity} <span className="text-xs text-amber-400">★</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 4-MEAL DAILY CULINARY SCHEDULE
         ========================================================================= */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Daily Dining Menu Book</h2>
          <p className="text-xs text-slate-400 font-light">Prepared fresh daily by Executive Chef Rohan Mehra and culinary staff.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meals.map((meal) => {
            const Icon = mealIcons[meal.meal_type as MealType] || UtensilsCrossed;
            const isCurrent = meal.meal_type === mealStatus.current;

            return (
              <div 
                key={meal.id} 
                className={`vision-glass rounded-3xl p-6 sm:p-7 space-y-4 relative overflow-hidden transition-all ${
                  isCurrent ? 'border-amber-400/40 ring-1 ring-amber-400/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{meal.meal_type}</h3>
                      <div className="text-[11px] text-slate-400 font-light flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{meal.start_time} - {meal.end_time}</span>
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                      Serving Now
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
                    {meal.menu_items?.join(', ') || meal.title}
                  </p>
                  {meal.chef_special && (
                    <div className="inline-block rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-300 font-medium">
                      Chef Special: {meal.chef_special}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          RESIDENT TASTING REVIEWS & COMMUNITY FEEDBACK
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Student Tasting Journal</h2>
            <p className="text-xs text-slate-400 font-light">Honest reviews directly from dining hall residents.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'Breakfast', 'Lunch', 'High Tea', 'Dinner'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterMeal(type)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                  filterMeal === type
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]'
                }`}
              >
                {type === 'all' ? 'All Meals' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="vision-glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{rev.user_name || 'Hostel Resident'}</span>
                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-slate-300">
                  {rev.meal_type}
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.round(rev.average_rating) ? 'fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
                <span className="text-[11px] font-bold text-slate-300 pl-1">{rev.average_rating}</span>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed">
                &ldquo;{rev.comments}&rdquo;
              </p>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-white/[0.06]">
                {rev.date || 'Today'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rating Modal */}
      <FoodRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        defaultMeal={selectedMeal}
      />

    </div>
  );
}
