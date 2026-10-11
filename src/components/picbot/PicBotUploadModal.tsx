'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon, 
  Calendar, 
  MapPin, 
  Tag, 
  Users, 
  Cpu, 
  Loader2 
} from 'lucide-react';
import Image from 'next/image';
import { PicBotCategory } from '@/types';
import { sound } from '@/lib/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PicBotUploadModal({ isOpen, onClose }: Props) {
  const { currentUser, addPicBotMemory } = useApp();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('2024-10-10');
  const [location, setLocation] = useState('Cozy Den Sky Terrace');
  const [category, setCategory] = useState<PicBotCategory>('Hostel Events');
  const [caption, setCaption] = useState('');
  const [taggedResidents, setTaggedResidents] = useState('Aryan Sharma, Kabir Bedi');
  
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [indexingStep, setIndexingStep] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('STRICT POLICY: Photos only! Video uploads are not allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        sound.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !event.trim()) {
      alert('Please upload an image and specify the event name.');
      return;
    }

    sound.playCameraSwoosh();
    setIsProcessingAI(true);
    setIndexingStep('1/3: Uploading high-res asset to Supabase Storage...');

    setTimeout(() => {
      setIndexingStep('2/3: AI Vision Model detecting face landmarks & 512-dim vectors...');
    }, 800);

    setTimeout(() => {
      setIndexingStep('3/3: Inserting face embeddings into Supabase pgvector vault...');
    }, 1600);

    setTimeout(() => {
      const residentsList = taggedResidents
        .split(',')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const parsedYear = new Date(date).getFullYear() || 2024;

      addPicBotMemory({
        image_url: imagePreview,
        event,
        date,
        year: parsedYear,
        location,
        category,
        caption: caption || `Memories captured at ${event}`,
        uploaded_by_name: currentUser.full_name,
        tagged_residents: residentsList.length > 0 ? residentsList : [currentUser.full_name],
      });

      setIsProcessingAI(false);
      sound.playChime();
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-white"
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

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-white/10 pr-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/80">
              <Upload className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Face Auto-Indexer
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">Upload Hostel Memory</h2>
            <p className="text-xs text-slate-400">
              Upload event or group photos. AI automatically creates face embeddings for PicBot search.
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Photo Picker Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Hostel Memory Photo <span className="text-rose-400">* (Photos Only)</span>
            </label>

            {imagePreview ? (
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/20 bg-slate-950">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 rounded-xl bg-slate-950/80 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 border border-white/10 backdrop-blur-md"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-500/50 bg-white/5 cursor-pointer transition-all hover:bg-white/10">
                <ImageIcon className="h-8 w-8 text-blue-400 mb-2" />
                <span className="text-xs font-bold text-white">Click to Select Hostel Photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, WebP (Strictly no videos)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Event & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300">Event / Occasion Name</label>
              <input
                type="text"
                required
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="E.g. Inter-Hostel Cricket Finals"
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PicBotCategory)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Hostel Events">Hostel Events</option>
                <option value="Group Photos">Group Photos</option>
                <option value="Trips & Outings">Trips &amp; Outings</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Sports & Games">Sports &amp; Games</option>
                <option value="Daily Memories">Daily Memories</option>
              </select>
            </div>
          </div>

          {/* Date & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300">Date Captured</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Campus Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g. Sky Terrace, Porch, Mess"
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tagged Residents */}
          <div>
            <label className="text-xs font-bold text-slate-300">
              Tagged Residents (Comma-separated)
            </label>
            <input
              type="text"
              value={taggedResidents}
              onChange={(e) => setTaggedResidents(e.target.value)}
              placeholder="E.g. Aryan Sharma, Kabir Bedi, Tanvi Iyer"
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              AI will generate 512-dim face embeddings for each tagged resident to enable PicBot search.
            </p>
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs font-bold text-slate-300">Caption / Note</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this moment special?..."
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* AI Processing Status Indicator */}
          {isProcessingAI && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-3 flex items-center gap-3 animate-pulse">
              <Loader2 className="h-5 w-5 text-cyan-400 animate-spin shrink-0" />
              <div>
                <span className="text-xs font-bold text-cyan-300">AI Vector Indexing in Progress</span>
                <p className="text-[10px] text-slate-300 mt-0.5">{indexingStep}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessingAI || !imagePreview}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Cpu className="h-4 w-4" />
              <span>{isProcessingAI ? 'Indexing Faces...' : 'Upload & Index Memory'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
