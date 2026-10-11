# 🏨 COZY DEN HostelOS

> **A Futuristic 3D Multi-Layer Hostel Management Platform & DreamCast PicBot AI**  
> Inspired by the real architecture of **Scope Global Skills University Boys Hostel, Bhopal**.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## ✨ Overview

**COZY DEN HostelOS** is a digital hostel operating system combining **Apple Vision Pro spatial design**, an interactive **3D Digital Twin building model**, an AI-powered personal memory locator (**DreamCast PicBot**), and a real-time facility command center.

---

## 🚀 Key Modules & Capabilities

### 1. 🏛️ Interactive 3D Digital Twin Architecture
- **Realistic 3D Building Twin**: Faithfully modeled after the real SGSU Boys Hostel facade, featuring ivory/cream textured concrete, dark chocolate recessed balcony alcoves, projecting slabs with black metal railings, and diurnal glowing windows.
- **7 Named Interactive Three.js Objects**:
  - `COZYDEN_BUILDING`: Master 4-story architectural block and central open atrium shaft.
  - `ENTRANCE`: Curved vaulted portico canopy with twin brushed stainless support columns.
  - `RECEPTION`: Ground floor lobby with curved LED concierge desk, check-in turnstile gate, and digital directory.
  - `ROOM_BLOCK`: Detailed student resident suite (Room 304) with study desk, laptop, cyber lamp, wardrobe, and IoT sensors.
  - `MESS_AREA`: Cafeteria with 4 sets of long dining tables, stainless buffet counters, and overhead infrared heat lamps.
  - `ADMIN_OFFICE`: Warden executive mahogany desk, leather swivel chair, document safe, and 4-feed CCTV monitor matrix.
  - `DREAMCAST_LOUNGE`: Rooftop recreation deck with industrial truss canopy, stargazing telescope, ethereal memory projector, and illuminated green billboard (*"COZY DEN - SCOPE GLOBAL SKILLS UNIVERSITY"*).
- **Diurnal Environments**: Instant toggle between **Day**, **Sunset**, and **Night** modes with dynamic celestial stars and sodium-vapor luminescence.
- **Spatial X-Ray & Exploded Views**: Fades outer walls to step inside rooms, or animates floor layers vertically.
- **One-Click GLB Exporter**: Built-in Three.js `GLTFExporter` allowing users to download `cozy_den_digital_twin.glb` directly in the browser.

### 2. 🤖 Module 8: DreamCast PicBot AI (Personal Memory Finder)
- **Facial Landmark Scanner**: Holographic biometric scanner extracting 512-dimensional facial vector embeddings.
- **Vector Cosine Similarity Search**: Powered by Supabase `pgvector` indexing with IVFFlat clustering.
- **Conversational AI Agent**: Natural language assistant responding to queries like *"Show my cricket photos"* or *"Diwali terrace memories"*.
- **Shimmering Loading State**: Renders ethereal animated badge: *"Searching your COZY DEN memories..."*.
- **Privacy & Biometrics Vault**: Strict resident consent toggles, self-search only enforcement, and vector purge capabilities.
- **Strict Photo-Only Policy**: Dedicated validators ensuring hostel memories remain strictly photos (no video uploads).

### 3. 🚨 48-Hour Smart Escalation Grievance Radar
- **Live IoT Health Vitals Grid**: Real-time score matrix covering Food, WiFi Mesh, Water/Solar, Electricity, and Cleanliness.
- **Overdue 48h Escalation**: Automatically loops in Chief Warden, Faculty Mentors, and Student Floor Representatives when facility staff fail to act within 48 hours.
- **Workflow Action Suite**: Assign technicians, update status from *Pending* to *In Progress* to *Resolved*, and log resolution notes.

### 4. 🍽️ Smart Mess & Dining Nutrition Hub
- **4-Meal Daily Schedules**: Breakfast (9:00 AM), Lunch (1:00 PM), High Tea (6:00 PM), and Dinner (8:00 PM) with menus and calories.
- **4-Metric Resident Reviews**: Students rate Taste, Quality, Hygiene, and Quantity with real-time composite score recalculation.

### 5. 🎛️ Management Command Center (`/management`)
- **Facility Radar & Complaints**: Filter grievances by category, track SLA timings, and monitor IoT vitals.
- **User & Resident Directory**: Manage room allocations, hostel positions, and enrollment of new residents.
- **Memory Moderation**: Review student-uploaded hostel moments with *Approve*, *Flag / Hide*, or *Delete* actions.
- **Notice Broadcaster**: Real-time announcement composer with priority tiers (*Normal*, *Urgent*, *Critical*) and targeted audience dispatch.
- **IoT Analytics Dashboard**: 4.2-hour resolution SLA velocity, resident CSAT scores (4.8 / 5.0), and category breakdown charts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.4 (Turbopack App Router)](https://nextjs.org/)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [Three.js](https://threejs.org/), [React Three Fiber (@react-three/fiber)](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), `three-stdlib`
- **Icons & Styling**: [Lucide React](https://lucide.dev/), Apple Vision Pro Glassmorphism
- **Audio Engine**: Synthesized Web Audio API (zero external sound dependencies)
- **Database & Storage**: [Supabase](https://supabase.com/) PostgreSQL, `pgvector`, Realtime WebSocket Publications, Storage Buckets

---

## 📁 Project Structure

```
COZY DEN/
├── public/
│   └── images/hostel/             # Real hostel reference images
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing page with 3D Digital Twin
│   │   ├── student/page.tsx       # Student resident dashboard
│   │   ├── teacher/page.tsx       # Faculty & mentor welfare portal
│   │   ├── management/page.tsx    # Management command suite (5 admin tools)
│   │   ├── picbot/page.tsx        # DreamCast PicBot AI memory locator
│   │   ├── food/page.tsx          # 4-meal schedule & rating reviews
│   │   ├── complaints/page.tsx    # Grievance registration & tracking
│   │   ├── announcements/page.tsx # Broadcast notices & memos
│   │   ├── memories/page.tsx      # Social memory photo wall
│   │   ├── login/page.tsx         # Auth with email & phone OTP
│   │   └── layout.tsx             # Root layout with notification toasts
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── DigitalTwinModel.tsx   # 7 Named 3D Objects & landscaping
│   │   │   ├── HostelCanvas.tsx       # 3D canvas, lighting & GLB exporter
│   │   │   └── WalkthroughGuide.ts    # Guided camera tour stops
│   │   ├── picbot/                    # Biometric scanner, chat & galleries
│   │   ├── modals/                    # Room, mess & grievance modals
│   │   └── navigation/Navbar.tsx      # Responsive glassmorphism navigation
│   ├── context/AppContext.tsx         # Global reactive state & local persistence
│   ├── data/hostelRoomsData.ts        # 5-floor room records & IoT telemetry
│   ├── lib/
│   │   ├── picbotEngine.ts            # 512-dim face vector similarity matcher
│   │   ├── sound.ts                   # Web Audio chime & camera sound generator
│   │   ├── supabase.ts                # Supabase client initialization
│   │   └── supabaseService.ts         # Data & storage operations with fallback
│   └── types/index.ts                 # TypeScript type definitions
├── supabase/
│   └── schema.sql                     # Complete PostgreSQL, pgvector & RLS setup
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** or **pnpm**

### 2. Installation
```bash
# Clone repository
git clone https://github.com/rupam369/cozy-den-hostelos.git
cd cozy-den-hostelos

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*(Note: The app includes full local fallback support and will run seamlessly even without Supabase keys).*

### 4. Database Setup
1. In your Supabase project dashboard, open the **SQL Editor**.
2. Run the SQL script from `supabase/schema.sql`.
3. This creates all tables, pgvector extensions, views, RLS policies, and storage buckets.

### 5. Running the Application
```bash
# Start local development server
npm run dev

# Open in browser
# http://localhost:3000
```

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🌿 Branching Strategy

- **`main`**: Production-ready branch deployed to Vercel.
- **`development`**: Active feature development branch for daily commits and staging tests.

```bash
# Switch to development branch
git checkout development

# Work on feature and push
git add .
git commit -m "feat: your new feature"
git push origin development

# Merge to main for release
git checkout main
git merge development
git push origin main
```

---

## 📄 License
This project is proprietary and built for **COZY DEN - Scope Global Skills University Boys Hostel**. All rights reserved.
