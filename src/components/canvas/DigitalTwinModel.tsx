'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { sound } from '@/lib/sound';

export type DigitalTwinZone = 
  | 'COZYDEN_BUILDING' 
  | 'ENTRANCE' 
  | 'RECEPTION' 
  | 'ROOM_BLOCK' 
  | 'MESS_AREA' 
  | 'ADMIN_OFFICE' 
  | 'DREAMCAST_LOUNGE';

interface DigitalTwinModelProps {
  timeOfDay: 'day' | 'sunset' | 'night';
  viewMode: 'exterior' | 'interior' | 'exploded';
  selectedZone: DigitalTwinZone | null;
  onSelectZone: (zone: DigitalTwinZone) => void;
  activeBuildingFloor: number | null;
}

export default function DigitalTwinModel({
  timeOfDay,
  viewMode,
  selectedZone,
  onSelectZone,
  activeBuildingFloor,
}: DigitalTwinModelProps) {
  const modelRootRef = useRef<THREE.Group>(null);

  // Gentle subtle breathing motion when idle
  useFrame((state) => {
    if (modelRootRef.current && selectedZone === null && activeBuildingFloor === null && viewMode === 'exterior') {
      modelRootRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.035;
    }
  });

  // Color tokens matching real Scope Global Skills University Boys Hostel
  const colors = useMemo(() => {
    const isNight = timeOfDay === 'night';
    const isSunset = timeOfDay === 'sunset';
    return {
      facadeIvory: '#ede8df',
      balconyChocolate: '#32221b',
      slabConcrete: '#262626',
      railingBlack: '#171717',
      canopyDark: '#1e293b',
      steelColumn: '#64748b',
      grassGreen: isNight ? '#062817' : '#14532d',
      asphaltRoad: '#1e2026',
      windowGlow: isNight ? '#fbbf24' : isSunset ? '#f97316' : '#f8fafc',
      windowEmission: isNight ? 1.8 : isSunset ? 1.2 : 0.2,
      signboardGreen: '#14532d',
    };
  }, [timeOfDay]);

  const isInterior = viewMode === 'interior';
  const isExploded = viewMode === 'exploded';

  return (
    <group ref={modelRootRef} position={[0, -0.6, 0]}>
      
      {/* ========================================================================= */}
      {/* 1. SURROUNDING ENVIRONMENT: GROUND, WALKWAYS, TREES, PARKING, SIGNPOST */}
      {/* ========================================================================= */}
      <group name="ENVIRONMENT">
        {/* Main Landscaped Ground / Grass Mound */}
        <mesh position={[0, -2.5, 0]} receiveShadow>
          <cylinderGeometry args={[8.8, 9.4, 0.4, 64]} />
          <meshStandardMaterial color={colors.grassGreen} roughness={0.8} />
        </mesh>

        {/* Circular Asphalt Driveway & Ring Road */}
        <mesh position={[0, -2.28, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[5.2, 8.4, 64]} />
          <meshStandardMaterial color={colors.asphaltRoad} roughness={0.85} metalness={0.1} />
        </mesh>

        {/* Paved Walkway from Road to Front Entrance */}
        <mesh position={[-1.2, -2.27, 4.6]} receiveShadow>
          <boxGeometry args={[2.2, 0.04, 2.8]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>

        {/* Parking Area Bay (Right Wing) */}
        <group position={[4.6, -2.27, 4.4]} rotation={[0, -0.2, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[3.2, 0.04, 2.6]} />
            <meshStandardMaterial color="#1e2430" roughness={0.9} />
          </mesh>
          {/* Parking White Stripes */}
          {[-1.0, 0, 1.0].map((x, idx) => (
            <mesh key={`p-line-${idx}`} position={[x, 0.025, 0]}>
              <boxGeometry args={[0.08, 0.01, 2.2]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          ))}
          {/* Low-Poly Resident Cars in Parking */}
          <group position={[-0.5, 0.25, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.8, 0.35, 1.6]} />
              <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.2, -0.1]}>
              <boxGeometry args={[0.7, 0.25, 0.9]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
          {/* Resident Scooter */}
          <group position={[0.5, 0.2, 0.3]} rotation={[0, 0.1, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.2, 0.3, 0.8]} />
              <meshStandardMaterial color="#ef4444" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[0, -0.1, -0.3]}>
              <cylinderGeometry args={[0.1, 0.1, 0.08]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0, -0.1, 0.3]}>
              <cylinderGeometry args={[0.1, 0.1, 0.08]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        </group>

        {/* Low-Poly Trees Around Perimeter */}
        {[
          [-6.2, 2.0],
          [-5.8, -1.8],
          [-4.5, -4.5],
          [5.8, -2.5],
          [6.4, 1.2],
          [-3.5, 5.5],
          [3.2, 6.2],
          [-6.8, 0],
        ].map(([tx, tz], idx) => (
          <group key={`tree-${idx}`} position={[tx, -2.2, tz]}>
            {/* Trunk */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.1, 0.14, 0.9, 8]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>
            {/* Foliage Cones / Spheres */}
            <mesh position={[0, 1.1, 0]}>
              <coneGeometry args={[0.85, 1.2, 8]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#15803d' : '#166534'} roughness={0.7} />
            </mesh>
            <mesh position={[0, 1.7, 0]}>
              <coneGeometry args={[0.65, 0.9, 8]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#22c55e' : '#15803d'} roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Real Driveway Signpost: "SCOPE GLOBAL SKILLS UNIVERSITY BOYS HOSTEL" */}
        <group position={[3.8, -1.8, 4.6]} rotation={[0, -0.35, 0]}>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[1.5, 0.8, 0.05]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.4} metalness={0.3} />
          </mesh>
          <Text position={[0, 0.38, 0.035]} fontSize={0.08} color="#ffffff" anchorX="center" anchorY="middle">
            SCOPE GLOBAL
          </Text>
          <Text position={[0, 0.26, 0.035]} fontSize={0.07} color="#93c5fd" anchorX="center" anchorY="middle">
            SKILLS UNIVERSITY
          </Text>
          <Text position={[0, 0.08, 0.035]} fontSize={0.11} color="#ffffff" anchorX="center" anchorY="middle">
            BOYS HOSTEL ←
          </Text>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 2. NAMED OBJECT: COZYDEN_BUILDING (MAIN ARCHITECTURAL HOSTEL STRUCTURE) */}
      {/* ========================================================================= */}
      <group
        name="COZYDEN_BUILDING"
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectZone('COZYDEN_BUILDING');
        }}
      >
        {/* Concrete Foundation Slabs & Plinth */}
        <RoundedBox args={[8.2, 0.3, 6.6]} radius={0.05} smoothness={4} position={[0, -2.15, 0]}>
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </RoundedBox>

        {/* 4 Multi-Floor Slabs & Levels */}
        {[
          { level: 0, y: -1.7, height: 1.15 },
          { level: 1, y: -0.3, height: 1.15 },
          { level: 2, y: 1.1, height: 1.15 },
          { level: 3, y: 2.5, height: 1.15 },
        ].map((fl) => {
          const isSelected = selectedZone === 'COZYDEN_BUILDING';
          const yPos = isExploded ? fl.y * 2.2 : fl.y;
          const hideExterior = isInterior;

          return (
            <group key={`facade-fl-${fl.level}`} position={[0, yPos, 0]}>
              {/* Floor Base Concrete Slab */}
              <RoundedBox args={[7.8, 0.22, 6.2]} radius={0.04} smoothness={4} position={[0, -0.62, 0]}>
                <meshStandardMaterial color={colors.slabConcrete} roughness={0.7} />
              </RoundedBox>

              {/* Exterior Ivory/Cream Facade Block (Fades if in Interior Mode) */}
              {!hideExterior && (
                <RoundedBox
                  args={[7.2, fl.height, 5.6]}
                  radius={0.05}
                  smoothness={4}
                  position={[0, 0, 0]}
                >
                  <meshStandardMaterial
                    color={isSelected ? '#3b82f6' : colors.facadeIvory}
                    roughness={0.6}
                    metalness={0.1}
                    transparent={isExploded}
                    opacity={isExploded ? 0.75 : 1.0}
                  />
                </RoundedBox>
              )}

              {/* Real Recessed Dark Chocolate Brown Balconies (Left Wing) */}
              {!hideExterior && (
                <RoundedBox args={[2.8, fl.height + 0.01, 0.45]} radius={0.03} smoothness={4} position={[-1.6, 0, 2.7]}>
                  <meshStandardMaterial color={colors.balconyChocolate} roughness={0.5} />
                </RoundedBox>
              )}

              {/* Real Recessed Dark Chocolate Brown Balconies (Right Wing) */}
              {!hideExterior && (
                <RoundedBox args={[2.2, fl.height + 0.01, 0.45]} radius={0.03} smoothness={4} position={[2.0, 0, 2.7]}>
                  <meshStandardMaterial color={colors.balconyChocolate} roughness={0.5} />
                </RoundedBox>
              )}

              {/* Projecting Balcony Slabs & Black Metal Railings */}
              {!hideExterior && (
                <>
                  <RoundedBox args={[2.6, 0.1, 1.1]} radius={0.03} smoothness={4} position={[-1.6, -0.52, 3.2]}>
                    <meshStandardMaterial color="#e5ded2" roughness={0.5} />
                  </RoundedBox>
                  <RoundedBox args={[2.0, 0.1, 1.1]} radius={0.03} smoothness={4} position={[2.0, -0.52, 3.2]}>
                    <meshStandardMaterial color="#e5ded2" roughness={0.5} />
                  </RoundedBox>

                  {/* Railing Bars Left */}
                  <group position={[-1.6, -0.22, 3.72]}>
                    <mesh position={[0, 0.18, 0]}>
                      <boxGeometry args={[2.55, 0.03, 0.03]} />
                      <meshStandardMaterial color={colors.railingBlack} metalness={0.9} />
                    </mesh>
                    <mesh position={[0, -0.18, 0]}>
                      <boxGeometry args={[2.55, 0.03, 0.03]} />
                      <meshStandardMaterial color={colors.railingBlack} metalness={0.9} />
                    </mesh>
                  </group>

                  {/* Railing Bars Right */}
                  <group position={[2.0, -0.22, 3.72]}>
                    <mesh position={[0, 0.18, 0]}>
                      <boxGeometry args={[1.95, 0.03, 0.03]} />
                      <meshStandardMaterial color={colors.railingBlack} metalness={0.9} />
                    </mesh>
                    <mesh position={[0, -0.18, 0]}>
                      <boxGeometry args={[1.95, 0.03, 0.03]} />
                      <meshStandardMaterial color={colors.railingBlack} metalness={0.9} />
                    </mesh>
                  </group>
                </>
              )}

              {/* Windows with Diurnal Emission */}
              {!hideExterior && (
                <>
                  <mesh position={[-1.6, 0.05, 2.9]}>
                    <planeGeometry args={[1.6, 0.8]} />
                    <meshStandardMaterial
                      color={colors.windowGlow}
                      emissive={colors.windowGlow}
                      emissiveIntensity={colors.windowEmission}
                      roughness={0.2}
                    />
                  </mesh>
                  <mesh position={[2.0, 0.05, 2.9]}>
                    <planeGeometry args={[1.3, 0.8]} />
                    <meshStandardMaterial
                      color={colors.windowGlow}
                      emissive={colors.windowGlow}
                      emissiveIntensity={colors.windowEmission}
                      roughness={0.2}
                    />
                  </mesh>
                </>
              )}
            </group>
          );
        })}
      </group>

      {/* ========================================================================= */}
      {/* 3. NAMED OBJECT: ENTRANCE (FRONT ENTRANCE & CURVED PORTICO CANOPY) */}
      {/* ========================================================================= */}
      <group
        name="ENTRANCE"
        position={[-1.2, -2.0, 3.4]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectZone('ENTRANCE');
        }}
      >
        {/* Curved Vaulted Portico Canopy Arch */}
        <mesh rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[2.5, 2.5, 1.8, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={colors.canopyDark} metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>

        {/* Twin Stainless Steel Support Columns */}
        <mesh position={[-1.1, -0.7, 0.8]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2]} />
          <meshStandardMaterial color={colors.steelColumn} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.1, -0.7, 0.8]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2]} />
          <meshStandardMaterial color={colors.steelColumn} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Warm Ground Threshold Spotlight */}
        <pointLight position={[0, -0.2, 0.4]} intensity={2.0} color="#fbbf24" distance={5} />

        {/* Floating Spatial Label on Selection */}
        {selectedZone === 'ENTRANCE' && (
          <Html position={[0, 1.2, 0]} center distanceFactor={12}>
            <div className="pointer-events-none rounded-2xl border border-blue-400 bg-slate-950/95 p-3 text-center shadow-2xl backdrop-blur-2xl whitespace-nowrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Front Entrance Portico</span>
              <span className="text-[10px] text-blue-300">Biometric Turnstile &amp; Canopy Approach</span>
            </div>
          </Html>
        )}
      </group>

      {/* ========================================================================= */}
      {/* 4. NAMED OBJECT: RECEPTION (RECEPTION ZONE & DIGITAL CONCIERGE) */}
      {/* ========================================================================= */}
      <group
        name="RECEPTION"
        position={[-1.2, -1.7, 1.2]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectZone('RECEPTION');
        }}
      >
        {/* Reception Floor Slab */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[2.8, 0.08, 2.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>

        {/* Curved Reception Concierge Desk */}
        <mesh position={[0, -0.15, -0.4]}>
          <boxGeometry args={[1.6, 0.7, 0.5]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Desk Glowing Accent Strip */}
        <mesh position={[0, 0.15, -0.14]}>
          <planeGeometry args={[1.5, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Digital Check-in Kiosk Tablet */}
        <mesh position={[-0.4, 0.3, -0.4]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.25, 0.2, 0.02]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>

        {/* Turnstile Access Gate */}
        <group position={[0.8, -0.1, 0.3]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.04]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Waiting Lounge Sofa */}
        <mesh position={[-0.8, -0.3, 0.5]}>
          <boxGeometry args={[0.9, 0.3, 0.5]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>

        {selectedZone === 'RECEPTION' && (
          <Html position={[0, 0.8, 0]} center distanceFactor={12}>
            <div className="pointer-events-none rounded-2xl border border-cyan-400 bg-slate-950/95 p-3 text-center shadow-2xl backdrop-blur-2xl whitespace-nowrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Cozy Den Reception Zone</span>
              <span className="text-[10px] text-cyan-300">Smart Turnstile • Resident Check-In</span>
            </div>
          </Html>
        )}
      </group>

      {/* ========================================================================= */}
      {/* 5. NAMED OBJECT: MESS_AREA (MESS / DINING AREA & BUFFET STATION) */}
      {/* ========================================================================= */}
      <group
        name="MESS_AREA"
        position={[1.8, -1.7, 0.6]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectZone('MESS_AREA');
        }}
      >
        {/* Dining Hall Floor Slab */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[3.2, 0.08, 2.8]} />
          <meshStandardMaterial color="#2b1a16" roughness={0.6} />
        </mesh>

        {/* 4 Sets of Dining Tables & Benches */}
        {[
          [-0.8, -0.6],
          [-0.8, 0.5],
          [0.8, -0.6],
          [0.8, 0.5],
        ].map(([tx, tz], idx) => (
          <group key={`mess-tbl-${idx}`} position={[tx, -0.25, tz]}>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.9, 0.05, 0.5]} />
              <meshStandardMaterial color="#78350f" roughness={0.5} />
            </mesh>
            <mesh position={[-0.38, -0.15, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.35]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            <mesh position={[0.38, -0.15, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.35]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Elevated Stainless Buffet Counter */}
        <mesh position={[0, -0.18, -1.05]}>
          <boxGeometry args={[2.6, 0.38, 0.45]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Overhead Food Warmer Lamps */}
        <pointLight position={[0, 0.35, -1.05]} intensity={2.2} color="#f97316" distance={3.8} />

        {selectedZone === 'MESS_AREA' && (
          <Html position={[0, 0.8, 0]} center distanceFactor={12}>
            <div className="pointer-events-none rounded-2xl border border-amber-400 bg-slate-950/95 p-3 text-center shadow-2xl backdrop-blur-2xl whitespace-nowrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Cozy Mess &amp; Dining Hall</span>
              <span className="text-[10px] text-amber-300">4-Meal Schedule • Buffet Service</span>
            </div>
          </Html>
        )}
      </group>

      {/* ========================================================================= */}
      {/* 6. NAMED OBJECT: ROOM_BLOCK (STUDENT RESIDENT ROOM BLOCK INTERIOR) */}
      {/* ========================================================================= */}
      <group
        name="ROOM_BLOCK"
        position={[-1.5, 1.1, 0.8]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectZone('ROOM_BLOCK');
        }}
      >
        {/* Room Floor Slab */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[2.6, 0.08, 2.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        {/* Resident Bed with Mattress & Quilt */}
        <group position={[-0.7, -0.25, -0.5]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.25, 1.6]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.15, 0.1]}>
            <boxGeometry args={[0.85, 0.08, 1.3]} />
            <meshStandardMaterial color="#2563eb" roughness={0.6} />
          </mesh>
          {/* Pillow */}
          <mesh position={[0, 0.18, -0.6]}>
            <boxGeometry args={[0.65, 0.08, 0.35]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
        </group>

        {/* Study Desk & Laptop */}
        <group position={[0.6, -0.2, -0.5]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.55]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
          <mesh position={[-0.38, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.38, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Laptop */}
          <mesh position={[0, 0.06, 0]} rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.3, 0.02, 0.22]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.16, -0.1]} rotation={[-0.3, 0.1, 0]}>
            <boxGeometry args={[0.3, 0.18, 0.01]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Wall Wardrobe */}
        <mesh position={[0.8, 0.1, 0.6]}>
          <boxGeometry args={[0.5, 1.1, 0.6]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>

        {/* IoT Environment Sensor Beacon */}
        <mesh position={[-0.9, 0.4, 0.8]}>
          <boxGeometry args={[0.15, 0.15, 0.04]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.9} />
        </mesh>

        {selectedZone === 'ROOM_BLOCK' && (
          <Html position={[0, 0.8, 0]} center distanceFactor={12}>
            <div className="pointer-events-none rounded-2xl border border-indigo-400 bg-slate-950/95 p-3 text-center shadow-2xl backdrop-blur-2xl whitespace-nowrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Student Room Suite 304</span>
              <span className="text-[10px] text-indigo-300">IoT Air Vitals • Fiber 5GHz AP • Ergonomic Study</span>
            </div>
          </Html>
        )}
      </group>

      {/* ========================================================================= */}
      {/* 7. NAMED OBJECT: ADMIN_OFFICE (MANAGEMENT WARDEN OFFICE & CCTV WALL) */}
      {/* ========================================================================= */}
      <group
        name="ADMIN_OFFICE"
        position={[-1.2, -0.3, -1.0]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectZone('ADMIN_OFFICE');
        }}
      >
        {/* Office Floor Slab */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[2.6, 0.08, 2.2]} />
          <meshStandardMaterial color="#1c1917" roughness={0.6} />
        </mesh>

        {/* Executive Mahogany Desk */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1.5, 0.6, 0.7]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>

        {/* Leather Swivel High-Back Armchair */}
        <group position={[0, -0.1, -0.6]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.35, -0.2]}>
            <boxGeometry args={[0.45, 0.6, 0.08]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* CCTV Monitoring Wall Display Matrix (4 Camera Feeds) */}
        <group position={[0, 0.4, 0.95]}>
          <mesh>
            <boxGeometry args={[1.8, 0.8, 0.05]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* 4 Glowing Monitor Tiles */}
          {[-0.45, 0.45].map((x, xi) =>
            [-0.18, 0.18].map((y, yi) => (
              <mesh key={`cam-${xi}-${yi}`} position={[x, y, 0.03]}>
                <planeGeometry args={[0.75, 0.3]} />
                <meshStandardMaterial
                  color="#0284c7"
                  emissive="#0284c7"
                  emissiveIntensity={0.7}
                  roughness={0.2}
                />
              </mesh>
            ))
          )}
        </group>

        {selectedZone === 'ADMIN_OFFICE' && (
          <Html position={[0, 0.8, 0]} center distanceFactor={12}>
            <div className="pointer-events-none rounded-2xl border border-rose-400 bg-slate-950/95 p-3 text-center shadow-2xl backdrop-blur-2xl whitespace-nowrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Warden Admin Office</span>
              <span className="text-[10px] text-rose-300">48h SLA Escalation Command • CCTV Grid</span>
            </div>
          </Html>
        )}
      </group>

      {/* ========================================================================= */}
      {/* 8. NAMED OBJECT: DREAMCAST_LOUNGE (ROOFTOP MEMORY LOUNGE & BILLBOARD) */}
      {/* ========================================================================= */}
      <group
        name="DREAMCAST_LOUNGE"
        position={[0, isExploded ? 2.5 * 2.2 + 0.9 : 3.4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelectZone('DREAMCAST_LOUNGE');
        }}
      >
        {/* Rooftop Recreation Floor Slab */}
        <mesh position={[0, 0.5, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[8.2, 0.12, 6.6]} />
          <meshStandardMaterial color="#1c2430" roughness={0.5} metalness={0.7} />
        </mesh>

        {/* Heavy Industrial Truss Canopy Steel Beams */}
        {[-3.2, -1.6, 0, 1.6, 3.2].map((x, i) => (
          <mesh key={`truss-${i}`} position={[x, 0.25, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}

        {/* Real Illuminated Green Rooftop Billboard: "COZY DEN - SCOPE GLOBAL SKILLS UNIVERSITY" */}
        <group position={[-1.8, 0.85, 3.25]} rotation={[-0.05, 0, 0]}>
          <mesh>
            <boxGeometry args={[3.2, 0.75, 0.08]} />
            <meshStandardMaterial color={colors.signboardGreen} roughness={0.3} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[3.12, 0.67]} />
            <meshStandardMaterial color="#166534" roughness={0.4} />
          </mesh>
          <Text
            position={[0, 0.04, 0.06]}
            fontSize={0.32}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
          >
            COZY DEN
          </Text>
          <Text
            position={[0, -0.2, 0.06]}
            fontSize={0.09}
            color="#bbf7d0"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            SCOPE GLOBAL SKILLS UNIVERSITY
          </Text>
        </group>

        {/* Holographic DreamCast Memory Projector Pedestal */}
        <group position={[1.5, 0.8, 0.5]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.45, 0.5, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Ethereal Holographic Memory Beam */}
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[0.6, 0.9, 16, 1, true]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[0, 0.8, 0]} intensity={2.5} color="#38bdf8" distance={4} />
        </group>

        {/* Stargazing Sky Telescope on Tripod */}
        <group position={[-2.5, 0.8, 1.2]} rotation={[0.4, -0.5, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.8]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Tripod Legs */}
          {[-0.15, 0.15].map((x, li) => (
            <mesh key={`leg-${li}`} position={[x, -0.1, 0]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]}>
              <cylinderGeometry args={[0.015, 0.015, 0.6]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))}
        </group>

        {selectedZone === 'DREAMCAST_LOUNGE' && (
          <Html position={[0, 1.6, 0]} center distanceFactor={12}>
            <div className="pointer-events-none rounded-2xl border border-purple-400 bg-slate-950/95 p-3 text-center shadow-2xl backdrop-blur-2xl whitespace-nowrap">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Rooftop DreamCast Memory Lounge</span>
              <span className="text-[10px] text-purple-300">AI Face Projector • Sky Telescope • Acoustic Deck</span>
            </div>
          </Html>
        )}
      </group>

    </group>
  );
}
