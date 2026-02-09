🍎 FoodSnap

Scan Smart, Eat Fresh
Your personal AI-powered food companion for healthier eating.

FoodSnap is a modern, production-ready web application that helps users make informed food choices by scanning food products and receiving instant nutrition insights, ingredient analysis, and AI-driven health recommendations.

✨ Why FoodSnap?

Most food labels are hard to understand and easy to ignore.
FoodSnap bridges that gap by combining barcode scanning, nutrition data, and AI reasoning into a single, simple experience.

Whether you’re health-conscious, managing dietary conditions, or just curious — FoodSnap gives clarity in seconds.

🚀 Live Demo (Production)

👉 https://foodsnap-plum.vercel.app

No setup required.
Open the app → analyze a product → see AI-powered insights instantly.

🧠 Core Features

📱 Instant Product Scanning
Scan food products and fetch nutrition data automatically.

🧠 AI-Powered Analysis (Gemini 3 Flash)
Ingredient-based reasoning, health scoring, and smart explanations.

⚠️ Allergen & Dietary Awareness
Highlights risks based on ingredients and user context.

❤️ Health Scoring System
A clear score that reflects overall product healthiness.

📊 Scan History
Track previously analyzed products.

⭐ Favorites
Save and compare products over time.

🌍 Human-Friendly Explanations
Simple, readable insights instead of medical jargon.

🛠 Tech Stack

Frontend

Next.js 14 (App Router)

TypeScript

Tailwind CSS

shadcn/ui + Radix UI

Framer Motion

Backend

Next.js API Routes (route.ts)

Node Runtime (Vercel)

AI

Google Gemini 3 Flash (server-side inference)

Data & Auth

Firebase Authentication

Firebase Firestore

OpenFoodFacts API

Tooling

pnpm (fast, deterministic)

ESLint + TypeScript strict mode

📂 Project Structure (Accurate & Clean)
FOODSNAP/
├── app/
│   ├── (auth)/              # Login / Signup routes
│   ├── api/
│   │   └── gemini/
│   │       ├── analyze-product/route.ts
│   │       ├── chat/route.ts
│   │       ├── structure-label/route.ts
│   │       └── gemini-test/route.ts
│   ├── analysis/             # Analysis pages
│   ├── scan/                 # Scanning flow
│   ├── profile/              # User profile & setup
│   ├── layout.tsx            # Root layout
│   ├── globals.css
│   └── page.tsx              # Landing page
│
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── scanner/              # Barcode scanning UI
│   ├── analysis/             # Analysis UI components
│   └── optimized/            # Performance-focused components
│
├── lib/
│   ├── auth.ts               # Auth helpers
│   ├── firebase.ts           # Firebase config
│   ├── openFoodFacts.ts      # OFF API wrapper
│   ├── search/               # Search & caching utils
│   └── utils.ts
│
├── services/
│   └── geminiClient.ts       # Gemini SDK integration
│
├── hooks/                    # Custom React hooks
├── public/                   # Static assets
├── styles/
│   └── globals.css
│
├── middleware.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
└── README.md

🔐 Environment Variables
Local Development (.env.local)
# Gemini AI
GOOGLE_API_KEY=your_gemini_api_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenFoodFacts
NEXT_PUBLIC_OPENFOODFACTS_API_URL=https://world.openfoodfacts.org/api/v0

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000


📌 Note

GOOGLE_API_KEY is server-only (used in route.ts)

Any env change requires redeploy on Vercel

🧪 How to Test Gemini AI (Production)
1️⃣ UI-Based Test (Fastest)

Open the live app

Select or scan a product (e.g. Kurkure)

Go to Analysis

AI insights + health score appear automatically

✔ Confirms Gemini is working in production

2️⃣ Direct API Test (Recommended for Developers)
Analyze Product API
POST https://foodsnap-plum.vercel.app/api/gemini/analyze-product


Example (Python / Colab / local script):

import requests

url = "https://foodsnap-plum.vercel.app/api/gemini/analyze-product"

payload = {
    "productName": "Kurkure",
    "ingredients": "Corn meal, vegetable oil, spices, salt"
}

r = requests.post(url, json=payload)
print(r.status_code)
print(r.json())


Expected

200 OK

success: true

healthScore + AI insights

3️⃣ Conversational AI Test (Reasoning Check)
POST https://foodsnap-plum.vercel.app/api/gemini/chat

payload = {
    "productName": "Kurkure Masala Munch",
    "ingredients": "Corn meal, oil, spices, salt",
    "healthScore": 35,
    "userMessage": "Can I eat this daily?",
    "userContext": {
        "ageGroup": "Adult",
        "conditions": ["High BP"],
        "goal": "Weight loss"
    },
    "conversationHistory": []
}


✔ Confirms reasoning, personalization, and safe responses

🧪 Version & Testing Strategy (Developer-Friendly)

Production → main branch

Preview testing → feature branches

Env changes → always followed by redeploy

POST-only APIs → predictable & secure

Node runtime → stable AI SDK execution

This setup ensures:

reproducible builds

zero frontend key leaks

reliable AI inference

🧑‍💻 Local Development
git clone https://github.com/amitakr0027/FOODSNAP.git
cd FOODSNAP
pnpm install
pnpm dev


Open → http://localhost:3000

🧠 Design Decisions (Why This Works)

Server-only AI keys (secure by default)

App Router + route.ts for clean backend logic

Strict prompt structure to avoid hallucinated output

pnpm for deterministic dependency resolution

Clear separation of UI, services, and logic

📜 License

MIT License
Free to use, modify, and learn from.

❤️ Final Note

FoodSnap is built with the mindset of clarity, safety, and developer experience.
If you’re reading this README, you should be able to:

understand the system in minutes

test AI functionality confidently

extend features without fear

If that happens — the README has done its job.
