/**
 * COZY DEN Supabase Service Layer
 * Live PostgreSQL Database, Auth, Storage & Realtime Channels with local fallback
 */

import { supabase, isSupabaseConfigured, BUCKETS, TABLES } from './supabase';
import { 
  UserProfile, 
  Complaint, 
  FoodReview, 
  MealSchedule, 
  NotificationItem, 
  AnnouncementItem,
  PicBotMemory,
  HostelPosition,
  UserRole
} from '@/types';

export const supabaseService = {
  // Check if live Supabase instance is active and configured
  isLive: () => isSupabaseConfigured && supabase !== null,

  // ================================================================
  // AUTHENTICATION & USER SESSIONS (TASK 2)
  // ================================================================
  async signUpWithEmail(
    email: string, 
    password: string, 
    metadata: {
      name: string;
      age: number;
      role: UserRole;
      hostel_position: HostelPosition;
      phone?: string;
      profile_image?: string;
      room_number?: string;
      floor?: number;
      wing?: string;
    }
  ) {
    if (!this.isLive() || !supabase) {
      const demoId = `usr-${Date.now()}`;
      return { 
        data: { 
          user: { 
            id: demoId, 
            email, 
            user_metadata: metadata 
          }, 
          session: null 
        }, 
        error: null 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: metadata.name,
          age: metadata.age,
          role: metadata.role,
          hostel_position: metadata.hostel_position,
          phone: metadata.phone,
        },
      },
    });

    if (!error && data.user) {
      // Create profile row in profiles table
      await this.upsertProfile({
        id: data.user.id,
        email: data.user.email || email,
        phone: metadata.phone || '',
        full_name: metadata.name,
        name: metadata.name,
        age: metadata.age,
        role: metadata.role,
        position: metadata.hostel_position,
        hostel_position: metadata.hostel_position,
        room_number: metadata.room_number || 'Room 101',
        floor: metadata.floor || 1,
        wing: metadata.wing || 'A',
        avatar_url: metadata.profile_image || '',
        profile_image: metadata.profile_image || '',
      });
    }

    return { data, error };
  },

  async signInWithEmail(email: string, password: string) {
    if (!this.isLive() || !supabase) {
      return { 
        data: { 
          user: { 
            id: `usr-${Date.now()}`, 
            email 
          }, 
          session: null 
        }, 
        error: null 
      };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signInWithPhoneOtp(phone: string) {
    if (!this.isLive() || !supabase) {
      return { data: { message: 'Demo OTP 123456 sent successfully.' }, error: null };
    }
    return await supabase.auth.signInWithOtp({ phone });
  },

  async verifyPhoneOtp(phone: string, token: string) {
    if (!this.isLive() || !supabase) {
      return { 
        data: { 
          user: { 
            id: `usr-${Date.now()}`, 
            phone 
          }, 
          session: null 
        }, 
        error: null 
      };
    }
    return await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  },

  async signOut() {
    if (!this.isLive() || !supabase) return { error: null };
    return await supabase.auth.signOut();
  },

  async getSession() {
    if (!this.isLive() || !supabase) return { data: { session: null }, error: null };
    return await supabase.auth.getSession();
  },

  async getUser() {
    if (!this.isLive() || !supabase) return { data: { user: null }, error: null };
    return await supabase.auth.getUser();
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    if (!this.isLive() || !supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },

  // ================================================================
  // PROFILES (TASK 3)
  // ================================================================
  async fetchProfile(userId: string) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select('*')
      .or(`user_id.eq.${userId},id.eq.${userId}`)
      .maybeSingle();
    return { data, error };
  },

  async fetchAllProfiles() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.PROFILES)
      .select('*')
      .order('created_at', { ascending: false });
  },

  async upsertProfile(profile: UserProfile) {
    if (!this.isLive() || !supabase) return { data: profile, error: null };
    const payload = {
      id: profile.id,
      user_id: profile.id,
      name: profile.name || profile.full_name,
      full_name: profile.full_name || profile.name,
      email: profile.email,
      phone: profile.phone || '',
      age: profile.age,
      role: profile.role,
      hostel_position: profile.hostel_position || profile.position,
      position: profile.position || profile.hostel_position,
      profile_image: profile.profile_image || profile.avatar_url,
      avatar_url: profile.avatar_url || profile.profile_image,
      room_number: profile.room_number,
      floor: profile.floor,
      wing: profile.wing,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    return { data, error };
  },

  // ================================================================
  // COMPLAINTS (TASK 3)
  // ================================================================
  async fetchComplaints() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.COMPLAINTS)
      .select('*')
      .order('created_at', { ascending: false });
  },

  async insertComplaint(complaint: Omit<Complaint, 'id' | 'created_at'> & { created_by?: string }) {
    if (!this.isLive() || !supabase) {
      return { 
        data: { 
          ...complaint, 
          id: `comp-${Date.now()}`,
          created_at: new Date().toISOString()
        }, 
        error: null 
      };
    }

    const payload = {
      created_by: complaint.created_by || null,
      user_name: complaint.user_name,
      category: complaint.category,
      title: complaint.title,
      description: complaint.description,
      image_url: complaint.photo_url || null,
      photo_url: complaint.photo_url || null,
      location: complaint.location,
      priority: complaint.priority,
      status: complaint.status || 'Pending',
      is_anonymous: complaint.is_anonymous || false,
      assigned_to: complaint.assigned_to || null,
      assigned_name: complaint.assigned_name || null,
    };

    return await supabase
      .from(TABLES.COMPLAINTS)
      .insert(payload)
      .select()
      .single();
  },

  async updateComplaintStatus(id: string, status: Complaint['status'], resolution_notes?: string) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    const updates: Record<string, unknown> = { status };
    if (status === 'Resolved') {
      updates.resolved_at = new Date().toISOString();
      if (resolution_notes) updates.resolution_notes = resolution_notes;
    }

    return await supabase
      .from(TABLES.COMPLAINTS)
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
  },

  async assignComplaint(id: string, staffName: string) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.COMPLAINTS)
      .update({
        assigned_name: staffName,
        status: 'In Progress',
      })
      .eq('id', id)
      .select()
      .maybeSingle();
  },

  // ================================================================
  // FOOD REVIEWS (TASK 3)
  // ================================================================
  async fetchFoodReviews() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.FOOD_REVIEWS)
      .select('*')
      .order('created_at', { ascending: false });
  },

  async insertFoodReview(review: Omit<FoodReview, 'id' | 'created_at' | 'average_rating'>) {
    if (!this.isLive() || !supabase) {
      const avg = Number(
        ((review.taste_rating + review.quality_rating + review.hygiene_rating + review.quantity_rating) / 4).toFixed(2)
      );
      return { 
        data: { 
          ...review, 
          id: `rev-${Date.now()}`,
          average_rating: avg,
          created_at: new Date().toISOString()
        }, 
        error: null 
      };
    }

    const payload = {
      user_id: review.user_id || null,
      user_name: review.user_name,
      meal_type: review.meal_type,
      taste_rating: review.taste_rating,
      quality_rating: review.quality_rating,
      hygiene_rating: review.hygiene_rating,
      quantity_rating: review.quantity_rating,
      comment: review.comments,
      comments: review.comments,
      photo_url: review.photo_url || null,
      date: review.date || new Date().toISOString().split('T')[0],
    };

    return await supabase
      .from(TABLES.FOOD_REVIEWS)
      .insert(payload)
      .select()
      .single();
  },

  // ================================================================
  // MEALS & SCHEDULE (TASK 3 & TASK 7)
  // ================================================================
  async fetchMeals() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.MEALS)
      .select('*')
      .order('meal_type');
  },

  // ================================================================
  // NOTIFICATIONS (TASK 3)
  // ================================================================
  async fetchNotifications(userId?: string) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    let query = supabase.from(TABLES.NOTIFICATIONS).select('*');
    if (userId) {
      query = query.or(`user_id.eq.${userId},target_role.eq.all,target_role.is.null`);
    }
    return await query.order('created_at', { ascending: false });
  },

  async insertNotification(notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'> & { user_id?: string }) {
    if (!this.isLive() || !supabase) {
      return { 
        data: { 
          ...notif, 
          id: `notif-${Date.now()}`,
          is_read: false,
          created_at: new Date().toISOString()
        }, 
        error: null 
      };
    }

    const payload = {
      user_id: notif.user_id || null,
      title: notif.title,
      message: notif.message,
      type: notif.type === 'green' ? 'Announcement' : notif.type === 'red' ? 'Complaint Alert' : 'System Alert',
      priority: notif.type === 'red' ? 'Critical' : 'Normal',
      category: notif.category || null,
      complaint_id: notif.complaint_id || null,
      target_role: notif.target_role || 'all',
      is_read: false,
    };

    return await supabase
      .from(TABLES.NOTIFICATIONS)
      .insert(payload)
      .select()
      .single();
  },

  async markNotificationAsRead(id: string) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.NOTIFICATIONS)
      .update({ is_read: true })
      .eq('id', id);
  },

  // ================================================================
  // ANNOUNCEMENTS (TASK 3)
  // ================================================================
  async fetchAnnouncements() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.ANNOUNCEMENTS)
      .select('*')
      .order('created_at', { ascending: false });
  },

  async insertAnnouncement(item: Omit<AnnouncementItem, 'id' | 'created_at'> & { created_by?: string }) {
    if (!this.isLive() || !supabase) {
      return { 
        data: { 
          ...item, 
          id: `ann-${Date.now()}`,
          created_at: new Date().toISOString()
        }, 
        error: null 
      };
    }

    const payload = {
      created_by: item.created_by || null,
      author_name: item.author_name,
      author_role: item.author_role,
      title: item.title,
      description: item.content,
      content: item.content,
      priority: item.priority || 'normal',
      tags: item.tags || ['General'],
    };

    return await supabase
      .from(TABLES.ANNOUNCEMENTS)
      .insert(payload)
      .select()
      .single();
  },

  // ================================================================
  // HOSTEL MEMORIES & DREAMCAST PICBOT (TASK 3)
  // ================================================================
  async fetchHostelMemories() {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.HOSTEL_MEMORIES)
      .select('*')
      .order('created_at', { ascending: false });
  },

  async insertHostelMemory(memory: {
    image_url: string;
    event_name: string;
    description?: string;
    visibility?: 'public' | 'private' | 'restricted';
    uploaded_by?: string;
    uploaded_by_name?: string;
    tagged_residents?: string[];
  }) {
    if (!this.isLive() || !supabase) {
      return { 
        data: { 
          ...memory, 
          id: `mem-${Date.now()}`,
          created_at: new Date().toISOString()
        }, 
        error: null 
      };
    }

    const payload = {
      image_url: memory.image_url,
      event_name: memory.event_name,
      event: memory.event_name,
      description: memory.description || '',
      caption: memory.description || '',
      visibility: memory.visibility || 'public',
      uploaded_by: memory.uploaded_by || null,
      uploaded_by_name: memory.uploaded_by_name || 'Resident',
      tagged_residents: memory.tagged_residents || [],
    };

    return await supabase
      .from(TABLES.HOSTEL_MEMORIES)
      .insert(payload)
      .select()
      .single();
  },

  async insertFaceEmbedding(embedding: {
    memory_id: string;
    user_id?: string;
    person_name: string;
    confidence?: number;
    bounding_box?: object;
    embedding_vector?: number[];
  }) {
    if (!this.isLive() || !supabase) return { data: null, error: null };
    return await supabase
      .from(TABLES.FACE_EMBEDDINGS)
      .insert(embedding)
      .select()
      .single();
  },

  // ================================================================
  // STORAGE BUCKETS (TASK 4)
  // ================================================================
  async uploadProfileImage(file: File, userId = 'user') {
    return this.uploadFile(BUCKETS.PROFILES, file, `avatar_${userId}_${Date.now()}`);
  },

  async uploadComplaintImage(file: File) {
    return this.uploadFile(BUCKETS.COMPLAINTS, file, `complaint_${Date.now()}`);
  },

  async uploadMemoryImage(file: File) {
    return this.uploadFile(BUCKETS.MEMORIES, file, `memory_${Date.now()}`);
  },

  async uploadFile(bucket: string, file: File, fileNamePrefix: string) {
    if (!this.isLive() || !supabase) {
      // Local fallback to data URL
      return new Promise<{ publicUrl: string; error: null }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ publicUrl: reader.result as string, error: null });
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${fileNamePrefix}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      return { publicUrl: '', error: uploadError };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { publicUrl: data.publicUrl, error: null };
  },

  // ================================================================
  // REALTIME SUBSCRIPTIONS (TASK 6)
  // ================================================================
  subscribeToComplaints(onUpdate: (payload: unknown) => void) {
    return this.subscribeToTable(TABLES.COMPLAINTS, onUpdate);
  },

  subscribeToNotifications(onUpdate: (payload: unknown) => void) {
    return this.subscribeToTable(TABLES.NOTIFICATIONS, onUpdate);
  },

  subscribeToAnnouncements(onUpdate: (payload: unknown) => void) {
    return this.subscribeToTable(TABLES.ANNOUNCEMENTS, onUpdate);
  },

  subscribeToTable(table: string, onUpdate: (payload: unknown) => void) {
    if (!this.isLive() || !supabase) return () => {};

    const channelName = `realtime_${table}_${Math.random().toString(36).substring(2, 6)}`;
    const channel = supabase
      .channel(channelName)
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
