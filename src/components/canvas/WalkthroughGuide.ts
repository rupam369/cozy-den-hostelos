export interface TourStop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  floorLevel?: number;
}

export const TOUR_STOPS: TourStop[] = [
  {
    id: 'facade',
    title: 'Cozy Den Exterior Facade',
    subtitle: 'Starlit Bhopal Night View',
    description: 'The real 4-story architecture featuring warm ivory stucco, dark chocolate balconies, and the illuminated rooftop signboard.',
    badge: 'Campus Exterior',
    cameraPos: [10, 4.5, 12],
    targetPos: [0, 0, 0],
  },
  {
    id: 'porch',
    title: 'Curved Entrance Portico',
    subtitle: 'Ground Floor Arrival',
    description: 'Modern curved steel canopy with warm downlights welcoming residents back after evening study hours. 24/7 biometric security.',
    badge: 'Level 0 • Porch',
    cameraPos: [-1.2, -1.2, 5.8],
    targetPos: [-1.2, -1.8, 3.4],
    floorLevel: 0,
  },
  {
    id: 'mess',
    title: 'Ground Floor Mess & Dining Hall',
    subtitle: 'Four-Pillar Dining Quality',
    description: 'Spacious dining hall with hot steam counters, UV-sanitized cutlery, and four daily meal sessions: Breakfast, Lunch, High Tea & Dinner.',
    badge: 'Level 0 • Dining',
    cameraPos: [3.8, -1.2, 4.2],
    targetPos: [1.2, -1.8, 1.5],
    floorLevel: 0,
  },
  {
    id: 'atrium',
    title: 'Central Open Atrium & Stairwell',
    subtitle: 'Architectural Light Shaft',
    description: 'Dramatic multi-level quadrangle looking up through all resident floors to the open night sky, bordered by safety railings and spotlights.',
    badge: 'Core • Atrium',
    cameraPos: [0, 0.5, 2.0],
    targetPos: [0, 2.5, 0],
  },
  {
    id: 'room204',
    title: 'Room 204 (Active Issue Hotspot)',
    subtitle: 'Level 2 • Wing B',
    description: 'Floor 2 resident room currently flagged with a 48-hour electrical circuit escalation. Monitored directly on the live 3D twin.',
    badge: 'Level 2 • Hotspot',
    cameraPos: [2.2, 1.6, 5.0],
    targetPos: [2.0, 1.1, 3.0],
    floorLevel: 2,
  },
  {
    id: 'room304',
    title: 'Executive Suite 304',
    subtitle: 'Level 3 • East Wing',
    description: 'Aryan Sharma\'s room. Double occupancy balcony suite with high-speed 1 Gbps Mesh WiFi (AP-3B), study desks, and private balcony.',
    badge: 'Level 3 • Suite 304',
    cameraPos: [-1.8, 3.0, 5.0],
    targetPos: [-1.6, 2.5, 3.0],
    floorLevel: 3,
  },
  {
    id: 'rooftop',
    title: 'Sky Terrace & Solar Canopy',
    subtitle: 'Rooftop Recreation Deck',
    description: 'Protected by slanted solar shed trusses. Stargazing telescope, weekend acoustic jam stage, open-air fitness gym, and city panoramas.',
    badge: 'Rooftop Deck',
    cameraPos: [0, 4.8, 6.2],
    targetPos: [0, 3.2, 0],
  },
];
