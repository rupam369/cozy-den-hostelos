'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Complaint, 
  FoodReview, 
  MealSchedule, 
  NotificationItem, 
  AnnouncementItem, 
  HealthScoreBreakdown,
  UserRole,
  HostelPosition,
  ComplaintCategory,
  ComplaintPriority,
  HostelMemoryPhoto,
  PicBotMemory,
  PicBotConsent,
  PicBotChatMessage,
  PicBotDetectedFace
} from '@/types';
import { INITIAL_PICBOT_MEMORIES } from '@/lib/picbotEngine';
import { INITIAL_MEALS } from '@/lib/utils';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole, position?: HostelPosition) => void;
  complaints: Complaint[];
  addComplaint: (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    location: string;
    priority: ComplaintPriority;
    photo_url?: string;
    is_anonymous: boolean;
  }) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  assignComplaint: (id: string, staffName: string) => void;
  resolveComplaint: (id: string, notes?: string) => void;
  simulateEscalation: (id: string) => void;
  reviews: FoodReview[];
  addReview: (review: Omit<FoodReview, 'id' | 'created_at' | 'average_rating'>) => void;
  meals: MealSchedule[];
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) => void;
  announcements: AnnouncementItem[];
  addAnnouncement: (item: Omit<AnnouncementItem, 'id' | 'created_at'>) => void;
  healthScores: HealthScoreBreakdown;
  activeBuildingFloor: number | null;
  setActiveBuildingFloor: (floor: number | null) => void;
  isExplodedView: boolean;
  setIsExplodedView: (val: boolean) => void;
  memories: HostelMemoryPhoto[];
  addMemoryPhoto: (photo: Omit<HostelMemoryPhoto, 'id' | 'likes' | 'created_at' | 'liked_by_me'>) => void;
  toggleLikeMemory: (id: string) => void;
  picBotMemories: PicBotMemory[];
  addPicBotMemory: (mem: Omit<PicBotMemory, 'id' | 'faces_detected'>) => void;
  picBotConsent: PicBotConsent;
  togglePicBotConsent: (enabled: boolean) => void;
  referenceFacePhoto: string | null;
  setReferenceFacePhoto: (url: string | null) => void;
  picBotSearchHistory: { id: string; query: string; results_count: number; timestamp: string }[];
  recordPicBotSearch: (query: string, results_count: number) => void;
  users: UserProfile[];
  updateUser: (user: UserProfile) => void;
  addUser: (user: UserProfile) => void;
  deleteUser: (id: string) => void;
  approveMemory: (id: string) => void;
  flagMemory: (id: string) => void;
  deleteMemory: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
}

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-student-01',
    email: 'aryan.sharma@cozyden.edu',
    phone: '+91 98765 43210',
    full_name: 'Aryan Sharma',
    name: 'Aryan Sharma',
    age: 21,
    role: 'student',
    position: 'Room leader',
    hostel_position: 'Room leader',
    room_number: 'Room 304',
    floor: 3,
    wing: 'A',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-08-01T10:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-student-02',
    email: 'rohan.verma@cozyden.edu',
    phone: '+91 98765 43211',
    full_name: 'Rohan Verma',
    name: 'Rohan Verma',
    age: 20,
    role: 'student',
    position: 'Floor representative',
    hostel_position: 'Floor representative',
    room_number: 'Room 202',
    floor: 2,
    wing: 'B',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-08-02T11:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-student-03',
    email: 'siddharth.sen@cozyden.edu',
    phone: '+91 98765 43212',
    full_name: 'Siddharth Sen',
    name: 'Siddharth Sen',
    age: 22,
    role: 'student',
    position: 'Resident',
    hostel_position: 'Resident',
    room_number: 'Room 204',
    floor: 2,
    wing: 'B',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-08-05T09:30:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-student-04',
    email: 'priya.nair@cozyden.edu',
    phone: '+91 98765 43213',
    full_name: 'Priya Nair',
    name: 'Priya Nair',
    age: 20,
    role: 'student',
    position: 'Resident',
    hostel_position: 'Resident',
    room_number: 'Room 108',
    floor: 1,
    wing: 'A',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-08-06T14:15:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-student-05',
    email: 'kabir.bedi@cozyden.edu',
    phone: '+91 98765 43214',
    full_name: 'Kabir Bedi',
    name: 'Kabir Bedi',
    age: 21,
    role: 'student',
    position: 'Resident',
    hostel_position: 'Resident',
    room_number: 'Room 305',
    floor: 3,
    wing: 'A',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-08-07T12:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-teacher-01',
    email: 'alok.mathur@cozyden.edu',
    phone: '+91 98765 43215',
    full_name: 'Dr. Alok Mathur',
    name: 'Dr. Alok Mathur',
    age: 44,
    role: 'teacher',
    position: 'Faculty Advisor',
    hostel_position: 'Faculty Advisor',
    room_number: 'Faculty Suite 101',
    floor: 1,
    wing: 'Faculty',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-07-15T08:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-teacher-02',
    email: 'shalini.rao@cozyden.edu',
    phone: '+91 98765 43216',
    full_name: 'Prof. Shalini Rao',
    name: 'Prof. Shalini Rao',
    age: 39,
    role: 'teacher',
    position: 'Faculty Advisor',
    hostel_position: 'Faculty Advisor',
    room_number: 'Faculty Suite 102',
    floor: 1,
    wing: 'Faculty',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-07-16T09:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-mgmt-01',
    email: 'rajesh.gupta@cozyden.edu',
    phone: '+91 98765 43217',
    full_name: 'Dr. Rajesh Gupta',
    name: 'Dr. Rajesh Gupta',
    age: 52,
    role: 'management',
    position: 'Warden',
    hostel_position: 'Warden',
    room_number: 'Admin Wing M-101',
    floor: 1,
    wing: 'Admin',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-06-01T08:00:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-mgmt-02',
    email: 'anita.desai@cozyden.edu',
    phone: '+91 98765 43218',
    full_name: 'Anita Desai',
    name: 'Anita Desai',
    age: 46,
    role: 'management',
    position: 'Mess manager',
    hostel_position: 'Mess manager',
    room_number: 'Mess Office Ground',
    floor: 0,
    wing: 'Mess',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-06-05T08:30:00.000Z',
    status: 'Active',
  },
  {
    id: 'usr-mgmt-03',
    email: 'vikram.roy@cozyden.edu',
    phone: '+91 98765 43219',
    full_name: 'Vikram Roy',
    name: 'Vikram Roy',
    age: 34,
    role: 'management',
    position: 'Admin',
    hostel_position: 'Admin',
    room_number: 'Server Control Room',
    floor: 1,
    wing: 'Tech',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-06-10T09:00:00.000Z',
    status: 'Active',
  },
];

const DEFAULT_USER: UserProfile = INITIAL_USERS[0];

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-101',
    user_id: 'usr-student-01',
    user_name: 'Aryan Sharma',
    title: 'High-speed WiFi packet drops on 3rd Floor East Wing',
    description: 'During online exams and evening study hours (8 PM - 11 PM), 5GHz WiFi SSID drops constantly in rooms 301-306.',
    category: 'WiFi',
    location: '3rd Floor, East Wing corridor (Near AP-3B)',
    priority: 'High',
    is_anonymous: false,
    status: 'In Progress',
    assigned_to: 'staff-it-01',
    assigned_name: 'Vikram Roy (Network Lead)',
    is_escalated: false,
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'comp-102',
    user_id: 'usr-student-02',
    user_name: 'Rohan Verma',
    title: 'Solar Water Heater low pressure on Floor 2 bathroom',
    description: 'Hot water stream in common washroom unit 2B is barely trickling during early morning hours.',
    category: 'Water',
    location: 'Floor 2, Washroom Cluster 2B',
    priority: 'Medium',
    is_anonymous: true,
    status: 'Pending',
    is_escalated: false,
    created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 'comp-103',
    user_id: 'usr-student-03',
    user_name: 'Siddharth Sen',
    title: 'Main circuit breaker tripping in Room 204 during rainy hours',
    description: 'Room 204 main switchboard trips immediately when study lamps are turned on. Unsafe wiring suspected.',
    category: 'Electricity',
    location: 'Room 204, Floor 2, Wing B',
    priority: 'Critical',
    is_anonymous: false,
    status: 'Pending',
    is_escalated: true,
    escalated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 52 * 3600 * 1000).toISOString(), // > 48 hours ago
  },
  {
    id: 'comp-104',
    user_id: 'usr-student-04',
    user_name: 'Priya Nair',
    title: 'Corridor ambient LED flicker resolved',
    description: 'Replacement of flickering sensor LED fixture near library entry door.',
    category: 'Room Maintenance',
    location: 'Floor 1, Library Lounge corridor',
    priority: 'Low',
    is_anonymous: false,
    status: 'Resolved',
    assigned_name: 'Sharma Ji (Electrician)',
    is_escalated: false,
    resolution_notes: 'Replaced driver ballast and checked motion sensor trigger. Working smoothly.',
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    resolved_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
];

const SEED_REVIEWS: FoodReview[] = [
  {
    id: 'rev-1',
    user_id: 'usr-student-01',
    user_name: 'Aryan Sharma',
    meal_type: 'Breakfast',
    date: new Date().toISOString().split('T')[0],
    taste_rating: 5,
    quality_rating: 5,
    hygiene_rating: 5,
    quantity_rating: 4,
    average_rating: 4.75,
    comments: 'The crispy ghee roast dosa and hot coconut chutney were exceptional today! Mess staff served with smile.',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    user_id: 'usr-student-05',
    user_name: 'Tanvi Iyer',
    meal_type: 'Lunch',
    date: new Date().toISOString().split('T')[0],
    taste_rating: 4,
    quality_rating: 4,
    hygiene_rating: 5,
    quantity_rating: 5,
    average_rating: 4.5,
    comments: 'Paneer butter masala gravy was creamy and fresh. Salad counters are impeccably sanitised.',
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rev-3',
    user_id: 'usr-student-06',
    user_name: 'Devansh Roy',
    meal_type: 'High Tea',
    date: new Date().toISOString().split('T')[0],
    taste_rating: 5,
    quality_rating: 4,
    hygiene_rating: 5,
    quantity_rating: 5,
    average_rating: 4.75,
    comments: 'Cardamom ginger tea on a rainy evening was a lifesaver. Samosas were hot and crunchy.',
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🚨 CRITICAL ESCALATION (48h Alert)',
    message: 'Students are facing this issue: "Main circuit breaker tripping in Room 204". Complaint unaddressed past 48 hours. Management attention required immediately.',
    type: 'red',
    category: 'Electricity',
    complaint_id: 'comp-103',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    target_role: 'all',
  },
  {
    id: 'notif-2',
    title: '🟡 Complaint Assigned & In Progress',
    message: 'Vikram Roy (Network Lead) is currently inspecting 3rd Floor East Wing WiFi access points.',
    type: 'yellow',
    category: 'WiFi',
    complaint_id: 'comp-101',
    is_read: false,
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    target_role: 'student',
  },
  {
    id: 'notif-3',
    title: '🟢 Maintenance Issue Resolved',
    message: 'Corridor ambient LED flicker near Library Lounge has been successfully repaired and verified.',
    type: 'green',
    category: 'Room Maintenance',
    complaint_id: 'comp-104',
    is_read: true,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    target_role: 'all',
  },
];

const SEED_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'High-Speed Optical WiFi Upgraded to 1 Gbps Mesh',
    content: 'Dedicated enterprise access points deployed across all resident floors. Enjoy seamless roaming from your room to the Sky Terrace with 0 packet latency.',
    author_name: 'Dr. Anita Desai',
    author_role: 'Head Warden',
    priority: 'normal',
    tags: ['WiFi', 'Tech Infrastructure'],
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Saturday Rooftop Acoustic Jam & BBQ Night',
    content: 'All residents are invited to Cozy Den Sky Terrace this Saturday 7:30 PM. Live student acoustic sets, fresh barbecue snacks, and stargazing telescopes.',
    author_name: 'Rohan Mehra',
    author_role: 'Mess manager',
    priority: 'normal',
    tags: ['Hostel Life', 'Social', 'Terrace'],
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'ann-3',
    title: 'Quiet Study Hours Protocol: Mid-Term Examination Week',
    content: 'Quiet hours will be observed strictly from 10:00 PM to 6:00 AM across all corridors. Floor study pods will remain open 24/7 with complimentary herbal tea.',
    author_name: 'Prof. K. Sen',
    author_role: 'Faculty Advisor',
    priority: 'urgent',
    tags: ['Academics', 'Rules'],
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

const SEED_MEMORIES: HostelMemoryPhoto[] = [
  {
    id: 'mem-1',
    image_url: '/images/hostel/cozy_den_real_facade.png',
    caption: 'COZY DEN Night Glow: The building standing tall under the starlit sky at Scope Global Skills University.',
    category: 'Campus Walk',
    author_name: 'Hostel Committee',
    room_tag: 'Main Wing',
    likes: 84,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'mem-2',
    image_url: '/images/hostel/cozy_den_atrium_night.png',
    caption: 'Staring straight up through the central atrium quadrangle. Open night sky framing the building stairwell.',
    category: 'Room Hangouts',
    author_name: 'Aryan Sharma',
    room_tag: 'Room 304',
    likes: 112,
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'mem-3',
    image_url: '/images/hostel/cozy_den_canopy_entrance.png',
    caption: 'The curved portico canopy and reception porch after midnight study sessions. Spotlights welcoming us home.',
    category: 'Terrace Vibes',
    author_name: 'Rohan Mehra',
    room_tag: 'Room 201',
    likes: 76,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'mem-4',
    image_url: '/images/hostel/cozy_den_signboard_driveway.png',
    caption: 'Entering the Cozy Den driveway with the Scope Global Skills University Boys Hostel signboard.',
    category: 'Campus Walk',
    author_name: 'Siddharth Sen',
    room_tag: 'Room 204',
    likes: 63,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [complaints, setComplaints] = useState<Complaint[]>(SEED_COMPLAINTS);
  const [reviews, setReviews] = useState<FoodReview[]>(SEED_REVIEWS);
  const [meals] = useState<MealSchedule[]>(INITIAL_MEALS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(SEED_ANNOUNCEMENTS);
  const [activeBuildingFloor, setActiveBuildingFloor] = useState<number | null>(null);
  const [isExplodedView, setIsExplodedView] = useState<boolean>(false);
  const [memories, setMemories] = useState<HostelMemoryPhoto[]>(SEED_MEMORIES);
  const [picBotMemories, setPicBotMemories] = useState<PicBotMemory[]>(INITIAL_PICBOT_MEMORIES);
  const [picBotConsent, setPicBotConsent] = useState<PicBotConsent>({
    consent_given: true,
    enabled: true,
    allow_tagging: true,
    updated_at: '2024-10-10T12:00:00.000Z',
  });
  const [referenceFacePhoto, setReferenceFacePhoto] = useState<string | null>(DEFAULT_USER.avatar_url || null);
  const [picBotSearchHistory, setPicBotSearchHistory] = useState<{ id: string; query: string; results_count: number; timestamp: string }[]>([
    { id: 'sh-1', query: 'Show my cricket photos', results_count: 2, timestamp: '2024-10-10T10:00:00.000Z' },
    { id: 'sh-2', query: 'Photos with my roommate', results_count: 8, timestamp: '2024-10-10T09:00:00.000Z' },
  ]);

  // Load from local storage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cozyden_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      const savedUsers = localStorage.getItem('cozyden_users_list');
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      const savedComplaints = localStorage.getItem('cozyden_complaints');
      if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
      const savedReviews = localStorage.getItem('cozyden_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      const savedNotifs = localStorage.getItem('cozyden_notifs');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      const savedMemories = localStorage.getItem('cozyden_memories');
      if (savedMemories) setMemories(JSON.parse(savedMemories));
      const savedPicBotMemories = localStorage.getItem('cozyden_picbot_memories');
      if (savedPicBotMemories) setPicBotMemories(JSON.parse(savedPicBotMemories));
      const savedConsent = localStorage.getItem('cozyden_picbot_consent');
      if (savedConsent) setPicBotConsent(JSON.parse(savedConsent));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('cozyden_user', JSON.stringify(currentUser));
      localStorage.setItem('cozyden_users_list', JSON.stringify(users));
      localStorage.setItem('cozyden_complaints', JSON.stringify(complaints));
      localStorage.setItem('cozyden_reviews', JSON.stringify(reviews));
      localStorage.setItem('cozyden_notifs', JSON.stringify(notifications));
      localStorage.setItem('cozyden_memories', JSON.stringify(memories));
      localStorage.setItem('cozyden_picbot_memories', JSON.stringify(picBotMemories));
      localStorage.setItem('cozyden_picbot_consent', JSON.stringify(picBotConsent));
    } catch {
      // Ignore storage errors
    }
  }, [currentUser, users, complaints, reviews, notifications, memories, picBotMemories, picBotConsent]);

  // Switch Role helper
  const switchRole = (role: UserRole, position?: HostelPosition) => {
    const defaultPositions: Record<UserRole, HostelPosition> = {
      student: 'Room leader',
      teacher: 'Faculty Advisor',
      management: 'Warden',
    };

    const updatedUser: UserProfile = {
      ...currentUser,
      role,
      position: position || defaultPositions[role],
      full_name: 
        role === 'student' ? 'Aryan Sharma' :
        role === 'teacher' ? 'Prof. Sarah Jenkins' : 'Rajesh Gupta (Chief Warden)',
    };
    setCurrentUser(updatedUser);
  };

  // Add Complaint
  const addComplaint = (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    location: string;
    priority: ComplaintPriority;
    photo_url?: string;
    is_anonymous: boolean;
  }) => {
    const newId = `comp-${Date.now().toString().slice(-4)}`;
    const newComplaint: Complaint = {
      id: newId,
      user_id: currentUser.id,
      user_name: data.is_anonymous ? 'Anonymous Resident' : currentUser.full_name,
      ...data,
      status: 'Pending',
      is_escalated: false,
      created_at: new Date().toISOString(),
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Dispatch Yellow notification
    addNotification({
      title: '🟡 New Complaint Registered',
      message: `Issue "${data.title}" submitted at ${data.location}. Priority: ${data.priority}.`,
      type: 'yellow',
      category: data.category,
      complaint_id: newId,
      target_role: 'management',
    });
  };

  // Update Status
  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // Assign staff
  const assignComplaint = (id: string, staffName: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, assigned_name: staffName, status: 'In Progress' }
          : c
      )
    );

    const targetComp = complaints.find((c) => c.id === id);
    if (targetComp) {
      addNotification({
        title: '🟡 Complaint Assigned to Staff',
        message: `"${targetComp.title}" has been assigned to ${staffName}. Work has commenced.`,
        type: 'yellow',
        category: targetComp.category,
        complaint_id: id,
        target_role: 'all',
      });
    }
  };

  // Resolve complaint
  const resolveComplaint = (id: string, notes?: string) => {
    const targetComp = complaints.find((c) => c.id === id);
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'Resolved',
              resolved_at: new Date().toISOString(),
              resolution_notes: notes || 'Inspected and verified resolved by hostel team.',
            }
          : c
      )
    );

    // Green notification
    addNotification({
      title: '🟢 Issue Successfully Resolved',
      message: `"${targetComp?.title || 'Complaint'}" has been marked resolved. Thank you for your patience!`,
      type: 'green',
      category: targetComp?.category || 'General',
      complaint_id: id,
      target_role: 'all',
    });
  };

  // 48h Smart Escalation simulation
  const simulateEscalation = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              is_escalated: true,
              escalated_at: new Date().toISOString(),
              priority: 'Critical',
            }
          : c
      )
    );

    const comp = complaints.find((c) => c.id === id);
    const title = comp ? comp.title : 'Hostel Utility Outage';

    // Dispatched to Management, Teachers, and Student Representatives
    addNotification({
      title: '🚨 RED ALERT: 48h SMART ESCALATION',
      message: `Students are facing this issue: "${title}". Unresolved for > 48 hours. Management attention required immediately. Sent to Management, Teachers & Student Reps.`,
      type: 'red',
      category: comp?.category || 'Critical',
      complaint_id: id,
      target_role: 'all',
    });
  };

  // Add Food Review
  const addReview = (reviewData: Omit<FoodReview, 'id' | 'created_at' | 'average_rating'>) => {
    const avg = Number(
      (
        (reviewData.taste_rating +
          reviewData.quality_rating +
          reviewData.hygiene_rating +
          reviewData.quantity_rating) /
        4
      ).toFixed(2)
    );

    const newRev: FoodReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      ...reviewData,
      average_rating: avg,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);

    // Send notification
    addNotification({
      title: `⭐ New Food Review (${reviewData.meal_type})`,
      message: `${reviewData.user_name} rated today's ${reviewData.meal_type}: ${avg}/5 stars.`,
      type: 'green',
      category: 'Food',
      target_role: 'all',
    });
  };

  // Add Notification
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now().toString().slice(-5)}`,
      ...notif,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const addAnnouncement = (item: Omit<AnnouncementItem, 'id' | 'created_at'>) => {
    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      ...item,
      created_at: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const addUser = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const approveMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approval_status: 'approved' } : m))
    );
    setPicBotMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approval_status: 'approved' } : m))
    );
    addNotification({
      title: '✅ Memory Approved by Admin',
      message: 'Hostel moment approved and published to the public wall.',
      type: 'green',
      category: 'Memory',
      target_role: 'all',
    });
  };

  const flagMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approval_status: 'flagged' } : m))
    );
    setPicBotMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, approval_status: 'flagged' } : m))
    );
    addNotification({
      title: '⚠️ Memory Flagged by Admin',
      message: 'A hostel memory was flagged for content review.',
      type: 'yellow',
      category: 'Memory',
      target_role: 'management',
    });
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setPicBotMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Add Memory Photo
  const addMemoryPhoto = (photoData: Omit<HostelMemoryPhoto, 'id' | 'likes' | 'created_at' | 'liked_by_me'>) => {
    const newPhoto: HostelMemoryPhoto = {
      id: `mem-${Date.now().toString().slice(-4)}`,
      ...photoData,
      likes: 1,
      liked_by_me: true,
      created_at: new Date().toISOString(),
    };
    setMemories((prev) => [newPhoto, ...prev]);

    // Notification broadcast
    addNotification({
      title: '📸 New Hostel Memory Shared!',
      message: `${photoData.author_name} posted a new moment in "${photoData.category}". Check it out on the Memories Wall!`,
      type: 'green',
      category: 'Memory',
      target_role: 'all',
    });
  };

  // Toggle Like on Memory
  const toggleLikeMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const isLiked = !m.liked_by_me;
        return {
          ...m,
          liked_by_me: isLiked,
          likes: isLiked ? m.likes + 1 : Math.max(0, m.likes - 1),
        };
      })
    );
  };

  // Add PicBot Memory with Automatic Simulated Face Indexing
  const addPicBotMemory = (memData: Omit<PicBotMemory, 'id' | 'faces_detected'>) => {
    const newId = `mem-db-${Date.now().toString().slice(-4)}`;
    
    // Auto-detect faces based on tagged residents
    const detectedFaces: PicBotDetectedFace[] = memData.tagged_residents.map((resident, idx) => ({
      person_name: resident,
      confidence: 0.98 + (idx * 0.005) % 0.018,
      bounding_box: {
        x: 0.2 + (idx * 0.22) % 0.6,
        y: 0.25,
        w: 0.18,
        h: 0.24,
      },
    }));

    const newMemory: PicBotMemory = {
      ...memData,
      id: newId,
      faces_detected: detectedFaces,
    };

    setPicBotMemories((prev) => [newMemory, ...prev]);

    addNotification({
      title: '🤖 DreamCast PicBot: Faces Indexed!',
      message: `Indexed "${memData.event}". Detected ${detectedFaces.length} face embeddings saved to Supabase vector vault.`,
      type: 'green',
      category: 'Memory',
      target_role: 'all',
    });
  };

  // Toggle PicBot Biometric Search Consent
  const togglePicBotConsent = (enabled: boolean) => {
    setPicBotConsent((prev) => ({
      ...prev,
      enabled,
      updated_at: new Date().toISOString(),
    }));
  };

  // Record Search Audit
  const recordPicBotSearch = (query: string, results_count: number) => {
    const newRecord = {
      id: `sh-${Date.now().toString().slice(-4)}`,
      query,
      results_count,
      timestamp: new Date().toISOString(),
    };
    setPicBotSearchHistory((prev) => [newRecord, ...prev].slice(0, 10));
  };

  // Dynamic Health Score computation
  const healthScores: HealthScoreBreakdown = React.useMemo(() => {
    const activeComps = complaints.filter((c) => c.status !== 'Resolved');

    // Penalties based on open complaints
    const wifiPen = activeComps.filter((c) => c.category === 'WiFi').length * 7;
    const waterPen = activeComps.filter((c) => c.category === 'Water').length * 8;
    const elecPen = activeComps.filter((c) => c.category === 'Electricity').length * 10;
    const cleanPen = activeComps.filter((c) => c.category === 'Cleaning').length * 6;

    // Food score based on average ratings
    const avgFood = reviews.length
      ? reviews.reduce((sum, r) => sum + r.average_rating, 0) / reviews.length
      : 4.5;
    const foodScore = Math.min(100, Math.max(60, Math.round((avgFood / 5) * 100)));

    const wifiScore = Math.max(50, 98 - wifiPen);
    const waterScore = Math.max(50, 96 - waterPen);
    const elecScore = Math.max(40, 99 - elecPen);
    const cleanScore = Math.max(55, 95 - cleanPen);

    const overall = Math.round(
      foodScore * 0.2 +
      wifiScore * 0.2 +
      waterScore * 0.2 +
      elecScore * 0.2 +
      cleanScore * 0.2
    );

    return {
      overall,
      food: foodScore,
      wifi: wifiScore,
      water: waterScore,
      electricity: elecScore,
      cleanliness: cleanScore,
    };
  }, [complaints, reviews]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        complaints,
        addComplaint,
        updateComplaintStatus,
        assignComplaint,
        resolveComplaint,
        simulateEscalation,
        reviews,
        addReview,
        meals,
        notifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        announcements,
        addAnnouncement,
        healthScores,
        activeBuildingFloor,
        setActiveBuildingFloor,
        isExplodedView,
        setIsExplodedView,
        memories,
        addMemoryPhoto,
        toggleLikeMemory,
        picBotMemories,
        addPicBotMemory,
        picBotConsent,
        togglePicBotConsent,
        referenceFacePhoto,
        setReferenceFacePhoto,
        picBotSearchHistory,
        recordPicBotSearch,
        users,
        updateUser,
        addUser,
        deleteUser,
        approveMemory,
        flagMemory,
        deleteMemory,
        deleteAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
