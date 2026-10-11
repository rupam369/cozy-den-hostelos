'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { HostelMemoryPhoto, MemoryCategory } from '@/types';
import UploadMemoryModal from '@/components/modals/UploadMemoryModal';
import { 
  Heart, 
  Plus, 
  Sparkles, 
  Tag, 
  MapPin, 
  X, 
  Maximize2, 
  Camera, 
  Filter,
  VideoOff
} from 'lucide-react';

export default function MemoriesWall() {
  const { memories, toggleLikeMemory } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<HostelMemoryPhoto | null>(null);

  const categories: string[] = [
    'all',
    'Room Hangouts',
    'Terrace Vibes',
    'Exam All-Nighter',
    'Mess Moments',
    'Hostel Fest',
    'Campus Walk',
  ];

  const filteredMemories = selectedCategory === 'all'
    ? memories
    : memories.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Wall Header & Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
              Resident Photo Vault
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
            <span className="rounded-full bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 text-[9px] font-bold text-pink-300">
              Photos Only (No Videos)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Cozy Memories &amp; Living Moments
          </h2>
          <p className="text-xs text-slate-400">
            A real student photo wall of hostel life, late nights, celebrations, and campus moments.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-pink-500/25 hover:scale-105 transition-all w-fit"
        >
          <Camera className="h-4 w-4" />
          <span>Upload Memory Photo</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-md'
                : 'border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900/90'
            }`}
          >
            {cat === 'all' ? 'All Memories' : cat}
          </button>
        ))}
      </div>

      {/* Memories Photo Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="group relative rounded-3xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl backdrop-blur-xl hover:border-pink-500/40 transition-all flex flex-col"
          >
            {/* Image Container with Hover Zoom */}
            <div
              onClick={() => setActiveLightboxPhoto(mem)}
              className="relative w-full h-56 overflow-hidden cursor-pointer bg-slate-950"
            >
              {mem.image_url.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mem.image_url}
                  alt={mem.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Image
                  src={mem.image_url}
                  alt={mem.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-slate-950/80 border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                  {mem.category}
                </span>
              </div>

              {/* Enlarge Hint */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                <Maximize2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Photo Info & Heart Action */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {mem.caption}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                  <span>👤 {mem.author_name}</span>
                  {mem.room_tag && (
                    <>
                      <span>•</span>
                      <span className="text-pink-300">📍 {mem.room_tag}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Heart Like Bar */}
              <div className="border-t border-white/5 pt-2.5 flex items-center justify-between">
                <button
                  onClick={() => toggleLikeMemory(mem.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl transition-all ${
                    mem.liked_by_me
                      ? 'text-pink-400 bg-pink-500/10 border border-pink-500/20'
                      : 'text-slate-400 hover:text-pink-400 hover:bg-white/5'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 transition-transform active:scale-125 ${
                      mem.liked_by_me ? 'fill-pink-500 text-pink-500' : ''
                    }`}
                  />
                  <span>{mem.likes}</span>
                </button>
                <span className="text-[10px] text-slate-500">
                  {new Date(mem.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {activeLightboxPhoto && (
        <div
          onClick={() => setActiveLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-3xl border border-white/20 bg-slate-900 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Close */}
            <button
              onClick={() => setActiveLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Photo View */}
            <div className="relative w-full h-[480px] bg-black">
              {activeLightboxPhoto.image_url.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeLightboxPhoto.image_url}
                  alt={activeLightboxPhoto.caption}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={activeLightboxPhoto.image_url}
                  alt={activeLightboxPhoto.caption}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* Footer Metadata */}
            <div className="p-6 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-xs font-bold text-pink-300">
                    {activeLightboxPhoto.category}
                  </span>
                  {activeLightboxPhoto.room_tag && (
                    <span className="text-xs text-slate-400">📍 {activeLightboxPhoto.room_tag}</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {activeLightboxPhoto.caption}
                </h3>
                <p className="text-xs text-slate-400">
                  Shared by <strong className="text-slate-200">{activeLightboxPhoto.author_name}</strong>
                </p>
              </div>

              <button
                onClick={() => toggleLikeMemory(activeLightboxPhoto.id)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold border transition-all ${
                  activeLightboxPhoto.liked_by_me
                    ? 'border-pink-500/40 bg-pink-500/20 text-pink-300'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    activeLightboxPhoto.liked_by_me ? 'fill-pink-500 text-pink-500' : ''
                  }`}
                />
                <span>{activeLightboxPhoto.likes} Loves</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadMemoryModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

    </div>
  );
}
