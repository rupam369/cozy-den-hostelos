'use client';

import React from 'react';
import CozyAssistantWidget from '@/components/chat/CozyAssistantWidget';
import { Bot, Sparkles, Shield, Clock, HelpCircle } from 'lucide-react';

export default function AIAssistantPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 py-4">
      
      {/* Page Header */}
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300 backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Cozy Intelligence Engine</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Meet Cozy Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Your 24/7 intelligent hostel companion. Ask anything regarding food timings, hostel curfew,
          open complaint tracking, or emergency contacts.
        </p>
      </div>

      {/* Embedded Full-Page Chat Container */}
      <CozyAssistantWidget isFullPage={true} />

      {/* Suggested Inquiries Guidance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
          <Clock className="h-5 w-5 text-amber-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Dining &amp; Timings</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            &quot;What is being served for dinner tonight?&quot; or &quot;When does high tea start?&quot;
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
          <Shield className="h-5 w-5 text-blue-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Curfew &amp; Governance</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            &quot;What are the curfew rules?&quot; or &quot;How do I get a weekend night pass?&quot;
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
          <HelpCircle className="h-5 w-5 text-rose-400 mb-2" />
          <h4 className="text-xs font-bold text-white">Emergency Assistance</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            &quot;Who do I call for emergency first aid?&quot; or &quot;Where is the warden cabin?&quot;
          </p>
        </div>
      </div>

    </div>
  );
}
