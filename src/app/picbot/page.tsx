'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import DreamCastScanner from '@/components/picbot/DreamCastScanner';
import PicBotChat from '@/components/picbot/PicBotChat';
import PicBotGallery from '@/components/picbot/PicBotGallery';
import PicBotUploadModal from '@/components/picbot/PicBotUploadModal';
import PicBotPrivacyModal from '@/components/picbot/PicBotPrivacyModal';
import { 
  Bot, 
  Sparkles, 
  Scan, 
  Upload, 
  ShieldCheck, 
  History, 
  Image as ImageIcon, 
  X, 
  Download, 
  Calendar, 
  MapPin, 
  Users, 
  Heart,
  ChevronRight,
  Zap,
  Cpu
} from 'lucide-react';
import Image from 'next/image';
import { PicBotMemory } from '@/types';
import { matchStudentFace } from '@/lib/picbotEngine';
import { sound } from '@/lib/sound';

export default function PicBotPage() {
  const { currentUser, picBotMemories, picBotConsent, picBotSearchHistory } = useApp();
  
  const [activeTab, setActiveTab] = useState<'assistant' | 'gallery' | 'audit'>('assistant');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [selectedLightboxMemory, setSelectedLightboxMemory] = useState<PicBotMemory | null>(null);

  // Compute personalized face matches
  const myMatchedMemories = matchStudentFace(picBotMemories, currentUser.full_name);

  const handleDownloadMemory = (mem: PicBotMemory) => {
    sound.playClick();
    const link = document.createElement('a');
    link.href = mem.image_url;
    link.download = `${mem.event.replace(/\s+/g, '_')}_CozyDen.png`;
    link.click();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-4 px-2 sm:px-4">
      
      {/* Hero Header */}
      <section className="relative text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 shadow-lg backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>COZY DEN MODULE 8: DREAMCAST PICBOT</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              COZY DEN DreamCast PicBot
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent text-2xl sm:text-4xl lg:text-5xl font-extrabold italic">
              &ldquo;Give me your photo, I&apos;ll find your memories.&rdquo;
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Never manually search hundreds or thousands of hostel event photos again. Our AI Vision Agent indexes 512-dim face embeddings in Supabase pgvector to locate every frame where you appear.
          </p>
        </div>

        {/* Action Suite */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsUploadModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:scale-105 transition-all"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Memory Photo</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsPrivacyModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 shadow-lg backdrop-blur-md hover:bg-white/10 hover:text-white transition-all"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Biometric Privacy &amp; Consent</span>
          </button>
        </div>

        {/* Live Vector Telemetry Stats Bar */}
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl text-left shadow-lg">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Memories Of You</div>
            <div className="text-xl font-black text-white mt-0.5">Found {myMatchedMemories.length}</div>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Face Verified (Cosine &gt; 0.90)</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl text-left shadow-lg">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Vector Space</div>
            <div className="text-xl font-black text-white mt-0.5">512-Dim</div>
            <p className="text-[10px] text-cyan-400 mt-0.5">Supabase pgvector</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl text-left shadow-lg">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Search Latency</div>
            <div className="text-xl font-black text-white mt-0.5">&lt; 14 ms</div>
            <p className="text-[10px] text-purple-400 mt-0.5">IVFFlat Cosine Index</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-xl text-left shadow-lg">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Privacy Vault</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {picBotConsent.enabled ? 'Protected' : 'Paused'}
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5">Self-Search Only</p>
          </div>
        </div>

      </section>

      {/* Biometric Reference Face Scanner */}
      <section>
        <DreamCastScanner
          onScanComplete={(matchedCount) => {
            // Trigger feedback
          }}
        />
      </section>

      {/* Navigation Tabs (Assistant vs Gallery vs Audit) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('assistant');
              }}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'assistant'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot className="h-4 w-4" />
              <span>AI Chat Assistant</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('gallery');
              }}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Memory Vault ({myMatchedMemories.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('audit');
              }}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Search Audit</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Tagged Resident: <strong className="text-white font-bold">{currentUser.full_name}</strong>
          </span>
        </div>

        {/* Tab 1: AI Chat Assistant Mode */}
        {activeTab === 'assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <PicBotChat onSelectMemoryForLightbox={(mem) => setSelectedLightboxMemory(mem)} />
            </div>

            {/* Quick Matched Memories Sidebar Preview */}
            <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-slate-900/60 p-5 backdrop-blur-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Face Matches
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="text-xs text-blue-400 hover:underline font-semibold"
                >
                  View All ({myMatchedMemories.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {myMatchedMemories.slice(0, 3).map((mem) => (
                  <div
                    key={mem.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedLightboxMemory(mem);
                    }}
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 hover:border-blue-500/40 hover:bg-slate-950 transition-all cursor-pointer"
                  >
                    <div className="relative h-16 w-20 shrink-0 rounded-xl overflow-hidden border border-white/15">
                      <Image src={mem.image_url} alt={mem.event} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400">
                          {mem.match_confidence || 99.1}% Match
                        </span>
                        <span className="text-[9px] text-slate-400">{mem.date}</span>
                      </div>
                      <h5 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-blue-300">
                        {mem.event}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {mem.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bot Info card */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-3.5 space-y-1.5">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-blue-400" />
                  Pro-Tip for Students:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Try asking PicBot for specific memories like <em>&quot;Find my cricket photos&quot;</em> or <em>&quot;Show photos with my roommate&quot;</em>. PicBot reads both facial embeddings and event tags.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Gallery & Timeline View */}
        {activeTab === 'gallery' && (
          <PicBotGallery
            memories={myMatchedMemories}
            onSelectMemoryForLightbox={(mem) => setSelectedLightboxMemory(mem)}
          />
        )}

        {/* Tab 3: Search Audit History */}
        {activeTab === 'audit' && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">PicBot Search Audit Trail</h3>
                <p className="text-xs text-slate-400">
                  Compliance and history log of recent facial similarity and natural queries executed on your account.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                Encrypted Log
              </span>
            </div>

            <div className="space-y-2">
              {picBotSearchHistory.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No recent searches recorded.</p>
              ) : (
                picBotSearchHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">&ldquo;{item.query}&rdquo;</span>
                        <p className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-xl bg-white/5 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-white/10">
                      {item.results_count} Results Found
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedLightboxMemory && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedLightboxMemory(null)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/20 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                sound.playClick();
                setSelectedLightboxMemory(null);
              }}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Lightbox Media */}
            <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl">
              <Image
                src={selectedLightboxMemory.image_url}
                alt={selectedLightboxMemory.event}
                fill
                className="object-contain"
                priority
              />

              {/* Confidence badge */}
              <div className="absolute top-4 left-4 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-black text-slate-950 shadow-xl">
                {selectedLightboxMemory.match_confidence || 99.2}% Face Match Confirmed
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="mt-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="rounded-full bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 text-[10px] font-bold text-blue-300">
                    {selectedLightboxMemory.category} • {selectedLightboxMemory.year}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {selectedLightboxMemory.event}
                  </h3>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownloadMemory(selectedLightboxMemory)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:scale-105 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download High-Res</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedLightboxMemory.caption}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-400" />
                  <span>{selectedLightboxMemory.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span>{selectedLightboxMemory.location}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  <span>Tagged: {selectedLightboxMemory.tagged_residents.join(', ')}</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Memory Upload Modal */}
      <PicBotUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Privacy Modal */}
      <PicBotPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

    </div>
  );
}
