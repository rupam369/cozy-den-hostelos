'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';

const DynamicCanvas = dynamic(() => import('./HostelCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] md:h-[640px] rounded-3xl border border-white/10 bg-slate-950/80 flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-sm tracking-wide font-medium">Initializing 3D Multi-Layer Hostel Model...</p>
    </div>
  ),
});

export default function HostelCanvasWrapper() {
  return <DynamicCanvas />;
}
