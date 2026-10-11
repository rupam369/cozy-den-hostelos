# COZY DEN HostelOS - Render Backend AI Workers 🚀

Autonomous AI background services, facial recognition indexing, complaint escalation automation, and intelligent resident chatbot for the COZY DEN smart hostel management platform.

---

## 🏛️ Architecture Overview

The backend worker infrastructure is decoupled from the Next.js Vercel frontend, allowing independent horizontal scaling and continuous background processing on [Render](https://render.com).

```
┌─────────────────────────────────┐
│     Next.js Frontend (Vercel)   │
└───────────────┬─────────────────┘
                │ REST API / Secure HTTPS
                ▼
┌────────────────────────────────────────────────────────┐
│             Render Web Service & Workers               │
│                                                        │
│  1. DreamCast PicBot Worker (Vision & Face Embeddings) │
│  2. AI Memory Search API (POST /search-memory)        │
│  3. 48h Complaint Escalation Worker (Red Alerts)      │
│  4. COZY Assistant Chatbot Engine (POST /chat)         │
└───────────────┬────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│     Supabase Cloud Services     │
│  - PostgreSQL + pgvector        │
│  - Storage (hostel-memories)    │
│  - Realtime Replication         │
└─────────────────────────────────┘
```

---

## 🛠️ The 4 Background Services

### 1. DreamCast PicBot Worker (`/dreamcast-worker`)
- **Technology**: Python, FastAPI, NumPy Spatial Vectorizer, PIL
- **Workflow**:
  1. Detects newly uploaded hostel memories in Supabase `hostel_memories`.
  2. Downloads photo securely from the `hostel-memories` Supabase storage bucket.
  3. Detects faces and extracts 512-dimensional normalized unit vectors ($\|\vec{v}\|_2 = 1.0$).
  4. Stores embeddings in Supabase `face_embeddings` table (`memory_id`, `user_id`, `bounding_box`, `confidence`, `embedding_vector`).
  5. Updates `faces_detected_count` in `hostel_memories`.

### 2. AI Memory Search API (`POST /search-memory`)
- **Input**: Student reference selfie or portrait (URL, base64, or direct file upload).
- **Security Check**: Enforces **biometric privacy consent** (`consent=true` required, HTTP 403 if omitted).
- **Vector Matching**: Computes cosine similarity across all indexed faces:
  $$\text{sim}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
- **Output**: Returns matching hostel memories (Photo URLs, event names, dates, locations, similarity score).

### 3. Complaint Escalation Worker (`/notification-worker`)
- **Logic**: Periodically scans for complaints where `status != 'Resolved'` and `created_at < now() - 48 hours` with `is_escalated = false`.
- **Action**:
  - Automatically raises priority to `Critical` and sets `is_escalated = true`.
  - Dispatches immediate **RED ALERT** notifications to:
    - **Hostel Management** (`Management Member`)
    - **Faculty / Wardens** (`Teacher`)
    - **Student Representatives** (`Student`)
- **Alert Message**:
  > *"Students are facing this issue: [WATER] 'Water leakage in Room 204 washroom' at Wing A - Floor 2. Management attention required immediately (Overdue > 48 hours without resolution)."*

### 4. AI Assistant Chatbot Backend (`POST /chat`)
- **Grounded Knowledge**:
  - **Meal Timings & Menu**: Live schedule from Supabase `meals` (Breakfast 9:00-9:30 AM, Lunch 1:00-2:00 PM, High Tea 6:00-6:30 PM, Dinner 8:00-9:00 PM).
  - **Complaint Guidance**: Explains categories, anonymous filing, and the 48-hour auto-escalation policy.
  - **Announcements**: Live notices from Supabase `announcements`.
  - **Hostel Rules**: Gate curfew (10:00 PM), quiet study hours (10:00 PM - 6:00 AM), emergency wardens.
- **Engines**: Uses OpenAI (`gpt-4o-mini`) when `OPENAI_API_KEY` is provided; seamlessly falls back to a high-precision rule and keyword retrieval engine.

---

## 📋 Environment Variables

Set these environment variables in your Render Dashboard:

| Variable | Required | Description |
|---|:---:|---|
| `SUPABASE_URL` | **Yes** | Your Supabase project URL (`https://lpektepedttwesoeacbx.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | **Yes** | Supabase **service_role secret** (bypasses RLS for worker jobs) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Fallback client key |
| `OPENAI_API_KEY` | Optional | Powers OpenAI ChatGPT responses in `/chat` |
| `BACKEND_API_KEY` | Optional | Secret key checked via `X-API-KEY` header |
| `PORT` | Optional | Container port (Render sets this automatically to `10000` or `8000`) |
| `ENVIRONMENT` | Optional | `production` or `development` |
| `ESCALATION_HOURS_THRESHOLD` | Optional | Default `48` |
| `FACE_MATCH_THRESHOLD` | Optional | Default `0.72` |

---

## 🚀 Render Deployment Guide

### Option A: 1-Click Render Blueprint (Recommended)
1. Push this repository to GitHub: `rupam369/cozy-den-hostelos`.
2. Log in to [Render](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect the repository `cozy-den-hostelos`.
5. Render will automatically detect [`render.yaml`](file:///c:/Users/Rupam/OneDrive/Desktop/COZY%20DEN/render.yaml) and configure:
   - **`cozy-den-ai-api`** (Web Service running FastAPI)
   - **`cozy-den-ai-worker`** (Background Worker running continuous daemon)
6. Fill in your `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` under the prompted environment variables.
7. Click **Apply**. Render will build and deploy the Docker containers automatically!

### Option B: Manual Web Service Setup
1. On Render, click **New +** -> **Web Service**.
2. Connect `cozy-den-hostelos`.
3. Select **Docker** environment.
   - **Root Directory**: `backend-workers`
   - **Dockerfile Path**: `backend-workers/Dockerfile`
4. Add the required environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`).
5. Click **Create Web Service**.

---

## 📡 API Endpoints Reference

### 1. Health & Status
- **`GET /health`**: Returns Supabase connection state and service parameters.
- **`GET /stats`**: Returns real-time counts of complaints, indexed face embeddings, and meals.

### 2. Search Memory by Face
- **`POST /search-memory`**
  ```json
  {
    "image_url": "https://.../student_selfie.jpg",
    "consent": true,
    "threshold": 0.72,
    "limit": 10
  }
  ```
  **Response**:
  ```json
  {
    "status": "success",
    "matches_found": 3,
    "matches": [
      {
        "memory_id": "b18b4887-213c-4433-871d-...",
        "photo_url": "https://.../rooftop_jam.jpg",
        "event": "Saturday Rooftop Acoustic Jam",
        "date": "2026-10-10",
        "location": "Sky Terrace Lounge",
        "similarity": 0.8924,
        "confidence_rating": "High Match"
      }
    ]
  }
  ```

### 3. Trigger 48-Hour Complaint Escalation
- **`POST /trigger-escalation`**
  ```json
  {
    "hours_threshold": 48
  }
  ```

### 4. COZY Assistant Chatbot
- **`POST /chat`**
  ```json
  {
    "message": "What is dinner timing and what happens if my water leak is not fixed?",
    "role": "Student"
  }
  ```

---

## 🔗 How Vercel Frontend Communicates with Render Services

Add your Render service URL to your Vercel project environment variables:
```env
NEXT_PUBLIC_RENDER_API_URL=https://cozy-den-ai-api.onrender.com
RENDER_API_KEY=your_backend_api_key_here
```

### TypeScript Client Example (For Next.js / Vercel):
```typescript
// src/services/renderWorkersApi.ts

const RENDER_BASE_URL = process.env.NEXT_PUBLIC_RENDER_API_URL || 'http://localhost:8000';

export async function searchMemoriesByStudentFace(referenceImageUrl: string) {
  const response = await fetch(`${RENDER_BASE_URL}/search-memory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.RENDER_API_KEY || ''
    },
    body: JSON.stringify({
      image_url: referenceImageUrl,
      consent: true, // Biometric privacy consent
      threshold: 0.72
    })
  });

  if (!response.ok) {
    throw new Error(`Render memory search failed: ${response.statusText}`);
  }

  return response.json();
}

export async function askCozyAssistant(message: string, userRole: string = 'Student') {
  const response = await fetch(`${RENDER_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, role: userRole })
  });

  return response.json();
}
```

---

## 🔒 Security & Privacy Guarantees
1. **Biometric Privacy Controls**: No facial recognition matching runs unless `consent: true` is explicitly provided. Calls without consent are rejected with `HTTP 403 Forbidden`.
2. **Rate Limiting**: Sliding window rate limiting prevents abuse (default: 60 requests/min per IP).
3. **No Key Exposure**: Client frontend only talks to public endpoints or proxies through Next.js server actions. Secrets (`SUPABASE_SERVICE_KEY`) remain strictly inside Render containers.
