'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MealType } from '@/types';
import { X, Star, UtensilsCrossed, CheckCircle2, Sparkles } from 'lucide-react';

interface FoodRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMeal?: MealType;
}

export default function FoodRatingModal({ isOpen, onClose, defaultMeal }: FoodRatingModalProps) {
  const { addReview, currentUser } = useApp();
  const [mealType, setMealType] = useState<MealType>(defaultMeal || 'Lunch');
  const [taste, setTaste] = useState(5);
  const [quality, setQuality] = useState(5);
  const [hygiene, setHygiene] = useState(5);
  const [quantity, setQuantity] = useState(5);
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      meal_type: mealType,
      date: new Date().toISOString().split('T')[0],
      taste_rating: taste,
      quality_rating: quality,
      hygiene_rating: hygiene,
      quantity_rating: quantity,
      comments: comments || 'Delicious and well-prepared meal.',
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setComments('');
    }, 1500);
  };

  const renderStarSelector = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    description: string
  ) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-white">{label}</span>
        <span className="text-xs font-bold text-amber-400">{value}/5</span>
      </div>
      <p className="text-[10px] text-slate-400 mb-2">{description}</p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setValue(star)}
            className="p-1 hover:scale-125 transition-transform"
          >
            <Star
              className={`h-5 w-5 ${
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Review Recorded!</h3>
            <p className="text-xs text-slate-400">
              Your feedback immediately updates the Hostel Food Health Score.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-amber-400" />
                <span>Rate Today&apos;s Hostel Meal</span>
              </h3>
              <p className="text-xs text-slate-400">
                Four-pillar feedback directly influences mess committee ratings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Meal Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Meal Session
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Breakfast', 'Lunch', 'High Tea', 'Dinner'] as MealType[]).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMealType(m)}
                      className={`rounded-xl py-2 px-1 text-center text-xs font-medium border transition-all ${
                        mealType === m
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold shadow-md'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Four Pillar Rating Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderStarSelector('Taste', taste, setTaste, 'Flavor, seasoning, warmth')}
                {renderStarSelector('Quality', quality, setQuality, 'Freshness & ingredients')}
                {renderStarSelector('Hygiene', hygiene, setHygiene, 'Cleanliness of counter & cutlery')}
                {renderStarSelector('Quantity', quantity, setQuantity, 'Portion sufficiency & refills')}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Comments & Suggestions
                </label>
                <textarea
                  rows={2}
                  placeholder="What was great? Anything the mess staff should improve?"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Submit Food Rating</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
