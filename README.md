<div align="center">

# 🍎 FoodSnap

### Scan Smart, Eat Fresh

*Your personal AI-powered food companion for healthier eating*

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://foodsnap-plum.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

[**Live Demo**](https://foodsnap-plum.vercel.app) • [**Features**](#-core-features) • [**Tech Stack**](#-tech-stack) • [**Get Started**](#-quick-start)

</div>

---

## 🌟 Why FoodSnap?

Most food labels are **hard to understand** and **easy to ignore**. FoodSnap bridges that gap by combining **barcode scanning**, **nutrition data**, and **AI reasoning** into a single, simple experience.

> Whether you're health-conscious, managing dietary conditions, or just curious — **FoodSnap gives clarity in seconds**.

<br/>

## ✨ Core Features

<table>
<tr>
<td width="50%">

### 📱 Instant Product Scanning
Scan food products and fetch nutrition data automatically from OpenFoodFacts database.

### 🧠 AI-Powered Analysis
Powered by **Gemini 3 Flash** for ingredient-based reasoning, health scoring, and smart explanations.

### ⚠️ Allergen & Dietary Awareness
Highlights risks based on ingredients and personalized user context.

</td>
<td width="50%">

### ❤️ Health Scoring System
Clear, visual scores that reflect overall product healthiness at a glance.

### 📊 Scan History
Track and review all previously analyzed products in one place.

### ⭐ Favorites & Compare
Save products and compare nutritional values over time.

</td>
</tr>
</table>

<br/>

## 🚀 Live Demo

**👉 [https://foodsnap-plum.vercel.app](https://foodsnap-plum.vercel.app)**

No setup required. Simply:
1. Open the app
2. Scan or search a product
3. Get AI-powered insights instantly

<br/>

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14 (App Router) • TypeScript • Tailwind CSS • shadcn/ui • Radix UI • Framer Motion |
| **Backend** | Next.js API Routes • Node Runtime (Vercel) |
| **AI Engine** | Google Gemini 3 Flash (server-side inference) |
| **Database & Auth** | Firebase Authentication • Firebase Firestore |
| **External APIs** | OpenFoodFacts API |
| **Tooling** | pnpm • ESLint • TypeScript (strict mode) |

</div>

<br/>

## 📂 Project Structure

```
FOODSNAP/
│
├── .next/                            # Next.js build output (auto-generated)
│
├── 📁 app/                           # Next.js App Router
│   │
│   ├── 📁 (auth)/                    # Authentication routes group
│   │   ├── 📁 login/
│   │   │   └── page.tsx
│   │   └── 📁 signup/
│   │       └── page.tsx
│   │
│   ├── 📁 about/
│   │   └── page.tsx
│   │
│   ├── 📁 analysis/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 api/                       # Backend API routes
│   │   └── 📁 gemini/
│   │       ├── 📁 analyze-product/
│   │       │   └── route.ts
│   │       ├── 📁 chat/
│   │       │   └── route.ts
│   │       ├── 📁 structure-label/
│   │       │   └── route.ts
│   │       └── 📁 gemini-test/
│   │           └── route.ts
│   │
│   ├── 📁 badges/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 community/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 community-guidelines/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 feedback/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 help/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 history/
│   │
│   ├── 📁 home/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 privacy/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 profile/
│   │   ├── 📁 setup/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 scan/
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── 📁 terms/
│   │
│   ├── error.tsx                     # Error boundary
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   ├── loading.tsx                   # Loading UI
│   ├── not-found.tsx                 # 404 page
│   └── page.tsx                      # Landing page
│
├── 📁 components/
│   │
│   ├── 📁 analysis/
│   │   ├── analysis.tsx
│   │   └── analysisUtils.ts
│   │
│   ├── 📁 home/
│   │   └── PoweredBySection.tsx
│   │
│   ├── 📁 optimized/
│   │   └── VirtualizedList.tsx
│   │
│   ├── 📁 scanner/
│   │   └── scan.tsx
│   │
│   └── 📁 ui/                        # shadcn/ui components
│       └── theme-provider.tsx
│
├── 📁 hooks/                         # Custom React hooks
│   ├── use-mobile.tsx
│   ├── use-optimized-profile.ts
│   ├── use-optimized-search.ts
│   ├── use-profile.ts
│   └── use-toast.ts
│
├── 📁 lib/                           # Core utilities & configurations
│   │
│   ├── 📁 search/
│   │   ├── debounce.ts
│   │   └── searchCache.ts
│   │
│   ├── auth.tsx                      # Firebase Auth helpers
│   ├── firebase.ts                   # Firebase config
│   ├── openFoodFacts.ts              # OpenFoodFacts API wrapper
│   ├── performance-utils.ts          # Performance optimization utils
│   ├── profile-store.ts              # Profile state management
│   ├── rankResults.ts                # Search ranking logic
│   ├── searchEngine.ts               # Search engine implementation
│   ├── utils.ts                      # Common utilities
│   └── validation.ts                 # Form validation
│
├── node_modules/                     # Dependencies (auto-generated)
│
├── 📁 public/                        # Static assets
│   ├── generic-food-product.png
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
│
├── 📁 services/
│   └── geminiClient.ts               # Google Gemini API client
│
├── 📁 styles/
│   └── globals.css                   # Additional global styles
│
├── .env.local                        # Environment variables (local)
├── .gitignore                        # Git ignore rules
├── components.json                   # shadcn/ui config
├── firebase-debug.log                # Firebase debug logs
├── middleware.ts                     # Next.js middleware
├── next-env.d.ts                     # Next.js TypeScript declarations
├── next.config.js                    # Next.js configuration
├── next.config.mjs                   # Next.js configuration (ES modules)
├── package-lock.json                 # npm lock file
├── package.json                      # Project dependencies & scripts
├── pnpm-lock.yaml                    # pnpm lock file
├── postcss.config.mjs                # PostCSS configuration
├── README.md                         # Project documentation
├── tailwind.config.ts                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

<br/>

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Gemini AI (Server-side only)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOOGLE_API_KEY=your_gemini_api_key

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Firebase Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# OpenFoodFacts API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_OPENFOODFACTS_API_URL=https://world.openfoodfacts.org/api/v0

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Application URL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **⚠️ Important Notes:**
> - `GOOGLE_API_KEY` is **server-only** (used in `route.ts` files)
> - Any environment variable change requires **redeployment** on Vercel
> - Never commit `.env.local` to version control

<br/>

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/amitakr0027/FOODSNAP.git

# Navigate to project directory
cd FOODSNAP

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<br/>

## 🧪 How to Use FoodSnap & Verify Gemini API

FoodSnap is a production-deployed AI food analysis platform powered by **Gemini 3 Flash**. The system is designed so that reviewers can verify core AI functionality in **under 2 minutes**, without setup.

---

## 🔹 OPTION 1: Fastest Check (Live Deployment – Recommended)

**Best for:** Reviewers who want instant verification with **zero setup**.

### 🌐 Live App
**👉 [https://foodsnap-plum.vercel.app](https://foodsnap-plum.vercel.app)**

### How to Use:
1. **Open the link** in your browser
2. **Select or load a product** (e.g., "Kurkure")
3. **Navigate to the Analysis screen**
4. FoodSnap automatically:
   - Sends product data to Gemini 3 Flash
   - Generates an AI Health Score
   - Displays ingredient-based insights
   - Produces multilingual & human-readable explanations

**✔ If insights load → Gemini API is working in production**

---

## 🔹 OPTION 2: Direct Gemini API Health Check (No UI)

**Best for:** Developers who want to test the backend AI independently of the UI.

### 🔮 Gemini Analyze API

```
POST https://foodsnap-plum.vercel.app/api/gemini/analyze-product
```

### ✅ Google Colab Test (Recommended)

**Where to run:** [Google Colab](https://colab.research.google.com) (Free, No Installation Required)

**Steps:**
1. Open 👉 **[https://colab.research.google.com](https://colab.research.google.com)**
2. Click **"New Notebook"**
3. **Paste the code below** into a cell
4. Click **"Run"** (▶️ button) or press `Shift + Enter`

```python
import requests

url = "https://foodsnap-plum.vercel.app/api/gemini/analyze-product"

payload = {
    "productName": "Kurkure",
    "ingredients": "Corn meal, vegetable oil, spices, salt"
}

r = requests.post(url, json=payload)
print(f"Status Code: {r.status_code}")
print(f"Response: {r.json()}")
```

**Expected Result:**

```json
{
  "success": true,
  "healthScore": 35,
  "insights": {
    "summary": "...",
    "positives": [...],
    "concerns": [...],
    "recommendation": "..."
  }
}
```

### 📌 This Confirms:
- ✅ Gemini 3 Flash is active
- ✅ API keys are valid
- ✅ Server-side inference works on Vercel

---

### 🖥️ Alternative: Terminal/Command Line Test

**Where to run:** Your local terminal or command prompt

```bash
curl -X POST https://foodsnap-plum.vercel.app/api/gemini/analyze-product \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Kurkure",
    "ingredients": "Corn meal, vegetable oil, spices, salt"
  }'
```

---

### 🐍 Alternative: Python Script (Local Machine)

**Where to run:** Any Python environment on your computer

**Steps:**
1. Save the code below as `test_foodsnap.py`
2. Run: `python test_foodsnap.py`

```python
import requests

url = "https://foodsnap-plum.vercel.app/api/gemini/analyze-product"

payload = {
    "productName": "Kurkure",
    "ingredients": "Corn meal, vegetable oil, spices, salt"
}

response = requests.post(url, json=payload)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
```

---

## 🔹 OPTION 3: Gemini Conversational AI Check (Chat Intelligence)

**Best for:** Testing reasoning, personalization, and empathy (more advanced than scoring).

### 🧠 Gemini Chat API

```
POST https://foodsnap-plum.vercel.app/api/gemini/chat
```

### ✅ Google Colab Test

**Where to run:** [Google Colab](https://colab.research.google.com)

**Steps:**
1. Open 👉 **[https://colab.research.google.com](https://colab.research.google.com)**
2. Click **"New Notebook"**
3. **Paste the code below**
4. Click **"Run"**

```python
import requests

url = "https://foodsnap-plum.vercel.app/api/gemini/chat"

payload = {
    "productName": "Kurkure Masala Munch",
    "ingredients": "Corn meal, edible vegetable oil, spices, salt",
    "healthScore": 35,
    "userMessage": "Can I eat this daily?",
    "userContext": {
        "ageGroup": "Adult",
        "conditions": ["High BP"],
        "goal": "Weight loss"
    },
    "conversationHistory": []
}

r = requests.post(url, json=payload)
print(f"Status Code: {r.status_code}")
print(f"Response:\n{r.json()}")
```

**Expected Output:**
- ✅ Friendly, human tone
- ✅ Health-aware reasoning
- ✅ Practical advice tailored to user context
- ✅ No medical claims or dangerous advice

### 📌 This Confirms:
- ✅ Gemini 3 Flash reasoning capabilities
- ✅ Personalization based on user health profile
- ✅ Safe and responsible AI responses

---

## 🧑‍💻 OPTION 4: Local Setup (For Deep Reviewers)

**Best for:** Reviewers who want to run the complete stack locally and inspect the code.

### 🔹 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm** (fast, deterministic package manager)

```bash
npm install -g pnpm
```

---

### 🔹 Clone & Install

**Where to run:** Your local terminal

```bash
# Clone the repository
git clone https://github.com/amitakr0027/FOODSNAP.git

# Navigate to project directory
cd FOODSNAP

# Install dependencies
pnpm install
```

---

### 🔹 Environment Setup

Create a `.env.local` file in the root directory:

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Gemini AI (Server-side only)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOOGLE_API_KEY=your_gemini_api_key

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Firebase Configuration (Optional for local testing)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# OpenFoodFacts API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_OPENFOODFACTS_API_URL=https://world.openfoodfacts.org/api/v0

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Application URL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 🔹 Run Locally

```bash
pnpm dev
```

**App runs at:** 👉 **[http://localhost:3000](http://localhost:3000)**

---

### 🔹 Local API Test

**Where to run:** Terminal (while `pnpm dev` is running)

```bash
curl -X POST http://localhost:3000/api/gemini/analyze-product \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Kurkure",
    "ingredients": "Corn meal, oil, spices, salt"
  }'
```

**✔ Confirms:** Local Gemini inference is working

---

## 🧠 Design Decisions (Why This Works Reliably)

<table>
<tr>
<td width="50%">

### 🔒 **Security**
- **POST-only APIs** (secure by default)
- **Server-side API keys** (never exposed to frontend)
- **Vercel Node runtime** (stable for AI SDKs)

</td>
<td width="50%">

### ✅ **Reliability**
- **Strict prompt discipline** (prevents hallucinated formats)
- **Colab-first testing** (judge-friendly, Google-native)
- **pnpm for reproducible builds**

</td>
</tr>
</table>

<br/>

## 🏗️ Architecture & Design Decisions

<table>
<tr>
<td>

### 🔐 **Security First**
- Server-only AI keys
- No frontend key exposure
- Secure Firebase authentication

</td>
<td>

### ⚡ **Performance**
- App Router for optimal routing
- pnpm for fast installs
- Optimized component rendering

</td>
</tr>
<tr>
<td>

### 🎯 **Clean Architecture**
- Separation of UI, services, and logic
- Type-safe with TypeScript
- Modular component structure

</td>
<td>

### 🤖 **AI Reliability**
- Strict prompt engineering
- Structured output validation
- Fallback error handling

</td>
</tr>
</table>

<br/>

## 🧑‍💻 Development Workflow

```bash
# Development
pnpm dev          # Start dev server

# Building
pnpm build        # Production build
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript validation
```

### Deployment Strategy

| Environment | Branch | Auto-Deploy |
|-------------|--------|-------------|
| **Production** | `main` | ✅ Yes |
| **Preview** | Feature branches | ✅ Yes |
| **Local** | N/A | Manual |

> **Note:** Environment changes always require redeployment

<br/>

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br/>

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<br/>

## 🙏 Acknowledgments

- [OpenFoodFacts](https://world.openfoodfacts.org/) for comprehensive food database
- [Google Gemini](https://ai.google.dev/) for powerful AI capabilities
- [Vercel](https://vercel.com) for seamless deployment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components

<br/>

---

<div align="center">

### ❤️ Built with passion for healthier living

**If you found this helpful, please consider giving it a ⭐**

Made by [Amit Kumar](https://github.com/amitakr0027)

</div>
