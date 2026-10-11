'use client';

import React from 'react';
import CozyAssistantWidget from '@/components/chat/CozyAssistantWidget';
import { Bot, Sparkles, Shield, Clock, HelpCircle, Compass } from 'lucide-react';

export default function AIAssistantPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-300 backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>COZY INTELLIGENCE SUITE • 24/7 RESIDENT COMPANION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Meet Cozy Assistant.
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
          Your spatial AI concierge for COZY DEN. Grounded in live dining menus, 
          night curfew rules, grievance escalation statuses, and emergency hotlines.
        </p>
      </div>

      {/* Embedded Full-Page Chat Container */}
      <div className="vision-glass rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/[0.08]">
        <CozyAssistantWidget isFullPage={true} />
      </div>

      {/* Suggested Inquiries Guidance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div className="vision-glass rounded-2xl p-5 space-y-2">
          <Clock className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dining &amp; Timings</h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            &ldquo;What is being served for dinner tonight?&rdquo; or &ldquo;When does High Tea start?&rdquo;
          </p>
        </div>

        <div className="vision-glass rounded-2xl p-5 space-y-2">
          <Shield className="h-4 w-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Curfew &amp; Passes</h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            &ldquo;What are the night gate curfew rules?&rdquo; or &ldquo;How do I register a weekend pass?&rdquo;
          </p>
        </div>

        <div className="vision-glass rounded-2xl p-5 space-y-2">
          <HelpCircle className="h-4 w-4 text-rose-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Emergency Protocol</h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            &ldquo;Where is the warden cabin?&rdquo; or &ldquo;Who do I call for emergency first aid?&rdquo;
          </p>
        </div>
      </div>

    </div>
  );
}
