/**
 * COZY DEN Supabase Service Layer
 * Provides live database & storage operations with resilient fallback to local state
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { 
  UserProfile, 
  Complaint, 
  FoodReview, 
  MealSchedule, 
  NotificationItem, 
  AnnouncementItem,
  PicBotMemory 
} from '@/types';

export const supabaseService = {
  // Check if live Supabase instance is connected
  isLive: () => isSupabaseConfigured && supabase !== null,

  // ================================================================
  // AUTHENTICATION & PROFILES
  // ================================================================
  async signUpWithEmail(email: string, password: string, metadata: Partial<UserProfile>) {
    if (!this.isLive() || !supabase) {
      return { data: { user: { id: `usr-${Date.now()}`, email } }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          role: metadata.role,
          position: metadata.position,
        },
      },
    });
    return { data, error };
  },

  async signInWithEmail(email: string, password: string) {
    if (!this.isLive() || !supabase) {
      return { data: { user: { id: `usr-${Date.now()}`, email } }, error: null };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signInWithPhoneOtp(phone: string) {
    if (!this.isLive() || !supabase) {
      return { data: { message: 'Demo OTP 123456 sent' }, error: null };
    }
    return await supabase.auth.signInWithOtp({ phone });
  },

  async verifyPhoneOtp(phone: string, token: string) {
    if (!this.isLive() || !supabase) {
      return { data: { user: { id: `usr-${Date.now()}`, phone } }, error: null };
    }
    return await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  },

  async signOut() {
    if (!this.isLive() || !supabase) return { error: null };
    return await supabase.auth.signOut();
  },

  async fetchProfile(userId: string) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async upsertProfile(profile: UserProfile) {
    if (!this.isLive() || !supabase) return { data: profile, error: null };
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        email: profile.email,
        phone: profile.phone,
        full_name: profile.full_name,
        age: profile.age,
        role: profile.role,
        position: profile.position,
        room_number: profile.room_number,
        floor: profile.floor,
        wing: profile.wing,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },

  // ================================================================
  // COMPLAINTS
  // ================================================================
  async fetchComplaints() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async insertComplaint(complaint: Omit<Complaint, 'id' | 'created_at'>) {
    if (!this.isLive() || !supabase) {
      return { data: { ...complaint, id: `comp-${Date.now()}` }, error: null };
    }
    return await supabase
      .from('complaints')
      .insert(complaint)
      .select()
      .single();
  },

  async updateComplaint(id: string, updates: Partial<Complaint>) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from('complaints')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  // ================================================================
  // FOOD REVIEWS
  // ================================================================
  async fetchReviews() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async insertReview(review: Omit<FoodReview, 'id' | 'created_at'>) {
    if (!this.isLive() || !supabase) {
      return { data: { ...review, id: `rev-${Date.now()}` }, error: null };
    }
    return await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
  },

  // ================================================================
  // ANNOUNCEMENTS
  // ================================================================
  async fetchAnnouncements() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async insertAnnouncement(item: Omit<AnnouncementItem, 'id' | 'created_at'>) {
    if (!this.isLive() || !supabase) {
      return { data: { ...item, id: `ann-${Date.now()}` }, error: null };
    }
    return await supabase
      .from('announcements')
      .insert(item)
      .select()
      .single();
  },

  // ================================================================
  // MEMORIES & STORAGE BUCKETS
  // ================================================================
  async uploadMemoryImage(file: File, folder = 'memories') {
    if (!this.isLive() || !supabase) {
      // Local fallback: read as base64 data URL
      return new Promise<{ publicUrl: string; error: null }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ publicUrl: reader.result as string, error: null });
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('memories')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      return { publicUrl: '', error: uploadError };
    }

    const { data } = supabase.storage.from('memories').getPublicUrl(fileName);
    return { publicUrl: data.publicUrl, error: null };
  },

  async insertMemory(memory: Omit<PicBotMemory, 'id'>) {
    if (!this.isLive() || !supabase) {
      return { data: { ...memory, id: `mem-${Date.now()}` }, error: null };
    }
    return await supabase
      .from('memories')
      .insert({
        image_url: memory.image_url,
        event: memory.event,
        date: memory.date,
        year: memory.year,
        location: memory.location,
        category: memory.category,
        caption: memory.caption,
        uploaded_by_name: memory.uploaded_by_name,
        tagged_residents: memory.tagged_residents,
        faces_detected_count: memory.faces_detected?.length || 0,
      })
      .select()
      .single();
  },

  // ================================================================
  // REALTIME SUBSCRIPTION HELPER
  // ================================================================
  subscribeToTable(table: string, onUpdate: (payload: unknown) => void) {
    if (!this.isLive() || !supabase) return () => {};

    const channel = supabase
      .channel(`realtime_${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        onUpdate(payload);
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  },
};
