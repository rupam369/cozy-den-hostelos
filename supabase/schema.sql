-- ================================================================
-- COZY DEN: Modern 3D Multi-Layer Hostel Management Platform (HostelOS)
-- Production Supabase PostgreSQL Schema, Security (RLS) & Realtime
-- ================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Try enabling vector extension for DreamCast PicBot if available
DO $$
BEGIN
    CREATE EXTENSION IF NOT EXISTS vector;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'pgvector extension not installed; falling back to float arrays';
END $$;

-- ================================================================
-- 2. DATABASE TABLES (TASK 3)
-- ================================================================

-- Table 1: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    full_name TEXT,
    age INTEGER,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'Student' CHECK (role IN (
        'Student', 'student',
        'Teacher', 'teacher',
        'Management Member', 'management'
    )),
    hostel_position TEXT NOT NULL DEFAULT 'Room Leader',
    position TEXT,
    profile_image TEXT,
    avatar_url TEXT,
    room_number TEXT DEFAULT 'Room 101',
    floor INTEGER DEFAULT 1,
    wing TEXT DEFAULT 'A',
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sync name/full_name & position/hostel_position triggers
CREATE OR REPLACE FUNCTION public.sync_profile_columns()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NOT NULL AND NEW.full_name IS NULL THEN
        NEW.full_name := NEW.name;
    ELSIF NEW.full_name IS NOT NULL AND NEW.name IS NULL THEN
        NEW.name := NEW.full_name;
    END IF;

    IF NEW.hostel_position IS NOT NULL AND NEW.position IS NULL THEN
        NEW.position := NEW.hostel_position;
    ELSIF NEW.position IS NOT NULL AND NEW.hostel_position IS NULL THEN
        NEW.hostel_position := NEW.position;
    END IF;

    IF NEW.profile_image IS NOT NULL AND NEW.avatar_url IS NULL THEN
        NEW.avatar_url := NEW.profile_image;
    ELSIF NEW.avatar_url IS NOT NULL AND NEW.profile_image IS NULL THEN
        NEW.profile_image := NEW.avatar_url;
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_profile_columns ON public.profiles;
CREATE TRIGGER trg_sync_profile_columns
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_columns();


-- Table 2: complaints
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_id UUID,
    user_name TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'WiFi', 
        'Water', 
        'Electricity', 
        'Food', 
        'Cleaning', 
        'Security', 
        'Room Maintenance'
    )),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    photo_url TEXT,
    location TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    assigned_to TEXT,
    assigned_name TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    is_escalated BOOLEAN DEFAULT false,
    escalated_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE OR REPLACE FUNCTION public.sync_complaint_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.image_url IS NOT NULL AND NEW.photo_url IS NULL THEN
        NEW.photo_url := NEW.image_url;
    ELSIF NEW.photo_url IS NOT NULL AND NEW.image_url IS NULL THEN
        NEW.image_url := NEW.photo_url;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_complaint_image ON public.complaints;
CREATE TRIGGER trg_sync_complaint_image
BEFORE INSERT OR UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.sync_complaint_image();


-- Table 3: food_reviews
CREATE TABLE IF NOT EXISTS public.food_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_name TEXT,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'High Tea', 'Dinner')),
    taste_rating NUMERIC NOT NULL CHECK (taste_rating BETWEEN 1 AND 5),
    quality_rating NUMERIC NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
    hygiene_rating NUMERIC NOT NULL CHECK (hygiene_rating BETWEEN 1 AND 5),
    quantity_rating NUMERIC NOT NULL CHECK (quantity_rating BETWEEN 1 AND 5),
    comment TEXT,
    comments TEXT,
    average_rating NUMERIC(3, 2) GENERATED ALWAYS AS (
        ROUND((taste_rating + quality_rating + hygiene_rating + quantity_rating) / 4.0, 2)
    ) STORED,
    date DATE DEFAULT CURRENT_DATE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Backwards compatibility view: reviews
CREATE OR REPLACE VIEW public.reviews AS SELECT * FROM public.food_reviews;


-- Table 4: meals
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'High Tea', 'Dinner')),
    menu TEXT NOT NULL,
    menu_items JSONB DEFAULT '[]'::jsonb,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    day_of_week TEXT DEFAULT 'Daily',
    title TEXT,
    chef_special TEXT,
    calories INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Table 5: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'System Alert' CHECK (type IN (
        'Announcement', 
        'Complaint Alert', 
        'System Alert',
        'green', 
        'yellow', 
        'red'
    )),
    priority TEXT DEFAULT 'Normal',
    category TEXT,
    complaint_id UUID,
    target_role TEXT DEFAULT 'all',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Table 6: announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID,
    author_name TEXT DEFAULT 'Hostel Administration',
    author_role TEXT DEFAULT 'Admin',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'critical')),
    tags TEXT[] DEFAULT ARRAY['General'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.sync_announcement_description()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.description IS NOT NULL AND NEW.content IS NULL THEN
        NEW.content := NEW.description;
    ELSIF NEW.content IS NOT NULL AND NEW.description IS NULL THEN
        NEW.description := NEW.content;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_announcement_description ON public.announcements;
CREATE TRIGGER trg_sync_announcement_description
BEFORE INSERT OR UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.sync_announcement_description();


-- Table 7: hostel_memories
CREATE TABLE IF NOT EXISTS public.hostel_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by UUID,
    uploaded_by_name TEXT DEFAULT 'Cozy Den Resident',
    image_url TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event TEXT,
    description TEXT,
    caption TEXT,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'restricted')),
    category TEXT DEFAULT 'Hostel Events',
    date DATE DEFAULT CURRENT_DATE,
    year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    location TEXT DEFAULT 'COZY DEN',
    tagged_residents TEXT[] DEFAULT ARRAY[]::TEXT[],
    faces_detected_count INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    approval_status TEXT DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.sync_hostel_memories_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.event_name IS NOT NULL AND NEW.event IS NULL THEN
        NEW.event := NEW.event_name;
    ELSIF NEW.event IS NOT NULL AND NEW.event_name IS NULL THEN
        NEW.event_name := NEW.event;
    END IF;

    IF NEW.description IS NOT NULL AND NEW.caption IS NULL THEN
        NEW.caption := NEW.description;
    ELSIF NEW.caption IS NOT NULL AND NEW.description IS NULL THEN
        NEW.description := NEW.caption;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_hostel_memories_fields ON public.hostel_memories;
CREATE TRIGGER trg_sync_hostel_memories_fields
BEFORE INSERT OR UPDATE ON public.hostel_memories
FOR EACH ROW EXECUTE FUNCTION public.sync_hostel_memories_fields();

-- Backwards compatibility view: memories
CREATE OR REPLACE VIEW public.memories AS SELECT * FROM public.hostel_memories;


-- Table 8: face_embeddings (DreamCast PicBot AI)
CREATE TABLE IF NOT EXISTS public.face_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memory_id UUID REFERENCES public.hostel_memories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    person_name TEXT,
    confidence NUMERIC(4, 3) DEFAULT 0.985,
    bounding_box JSONB DEFAULT '{"x": 0.2, "y": 0.2, "w": 0.3, "h": 0.3}'::jsonb,
    embedding_vector FLOAT8[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- 3. STORAGE SETUP (TASK 4)
-- ================================================================
-- Create required buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('profile-images', 'profile-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('complaint-images', 'complaint-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('hostel-memories', 'hostel-memories', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
    -- Compatibility aliases
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('complaint-photos', 'complaint-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('memories', 'memories', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies (storage.objects has RLS enabled by default in Supabase)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read profile-images" ON storage.objects;
    CREATE POLICY "Public Read profile-images" ON storage.objects FOR SELECT USING (bucket_id IN ('profile-images', 'avatars'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Upload profile-images" ON storage.objects;
    CREATE POLICY "Upload profile-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('profile-images', 'avatars'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read complaint-images" ON storage.objects;
    CREATE POLICY "Public Read complaint-images" ON storage.objects FOR SELECT USING (bucket_id IN ('complaint-images', 'complaint-photos'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Upload complaint-images" ON storage.objects;
    CREATE POLICY "Upload complaint-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('complaint-images', 'complaint-photos'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read hostel-memories" ON storage.objects;
    CREATE POLICY "Public Read hostel-memories" ON storage.objects FOR SELECT USING (bucket_id IN ('hostel-memories', 'memories'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Upload hostel-memories" ON storage.objects;
    CREATE POLICY "Upload hostel-memories" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('hostel-memories', 'memories'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;


-- ================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES (TASK 5)
-- ================================================================

-- Helper function to detect role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
    r TEXT;
BEGIN
    SELECT role INTO r FROM public.profiles WHERE user_id = auth.uid() OR id = auth.uid() LIMIT 1;
    RETURN COALESCE(r, 'Student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all 8 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_embeddings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Profiles read policy" ON public.profiles;
CREATE POLICY "Profiles read policy" ON public.profiles
    FOR SELECT USING (true); -- Public/authenticated read for resident directory

DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.uid() = id OR
        public.current_user_role() IN ('Management Member', 'management')
    );

DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;
CREATE POLICY "Profiles insert policy" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- 2. Complaints Policies
DROP POLICY IF EXISTS "Complaints read policy" ON public.complaints;
CREATE POLICY "Complaints read policy" ON public.complaints
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students insert complaints" ON public.complaints;
CREATE POLICY "Students insert complaints" ON public.complaints
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Management update complaints" ON public.complaints;
CREATE POLICY "Management update complaints" ON public.complaints
    FOR UPDATE USING (
        public.current_user_role() IN ('Management Member', 'management', 'Teacher', 'teacher') OR
        auth.uid() = created_by OR
        auth.uid() IS NULL -- Allow demo updates
    );

-- 3. Food Reviews Policies
DROP POLICY IF EXISTS "Food reviews read policy" ON public.food_reviews;
CREATE POLICY "Food reviews read policy" ON public.food_reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students submit food reviews" ON public.food_reviews;
CREATE POLICY "Students submit food reviews" ON public.food_reviews
    FOR INSERT WITH CHECK (true);

-- 4. Meals Policies
DROP POLICY IF EXISTS "Meals read policy" ON public.meals;
CREATE POLICY "Meals read policy" ON public.meals
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Management manage meals" ON public.meals;
CREATE POLICY "Management manage meals" ON public.meals
    FOR ALL USING (
        public.current_user_role() IN ('Management Member', 'management') OR
        auth.uid() IS NULL
    );

-- 5. Notifications Policies
DROP POLICY IF EXISTS "Notifications read policy" ON public.notifications;
CREATE POLICY "Notifications read policy" ON public.notifications
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Notifications update policy" ON public.notifications;
CREATE POLICY "Notifications update policy" ON public.notifications
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Notifications insert policy" ON public.notifications;
CREATE POLICY "Notifications insert policy" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- 6. Announcements Policies
DROP POLICY IF EXISTS "Announcements read policy" ON public.announcements;
CREATE POLICY "Announcements read policy" ON public.announcements
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Management create announcements" ON public.announcements;
CREATE POLICY "Management create announcements" ON public.announcements
    FOR ALL USING (
        public.current_user_role() IN ('Management Member', 'management', 'Teacher', 'teacher') OR
        auth.uid() IS NULL
    );

-- 7. Hostel Memories Policies
DROP POLICY IF EXISTS "Memories read policy" ON public.hostel_memories;
CREATE POLICY "Memories read policy" ON public.hostel_memories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students and residents upload memories" ON public.hostel_memories;
CREATE POLICY "Students and residents upload memories" ON public.hostel_memories
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Management manage memories" ON public.hostel_memories;
CREATE POLICY "Management manage memories" ON public.hostel_memories
    FOR ALL USING (
        public.current_user_role() IN ('Management Member', 'management') OR
        auth.uid() = uploaded_by OR
        auth.uid() IS NULL
    );

-- 8. Face Embeddings Policies
DROP POLICY IF EXISTS "Face embeddings read policy" ON public.face_embeddings;
CREATE POLICY "Face embeddings read policy" ON public.face_embeddings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Face embeddings write policy" ON public.face_embeddings;
CREATE POLICY "Face embeddings write policy" ON public.face_embeddings
    FOR INSERT WITH CHECK (true);


-- ================================================================
-- 5. REALTIME REPLICATION (TASK 6)
-- ================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.food_reviews;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hostel_memories;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;


-- ================================================================
-- 6. COZY DEN SPECIFIC DATA (TASK 7)
-- ================================================================

-- Meal Schedule:
-- Breakfast: 9:00 AM - 9:30 AM
-- Lunch: 1:00 PM - 2:00 PM
-- High Tea: 6:00 PM - 6:30 PM
-- Dinner: 8:00 PM - 9:00 PM
DELETE FROM public.meals WHERE day_of_week = 'Daily';

INSERT INTO public.meals (meal_type, menu, menu_items, start_time, end_time, day_of_week, title, chef_special, calories)
VALUES 
(
    'Breakfast',
    'Masala Dosa with Sambar, Fluffy Idli, Boiled Eggs, Seasonal Fruits, Filter Coffee & Masala Chai',
    '["Masala Dosa with Sambar", "Fluffy Idli", "Boiled Eggs", "Seasonal Fruits", "Filter Coffee & Masala Chai"]'::jsonb,
    '9:00 AM',
    '9:30 AM',
    'Daily',
    'Sunrise Energy Feast',
    'Crispy Ghee Roast Dosa',
    480
),
(
    'Lunch',
    'Paneer Butter Masala, Dal Makhani, Jeera Rice, Butter Naan, Fresh Cucumber Raita, Gulab Jamun',
    '["Paneer Butter Masala", "Dal Makhani", "Jeera Rice", "Butter Naan", "Fresh Cucumber Raita", "Gulab Jamun"]'::jsonb,
    '1:00 PM',
    '2:00 PM',
    'Daily',
    'Grand Feast Dining',
    'Chef Royal Shahi Paneer',
    720
),
(
    'High Tea',
    'Crispy Vegetable Pakoras, Hot Samosa with Mint Chutney, Marie Biscuits, Ginger Cardamom Chai',
    '["Crispy Vegetable Pakoras", "Hot Samosa with Mint Chutney", "Marie Biscuits", "Ginger Cardamom Chai"]'::jsonb,
    '6:00 PM',
    '6:30 PM',
    'Daily',
    'Evening Sunset Brew',
    'Crisp Paneer Bread Roll',
    310
),
(
    'Dinner',
    'Smoky Kadai Veg, Tadka Yellow Dal, Phulka Rotis, Steamed Basmati Rice, Moong Dal Halwa',
    '["Smoky Kadai Veg", "Tadka Yellow Dal", "Phulka Rotis", "Steamed Basmati Rice", "Moong Dal Halwa"]'::jsonb,
    '8:00 PM',
    '9:00 PM',
    'Daily',
    'Warm Comfort Dinner',
    'Smoky Tandoori Roti & Paneer Tikka',
    650
);

-- Seed Initial Announcements
INSERT INTO public.announcements (title, description, content, author_name, author_role, priority, tags)
VALUES 
(
    'High-Speed Optical WiFi Upgraded to 1 Gbps Mesh',
    'Dedicated enterprise access points deployed across all resident floors. Enjoy seamless roaming from your room to the Sky Terrace with 0 packet latency.',
    'Dedicated enterprise access points deployed across all resident floors. Enjoy seamless roaming from your room to the Sky Terrace with 0 packet latency.',
    'Dr. Anita Desai',
    'Head Warden',
    'normal',
    ARRAY['WiFi', 'Tech Infrastructure']
),
(
    'Saturday Rooftop Acoustic Jam & BBQ Night',
    'All residents are invited to Cozy Den Sky Terrace this Saturday 7:30 PM. Live student acoustic sets, fresh barbecue snacks, and stargazing telescopes.',
    'All residents are invited to Cozy Den Sky Terrace this Saturday 7:30 PM. Live student acoustic sets, fresh barbecue snacks, and stargazing telescopes.',
    'Rohan Mehra',
    'Mess manager',
    'normal',
    ARRAY['Hostel Life', 'Social', 'Terrace']
),
(
    'Quiet Study Hours Protocol: Mid-Term Examination Week',
    'Quiet hours will be observed strictly from 10:00 PM to 6:00 AM across all corridors. Floor study pods will remain open 24/7 with complimentary herbal tea.',
    'Quiet hours will be observed strictly from 10:00 PM to 6:00 AM across all corridors. Floor study pods will remain open 24/7 with complimentary herbal tea.',
    'Prof. K. Sen',
    'Faculty Advisor',
    'urgent',
    ARRAY['Academics', 'Rules']
)
ON CONFLICT DO NOTHING;
