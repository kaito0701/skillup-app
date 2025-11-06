# SKILL-UP 🎓

Online Micro-learning and Career Guidance Platform for Filipino Students and Job Seekers

## 🌟 Features

### User App (Mobile-First)
- **Welcome & Authentication**: Onboarding screens with login/signup
- **Dashboard**: Personalized learning hub with progress tracking
- **Career Assessment**: Interactive quiz to discover career paths
- **Micro-learning Modules**: 5 complete courses with lessons and quizzes
  - Social Media Marketing
  - Content Creation
  - Communication Skills
  - Time Management
  - Canva Design
- **Community Resources**: Interactive map with training centers and job fairs
- **Profile & Achievements**: Certificates, badges, and progress tracking
- **Settings**: Account preferences and notifications
- **Feedback System**: Floating button on every screen for instant feedback submission

### Admin Dashboard (Mobile-First) 📱
**NEW: Fully redesigned for mobile!** All admin screens now feature touch-friendly interfaces, smooth animations, and match the user app's design language.

- **Admin Login**: Secure authentication with mobile-optimized form
- **Dashboard Overview**: Key metrics, user stats, and engagement trends
- **User Management**: Monitor users, view progress, search/filter (card-based layout)
- **Learning Analytics**: Visual charts optimized for mobile screens
- **Community Resources Management**: Add/edit/delete training centers and job fairs
- **Reports & Export**: Generate CSV/PDF reports with touch-friendly controls
- **User Feedback Management**: View, search, filter, and manage all user feedback submissions

📚 **Documentation:**
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Complete admin documentation
- [MOBILE_FIRST_REDESIGN.md](./MOBILE_FIRST_REDESIGN.md) - **NEW:** Admin mobile redesign details
- [FEEDBACK_FEATURE.md](./FEEDBACK_FEATURE.md) - Feedback system guide
- [LOCALIZATION_GUIDE.md](./LOCALIZATION_GUIDE.md) - English/Tagalog language support
- [ANIMATION_SHOWCASE.md](./ANIMATION_SHOWCASE.md) - Animation features

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

### First Steps

1. **User App**: Start at the welcome screen → Login or signup
2. **Admin Dashboard**: Navigate to `/admin` → Login with admin credentials
3. **Test Features**: Explore all screens, submit feedback, check admin panel

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool & dev server
- **ShadCN UI** - Component library
- **Lucide React** - Icons
- **Motion (Framer Motion)** - Smooth animations
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Supabase** - Backend database and edge functions
- **Google Gemini AI** - AI-powered career assessments and learning content

## 📱 Mobile Optimized

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-first approach
- PWA-ready architecture
- Works offline (with service worker)

## 📂 Project Structure

```
├── App.tsx                      # Main app component with routing
├── main.tsx                     # Entry point
├── components/                  # User app screens
│   ├── WelcomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── CareerAssessmentScreen.tsx
│   ├── AssessmentResultsScreen.tsx
│   ├── ModuleListScreen.tsx
│   ├── LessonScreen.tsx
│   ├── CommunityResourcesScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── FeedbackScreen.tsx
│   ├── FeedbackButton.tsx       # Floating feedback button
│   ├── FeedbackFooterLink.tsx   # Footer feedback link
│   ├── AnimatedButton.tsx       # Reusable animated button
│   ├── AnimatedCard.tsx         # Reusable animated card
│   ├── LanguageSelector.tsx     # EN/TL language toggle
│   └── LoadingScreen.tsx        # Loading animation
├── components/admin/            # Admin dashboard screens
│   ├── AdminLoginScreen.tsx
│   ├── AdminDashboardScreen.tsx
│   ├── AdminUsersScreen.tsx
│   ├── AdminAnalyticsScreen.tsx
│   ├── AdminResourcesScreen.tsx
│   ├── AdminReportsScreen.tsx
│   └── AdminFeedbackScreen.tsx
├── components/ui/               # ShadCN components
├── utils/
│   ├── locales.ts               # Translation strings (EN/TL)
│   └── supabase.ts              # Database helper functions (optional)
├── styles/
│   └── globals.css              # Global styles & design tokens
└── guidelines/
    └── Guidelines.md            # Design system & coding standards
```

## 🎨 Design Features

- **Beautiful Animations**: Smooth transitions with Motion (Framer Motion)
- **Warm Glow Effects**: Hover effects on buttons and cards
- **Consistent Typography**: Custom font hierarchy in `globals.css`
- **Color System**: Warm, friendly colors optimized for learning
- **Dark Mode Ready**: Design tokens support dark mode
- **Accessible**: WCAG 2.1 AA compliant

## 🌐 Localization

The app supports **English** and **Tagalog**:
- Toggle language with the language selector (🇬🇧/🇵🇭 flag)
- All text content is localized
- Stored in `/utils/locales.ts`
- See [LOCALIZATION_GUIDE.md](./LOCALIZATION_GUIDE.md) for details

## 🔧 Development Tips

### Adding New Screens

1. Create component in `/components/` or `/components/admin/`
2. Add route in `App.tsx`
3. Import and use shared components (AnimatedButton, AnimatedCard, etc.)
4. Add translations to `/utils/locales.ts`

### Working with the Backend

The app is fully integrated with Supabase backend:

1. **API Functions**: All located in `/utils/api.ts`
2. **Server Routes**: Hono server in `/supabase/functions/server/index.tsx`
3. **Database**: Key-value store accessed via `/supabase/functions/server/kv_store.tsx`
4. **AI Integration**: Google Gemini for career assessments and learning modules

All user data, progress, feedback, and community resources are stored in the live database.

### Styling Guidelines

- Use Tailwind CSS classes
- **Don't** use font-size, font-weight, or line-height classes (defined in globals.css)
- Use design tokens from `globals.css`
- Follow z-index hierarchy in [ZINDEX_HIERARCHY.md](./ZINDEX_HIERARCHY.md)

## 🐛 Known Issues

None at the moment! 🎉

## 🚀 Deployment

### 📦 Deploy to GitHub & Vercel

Want to deploy this app to your own domain? Follow our comprehensive guides:

#### Quick Start (15 minutes)
👉 **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Fast-track deployment guide

#### Detailed Guide (Step-by-step)
👉 **[GITHUB_VERCEL_DEPLOYMENT.md](./GITHUB_VERCEL_DEPLOYMENT.md)** - Complete walkthrough with screenshots

**What you'll need:**
- GitHub account (free)
- Vercel account (free)
- Supabase account (free tier)
- Google Gemini API key (free tier)

**Deployment steps:**
1. Set up Supabase project & database
2. Deploy Edge Functions
3. Push code to GitHub
4. Deploy to Vercel
5. Configure environment variables

**Result:** Your app live at `https://your-app.vercel.app` 🎉

---

### 🏗️ Architecture

This app uses **Supabase** for backend services with full CRUD functionality:

- ✅ **User Authentication** - Login/signup with session management
- ✅ **Database** - PostgreSQL with key-value store for users, progress, feedback
- ✅ **Edge Functions** - Hono server running on Supabase Edge Functions
- ✅ **AI Integration** - Google Gemini API for career assessments and content generation
- ✅ **Admin Portal** - Full user management, analytics, and feedback system

---

### 🔑 Default Admin Credentials

```
Email: admin@skillup.com
Password: admin123
```

⚠️ **Important**: Change the admin password after deployment!

The admin account is automatically created on first admin login attempt.

---

### 🧪 Testing the App

1. **User Flow**:
   - Sign up with any email/password
   - Take the career assessment (AI-powered)
   - Browse personalized learning modules (AI-generated)
   - Complete lessons and quizzes
   - Submit feedback via floating button
   - Check profile for badges and achievements

2. **Admin Flow**:
   - Go to Admin Portal from welcome screen
   - Login with admin credentials
   - View user analytics and engagement
   - Manage users (edit/delete)
   - View and respond to feedback
   - Manage community resources
   - Export reports

---

### 🌐 Deployment Options

**Option 1: Vercel (Recommended)**
- ✅ Free tier available
- ✅ Auto-deploy on git push
- ✅ Custom domains
- ✅ Built-in analytics
- 👉 See [GITHUB_VERCEL_DEPLOYMENT.md](./GITHUB_VERCEL_DEPLOYMENT.md)

**Option 2: Netlify**
- ✅ Free tier available
- ✅ Drag-and-drop deployment
- ✅ Continuous deployment
- Same setup as Vercel

**Option 3: Self-Hosted**
- Host frontend anywhere (static hosting)
- Deploy Edge Functions to Supabase
- More control, more setup required

## 🎯 Purpose

This is a prototype developed as a class assignment to demonstrate:
- Mobile app UI/UX design (user-facing)
- Admin dashboard for monitoring and management
- User flow and navigation
- Interactive learning experiences
- Data visualization and analytics
- Philippine-specific career resources
- Full-stack application architecture
- Modern web development practices

## 📄 License

Educational project - Free to use for learning purposes

## 👨‍💻 Development

Built with AI assistance as part of academic coursework, showcasing modern web development practices and mobile-first design principles.

---

**Need help?** Check out the documentation files or run `npm run dev` to start! 🚀
