# FoodSnap 🍎📱

**Scan Smart, Eat Fresh** - Your personal food companion for better eating.

## Overview

FoodSnap is a modern web application that helps users make informed food choices by scanning product barcodes to get instant nutrition insights, ingredient analysis, and health recommendations.

## Features

- 📱 **Instant Barcode Scanning** - Point and scan any product barcode
- 🧠 **AI-Powered Analysis** - Get intelligent health insights
- ⚠️ **Allergen Alerts** - Set dietary restrictions and receive warnings
- ❤️ **Health Scoring** - Comprehensive product healthiness scoring
- 📊 **Scan History** - Track your food choices over time
- ⭐ **Favorites** - Save and compare healthy products

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Database**: Firebase
- **Authentication**: Firebase Auth
- **API**: OpenFoodFacts API
- **AI**: GroqAI for analysis

## Project Structure

\`\`\`
FOODSNAP/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (auth)/                   # Authentication routes
│   ├
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── 📁 components/                   # Reusable components
│   ├── 📁 ui/                       # Basic UI components
│   ├── 📁 auth/                     # Auth components
│   ├── 📁 scanner/                  # Scanner components
│   └── 📁 nutrition/                # Nutrition components
├── 📁 lib/                          # Utilities and config
├── 📁 hooks/                        # Custom React hooks
├── 📁 types/                        # TypeScript definitions
└── 📁 public/                       # Static assets
\`\`\`

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/foodsnap.git
   cd foodsnap
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Fill in your Firebase and API credentials.

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenFoodFacts API
NEXT_PUBLIC_OPENFOODFACTS_API_URL=https://world.openfoodfacts.org/api/v0

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue or contact us at support@foodsnap.app

---

Made with ❤️ for healthier eating
