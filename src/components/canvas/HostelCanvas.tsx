'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Text, RoundedBox, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { GLTFExporter } from 'three-stdlib';
import * as THREE from 'three';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  Layers, 
  Sun, 
  Moon, 
  Compass, 
  Camera, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  UtensilsCrossed, 
  DoorOpen, 
  Volume2, 
  VolumeX, 
  X, 
  Maximize2, 
  ExternalLink, 
  ShieldAlert, 
  Info,
  Download,
  Building2
} from 'lucide-react';
import Image from 'next/image';
import { TOUR_STOPS, TourStop } from './WalkthroughGuide';
import { HOSTEL_ROOMS_DATA, HostelRoom } from '@/data/hostelRoomsData';
import RoomInspectorModal from '@/components/modals/RoomInspectorModal';
import MessInspectorModal from '@/components/modals/MessInspectorModal';
import FoodRatingModal from '@/components/modals/FoodRatingModal';
import ComplaintModal from '@/components/modals/ComplaintModal';
import DigitalTwinModel, { DigitalTwinZone } from './DigitalTwinModel';
import { sound } from '@/lib/sound';

// Camera focal coordinates for each named Digital Twin zone
const ZONE_CAMERA_TARGETS: Record<DigitalTwinZone, { cam: [number, number, number]; look: [number, number, number] }> = {
  COZYDEN_BUILDING: { cam: [10, 5, 12], look: [0, 0, 0] },
  ENTRANCE: { cam: [-1.2, -0.6, 7.5], look: [-1.2, -1.8, 3.4] },
  RECEPTION: { cam: [-1.2, -0.5, 4.2], look: [-1.2, -1.5, 1.2] },
  ROOM_BLOCK: { cam: [-1.5, 2.0, 3.8], look: [-1.5, 1.1, 0.8] },
  MESS_AREA: { cam: [2.0, -0.5, 3.8], look: [1.8, -1.5, 0.6] },
  ADMIN_OFFICE: { cam: [-1.2, 0.6, 2.2], look: [-1.2, -0.3, -1.0] },
  DREAMCAST_LOUNGE: { cam: [0, 5.2, 5.8], look: [0, 3.4, 0] },
};

// -------------------------------------------------------------
// Guided Camera Controller for 3D Walkthrough Tour & Zone Focus
// -------------------------------------------------------------
interface CameraControllerProps {
  isTourActive: boolean;
  currentTourStop: TourStop;
  activeBuildingFloor: number | null;
  selectedZone: DigitalTwinZone | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

function GuidedCameraController({
  isTourActive,
  currentTourStop,
  activeBuildingFloor,
  selectedZone,
  controlsRef,
}: CameraControllerProps) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTourActive) {
      const targetCam = new THREE.Vector3(...currentTourStop.cameraPos);
      const targetLook = new THREE.Vector3(...currentTourStop.targetPos);

      camera.position.lerp(targetCam, THREE.MathUtils.clamp(delta * 2.8, 0, 1));
      controlsRef.current.target.lerp(targetLook, THREE.MathUtils.clamp(delta * 2.8, 0, 1));
      controlsRef.current.update();
    } else if (selectedZone && ZONE_CAMERA_TARGETS[selectedZone]) {
      const targetCam = new THREE.Vector3(...ZONE_CAMERA_TARGETS[selectedZone].cam);
      const targetLook = new THREE.Vector3(...ZONE_CAMERA_TARGETS[selectedZone].look);

      camera.position.lerp(targetCam, THREE.MathUtils.clamp(delta * 2.8, 0, 1));
      controlsRef.current.target.lerp(targetLook, THREE.MathUtils.clamp(delta * 2.8, 0, 1));
      controlsRef.current.update();
    } else if (activeBuildingFloor !== null) {
      const floorYOffsets = [-1.7, -0.3, 1.1, 2.5];
      const targetY = floorYOffsets[activeBuildingFloor] || 0;
      const targetCam = new THREE.Vector3(7.5, targetY + 1.8, 8.5);
      const targetLook = new THREE.Vector3(0, targetY, 0);

      camera.position.lerp(targetCam, THREE.MathUtils.clamp(delta * 2.5, 0, 1));
      controlsRef.current.target.lerp(targetLook, THREE.MathUtils.clamp(delta * 2.5, 0, 1));
      controlsRef.current.update();
    }
  });

  return null;
}

// Bridge component to capture canvas Three.js scene for GLB exporter
function SceneExporterBridge({ onExportRef }: { onExportRef: (fn: () => void) => void }) {
  const { scene } = useThree();

  useEffect(() => {
    onExportRef(() => {
      sound.playCameraSwoosh();
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'cozy_den_digital_twin.glb';
          link.click();
          URL.revokeObjectURL(url);
          sound.playChime();
        },
        (error) => {
          console.error('An error occurred exporting the GLB model:', error);
        },
        { binary: true }
      );
    });
  }, [scene, onExportRef]);

  return null;
}

// -------------------------------------------------------------
// Pulsating 3D Complaint Hotspot Beacon
// -------------------------------------------------------------
interface HotspotProps {
  position: [number, number, number];
  color: string;
  label: string;
  badge: string;
  onClick: () => void;
}

function ComplaintHotspotBeacon({ position, color, label, badge, onClick }: HotspotProps) {
  const haloRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (haloRef.current) {
      const scale = 1 + Math.sin(time * 3.5) * 0.45;
      haloRef.current.scale.set(scale, scale, scale);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.55 - Math.sin(time * 3.5) * 0.25;
      }
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(hovered ? 1.4 : 1.0);
    }
  });

  return (
    <group position={position}>
      {/* Outer pulsating wave halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} wireframe />
      </mesh>

      {/* Core glowing orb */}
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation();
          sound.playAlert();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3.0 : 2.0}
        />
      </mesh>

      {/* Floating 3D Tooltip */}
      <Html position={[0, 0.45, 0]} center distanceFactor={14}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playAlert();
            onClick();
          }}
          className={`pointer-events-auto cursor-pointer rounded-xl border px-2.5 py-1 backdrop-blur-xl shadow-2xl transition-all ${
            color === '#ef4444'
              ? 'border-red-500/60 bg-red-950/90 text-red-100 ring-2 ring-red-500/40'
              : color === '#f59e0b'
              ? 'border-amber-500/60 bg-amber-950/90 text-amber-100 ring-1 ring-amber-500/30'
              : 'border-blue-500/60 bg-blue-950/90 text-blue-100 ring-1 ring-blue-500/30'
          } ${hovered ? 'scale-110 shadow-red-500/30' : ''}`}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: color }} />
            <span className="font-extrabold text-[10px] uppercase tracking-wider">{badge}</span>
          </div>
          <p className="text-[10px] font-medium text-slate-200 whitespace-nowrap mt-0.5">{label}</p>
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// 3D Room Box Model for Interactive Visualization on Floors
// -------------------------------------------------------------
interface Room3DProps {
  room: HostelRoom;
  onSelect: (room: HostelRoom) => void;
}

function Room3DBox({ room, onSelect }: Room3DProps) {
  const [hovered, setHovered] = useState(false);
  const isAlert = room.issueSeverity === 'critical';

  return (
    <group position={room.position3D}>
      {/* Interactive Room Volume Box */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          onSelect(room);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.1, 0.85, 0.9]} />
        <meshStandardMaterial
          color={isAlert ? '#7f1d1d' : hovered ? '#3b82f6' : '#1e293b'}
          emissive={isAlert ? '#ef4444' : hovered ? '#2563eb' : '#000000'}
          emissiveIntensity={isAlert ? 0.6 : hovered ? 0.4 : 0}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Room Door Frame */}
      <mesh position={[0, -0.05, 0.46]}>
        <planeGeometry args={[0.35, 0.65]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Room Number Plate in 3D */}
      <Text
        position={[0, 0.32, 0.47]}
        fontSize={0.08}
        color={hovered ? '#ffffff' : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
        font=""
      >
        {room.roomNumber.replace('Room ', 'R-')}
      </Text>

      {/* Floating Badge on Hover */}
      {hovered && (
        <Html position={[0, 0.65, 0]} center distanceFactor={12}>
          <div className="pointer-events-none rounded-xl border border-white/20 bg-slate-950/90 px-2.5 py-1 text-center shadow-xl backdrop-blur-md whitespace-nowrap">
            <p className="text-[11px] font-bold text-white">{room.roomNumber}</p>
            <p className="text-[9px] text-slate-300">{room.type}</p>
            <p className="text-[9px] text-blue-400 mt-0.5">Click to Inspect IoT &amp; Residents</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// Ground Floor Mess Area 3D Detail
// -------------------------------------------------------------
interface Mess3DProps {
  onOpenMessModal: () => void;
}

function MessArea3D({ onOpenMessModal }: Mess3DProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[1.6, 0, 0.8]}>
      {/* Dining Hall Floor Slab with Warm Ambient Accent */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3.2, 0.08, 2.6]} />
        <meshStandardMaterial color="#2d1b15" roughness={0.6} />
      </mesh>

      {/* Dining Tables & Benches (4 Sets) */}
      {[
        [-0.8, -0.5],
        [-0.8, 0.5],
        [0.8, -0.5],
        [0.8, 0.5],
      ].map(([x, z], idx) => (
        <group key={`table-${idx}`} position={[x, -0.25, z]}>
          {/* Table Top */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.9, 0.05, 0.5]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
          {/* Table Legs */}
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

      {/* Buffet Counter Station */}
      <mesh position={[0, -0.18, -1.05]}>
        <boxGeometry args={[2.6, 0.38, 0.45]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Steam heat lamps over buffet */}
      <pointLight position={[0, 0.3, -1.05]} intensity={1.5} color="#f97316" distance={3.5} />

      {/* Interactive 3D Mess Beacon */}
      <Html position={[0, 0.4, 0]} center distanceFactor={13}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            onOpenMessModal();
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`pointer-events-auto cursor-pointer rounded-2xl border border-amber-500/40 bg-slate-950/90 p-2 text-center backdrop-blur-xl shadow-2xl transition-all ${
            hovered ? 'scale-110 ring-2 ring-amber-400/50 bg-amber-950/80' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 justify-center">
            <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-amber-300">
              Cozy Mess &amp; Dining Hall
            </span>
          </div>
          <p className="text-[9px] text-slate-300 mt-0.5">Click for 4-Meal Menu &amp; Crowd Capacity</p>
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// Single Floor Component with Rooms and Realistic Architecture
// -------------------------------------------------------------
interface FloorProps {
  level: number;
  name: string;
  subtitle: string;
  yOffset: number;
  isSelected: boolean;
  isExploded: boolean;
  timeOfDay: 'day' | 'sunset' | 'night';
  onSelect: () => void;
  onSelectRoom: (room: HostelRoom) => void;
  onOpenMessModal: () => void;
  onHotspotClick: (roomNumber: string) => void;
}

function BuildingFloor({
  level,
  name,
  yOffset,
  isSelected,
  isExploded,
  timeOfDay,
  onSelect,
  onSelectRoom,
  onOpenMessModal,
  onHotspotClick,
}: FloorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const targetY = isExploded ? yOffset * 2.2 : yOffset;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY,
        5,
        delta
      );
    }
  });

  const creamFacadeColor = isSelected ? '#3b82f6' : hovered ? '#fbf8f2' : '#f2ece1';
  const brownAccentColor = isSelected ? '#2563eb' : '#33231d';
  const railingColor = '#171717';

  const windowGlowColor = timeOfDay === 'night' ? '#fbbf24' : timeOfDay === 'sunset' ? '#f97316' : '#f8fafc';
  const windowEmission = timeOfDay === 'night' ? 1.6 : timeOfDay === 'sunset' ? 1.1 : 0.2;

  // Filter rooms on this specific floor
  const floorRooms = useMemo(() => {
    return HOSTEL_ROOMS_DATA.filter((r) => r.floor === level);
  }, [level]);

  return (
    <group
      ref={groupRef}
      position={[0, yOffset, 0]}
      onClick={(e) => {
        e.stopPropagation();
        sound.playClick();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Floor Concrete Slab */}
      <RoundedBox args={[7.8, 0.25, 6.2]} radius={0.05} smoothness={4} position={[0, -0.65, 0]}>
        <meshStandardMaterial color="#262626" roughness={0.7} metalness={0.2} />
      </RoundedBox>

      {/* Main Ivory Body Block */}
      <RoundedBox args={[7.2, 1.15, 5.6]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={creamFacadeColor}
          roughness={0.6}
          metalness={0.1}
          transparent={isSelected && isExploded}
          opacity={isSelected && isExploded ? 0.8 : 1.0}
        />
      </RoundedBox>

      {/* Dark Chocolate Brown Balcony Recession (Front Center-Left) */}
      <RoundedBox args={[2.8, 1.16, 0.45]} radius={0.04} smoothness={4} position={[-1.6, 0, 2.7]}>
        <meshStandardMaterial color={brownAccentColor} roughness={0.5} metalness={0.2} />
      </RoundedBox>

      {/* Dark Chocolate Brown Balcony Recession (Front Right) */}
      <RoundedBox args={[2.2, 1.16, 0.45]} radius={0.04} smoothness={4} position={[2.0, 0, 2.7]}>
        <meshStandardMaterial color={brownAccentColor} roughness={0.5} metalness={0.2} />
      </RoundedBox>

      {/* Projecting Balcony Slabs */}
      <RoundedBox args={[2.6, 0.12, 1.1]} radius={0.04} smoothness={4} position={[-1.6, -0.52, 3.2]}>
        <meshStandardMaterial color="#e5ded2" roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[2.0, 0.12, 1.1]} radius={0.04} smoothness={4} position={[2.0, -0.52, 3.2]}>
        <meshStandardMaterial color="#e5ded2" roughness={0.5} />
      </RoundedBox>

      {/* Black Metal Balcony Railings */}
      <group position={[-1.6, -0.22, 3.72]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2.55, 0.04, 0.04]} />
          <meshStandardMaterial color={railingColor} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.55, 0.04, 0.04]} />
          <meshStandardMaterial color={railingColor} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[2.55, 0.04, 0.04]} />
          <meshStandardMaterial color={railingColor} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      <group position={[2.0, -0.22, 3.72]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.95, 0.04, 0.04]} />
          <meshStandardMaterial color={railingColor} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.95, 0.04, 0.04]} />
          <meshStandardMaterial color={railingColor} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[1.95, 0.04, 0.04]} />
          <meshStandardMaterial color={railingColor} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>

      {/* Windows with glow */}
      <mesh position={[-1.6, 0.05, 2.9]}>
        <planeGeometry args={[1.6, 0.85]} />
        <meshStandardMaterial
          color={windowGlowColor}
          emissive={windowGlowColor}
          emissiveIntensity={windowEmission}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[2.0, 0.05, 2.9]}>
        <planeGeometry args={[1.3, 0.85]} />
        <meshStandardMaterial
          color={windowGlowColor}
          emissive={windowGlowColor}
          emissiveIntensity={windowEmission}
          roughness={0.2}
        />
      </mesh>

      {/* Ventilation Windows */}
      <mesh position={[0.2, 0.35, 2.82]}>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial
          color={windowGlowColor}
          emissive={windowGlowColor}
          emissiveIntensity={windowEmission * 0.7}
        />
      </mesh>
      <mesh position={[3.3, 0.35, 2.82]}>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial
          color={windowGlowColor}
          emissive={windowGlowColor}
          emissiveIntensity={windowEmission * 0.7}
        />
      </mesh>

      {/* RENDER GROUND FLOOR MESS DETAIL IF LEVEL 0 */}
      {level === 0 && <MessArea3D onOpenMessModal={onOpenMessModal} />}

      {/* RENDER 3D ROOMS VISUALIZATION WHEN FLOOR IS SELECTED OR EXPLODED */}
      {(isSelected || isExploded) && (
        <group position={[0, 0.2, 0]}>
          {floorRooms.map((room) => (
            <Room3DBox key={room.id} room={room} onSelect={onSelectRoom} />
          ))}
        </group>
      )}

      {/* 3D COMPLAINT HOTSPOTS ON THIS FLOOR */}
      {level === 2 && (
        <>
          {/* Room 204 Electrical Hotspot */}
          <ComplaintHotspotBeacon
            position={[1.8, 0.3, 3.2]}
            color="#ef4444"
            badge="🚨 48h Escalation"
            label="Room 204: Breaker Fault"
            onClick={() => onHotspotClick('Room 204')}
          />
          {/* Washroom Solar Geyser Hotspot */}
          <ComplaintHotspotBeacon
            position={[-2.8, 0.2, 1.8]}
            color="#38bdf8"
            badge="💧 Water Supply"
            label="Washroom 2B: Solar Valve"
            onClick={() => onHotspotClick('Washroom Cluster 2B')}
          />
        </>
      )}

      {level === 3 && (
        /* Floor 3 WiFi Mesh Hotspot */
        <ComplaintHotspotBeacon
          position={[0, 0.3, 3.2]}
          color="#f59e0b"
          badge="📶 WiFi Mesh"
          label="Corridor AP-3B: 5GHz Packet Drop"
          onClick={() => onHotspotClick('Room 304')}
        />
      )}

      {/* Floor Label Badge */}
      {(hovered || isSelected || isExploded) && (
        <Html position={[4.6, 0, 0]} center distanceFactor={13}>
          <div className="pointer-events-none whitespace-nowrap rounded-xl border border-white/20 bg-slate-950/90 px-3 py-1.5 backdrop-blur-md shadow-2xl transition-all">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-blue-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="font-bold text-xs tracking-wide text-white uppercase">{name}</span>
            </div>
            <p className="text-[10px] text-slate-300">
              {level === 0 ? 'Ground: Reception, Porch & Cozy Mess' : `Floor ${level}: ${floorRooms.length} Active Suites`}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// Full 3D Real Building Environment
// -------------------------------------------------------------
interface BuildingProps {
  timeOfDay: 'day' | 'sunset' | 'night';
  onSelectRoom: (room: HostelRoom) => void;
  onOpenMessModal: () => void;
  onHotspotClick: (roomNumber: string) => void;
}

function RealCozyDenBuilding({
  timeOfDay,
  onSelectRoom,
  onOpenMessModal,
  onHotspotClick,
}: BuildingProps) {
  const { activeBuildingFloor, setActiveBuildingFloor, isExplodedView } = useApp();
  const buildingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buildingRef.current && activeBuildingFloor === null && !isExplodedView) {
      buildingRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.05;
    }
  });

  const floors = [
    { level: 0, name: 'Ground Floor: Reception & Mess', subtitle: 'Curved Entrance Canopy & Dining Hall', yOffset: -1.7 },
    { level: 1, name: 'Floor 1: Resident Suites & Study', subtitle: 'Rooms 101-104 & Central Atrium Walkway', yOffset: -0.3 },
    { level: 2, name: 'Floor 2: Resident Suites (Wing A & B)', subtitle: 'Rooms 201-204 with Balconies', yOffset: 1.1 },
    { level: 3, name: 'Floor 3: Senior Resident Suites', subtitle: 'Rooms 301-304 & Balcony Views', yOffset: 2.5 },
  ];

  return (
    <group ref={buildingRef} position={[0, -0.6, 0]}>
      {/* Landscaping Base / Driveway Ground */}
      <mesh position={[0, -2.6, 0]} receiveShadow>
        <cylinderGeometry args={[7.6, 8.2, 0.35, 64]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Pathway Border */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.8, 7.1, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>

      {/* REAL GROUND FLOOR CURVED CANOPY ENTRANCE */}
      <group position={[-1.2, -2.0, 3.4]}>
        <mesh rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[2.4, 2.4, 1.8, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-1.1, -0.7, 0.8]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[1.1, -0.7, 0.8]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <pointLight position={[0, -0.2, 0.4]} intensity={1.8} color="#fbbf24" distance={5} />
      </group>

      {/* Floors 0 to 3 */}
      {floors.map((floor) => (
        <BuildingFloor
          key={floor.level}
          level={floor.level}
          name={floor.name}
          subtitle={floor.subtitle}
          yOffset={floor.yOffset}
          isSelected={activeBuildingFloor === floor.level}
          isExploded={isExplodedView}
          timeOfDay={timeOfDay}
          onSelect={() => {
            setActiveBuildingFloor(activeBuildingFloor === floor.level ? null : floor.level);
          }}
          onSelectRoom={onSelectRoom}
          onOpenMessModal={onOpenMessModal}
          onHotspotClick={onHotspotClick}
        />
      ))}

      {/* REAL ROOFTOP CANOPY & ICONIC "COZY DEN" BILLBOARD */}
      <group position={[0, isExplodedView ? 2.5 * 2.2 + 0.9 : 3.4, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[8.2, 0.12, 6.6]} />
          <meshStandardMaterial color="#1c2430" roughness={0.5} metalness={0.7} />
        </mesh>

        {[-3.2, -1.6, 0, 1.6, 3.2].map((x, i) => (
          <mesh key={`truss-${i}`} position={[x, 0.25, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}

        {/* COZY DEN ROOFTOP SIGNBOARD */}
        <group position={[-1.8, 0.85, 3.25]} rotation={[-0.05, 0, 0]}>
          <mesh>
            <boxGeometry args={[3.2, 0.75, 0.08]} />
            <meshStandardMaterial color="#14532d" roughness={0.3} metalness={0.3} />
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
            font=""
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
      </group>

      {/* REAL CAMPUS SIGNPOST IN DRIVEWAY */}
      <group position={[3.6, -2.1, 3.5]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.9]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.4, 0.75, 0.04]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.4} metalness={0.3} />
        </mesh>
        <Text position={[0, 0.48, 0.03]} fontSize={0.08} color="#ffffff" anchorX="center" anchorY="middle">
          SCOPE GLOBAL
        </Text>
        <Text position={[0, 0.38, 0.03]} fontSize={0.07} color="#93c5fd" anchorX="center" anchorY="middle">
          SKILLS UNIVERSITY
        </Text>
        <Text position={[0, 0.22, 0.03]} fontSize={0.11} color="#ffffff" anchorX="center" anchorY="middle">
          BOYS HOSTEL ←
        </Text>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// Real Lighting Setup
// -------------------------------------------------------------
function RealBuildingLighting({ timeOfDay }: { timeOfDay: 'day' | 'sunset' | 'night' }) {
  if (timeOfDay === 'night') {
    return (
      <>
        <ambientLight intensity={0.4} color="#0c1322" />
        <directionalLight position={[10, 14, 10]} intensity={0.8} color="#94a3b8" castShadow />
        <pointLight position={[-6, 4, 8]} intensity={1.8} color="#fbbf24" distance={16} />
        <pointLight position={[6, 2, 7]} intensity={1.6} color="#f59e0b" distance={14} />
        <pointLight position={[-1.2, -1.8, 4]} intensity={2.2} color="#fef08a" distance={8} />
        <Stars radius={90} depth={40} count={3500} factor={3.5} saturation={0} fade speed={1.2} />
      </>
    );
  }

  if (timeOfDay === 'sunset') {
    return (
      <>
        <ambientLight intensity={0.5} color="#581c87" />
        <directionalLight position={[12, 8, 10]} intensity={2.2} color="#fdba74" castShadow />
        <pointLight position={[-6, 3, 6]} intensity={1.5} color="#f97316" />
        <Stars radius={90} depth={40} count={1200} factor={3} saturation={0} fade speed={0.8} />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.9} color="#f8fafc" />
      <directionalLight position={[12, 18, 12]} intensity={2.0} color="#ffffff" castShadow />
      <directionalLight position={[-10, 8, -8]} intensity={0.5} color="#cbd5e1" />
    </>
  );
}

// Real Campus Photos
const REAL_HOSTEL_PHOTOS = [
  {
    src: '/images/hostel/cozy_den_real_facade.png',
    title: 'COZY DEN Night Facade',
    caption: 'Full 4-story exterior with illuminated balconies & rooftop billboard under clear Bhopal night sky.',
    badge: 'Main Facade',
  },
  {
    src: '/images/hostel/cozy_den_atrium_night.png',
    title: 'Central Atrium Shaft',
    caption: 'Looking up through the multi-floor stairwell atrium quadrangle framed by night sky and warm downlights.',
    badge: 'Atrium Quadrangle',
  },
  {
    src: '/images/hostel/cozy_den_canopy_entrance.png',
    title: 'Curved Entrance Canopy',
    caption: 'Ground floor curved portico entrance with ambient spotlights and glass reception lounge.',
    badge: 'Ground Entrance',
  },
  {
    src: '/images/hostel/cozy_den_signboard_driveway.png',
    title: 'Campus Driveway & Signboard',
    caption: 'Scope Global Skills University Boys Hostel board pointing to the Cozy Den entrance under the stars.',
    badge: 'Campus Driveway',
  },
];

// -------------------------------------------------------------
// MAIN HOSTEL CANVAS EXPORT
// -------------------------------------------------------------
export default function HostelCanvas() {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('night');
  const [viewMode, setViewMode] = useState<'3d' | 'real_photos'>('3d');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const { isExplodedView, setIsExplodedView, activeBuildingFloor, setActiveBuildingFloor } = useApp();

  // Digital Twin Named Zones & View Mode State
  const [twinViewMode, setTwinViewMode] = useState<'exterior' | 'interior'>('exterior');
  const [selectedZone, setSelectedZone] = useState<DigitalTwinZone | null>(null);
  const exportGLBFn = useRef<(() => void) | null>(null);

  // Walkthrough State
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Inspector Modals State
  const [selectedRoom, setSelectedRoom] = useState<HostelRoom | null>(null);
  const [isMessModalOpen, setIsMessModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isFoodRatingModalOpen, setIsFoodRatingModalOpen] = useState(false);

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Auto-play timer for Walkthrough tour
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTourActive && isAutoPlay) {
      timer = setInterval(() => {
        setCurrentTourIndex((prev) => {
          const next = (prev + 1) % TOUR_STOPS.length;
          sound.playCameraSwoosh();
          return next;
        });
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isTourActive, isAutoPlay]);

  const startTour = () => {
    sound.playCameraSwoosh();
    setIsTourActive(true);
    setSelectedZone(null);
    setCurrentTourIndex(0);
    setIsAutoPlay(true);
    setActiveBuildingFloor(null);
  };

  const stopTour = () => {
    sound.playClick();
    setIsTourActive(false);
    setIsAutoPlay(false);
  };

  const nextStop = () => {
    sound.playCameraSwoosh();
    setCurrentTourIndex((prev) => (prev + 1) % TOUR_STOPS.length);
  };

  const prevStop = () => {
    sound.playCameraSwoosh();
    setCurrentTourIndex((prev) => (prev - 1 + TOUR_STOPS.length) % TOUR_STOPS.length);
  };

  const handleHotspotClick = (roomNumber: string) => {
    const found = HOSTEL_ROOMS_DATA.find((r) => r.roomNumber.includes(roomNumber) || roomNumber.includes(r.roomNumber));
    if (found) {
      setSelectedRoom(found);
    } else {
      setIsComplaintModalOpen(true);
    }
  };

  const activeTourStop = TOUR_STOPS[currentTourIndex];

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] md:h-[700px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-900/95 to-slate-950/90 shadow-2xl backdrop-blur-2xl">
      
      {/* 3D Model Mode */}
      {viewMode === '3d' ? (
        <Canvas
          shadows
          camera={{ position: [10, 5, 12], fov: 44 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <RealBuildingLighting timeOfDay={timeOfDay} />
          <Float speed={isTourActive || selectedZone !== null ? 0 : 0.8} rotationIntensity={isTourActive || selectedZone !== null ? 0 : 0.08} floatIntensity={isTourActive || selectedZone !== null ? 0 : 0.1}>
            <DigitalTwinModel
              timeOfDay={timeOfDay}
              viewMode={isExplodedView ? 'exploded' : twinViewMode}
              selectedZone={selectedZone}
              onSelectZone={(zone) => {
                setSelectedZone(zone);
                setIsTourActive(false);
                if (zone === 'MESS_AREA') setIsMessModalOpen(true);
                if (zone === 'ROOM_BLOCK') {
                  const r304 = HOSTEL_ROOMS_DATA.find((r) => r.roomNumber.includes('304'));
                  if (r304) setSelectedRoom(r304);
                }
              }}
              activeBuildingFloor={activeBuildingFloor}
            />
          </Float>
          <SceneExporterBridge onExportRef={(fn) => { exportGLBFn.current = fn; }} />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={4.5}
            maxDistance={24}
            maxPolarAngle={Math.PI / 2 + 0.05}
            autoRotate={!isExplodedView && activeBuildingFloor === null && !isTourActive && selectedZone === null}
            autoRotateSpeed={0.6}
          />
          <GuidedCameraController
            isTourActive={isTourActive}
            currentTourStop={activeTourStop}
            activeBuildingFloor={activeBuildingFloor}
            selectedZone={selectedZone}
            controlsRef={controlsRef}
          />
        </Canvas>
      ) : (
        /* Real Photos Gallery Viewer Mode */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950/95">
          <div className="relative w-full max-w-3xl h-[420px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
            <Image
              src={REAL_HOSTEL_PHOTOS[activePhotoIndex].src}
              alt={REAL_HOSTEL_PHOTOS[activePhotoIndex].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div className="space-y-1">
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  {REAL_HOSTEL_PHOTOS[activePhotoIndex].badge}
                </span>
                <h3 className="text-base font-bold text-white">
                  {REAL_HOSTEL_PHOTOS[activePhotoIndex].title}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  {REAL_HOSTEL_PHOTOS[activePhotoIndex].caption}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto p-1 max-w-full">
            {REAL_HOSTEL_PHOTOS.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  setActivePhotoIndex(idx);
                }}
                className={`relative h-14 w-20 rounded-xl overflow-hidden border transition-all shrink-0 ${
                  activePhotoIndex === idx
                    ? 'border-blue-400 ring-2 ring-blue-500/50 scale-105'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={photo.src} alt={photo.title} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TOP FLOATING HUD CONTROLS
         ------------------------------------------------------------- */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
        
        {/* Title & Status */}
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/85 px-3.5 py-2 backdrop-blur-xl shadow-lg">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">COZY DEN 3D TWIN</h3>
              <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-bold text-blue-300 border border-blue-500/30">
                Live IoT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Scope Global Skills University Boys Hostel</p>
          </div>
        </div>

        {/* View Switcher, Walkthrough Button & Lighting Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/85 p-1.5 backdrop-blur-xl shadow-lg flex-wrap sm:flex-nowrap">
          
          {/* 3D Walkthrough Tour Launch Button */}
          {viewMode === '3d' && (
            <button
              onClick={() => {
                if (isTourActive) {
                  stopTour();
                } else {
                  startTour();
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-md ${
                isTourActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-400/50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isTourActive ? 'Exit 3D Tour' : '3D Walkthrough'}</span>
            </button>
          )}

          {/* Mode Switcher */}
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('3d');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
              viewMode === '3d'
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3D Model</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('real_photos');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'real_photos'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Photos ({REAL_HOSTEL_PHOTOS.length})</span>
          </button>

          {viewMode === '3d' && (
            <>
              <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

              {/* Lighting */}
              <button
                onClick={() => {
                  sound.playClick();
                  setTimeOfDay('night');
                }}
                className={`p-1.5 rounded-xl text-xs transition-all ${
                  timeOfDay === 'night' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Night Mode"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setTimeOfDay('sunset');
                }}
                className={`p-1.5 rounded-xl text-xs transition-all ${
                  timeOfDay === 'sunset' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Sunset Mode"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>

              {/* Interior Walk-In vs Exterior Mode Toggle */}
              <button
                onClick={() => {
                  sound.playClick();
                  setTwinViewMode(twinViewMode === 'exterior' ? 'interior' : 'exterior');
                }}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                  twinViewMode === 'interior'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md ring-1 ring-cyan-400/50'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                title="Toggle between Exterior Facade and Interior Walk-In X-Ray View"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{twinViewMode === 'interior' ? 'Interior' : 'Exterior'}</span>
              </button>

              {/* Exploded View Toggle */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsExplodedView(!isExplodedView);
                }}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-medium transition-all ${
                  isExplodedView
                    ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400/50'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                title="Explode Architectural Floor Layers"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden md:inline">{isExplodedView ? 'Collapse' : 'Explode'}</span>
              </button>

              {/* Export GLB 3D Model Button */}
              <button
                onClick={() => {
                  if (exportGLBFn.current) exportGLBFn.current();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-md"
                title="Export and download web-ready binary GLB 3D model"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Export GLB</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* -------------------------------------------------------------
          NAMED OBJECT QUICK ZONE RIBBON (Apple Vision Pro Glass Bar)
         ------------------------------------------------------------- */}
      {viewMode === '3d' && (
        <div className="absolute top-16 left-4 right-4 pointer-events-none z-20 flex items-center justify-start sm:justify-center overflow-x-auto py-1">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/85 p-1.5 backdrop-blur-xl shadow-2xl max-w-full overflow-x-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 shrink-0">Zones:</span>
            {[
              { id: 'COZYDEN_BUILDING' as DigitalTwinZone, label: 'Building' },
              { id: 'ENTRANCE' as DigitalTwinZone, label: 'Entrance' },
              { id: 'RECEPTION' as DigitalTwinZone, label: 'Reception' },
              { id: 'MESS_AREA' as DigitalTwinZone, label: 'Mess Hall' },
              { id: 'ROOM_BLOCK' as DigitalTwinZone, label: 'Room Suite' },
              { id: 'ADMIN_OFFICE' as DigitalTwinZone, label: 'Warden Office' },
              { id: 'DREAMCAST_LOUNGE' as DigitalTwinZone, label: 'Sky Lounge' },
            ].map((z) => (
              <button
                key={z.id}
                onClick={() => {
                  sound.playClick();
                  setIsTourActive(false);
                  setActiveBuildingFloor(null);
                  setSelectedZone(selectedZone === z.id ? null : z.id);
                  if (z.id === 'MESS_AREA') setIsMessModalOpen(true);
                  if (z.id === 'ROOM_BLOCK') {
                    const r304 = HOSTEL_ROOMS_DATA.find((r) => r.roomNumber.includes('304'));
                    if (r304) setSelectedRoom(r304);
                  }
                }}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedZone === z.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg ring-1 ring-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {z.label}
              </button>
            ))}

            {selectedZone !== null && (
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedZone(null);
                }}
                className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded-lg font-medium shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          ZONE SPATIAL HUD DETAIL CARD (When a zone is selected)
         ------------------------------------------------------------- */}
      {selectedZone && viewMode === '3d' && (
        <div className="absolute top-28 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 pointer-events-auto z-30 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="rounded-3xl border border-blue-500/30 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-2xl text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="rounded-full bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                Named 3D Twin Zone
              </span>
              <button
                onClick={() => setSelectedZone(null)}
                className="h-6 w-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                {selectedZone === 'COZYDEN_BUILDING' ? 'Main Hostel Architecture' :
                 selectedZone === 'ENTRANCE' ? 'Front Entrance Portico' :
                 selectedZone === 'RECEPTION' ? 'Ground Reception Zone' :
                 selectedZone === 'MESS_AREA' ? 'Mess & Dining Hall' :
                 selectedZone === 'ROOM_BLOCK' ? 'Student Room Block 304' :
                 selectedZone === 'ADMIN_OFFICE' ? 'Warden Management Office' :
                 'Rooftop DreamCast Memory Lounge'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedZone === 'COZYDEN_BUILDING' ? '4 multi-story levels matching real Scope Global Skills University facade with chocolate brown balcony alcoves & central atrium.' :
                 selectedZone === 'ENTRANCE' ? 'Curved portico canopy arch with twin stainless steel support pillars, driveway approach & floor spotlights.' :
                 selectedZone === 'RECEPTION' ? 'Automated entrance, curved LED concierge desk, smart resident turnstile keycard gate & waiting couch.' :
                 selectedZone === 'MESS_AREA' ? 'Ground cafeteria with 4 sets of long dining tables, stainless buffet serving station & warm heat lamps.' :
                 selectedZone === 'ROOM_BLOCK' ? 'Minimalist wooden bed, study desk with cyber lamp, laptop, wall wardrobe, and IoT environmental sensor.' :
                 selectedZone === 'ADMIN_OFFICE' ? 'Executive mahogany desk, high-back leather swivel chair, document safe, and 4-feed CCTV monitor matrix.' :
                 'Rooftop recreation lounge with illuminated green COZY DEN billboard, ethereal memory projector & sky telescope.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>IoT Mesh Active</span>
              </span>
              {selectedZone === 'MESS_AREA' && (
                <button
                  onClick={() => setIsMessModalOpen(true)}
                  className="text-amber-400 hover:underline font-bold text-xs"
                >
                  Open Menu →
                </button>
              )}
              {selectedZone === 'ROOM_BLOCK' && (
                <button
                  onClick={() => {
                    const r304 = HOSTEL_ROOMS_DATA.find((r) => r.roomNumber.includes('304'));
                    if (r304) setSelectedRoom(r304);
                  }}
                  className="text-blue-400 hover:underline font-bold text-xs"
                >
                  Inspect Suite →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          WALKTHROUGH TOUR FLOATING CARD (When Walkthrough is Active)
         ------------------------------------------------------------- */}
      {isTourActive && viewMode === '3d' && (
        <div className="absolute top-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 pointer-events-auto z-30 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-3xl border border-white/20 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-2xl text-white">
            
            {/* Top Indicator */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                {activeTourStop.badge}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {currentTourIndex + 1} / {TOUR_STOPS.length}
                </span>
                <button
                  onClick={stopTour}
                  className="h-6 w-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Stop Info */}
            <div className="mt-3 space-y-1">
              <h4 className="text-base font-bold text-white">{activeTourStop.title}</h4>
              <p className="text-xs font-semibold text-purple-300">{activeTourStop.subtitle}</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {activeTourStop.description}
              </p>
            </div>

            {/* Tour Controls (Prev, Next, Auto-play) */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevStop}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-all"
                  title="Previous Stop"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextStop}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-white transition-all"
                  title="Next Stop"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                    isAutoPlay ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {isAutoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span>{isAutoPlay ? 'Auto' : 'Play'}</span>
                </button>
              </div>

              {/* Stop-specific Action Shortcuts */}
              {activeTourStop.id === 'mess' && (
                <button
                  onClick={() => setIsMessModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/30"
                >
                  <UtensilsCrossed className="h-3 w-3" />
                  <span>Mess Details</span>
                </button>
              )}
              {activeTourStop.id === 'room204' && (
                <button
                  onClick={() => handleHotspotClick('Room 204')}
                  className="flex items-center gap-1 text-[11px] font-bold text-red-300 hover:text-white bg-red-500/20 px-2.5 py-1 rounded-xl border border-red-500/30 animate-pulse"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Inspect Fault</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          BOTTOM INTERACTIVE FLOOR & HOTSPOT BAR
         ------------------------------------------------------------- */}
      {viewMode === '3d' && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none z-20">
          
          {/* Floor Selection Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/85 p-1.5 backdrop-blur-xl shadow-xl overflow-x-auto max-w-full">
            {[
              { level: 0, label: 'L0: Reception & Mess' },
              { level: 1, label: 'L1: Floor 1 Suites' },
              { level: 2, label: 'L2: Floor 2 Balconies' },
              { level: 3, label: 'L3: Floor 3 Suites' },
            ].map((item) => (
              <button
                key={item.level}
                onClick={() => {
                  sound.playClick();
                  setIsTourActive(false);
                  setActiveBuildingFloor(activeBuildingFloor === item.level ? null : item.level);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeBuildingFloor === item.level
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg ring-1 ring-blue-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}

            {activeBuildingFloor !== null && (
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveBuildingFloor(null);
                }}
                className="text-[11px] text-slate-400 hover:text-white px-2.5 py-1 font-medium"
              >
                Reset Camera
              </button>
            )}
          </div>

          {/* Quick Shortcuts: Mess & Hotspots */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsMessModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-2xl border border-amber-500/30 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 backdrop-blur-md shadow-lg transition-all"
            >
              <UtensilsCrossed className="h-3.5 w-3.5" />
              <span>Mess Hall</span>
            </button>
            <button
              onClick={() => handleHotspotClick('Room 204')}
              className="flex items-center gap-1.5 rounded-2xl border border-red-500/30 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 backdrop-blur-md shadow-lg transition-all"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              <span>Hotspots (3)</span>
            </button>
          </div>

        </div>
      )}

      {/* -------------------------------------------------------------
          MODALS & DRAWERS
         ------------------------------------------------------------- */}
      {/* Room Inspector Modal */}
      <RoomInspectorModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onRequestComplaint={(roomNum) => {
          setSelectedRoom(null);
          setIsComplaintModalOpen(true);
        }}
      />

      {/* Mess Inspector Modal */}
      <MessInspectorModal
        isOpen={isMessModalOpen}
        onClose={() => setIsMessModalOpen(false)}
        onOpenRating={() => setIsFoodRatingModalOpen(true)}
      />

      {/* Food Rating Modal */}
      <FoodRatingModal
        isOpen={isFoodRatingModalOpen}
        onClose={() => setIsFoodRatingModalOpen(false)}
      />

      {/* Complaint Reporting Modal */}
      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />

    </div>
  );
}
