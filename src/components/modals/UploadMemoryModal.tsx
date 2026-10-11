'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { MemoryCategory } from '@/types';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Heart,
  VideoOff
} from 'lucide-react';

interface UploadMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: MemoryCategory[] = [
  'Room Hangouts',
  'Terrace Vibes',
  'Exam All-Nighter',
  'Mess Moments',
  'Hostel Fest',
  'Campus Walk',
];

export default function UploadMemoryModal({ isOpen, onClose }: UploadMemoryModalProps) {
  const { addMemoryPhoto, currentUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Room Hangouts');
  const [roomTag, setRoomTag] = useState(currentUser.room_number || 'Room 304');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // STRICT CHECK: Reject video files explicitly as requested!
    if (file.type.startsWith('video/')) {
      setErrorMsg('⚠️ Only photos are permitted! Videos are strictly not allowed to preserve the aesthetic photo memories wall.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMsg('⚠️ Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    // Read image as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setErrorMsg('Please select a photo to upload.');
      return;
    }
    if (!caption.trim()) {
      setErrorMsg('Please write a short caption or story for this memory.');
      return;
    }

    addMemoryPhoto({
      image_url: imagePreview,
      caption,
      category,
      room_tag: roomTag,
      author_name: currentUser.full_name,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setImagePreview(null);
      setCaption('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Memory Added to Wall!</h3>
            <p className="text-xs text-slate-400">
              Your photo is now live on the Cozy Memories wall for all residents.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-pink-500/20 border border-pink-500/30 px-2.5 py-0.5 text-[10px] font-bold text-pink-300">
                  Photos Only • No Videos
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                <span>Upload Hostel Memory Photo</span>
              </h3>
              <p className="text-xs text-slate-400">
                Share room moments, late-night chai chats, fest celebrations &amp; terrace memories.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Photo Upload Box */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/20 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Memory preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 rounded-xl bg-black/70 px-2.5 py-1 text-xs text-white backdrop-blur-md hover:bg-black/90"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/15 bg-white/5 hover:border-pink-500/50 hover:bg-white/10 transition-all cursor-pointer group text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-white">Click to Select Hostel Photo</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP</p>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                      <VideoOff className="h-3 w-3" />
                      <span>Strictly Photos Only (No Video Files)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Memory Story / Caption
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 2 AM Maggi pact in room 304 before mid-term exams..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Category & Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Room / Location Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 304 or Sky Terrace"
                    value={roomTag}
                    onChange={(e) => setRoomTag(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
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
                  className="rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-xl shadow-pink-500/25 hover:from-pink-500 hover:to-purple-500 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Pin to Memory Wall</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
