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
├── 📁 app/
│   ├── 📁 (auth)/                    # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── 📁 api/                       # Backend API routes
│   │   └── gemini/
│   │       ├── analyze-product/route.ts
│   │       ├── chat/route.ts
│   │       ├── structure-label/route.ts
│   │       └── gemini-test/route.ts
│   │
│   ├── 📁 analysis/                  # Analysis result pages
│   ├── 📁 scan/                      # Barcode scanning flow
│   ├── 📁 profile/                   # User profile & preferences
│   │
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── page.tsx                      # Landing page
│
├── 📁 components/
│   ├── ui/                           # shadcn/ui components
│   ├── scanner/                      # Barcode scanning UI
│   ├── analysis/                     # Analysis display components
│   └── optimized/                    # Performance-focused components
│
├── 📁 lib/
│   ├── auth.ts                       # Authentication helpers
│   ├── firebase.ts                   # Firebase configuration
│   ├── openFoodFacts.ts              # OpenFoodFacts API wrapper
│   ├── search/                       # Search & caching utilities
│   └── utils.ts                      # Common utilities
│
├── 📁 services/
│   └── geminiClient.ts               # Gemini SDK integration
│
├── 📁 hooks/                         # Custom React hooks
│
├── 📁 public/                        # Static assets
│
├── 📁 styles/
│   └── globals.css
│
├── middleware.ts                     # Next.js middleware
├── next.config.mjs                   # Next.js configuration
├── package.json
├── pnpm-lock.yaml
└── README.md
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

## 🧪 Testing Gemini AI Integration

### 1️⃣ **UI-Based Test** (Fastest)

1. Open the [live app](https://foodsnap-plum.vercel.app)
2. Select or scan a product (e.g., "Kurkure")
3. Navigate to Analysis page
4. ✅ AI insights + health score appear automatically

---

### 2️⃣ **Direct API Test** (Recommended for Developers)

**Endpoint:** Analyze Product API

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

**Expected Response:**

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

---

### 3️⃣ **Conversational AI Test** (Reasoning Check)

**Endpoint:** Chat API

```python
import requests

url = "https://foodsnap-plum.vercel.app/api/gemini/chat"

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

response = requests.post(url, json=payload)
print(response.json())
```

✅ **Confirms:** Reasoning, personalization, and safe responses

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
