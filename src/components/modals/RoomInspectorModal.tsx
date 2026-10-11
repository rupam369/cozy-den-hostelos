'use client';

import React, { useState } from 'react';
import { HostelRoom } from '@/data/hostelRoomsData';
import { 
  X, 
  Wifi, 
  Zap, 
  Thermometer, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Wind, 
  Sun, 
  Sliders, 
  ShieldAlert, 
  Sparkles,
  ExternalLink,
  PhoneCall,
  Wrench
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { sound } from '@/lib/sound';

interface Props {
  room: HostelRoom | null;
  onClose: () => void;
  onRequestComplaint?: (roomNumber: string) => void;
}

export default function RoomInspectorModal({ room, onClose, onRequestComplaint }: Props) {
  const [acState, setAcState] = useState<'Active' | 'Eco' | 'Off'>(room?.telemetry.acStatus || 'Active');
  const [lightVal, setLightVal] = useState<number>(room?.telemetry.lightIntensity || 75);
  const [isLocked, setIsLocked] = useState<boolean>(room?.telemetry.doorStatus === 'Locked');
  const [cleaningRequested, setCleaningRequested] = useState(false);

  if (!room) return null;

  const toggleLock = () => {
    sound.playClick();
    setIsLocked(!isLocked);
  };

  const handleAcToggle = () => {
    sound.playClick();
    setAcState((prev) => (prev === 'Active' ? 'Eco' : prev === 'Eco' ? 'Off' : 'Active'));
  };

  const handleRequestCleaning = () => {
    sound.playChime();
    setCleaningRequested(true);
    setTimeout(() => setCleaningRequested(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl text-white"
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/80 font-black text-xl text-blue-400">
              {room.floor === 0 ? 'L0' : `F${room.floor}`}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Floor {room.floor} • Wing {room.wing}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                {room.type}
              </span>
              {room.issueSeverity === 'critical' && (
                <span className="rounded-full bg-red-500/20 border border-red-500/50 px-2.5 py-0.5 text-[10px] font-bold text-red-300 flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="h-3 w-3" />
                  Active 48h Escalation
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{room.roomNumber}</h2>
            <p className="text-xs text-slate-400">
              Scope Global Skills University Cozy Den Digital Twin Node
            </p>
          </div>
        </div>

        {/* Hotspot Alert Banner if active issue exists */}
        {room.issueDescription && (
          <div className={`mt-4 rounded-2xl border p-4 backdrop-blur-xl ${
            room.issueSeverity === 'critical'
              ? 'border-red-500/40 bg-red-950/40 text-red-100 ring-1 ring-red-500/30'
              : 'border-amber-500/40 bg-amber-950/40 text-amber-100'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">Active Hostel Grievance Flagged</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/30 text-red-200">
                    {room.issueSeverity} priority
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-200 leading-relaxed">
                  {room.issueDescription}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <Link
                    href={`/complaints?id=${room.activeIssueId}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-300 hover:text-white bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-xl border border-red-500/30 transition-all"
                  >
                    <span>View Grievance Status & Timeline</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live IoT Telemetry Vitals Grid */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-blue-400" />
              Live Room IoT Telemetry
            </span>
            <span className="text-emerald-400 flex items-center gap-1 text-[11px] normal-case">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sensors Streaming
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Thermostat */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Climate</span>
                <Thermometer className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-white">{room.telemetry.temperature}°C</div>
              <p className="text-[10px] text-cyan-300 mt-0.5">Optimal Comfort</p>
            </div>

            {/* Power usage */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Power Draw</span>
                <Zap className={`h-3.5 w-3.5 ${room.issueSeverity === 'critical' ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
              </div>
              <div className="text-xl font-bold text-white">{room.telemetry.powerUsage} kW/h</div>
              <p className={`text-[10px] mt-0.5 ${room.issueSeverity === 'critical' ? 'text-red-400' : 'text-slate-400'}`}>
                {room.issueSeverity === 'critical' ? 'Circuit Fault' : 'Smart Meter'}
              </p>
            </div>

            {/* WiFi Signal */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>WiFi Mesh</span>
                <Wifi className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white">{room.telemetry.wifiSignal} dBm</div>
              <p className="text-[10px] text-indigo-300 mt-0.5">5GHz Optical Link</p>
            </div>

            {/* Door Status */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Biometric Lock</span>
                {isLocked ? <Lock className="h-3.5 w-3.5 text-emerald-400" /> : <Unlock className="h-3.5 w-3.5 text-amber-400" />}
              </div>
              <div className="text-xl font-bold text-white">{isLocked ? 'Secured' : 'Open'}</div>
              <button 
                onClick={toggleLock}
                className="text-[10px] text-blue-400 hover:underline mt-0.5 font-medium"
              >
                {isLocked ? 'Tap to Unlock' : 'Tap to Lock'}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Controls Simulation */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-cyan-400" />
              Smart Inverter AC Mode:
            </span>
            <button
              onClick={handleAcToggle}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                acState === 'Active'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : acState === 'Eco'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-slate-300'
              }`}
            >
              Mode: {acState}
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                Study Desk Ambient Lighting:
              </span>
              <span className="font-bold text-amber-400">{lightVal}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={lightVal}
              onChange={(e) => setLightVal(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Residents / Occupants Section */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-purple-400" />
              Room Residents ({room.occupants.length} / {room.capacity})
            </span>
            <span className="text-purple-300 text-[11px] normal-case">Hostel Directory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {room.occupants.map((occ, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/20">
                  <Image src={occ.avatar} alt={occ.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-xs font-bold text-white truncate">{occ.name}</h5>
                  </div>
                  <p className="text-[10px] text-purple-300 truncate">{occ.role}</p>
                  <p className="text-[9px] text-slate-400 font-mono">{occ.studentId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Pills */}
        <div className="mt-4 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Suite Facilities &amp; Specifications
          </span>
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 flex items-center gap-1"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestCleaning}
              disabled={cleaningRequested}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{cleaningRequested ? 'Housekeeping Notified! ✓' : 'Request Housekeeping'}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                if (onRequestComplaint) onRequestComplaint(room.roomNumber);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Report Issue in Room</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
