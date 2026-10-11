import { PicBotMemory, PicBotChatMessage, PicBotDetectedFace } from '@/types';

// ================================================================
// SEED MEMORIES DATABASE FOR COZY DEN DREAMCAST PICBOT
// ================================================================
export const INITIAL_PICBOT_MEMORIES: PicBotMemory[] = [
  {
    id: 'mem-db-001',
    image_url: '/images/hostel/cozy_den_atrium_night.png',
    event: 'Mid-Term Exam All-Nighter Study Sprint',
    date: '2024-10-04',
    year: 2024,
    location: 'Central Atrium Study Pods',
    category: 'Daily Memories',
    album: 'Semester 5 Chronicles',
    caption: '3 AM study sessions at the central atrium light shaft with endless cups of cutting chai.',
    uploaded_by_name: 'Devansh Roy',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi', 'Devansh Roy'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.992, bounding_box: { x: 0.28, y: 0.32, w: 0.18, h: 0.22 } },
      { person_name: 'Kabir Bedi', confidence: 0.984, bounding_box: { x: 0.52, y: 0.35, w: 0.16, h: 0.21 } },
    ],
  },
  {
    id: 'mem-db-002',
    image_url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    event: 'Inter-Hostel Cricket Premier League Finals',
    date: '2024-09-18',
    year: 2024,
    location: 'SGSU Sports Complex Ground',
    category: 'Sports & Games',
    album: 'Cricket Championship 2024',
    caption: 'Cozy Den Warriors lifting the SGSU Trophy! Aryan hit the winning boundary in the final over!',
    uploaded_by_name: 'Siddharth Sen',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi', 'Siddharth Sen', 'Harsh Vardhan'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.996, bounding_box: { x: 0.42, y: 0.24, w: 0.19, h: 0.25 } },
      { person_name: 'Kabir Bedi', confidence: 0.988, bounding_box: { x: 0.65, y: 0.28, w: 0.17, h: 0.23 } },
    ],
  },
  {
    id: 'mem-db-003',
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    event: 'Grand Saturday Sky Terrace Acoustic Night',
    date: '2024-09-28',
    year: 2024,
    location: 'Sky Terrace Recreation Deck',
    category: 'Celebrations',
    album: 'Terrace Jam Sessions',
    caption: 'Stargazing, acoustic guitars, and tandoori skewers under the illuminated Cozy Den billboard.',
    uploaded_by_name: 'Aryan Sharma',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi', 'Tanvi Iyer', 'Devansh Roy'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.989, bounding_box: { x: 0.35, y: 0.30, w: 0.18, h: 0.24 } },
      { person_name: 'Kabir Bedi', confidence: 0.982, bounding_box: { x: 0.58, y: 0.32, w: 0.17, h: 0.22 } },
      { person_name: 'Tanvi Iyer', confidence: 0.978, bounding_box: { x: 0.15, y: 0.34, w: 0.16, h: 0.21 } },
    ],
  },
  {
    id: 'mem-db-004',
    image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    event: 'Cozy Den 48-Hour Hackathon Victory',
    date: '2024-08-14',
    year: 2024,
    location: 'Executive Suite 304',
    category: 'Hostel Events',
    album: 'Tech & Hackathons',
    caption: 'Aryan & Kabir bagging 1st prize for building the AI Smart Hostel energy telemetry model.',
    uploaded_by_name: 'Kabir Bedi',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.994, bounding_box: { x: 0.32, y: 0.26, w: 0.20, h: 0.25 } },
      { person_name: 'Kabir Bedi', confidence: 0.991, bounding_box: { x: 0.60, y: 0.25, w: 0.19, h: 0.24 } },
    ],
  },
  {
    id: 'mem-db-005',
    image_url: '/images/hostel/cozy_den_real_facade.png',
    event: 'Deepawali Lights & Diya Illumination',
    date: '2023-11-12',
    year: 2023,
    location: 'Cozy Den Main Entrance Facade',
    category: 'Celebrations',
    album: 'Diwali Homecoming',
    caption: 'The entire 4-story facade lit up with fairy lights and student-made clay diyas. Unforgettable warmth.',
    uploaded_by_name: 'Warden Office',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi', 'Siddharth Sen', 'Tanvi Iyer'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.979, bounding_box: { x: 0.40, y: 0.38, w: 0.17, h: 0.21 } },
    ],
  },
  {
    id: 'mem-db-006',
    image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    event: 'Upper Lake Sunset Outing & Speedboating',
    date: '2024-07-21',
    year: 2024,
    location: 'Bhopal Upper Lake Marina',
    category: 'Trips & Outings',
    album: 'Weekend Getaways',
    caption: 'Post-midterm boat race and lakeside Maggi with the entire Floor 3 wing squad.',
    uploaded_by_name: 'Aryan Sharma',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi', 'Devansh Roy', 'Manav Sethi'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.995, bounding_box: { x: 0.22, y: 0.25, w: 0.18, h: 0.23 } },
      { person_name: 'Kabir Bedi', confidence: 0.987, bounding_box: { x: 0.45, y: 0.27, w: 0.17, h: 0.22 } },
    ],
  },
  {
    id: 'mem-db-007',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    event: 'Sunday Special Gulaab Jamun Mess Feast',
    date: '2024-09-01',
    year: 2024,
    location: 'Cozy Mess & Dining Hall',
    category: 'Daily Memories',
    album: 'Mess Food Diaries',
    caption: 'Nothing beats fresh Paneer Butter Masala and hot gulab jamun after a grueling week of labs.',
    uploaded_by_name: 'Mess Manager',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi', 'Tanvi Iyer'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.983, bounding_box: { x: 0.36, y: 0.32, w: 0.17, h: 0.22 } },
      { person_name: 'Kabir Bedi', confidence: 0.976, bounding_box: { x: 0.62, y: 0.34, w: 0.16, h: 0.20 } },
    ],
  },
  {
    id: 'mem-db-008',
    image_url: '/images/hostel/cozy_den_canopy_entrance.png',
    event: 'Curfew Chai Run at Curved Portico',
    date: '2024-10-01',
    year: 2024,
    location: 'Curved Entrance Canopy & Porch',
    category: 'Daily Memories',
    album: 'Midnight Chronicles',
    caption: '11:55 PM sprint back to the biometric gates after grabbing ginger tea down the driveway.',
    uploaded_by_name: 'Security Supervisor',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.991, bounding_box: { x: 0.48, y: 0.30, w: 0.19, h: 0.24 } },
      { person_name: 'Kabir Bedi', confidence: 0.985, bounding_box: { x: 0.68, y: 0.33, w: 0.17, h: 0.22 } },
    ],
  },
  {
    id: 'mem-db-009',
    image_url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
    event: 'Annual SGSU Athletic Sprint Finals',
    date: '2023-12-05',
    year: 2023,
    location: 'Campus Running Track',
    category: 'Sports & Games',
    album: 'SGSU Sports Meet 2023',
    caption: 'Aryan grabbing Silver medal in the 400m inter-hostel relay!',
    uploaded_by_name: 'Sports Rep',
    tagged_residents: ['Aryan Sharma'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.993, bounding_box: { x: 0.44, y: 0.22, w: 0.21, h: 0.27 } },
    ],
  },
  {
    id: 'mem-db-010',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    event: 'Fresher Welcome Gala & DJ Night',
    date: '2022-09-15',
    year: 2022,
    location: 'Cozy Den Amphitheatre Courtyard',
    category: 'Hostel Events',
    album: 'Fresher Memories 2022',
    caption: 'First week at Cozy Den as freshers! Time truly flies when you live with brothers.',
    uploaded_by_name: 'Alumni Association',
    tagged_residents: ['Aryan Sharma', 'Kabir Bedi', 'Siddharth Sen'],
    faces_detected: [
      { person_name: 'Aryan Sharma', confidence: 0.981, bounding_box: { x: 0.38, y: 0.30, w: 0.18, h: 0.23 } },
      { person_name: 'Kabir Bedi', confidence: 0.975, bounding_box: { x: 0.58, y: 0.32, w: 0.17, h: 0.21 } },
    ],
  },
];

// ================================================================
// SIMULATED FACE EMBEDDINGS & COSINE SIMILARITY ENGINE
// ================================================================

// Compute deterministic high-dimensional vector for a face
export function generateFaceEmbedding(identifier: string): number[] {
  const dim = 128;
  const vector: number[] = [];
  let seed = 0;
  for (let i = 0; i < identifier.length; i++) {
    seed = (seed * 31 + identifier.charCodeAt(i)) % 100000;
  }

  for (let i = 0; i < dim; i++) {
    const val = Math.sin(seed + i * 1.618);
    vector.push(val);
  }

  // Normalize to unit vector
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return vector.map((v) => v / norm);
}

// Cosine similarity between two unit vectors (returns -1 to 1)
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

// Match photos against a reference student (e.g. Aryan Sharma)
export function matchStudentFace(
  memories: PicBotMemory[],
  targetStudentName: string = 'Aryan Sharma',
  minConfidence: number = 0.85
): PicBotMemory[] {
  const referenceEmbedding = generateFaceEmbedding(targetStudentName);

  const matched = memories
    .filter((mem) => {
      // Check if face detected matches target student
      return mem.faces_detected.some((face) => {
        const faceEmbedding = generateFaceEmbedding(face.person_name);
        const sim = cosineSimilarity(referenceEmbedding, faceEmbedding);
        // If same person, sim is 1.0; add realistic micro variance
        return face.person_name.toLowerCase() === targetStudentName.toLowerCase() || sim > 0.92;
      });
    })
    .map((mem) => {
      // Calculate realistic confidence score
      const matchingFace = mem.faces_detected.find(
        (f) => f.person_name.toLowerCase() === targetStudentName.toLowerCase()
      );
      const score = matchingFace ? Math.round(matchingFace.confidence * 1000) / 10 : 96.5;
      return {
        ...mem,
        match_confidence: score,
      };
    });

  // Sort by highest confidence
  return matched.sort((a, b) => (b.match_confidence || 0) - (a.match_confidence || 0));
}

// ================================================================
// NATURAL LANGUAGE PICBOT QUERY PARSER
// ================================================================
export interface ParseQueryResult {
  reply: string;
  results: PicBotMemory[];
  metaBadge: string;
}

export function parsePicBotNaturalQuery(
  query: string,
  allMemories: PicBotMemory[],
  userName: string = 'Aryan Sharma',
  roommateName: string = 'Kabir Bedi'
): ParseQueryResult {
  const q = query.toLowerCase().trim();

  // 1. Cricket / Sports queries
  if (q.includes('cricket') || q.includes('sports') || q.includes('match') || q.includes('trophy')) {
    const results = allMemories.filter(
      (m) =>
        (m.category === 'Sports & Games' || m.event.toLowerCase().includes('cricket') || m.caption.toLowerCase().includes('cricket')) &&
        m.tagged_residents.includes(userName)
    );
    return {
      reply: `Found ${results.length} sports & cricket memories of you! Including the winning final at SGSU Grounds.`,
      results,
      metaBadge: 'Athletic Archives',
    };
  }

  // 2. Roommate queries
  if (q.includes('roommate') || q.includes('kabir') || q.includes('together') || q.includes('with my bro')) {
    const results = allMemories.filter(
      (m) => m.tagged_residents.includes(userName) && m.tagged_residents.includes(roommateName)
    );
    return {
      reply: `Found ${results.length} memories of you and your roommate ${roommateName}! From hackathons to late-night chai runs.`,
      results,
      metaBadge: 'Roommate Duo',
    };
  }

  // 3. Terrace / Jam / Night queries
  if (q.includes('terrace') || q.includes('diwali') || q.includes('acoustic') || q.includes('stargazing')) {
    const results = allMemories.filter(
      (m) =>
        (m.location.toLowerCase().includes('terrace') ||
          m.event.toLowerCase().includes('acoustic') ||
          m.event.toLowerCase().includes('diwali')) &&
        m.tagged_residents.includes(userName)
    );
    return {
      reply: `Located ${results.length} Sky Terrace memories featuring night acoustic sessions and festive fireworks!`,
      results,
      metaBadge: 'Rooftop Deck',
    };
  }

  // 4. Mess / Food queries
  if (q.includes('food') || q.includes('mess') || q.includes('dinner') || q.includes('lunch') || q.includes('jamun')) {
    const results = allMemories.filter(
      (m) =>
        (m.location.toLowerCase().includes('mess') || m.caption.toLowerCase().includes('paneer') || m.category === 'Daily Memories') &&
        m.tagged_residents.includes(userName)
    );
    return {
      reply: `Found ${results.length} moments at Cozy Mess & Dining Hall!`,
      results,
      metaBadge: 'Mess Moments',
    };
  }

  // 5. Trip / Outing queries
  if (q.includes('trip') || q.includes('outing') || q.includes('lake') || q.includes('bhopal')) {
    const results = allMemories.filter(
      (m) => m.category === 'Trips & Outings' && m.tagged_residents.includes(userName)
    );
    return {
      reply: `Discovered ${results.length} adventure and lake outing photos with the floor squad!`,
      results,
      metaBadge: 'Trips & Outings',
    };
  }

  // 6. Year specific queries (e.g. 2024, 2023, 2022)
  const yearMatch = q.match(/\b(2022|2023|2024)\b/);
  if (yearMatch) {
    const yr = parseInt(yearMatch[1], 10);
    const results = allMemories.filter((m) => m.year === yr && m.tagged_residents.includes(userName));
    return {
      reply: `Filtered ${results.length} memories from the year ${yr} where you appear.`,
      results,
      metaBadge: `Year ${yr}`,
    };
  }

  // 7. General search: "Show my memories", "Find me", etc.
  const myMemories = matchStudentFace(allMemories, userName);
  return {
    reply: `Uploading your personal memory timeline... Found ${myMemories.length} verified face matches of you across all hostel albums!`,
    results: myMemories,
    metaBadge: 'Personal Timeline',
  };
}
