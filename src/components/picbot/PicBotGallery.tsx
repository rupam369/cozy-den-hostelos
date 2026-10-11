'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  PicBotMemory, 
  PicBotCategory 
} from '@/types';
import { 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Sparkles, 
  Download, 
  Maximize2, 
  Heart, 
  Eye, 
  Check, 
  X,
  Search,
  Scan
} from 'lucide-react';
import Image from 'next/image';
import { sound } from '@/lib/sound';

interface Props {
  memories: PicBotMemory[];
  onSelectMemoryForLightbox: (memory: PicBotMemory) => void;
}

export default function PicBotGallery({ memories, onSelectMemoryForLightbox }: Props) {
  const { currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedFriend, setSelectedFriend] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showFaceBoxes, setShowFaceBoxes] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Hostel Events',
    'Group Photos',
    'Trips & Outings',
    'Celebrations',
    'Sports & Games',
    'Daily Memories',
  ];

  const years = ['All', '2024', '2023', '2022'];
  const commonFriends = ['All', 'Kabir Bedi', 'Tanvi Iyer', 'Siddharth Sen', 'Devansh Roy'];

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter pipeline
  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      // Category match
      if (selectedCategory !== 'All' && mem.category !== selectedCategory) return false;

      // Year match
      if (selectedYear !== 'All' && mem.year.toString() !== selectedYear) return false;

      // Friend match
      if (selectedFriend !== 'All' && !mem.tagged_residents.includes(selectedFriend)) return false;

      // Keyword search
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchesEvent = mem.event.toLowerCase().includes(kw);
        const matchesLocation = mem.location.toLowerCase().includes(kw);
        const matchesCaption = mem.caption.toLowerCase().includes(kw);
        const matchesResident = mem.tagged_residents.some((r) => r.toLowerCase().includes(kw));
        if (!matchesEvent && !matchesLocation && !matchesCaption && !matchesResident) return false;
      }

      return true;
    });
  }, [memories, selectedCategory, selectedYear, selectedFriend, searchKeyword]);

  return (
    <div className="space-y-6">
      
      {/* Smart Filter Suite */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Smart Memory Filters
            </h3>
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
              {filteredMemories.length} Matched
            </span>
          </div>

          {/* Toggle Face Bounding Boxes */}
          <button
            onClick={() => {
              sound.playClick();
              setShowFaceBoxes(!showFaceBoxes);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              showFaceBoxes
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="h-3.5 w-3.5" />
            <span>Face Mesh Bounding Boxes {showFaceBoxes ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by event, location (e.g. 'Sky Terrace'), or tagged friends..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Multi-Criteria Pills */}
        <div className="space-y-3 pt-1">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                }}
                className={`rounded-xl px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Years & Friends */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Year selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Year:</span>
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    sound.playClick();
                    setSelectedYear(yr);
                  }}
                  className={`rounded-lg px-2.5 py-0.5 text-xs font-medium transition-all ${
                    selectedYear === yr
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Friends filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">With Friend:</span>
              {commonFriends.map((friend) => (
                <button
                  key={friend}
                  onClick={() => {
                    sound.playClick();
                    setSelectedFriend(friend);
                  }}
                  className={`rounded-lg px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all ${
                    selectedFriend === friend
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {friend}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Memory Results Grid */}
      {filteredMemories.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center backdrop-blur-xl">
          <Sparkles className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No Matching Memories Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters, or upload a new memory photo to index your face.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMemories.map((mem) => {
            const isFav = !!favorites[mem.id];
            return (
              <div
                key={mem.id}
                onClick={() => onSelectMemoryForLightbox(mem)}
                className="group relative rounded-3xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col"
              >
                {/* Image Container with Face Landmarks & Confidence */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={mem.image_url}
                    alt={mem.event}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges: Category & Confidence */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-950/80 border border-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      {mem.category}
                    </span>
                    <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow-lg flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>{mem.match_confidence || 98.7}% Face Match</span>
                    </span>
                  </div>

                  {/* Simulated Face Bounding Boxes */}
                  {showFaceBoxes && mem.faces_detected.map((face, idx) => (
                    <div
                      key={idx}
                      className="absolute border-2 border-cyan-400 rounded-md pointer-events-none transition-all shadow-[0_0_10px_#22d3ee]"
                      style={{
                        left: `${face.bounding_box.x * 100}%`,
                        top: `${face.bounding_box.y * 100}%`,
                        width: `${face.bounding_box.w * 100}%`,
                        height: `${face.bounding_box.h * 100}%`,
                      }}
                    >
                      <div className="absolute -top-4 left-0 bg-cyan-400 text-slate-950 text-[8px] font-black px-1 rounded-sm whitespace-nowrap">
                        {face.person_name} ({Math.round(face.confidence * 100)}%)
                      </div>
                    </div>
                  ))}

                  {/* Heart Favorite Button */}
                  <button
                    onClick={(e) => toggleFavorite(mem.id, e)}
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 border border-white/15 text-white hover:scale-110 transition-transform backdrop-blur-md shadow"
                  >
                    <Heart
                      className={`h-4 w-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-300'}`}
                    />
                  </button>
                </div>

                {/* Card Meta Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-400" />
                        <span>{mem.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-400" />
                        <span className="truncate">{mem.location}</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      {mem.event}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {mem.caption}
                    </p>
                  </div>

                  {/* Tagged Residents Strip */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Users className="h-3 w-3 text-purple-400" />
                      <span className="truncate max-w-[200px]">
                        {mem.tagged_residents.join(', ')}
                      </span>
                    </div>

                    <span className="text-blue-400 group-hover:translate-x-1 transition-transform font-bold text-xs">
                      Inspect →
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
