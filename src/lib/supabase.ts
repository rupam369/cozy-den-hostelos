import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Initialize production Supabase client with autoRefreshToken & persistent sessions
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export const BUCKETS = {
  PROFILES: 'profile-images',
  COMPLAINTS: 'complaint-images',
  MEMORIES: 'hostel-memories',
} as const;

export const TABLES = {
  PROFILES: 'profiles',
  COMPLAINTS: 'complaints',
  FOOD_REVIEWS: 'food_reviews',
  MEALS: 'meals',
  NOTIFICATIONS: 'notifications',
  ANNOUNCEMENTS: 'announcements',
  HOSTEL_MEMORIES: 'hostel_memories',
  FACE_EMBEDDINGS: 'face_embeddings',
} as const;
