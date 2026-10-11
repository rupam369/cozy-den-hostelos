'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ComplaintCategory, ComplaintPriority } from '@/types';
import { 
  X, 
  Wifi, 
  Droplets, 
  Zap, 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  Camera, 
  EyeOff, 
  AlertTriangle,
  CheckCircle2,
  LucideIcon
} from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ComplaintCategory;
}

const CATEGORIES: { id: ComplaintCategory; label: string; icon: LucideIcon; color: string }[] = [
  { id: 'WiFi', label: 'WiFi & Network', icon: Wifi, color: 'text-cyan-400' },
  { id: 'Water', label: 'Water & Plumbing', icon: Droplets, color: 'text-blue-400' },
  { id: 'Electricity', label: 'Electricity & Power', icon: Zap, color: 'text-amber-400' },
  { id: 'Food', label: 'Mess & Food', icon: Utensils, color: 'text-orange-400' },
  { id: 'Cleaning', label: 'Hygiene & Cleaning', icon: Sparkles, color: 'text-emerald-400' },
  { id: 'Security', label: 'Safety & Security', icon: ShieldCheck, color: 'text-purple-400' },
  { id: 'Room Maintenance', label: 'Room Maintenance', icon: Wrench, color: 'text-rose-400' },
];

export default function ComplaintModal({ isOpen, onClose, defaultCategory }: ComplaintModalProps) {
  const { addComplaint, currentUser } = useApp();
  const [category, setCategory] = useState<ComplaintCategory>(defaultCategory || 'WiFi');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(currentUser.room_number || 'Room 304, Floor 3');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addComplaint({
      title,
      description,
      category,
      location,
      priority,
      photo_url: photoUrl || undefined,
      is_anonymous: isAnonymous,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      // Reset fields
      setTitle('');
      setDescription('');
    }, 1500);
  };

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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Grievance Successfully Registered</h3>
            <p className="text-xs text-slate-400">
              Notification dispatched to hostel facility desk. Tracking ID generated.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <span>Log Hostel Grievance</span>
              </h3>
              <p className="text-xs text-slate-400">
                Issues unresolved after 48 hours automatically trigger Red Alert escalation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Category Grid */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Issue Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600/20 text-white shadow-md'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                        }`}
                      >
                        <Icon className={`h-4 w-4 mb-1 ${cat.color}`} />
                        <span className="text-[10px] font-medium leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Issue Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Geyser not heating water in Room 304"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain when this started and how it affects your room..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Location & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Exact Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 304, Wing A"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Low">Low - Minor Inconvenience</option>
                    <option value="Medium">Medium - Regular Issue</option>
                    <option value="High">High - Urgent Attention</option>
                    <option value="Critical">Critical - Safety / Power Outage</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload / Link (Optional) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-blue-400" />
                    <span>Attach Photo Evidence (Optional)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Image URL or camera snapshot</span>
                </label>
                <input
                  type="url"
                  placeholder="Paste image URL (e.g. https://...)"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Anonymous Reporting Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${isAnonymous ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                    <EyeOff className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">Anonymous Grievance</p>
                    <p className="text-[10px] text-slate-400">Hide my name and room identity from public logs</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
                >
                  Submit Complaint
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
