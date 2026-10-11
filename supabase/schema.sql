-- ================================================================
-- COZY DEN: Modern 3D Multi-Layer Hostel Management Platform
-- Supabase PostgreSQL Database Schema & Realtime Setup
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    phone TEXT,
    full_name TEXT NOT NULL,
    age INTEGER,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'management')),
    position TEXT NOT NULL CHECK (position IN (
        'Room leader', 
        'Floor representative', 
        'Warden', 
        'Mess manager', 
        'Admin', 
        'Resident', 
        'Faculty Advisor',
        'Head Warden'
    )),
    room_number TEXT,
    floor INTEGER DEFAULT 1,
    wing TEXT DEFAULT 'A',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'WiFi', 
        'Water', 
        'Electricity', 
        'Food', 
        'Cleaning', 
        'Security', 
        'Room Maintenance'
    )),
    location TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    photo_url TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    assigned_to TEXT,
    assigned_name TEXT,
    is_escalated BOOLEAN DEFAULT false,
    escalated_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 3. FOOD REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'High Tea', 'Dinner')),
    date DATE DEFAULT CURRENT_DATE,
    taste_rating INTEGER NOT NULL CHECK (taste_rating BETWEEN 1 AND 5),
    quality_rating INTEGER NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
    hygiene_rating INTEGER NOT NULL CHECK (hygiene_rating BETWEEN 1 AND 5),
    quantity_rating INTEGER NOT NULL CHECK (quantity_rating BETWEEN 1 AND 5),
    average_rating NUMERIC(3, 2) NOT NULL,
    comments TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MEAL SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week TEXT NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'High Tea', 'Dinner')),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    title TEXT NOT NULL,
    menu_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    chef_special TEXT,
    calories INTEGER,
    allergens TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT CHECK (target_role IN ('all', 'student', 'teacher', 'management')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('green', 'yellow', 'red')),
    category TEXT,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'critical')),
    tags TEXT[] DEFAULT ARRAY['General'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Permissive demo policies (Allow select & insert for authenticated or anon clients)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public write profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public read complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Public write complaints" ON public.complaints FOR ALL USING (true);

CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public write reviews" ON public.reviews FOR ALL USING (true);

CREATE POLICY "Public read meals" ON public.meals FOR SELECT USING (true);
CREATE POLICY "Public write meals" ON public.meals FOR ALL USING (true);

CREATE POLICY "Public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public write notifications" ON public.notifications FOR ALL USING (true);

CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public write announcements" ON public.announcements FOR ALL USING (true);

-- 8. ENABLE SUPABASE REALTIME REPLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- 9. SEED INITIAL MEALS
INSERT INTO public.meals (day_of_week, meal_type, start_time, end_time, title, menu_items, chef_special, calories)
VALUES 
('Daily', 'Breakfast', '9:00 AM', '9:30 AM', 'Sunrise Energy Feast', '["Masala Dosa with Sambar", "Fluffy Idli", "Boiled Eggs", "Seasonal Fruits", "Filter Coffee & Masala Chai"]', 'Crispy Ghee Roast Dosa', 480),
('Daily', 'Lunch', '1:00 PM', '2:00 PM', 'Grand Feast Dining', '["Paneer Butter Masala", "Dal Makhani", "Jeera Rice", "Butter Naan", "Fresh Cucumber Raita", "Gulab Jamun"]', 'Chef Royal Shahi Paneer', 720),
('Daily', 'High Tea', '6:00 PM', '6:30 PM', 'Evening Sunset Brew', '["Crispy Vegetable Pakoras", "Hot Samosa with Mint Chutney", "Marie Biscuits", "Ginger Cardamom Chai"]', 'Crisp Paneer Bread Roll', 310),
('Daily', 'Dinner', '8:00 PM', '9:00 PM', 'Warm Comfort Dinner', '["Smoky Kadai Veg", "Tadka Yellow Dal", "Phulka Rotis", "Steamed Basmati Rice", "Moong Dal Halwa"]', 'Smoky Tandoori Roti & Paneer Tikka', 650)
ON CONFLICT DO NOTHING;

-- 10. SEED INITIAL ANNOUNCEMENTS
INSERT INTO public.announcements (title, content, author_name, author_role, priority, tags)
VALUES 
('High-Speed Optical WiFi Upgraded to 1 Gbps', 'Fiber optics upgrades completed across 2nd & 3rd wings. Connect to CozyDen_5G with your student credentials.', 'Vikram Roy', 'Admin', 'normal', ARRAY['WiFi', 'Infrastructure']),
('Grand Saturday Hostel Acoustic Night & Terrace Barbecue', 'Join fellow residents on the Sky Terrace this Saturday 7:30 PM for acoustic jams, hot cocoa, and barbecue skewers!', 'Anita Desai', 'Mess manager', 'normal', ARRAY['Event', 'Terrace']),
('Emergency Plumbing Overhaul - Wing B', 'Maintenance crew scheduled on Wing B ground water pipeline between 2:00 PM - 3:00 PM. Alternate water line active.', 'Ramesh Verma', 'Warden', 'urgent', ARRAY['Water', 'Maintenance'])
ON CONFLICT DO NOTHING;

-- ================================================================
-- MODULE 8: COZY DEN DREAMCAST PICBOT (AI PERSONAL MEMORY FINDER)
-- ================================================================

-- Enable pgvector extension for face embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 11. HOSTEL MEMORIES REPOSITORY (Stored in Supabase Storage 'memories' bucket)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    event TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Hostel Events',
        'Group Photos',
        'Trips & Outings',
        'Celebrations',
        'Sports & Games',
        'Daily Memories'
    )),
    caption TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    uploaded_by_name TEXT,
    tagged_residents TEXT[] DEFAULT ARRAY[]::TEXT[],
    faces_detected_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. AI FACE EMBEDDINGS (Indexed per detected face for fast vector cosine similarity)
CREATE TABLE IF NOT EXISTS public.face_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    person_name TEXT NOT NULL,
    confidence NUMERIC(4, 3) DEFAULT 0.985,
    bounding_box JSONB DEFAULT '{"x": 0.2, "y": 0.2, "w": 0.3, "h": 0.3}'::jsonb,
    embedding_vector vector(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for blazing-fast cosine distance vector search
CREATE INDEX IF NOT EXISTS face_embeddings_vector_idx ON public.face_embeddings 
USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 100);

-- 13. AI PICBOT SEARCH AUDIT & HISTORY
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    search_type TEXT NOT NULL CHECK (search_type IN ('face_reference', 'natural_chat', 'smart_filter')),
    results_count INTEGER NOT NULL DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. PRIVACY CONSENT & BIOMETRIC CONTROLS
CREATE TABLE IF NOT EXISTS public.face_search_consent (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_given BOOLEAN DEFAULT true,
    enabled BOOLEAN DEFAULT true,
    allow_tagging BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS & Policies for DreamCast PicBot
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_search_consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read memories" ON public.memories FOR SELECT USING (true);
CREATE POLICY "Public write memories" ON public.memories FOR ALL USING (true);

CREATE POLICY "Public read face_embeddings" ON public.face_embeddings FOR SELECT USING (true);
CREATE POLICY "Public write face_embeddings" ON public.face_embeddings FOR ALL USING (true);

CREATE POLICY "Public read search_history" ON public.search_history FOR SELECT USING (true);
CREATE POLICY "Public write search_history" ON public.search_history FOR ALL USING (true);

CREATE POLICY "Public read face_search_consent" ON public.face_search_consent FOR SELECT USING (true);
CREATE POLICY "Public write face_search_consent" ON public.face_search_consent FOR ALL USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.memories;

-- 15. ALIAS VIEWS FOR MAXIMUM BACKWARD / REST COMPATIBILITY
CREATE OR REPLACE VIEW public.users AS
SELECT 
    id,
    full_name AS name,
    email,
    phone,
    age,
    role,
    position AS hostel_position,
    avatar_url AS profile_image,
    room_number,
    floor,
    wing,
    created_at,
    updated_at
FROM public.profiles;

CREATE OR REPLACE VIEW public.food_reviews AS
SELECT * FROM public.reviews;

-- 16. SUPABASE STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
('memories', 'memories', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
('complaint-photos', 'complaint-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage bucket access policies
CREATE POLICY "Public Access to Memories Bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'memories');

CREATE POLICY "Upload to Memories Bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'memories');

CREATE POLICY "Public Access to Complaint Photos" ON storage.objects
FOR SELECT USING (bucket_id = 'complaint-photos');

CREATE POLICY "Upload to Complaint Photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'complaint-photos');

CREATE POLICY "Public Access to Avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Upload to Avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');
