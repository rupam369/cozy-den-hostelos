'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { sound } from '@/lib/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PicBotPrivacyModal({ isOpen, onClose }: Props) {
  const { picBotConsent, togglePicBotConsent } = useApp();

  if (!isOpen) return null;

  const handleToggleConsent = () => {
    sound.playClick();
    togglePicBotConsent(!picBotConsent.enabled);
  };

  const handleDeleteEmbeddings = () => {
    sound.playAlert();
    if (confirm('Are you sure you want to delete your 512-dimensional face vectors? DreamCast PicBot will no longer be able to find photos of you until you re-upload a reference selfie.')) {
      togglePicBotConsent(false);
      sound.playChime();
      alert('Your face embeddings have been purged from the Supabase pgvector vault.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-white"
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
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/80">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Biometric Data Vault
            </span>
            <h2 className="text-xl font-black text-white mt-1">PicBot Privacy &amp; Consent</h2>
            <p className="text-xs text-slate-400">
              Your biometric face coordinates belong strictly to you.
            </p>
          </div>
        </div>

        {/* Consent Switches */}
        <div className="mt-5 space-y-4">
          
          {/* Main Face Search Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md">
            <div className="space-y-0.5 max-w-[80%]">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-blue-400" />
                <span>Enable AI Facial Recognition Search</span>
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Allows DreamCast PicBot to compare your reference selfie with hostel memory embeddings.
              </p>
            </div>

            <button
              onClick={handleToggleConsent}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                picBotConsent.enabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  picBotConsent.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Privacy Guarantees */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5 text-xs text-slate-300">
            <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">
              Privacy Guarantees:
            </h5>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Self-Search Only:</strong> Other students can never search your face or retrieve your private timeline without your explicit consent.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mathematical Irreversibility:</strong> 512-dimensional vector embeddings cannot be reverse-engineered back into raw photographs.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Commercial Sharing:</strong> Biometric vectors are encrypted and retained strictly inside the Cozy Den Supabase instance.
              </span>
            </div>
          </div>

          {/* Delete All Embeddings */}
          <div className="pt-2">
            <button
              onClick={handleDeleteEmbeddings}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              <span>Purge My Facial Embeddings From Database</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
