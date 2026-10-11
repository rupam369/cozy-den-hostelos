export interface RoomTelemetry {
  temperature: number; // in °C
  powerUsage: number; // in kW/h
  wifiSignal: number; // in dBm
  doorStatus: 'Locked' | 'Unlocked';
  acStatus: 'Active' | 'Eco' | 'Off';
  lightIntensity: number; // 0 - 100%
}

export interface HostelRoom {
  id: string;
  roomNumber: string;
  floor: number;
  wing: 'A' | 'B' | 'East' | 'West' | 'Central';
  type: 'Double Balcony Suite' | 'Executive Suite' | 'Standard Double' | 'Triple Deluxe' | 'Dining Hall' | 'Reception & Lounge';
  capacity: number;
  occupants: {
    name: string;
    role: string;
    studentId: string;
    avatar: string;
  }[];
  telemetry: RoomTelemetry;
  amenities: string[];
  activeIssueId?: string;
  issueDescription?: string;
  issueSeverity?: 'critical' | 'high' | 'medium' | 'none';
  position3D: [number, number, number]; // [x, y, z] offset relative to floor
}

export const HOSTEL_ROOMS_DATA: HostelRoom[] = [
  // --- LEVEL 0: GROUND FLOOR ---
  {
    id: 'room-001',
    roomNumber: 'Reception & Porch',
    floor: 0,
    wing: 'Central',
    type: 'Reception & Lounge',
    capacity: 20,
    occupants: [
      { name: 'Kishan Lal', role: 'Security Supervisor', studentId: 'SEC-01', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Meena Sharma', role: 'Front Desk Officer', studentId: 'REC-04', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 24.2,
      powerUsage: 2.1,
      wifiSignal: -38,
      doorStatus: 'Unlocked',
      acStatus: 'Active',
      lightIntensity: 85,
    },
    amenities: ['24/7 Biometric Turnstiles', 'CCTV Monitoring Hub', 'First Aid Station', 'Parcel Delivery Locker'],
    issueSeverity: 'none',
    position3D: [-1.4, 0, 1.8],
  },
  {
    id: 'room-002',
    roomNumber: 'Cozy Mess & Dining Hall',
    floor: 0,
    wing: 'East',
    type: 'Dining Hall',
    capacity: 120,
    occupants: [
      { name: 'Rohan Mehra', role: 'Mess Manager', studentId: 'MESS-DIR', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
      { name: 'Chef Ramdas', role: 'Head Culinary Lead', studentId: 'CHEF-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 23.5,
      powerUsage: 4.8,
      wifiSignal: -42,
      doorStatus: 'Unlocked',
      acStatus: 'Active',
      lightIntensity: 90,
    },
    amenities: ['Steam Bain-Marie Counters', 'UV-C Cutlery Sanitizer', 'RO Water Chiller', 'Digital Token Display', 'Hand-Wash Pods'],
    issueSeverity: 'none',
    position3D: [1.8, 0, 0.5],
  },

  // --- LEVEL 1: FLOOR 1 ---
  {
    id: 'room-101',
    roomNumber: 'Room 101',
    floor: 1,
    wing: 'A',
    type: 'Double Balcony Suite',
    capacity: 2,
    occupants: [
      { name: 'Karan Patel', role: 'Resident (CSE 3rd Yr)', studentId: 'SGSU-22-108', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
      { name: 'Sameer Khan', role: 'Resident (AI/DS 3rd Yr)', studentId: 'SGSU-22-114', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 23.0,
      powerUsage: 1.1,
      wifiSignal: -45,
      doorStatus: 'Locked',
      acStatus: 'Eco',
      lightIntensity: 60,
    },
    amenities: ['Dual Study Desks', 'Ergonomic Mesh Chairs', 'Private Balcony', 'Attached Bath', 'LAN Socket'],
    issueSeverity: 'none',
    position3D: [-2.0, 0, 1.2],
  },
  {
    id: 'room-102',
    roomNumber: 'Room 102',
    floor: 1,
    wing: 'A',
    type: 'Standard Double',
    capacity: 2,
    occupants: [
      { name: 'Tanvi Iyer', role: 'Floor Rep (ECE 2nd Yr)', studentId: 'SGSU-23-044', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      { name: 'Ananya Sen', role: 'Resident (Design 2nd Yr)', studentId: 'SGSU-23-089', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 22.8,
      powerUsage: 0.95,
      wifiSignal: -44,
      doorStatus: 'Locked',
      acStatus: 'Active',
      lightIntensity: 75,
    },
    amenities: ['Study Bookshelf', 'Wardrobe Storage', 'Garden View Windows', 'Attached Bath'],
    issueSeverity: 'none',
    position3D: [-0.6, 0, 1.2],
  },
  {
    id: 'room-104',
    roomNumber: 'Room 104',
    floor: 1,
    wing: 'B',
    type: 'Double Balcony Suite',
    capacity: 2,
    occupants: [
      { name: 'Priya Nair', role: 'Resident (Robotics)', studentId: 'SGSU-23-112', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' },
      { name: 'Ritu Sharma', role: 'Resident (BioTech)', studentId: 'SGSU-23-116', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 23.4,
      powerUsage: 1.0,
      wifiSignal: -48,
      doorStatus: 'Locked',
      acStatus: 'Eco',
      lightIntensity: 50,
    },
    amenities: ['Balcony Garden', 'Dual Study Stations', 'LAN 1 Gbps', 'Ceiling Fan'],
    issueSeverity: 'none',
    position3D: [1.8, 0, 1.2],
  },

  // --- LEVEL 2: FLOOR 2 ---
  {
    id: 'room-201',
    roomNumber: 'Room 201',
    floor: 2,
    wing: 'A',
    type: 'Double Balcony Suite',
    capacity: 2,
    occupants: [
      { name: 'Manav Sethi', role: 'Resident (CSE 3rd Yr)', studentId: 'SGSU-22-045', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Harsh Vardhan', role: 'Resident (Cybersecurity)', studentId: 'SGSU-22-092', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 23.1,
      powerUsage: 1.2,
      wifiSignal: -46,
      doorStatus: 'Locked',
      acStatus: 'Active',
      lightIntensity: 65,
    },
    amenities: ['Balcony Lounge', 'Attached Bath', 'High-Speed WiFi', 'Full Wardrobes'],
    issueSeverity: 'none',
    position3D: [-2.0, 0, 1.2],
  },
  {
    id: 'room-202',
    roomNumber: 'Room 202',
    floor: 2,
    wing: 'A',
    type: 'Double Balcony Suite',
    capacity: 2,
    occupants: [
      { name: 'Devansh Roy', role: 'Floor 2 Representative', studentId: 'SGSU-22-019', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Kunal Bahl', role: 'Resident (Mechanical)', studentId: 'SGSU-22-031', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 22.9,
      powerUsage: 1.05,
      wifiSignal: -41,
      doorStatus: 'Unlocked',
      acStatus: 'Active',
      lightIntensity: 80,
    },
    amenities: ['Floor Rep Desk', 'Attached Bath', 'Balcony Sunset View', 'Solar Hot Water'],
    issueSeverity: 'none',
    position3D: [-0.6, 0, 1.2],
  },
  {
    id: 'room-204',
    roomNumber: 'Room 204',
    floor: 2,
    wing: 'B',
    type: 'Double Balcony Suite',
    capacity: 2,
    occupants: [
      { name: 'Siddharth Sen', role: 'Resident (EE 3rd Yr)', studentId: 'SGSU-22-201', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { name: 'Tushar Jain', role: 'Resident (Civil 3rd Yr)', studentId: 'SGSU-22-205', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 25.1,
      powerUsage: 0.2, // Tripped breaker
      wifiSignal: -52,
      doorStatus: 'Unlocked',
      acStatus: 'Off',
      lightIntensity: 20,
    },
    amenities: ['Balcony View', 'Study Desks', 'Safety MCB Box', 'Attached Washroom'],
    activeIssueId: 'comp-103',
    issueDescription: 'Main circuit breaker tripping during rainy hours. > 48h Escalation Active!',
    issueSeverity: 'critical',
    position3D: [1.8, 0, 1.2],
  },

  // --- LEVEL 3: FLOOR 3 ---
  {
    id: 'room-301',
    roomNumber: 'Room 301',
    floor: 3,
    wing: 'A',
    type: 'Executive Suite',
    capacity: 2,
    occupants: [
      { name: 'Abhay Singhania', role: 'Senior Resident (CSE 4th Yr)', studentId: 'SGSU-21-011', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80' },
      { name: 'Rohit Das', role: 'Senior Resident (AI 4th Yr)', studentId: 'SGSU-21-042', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 22.4,
      powerUsage: 1.35,
      wifiSignal: -40,
      doorStatus: 'Locked',
      acStatus: 'Active',
      lightIntensity: 70,
    },
    amenities: ['Panoramic Balcony', 'Dual Monitor Setups', 'Attached Bath', 'Solar Geyser'],
    issueSeverity: 'none',
    position3D: [-2.0, 0, 1.2],
  },
  {
    id: 'room-304',
    roomNumber: 'Room 304',
    floor: 3,
    wing: 'East',
    type: 'Executive Suite',
    capacity: 2,
    occupants: [
      { name: 'Aryan Sharma', role: 'Room Leader & Resident Head', studentId: 'SGSU-21-007', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { name: 'Kabir Bedi', role: 'Resident (Data Science 4th Yr)', studentId: 'SGSU-21-028', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
    ],
    telemetry: {
      temperature: 22.0,
      powerUsage: 1.4,
      wifiSignal: -39,
      doorStatus: 'Locked',
      acStatus: 'Active',
      lightIntensity: 85,
    },
    amenities: ['1 Gbps Mesh WiFi Node AP-3B', 'Attached Balcony with Night Bhopal Skyline', 'Ergonomic Desks', 'Attached Washroom', 'Private Bookcase'],
    activeIssueId: 'comp-101',
    issueDescription: 'High-speed WiFi packet drops on 3rd Floor East Wing during 8-11 PM (Assigned to Vikram Roy)',
    issueSeverity: 'high',
    position3D: [1.8, 0, 1.2],
  },
];
