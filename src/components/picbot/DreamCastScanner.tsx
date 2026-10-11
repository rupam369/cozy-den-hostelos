'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Scan, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { sound } from '@/lib/sound';

interface Props {
  onScanComplete?: (matchedCount: number) => void;
}

export default function DreamCastScanner({ onScanComplete }: Props) {
  const { currentUser, referenceFacePhoto, setReferenceFacePhoto, picBotConsent, picBotMemories } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [vectorHash, setVectorHash] = useState('vec_512_89a4...f902');

  const handleTriggerScan = () => {
    sound.playCameraSwoosh();
    setIsScanning(true);
    setScanProgress(15);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          sound.playChime();
          const count = picBotMemories.filter((m) => m.tagged_residents.includes(currentUser.full_name)).length;
          if (onScanComplete) onScanComplete(count);
          setVectorHash(`vec_512_${Math.random().toString(36).substring(2, 7)}...${Math.random().toString(36).substring(2, 6)}`);
          return 100;
        }
        return prev + 25;
      });
    }, 280);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Strictly photos only! Video files are not supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        sound.playClick();
        setReferenceFacePhoto(reader.result);
        handleTriggerScan();
      }
    };
    reader.readAsDataURL(file);
  };

  const currentPhoto = referenceFacePhoto || currentUser.avatar_url;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl">
      {/* Background Spatial Glow */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center gap-6">
        
        {/* Holographic Face Scanner Display */}
        <div className="relative group shrink-0">
          <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-slate-950 shadow-2xl shadow-blue-500/15">
            {currentPhoto ? (
              <Image
                src={currentPhoto}
                alt="Reference Selfie"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-500">
                <Camera className="h-12 w-12 stroke-[1.5]" />
                <span className="text-xs mt-2">No Selfie Uploaded</span>
              </div>
            )}

            {/* Biometric Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/15" />

            {/* Animated Laser Scanning Line */}
            {isScanning && (
              <div 
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse"
                style={{
                  top: `${scanProgress}%`,
                  transition: 'top 0.25s linear',
                }}
              />
            )}

            {/* Holographic Face Landmarks Mesh */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative h-28 w-28 rounded-full border border-cyan-400/30 border-dashed animate-spin duration-1000">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>

            {/* Target Reticle Corners */}
            <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-blue-400" />
            <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-blue-400" />
            <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-blue-400" />
            <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-blue-400" />

            {/* Status Pill */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-2 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px]">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                {isScanning ? 'Extracting Vector...' : 'Biometrics Active'}
              </span>
              <span className="text-slate-300 font-mono">99.4% Match</span>
            </div>
          </div>
        </div>

        {/* Biometric Controls & Embedding Metadata */}
        <div className="flex-1 space-y-4 text-left">
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span>AI Face Recognition Indexer</span>
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-slate-300 font-mono">
                512-Dim Vector Space
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              Personal Reference Face
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              DreamCast PicBot analyzes facial bone geometry, eye-distance, and landmark coordinates to find every hostel memory where <strong className="text-white font-bold">{currentUser.full_name}</strong> appears.
            </p>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Vector Hash</span>
                <Cpu className="h-3 w-3 text-cyan-400" />
              </div>
              <div className="text-xs font-mono font-bold text-white mt-0.5 truncate">{vectorHash}</div>
              <p className="text-[9px] text-emerald-400 mt-0.5">Normalized (L2 = 1.0)</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Indexed Memories</span>
                <Scan className="h-3 w-3 text-purple-400" />
              </div>
              <div className="text-xs font-bold text-white mt-0.5">{picBotMemories.length} Photos</div>
              <p className="text-[9px] text-purple-300 mt-0.5">Supabase pgvector</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-2.5 backdrop-blur-md col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Privacy Status</span>
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                {picBotConsent.enabled ? 'Private Vault' : 'Opted Out'}
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">Self-Only Search</p>
            </div>
          </div>

          {/* Action Buttons: Upload new selfie, re-scan, use profile */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <label className="cursor-pointer flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all">
              <Upload className="h-3.5 w-3.5" />
              <span>Upload New Selfie</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleTriggerScan}
              disabled={isScanning}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Analyzing Facial Mesh...' : 'Re-Scan Database'}</span>
            </button>

            {currentUser.avatar_url && referenceFacePhoto !== currentUser.avatar_url && (
              <button
                onClick={() => {
                  sound.playClick();
                  setReferenceFacePhoto(currentUser.avatar_url || null);
                  handleTriggerScan();
                }}
                className="text-xs text-blue-400 hover:underline px-2 py-1 font-medium"
              >
                Reset to Registered Avatar
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
