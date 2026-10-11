export type UserRole = 'student' | 'teacher' | 'management';

export type HostelPosition = 
  | 'Room leader' 
  | 'Room Leader'
  | 'Floor representative' 
  | 'Floor Representative'
  | 'Warden' 
  | 'Mess manager' 
  | 'Mess Manager'
  | 'Admin' 
  | 'Resident' 
  | 'Faculty Advisor'
  | 'Faculty'
  | 'Maintenance Head';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  name?: string; // alias for full_name
  age: number;
  role: UserRole;
  position: HostelPosition;
  hostel_position?: HostelPosition; // alias for position
  room_number: string;
  floor: number;
  wing: string;
  avatar_url?: string;
  profile_image?: string; // alias for avatar_url
  created_at?: string;
  status?: 'Active' | 'On Leave' | 'Graduated';
}

export type ComplaintCategory = 
  | 'WiFi' 
  | 'Water' 
  | 'Electricity' 
  | 'Food' 
  | 'Cleaning' 
  | 'Security' 
  | 'Room Maintenance';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Complaint {
  id: string;
  user_id?: string;
  user_name: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  priority: ComplaintPriority;
  photo_url?: string;
  is_anonymous: boolean;
  status: ComplaintStatus;
  assigned_to?: string;
  assigned_name?: string;
  is_escalated: boolean;
  escalated_at?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'High Tea' | 'Dinner';

export interface MealSchedule {
  id: string;
  meal_type: MealType;
  start_time: string;
  end_time: string;
  title: string;
  menu_items: string[];
  chef_special?: string;
  calories?: number;
  is_active?: boolean;
}

export interface FoodReview {
  id: string;
  user_id?: string;
  user_name: string;
  meal_type: MealType;
  date: string;
  taste_rating: number; // 1 to 5
  quality_rating: number; // 1 to 5
  hygiene_rating: number; // 1 to 5
  quantity_rating: number; // 1 to 5
  average_rating: number;
  comments: string;
  photo_url?: string;
  created_at: string;
}

export type NotificationColor = 'green' | 'yellow' | 'red';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationColor;
  category?: string;
  complaint_id?: string;
  is_read: boolean;
  created_at: string;
  target_role?: 'all' | 'student' | 'teacher' | 'management';
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: string;
  priority: 'normal' | 'urgent' | 'critical';
  tags: string[];
  created_at: string;
}

export interface HealthScoreBreakdown {
  overall: number;
  food: number;
  wifi: number;
  water: number;
  electricity: number;
  cleanliness: number;
}

export type MemoryCategory = 
  | 'Room Hangouts' 
  | 'Terrace Vibes' 
  | 'Exam All-Nighter' 
  | 'Mess Moments' 
  | 'Hostel Fest' 
  | 'Campus Walk';

export interface HostelMemoryPhoto {
  id: string;
  image_url: string;
  caption: string;
  category: MemoryCategory;
  author_name: string;
  room_tag?: string;
  likes: number;
  liked_by_me?: boolean;
  approval_status?: 'approved' | 'pending' | 'flagged';
  created_at: string;
}

// -------------------------------------------------------------
// MODULE 8: DREAMCAST PICBOT TYPES
// -------------------------------------------------------------
export type PicBotCategory = 
  | 'Hostel Events'
  | 'Group Photos'
  | 'Trips & Outings'
  | 'Celebrations'
  | 'Sports & Games'
  | 'Daily Memories';

export interface PicBotDetectedFace {
  person_name: string;
  user_id?: string;
  confidence: number;
  bounding_box: {
    x: number; // 0 to 1 percentage from left
    y: number; // 0 to 1 percentage from top
    w: number; // 0 to 1 percentage width
    h: number; // 0 to 1 percentage height
  };
}

export interface PicBotMemory {
  id: string;
  image_url: string;
  event: string;
  date: string;
  year: number;
  location: string;
  category: PicBotCategory;
  caption: string;
  uploaded_by_name: string;
  tagged_residents: string[];
  faces_detected: PicBotDetectedFace[];
  match_confidence?: number; // 0 to 100%
  album?: string;
  is_favorite?: boolean;
  approval_status?: 'approved' | 'pending' | 'flagged';
}

export interface PicBotChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  results?: PicBotMemory[];
  metaBadge?: string;
}

export interface PicBotConsent {
  consent_given: boolean;
  enabled: boolean;
  allow_tagging: boolean;
  updated_at: string;
}

