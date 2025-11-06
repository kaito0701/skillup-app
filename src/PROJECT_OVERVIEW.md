# 📋 SKILL-UP Project Overview

Quick reference for the entire project structure and capabilities.

---

## 🎯 What is SKILL-UP?

A mobile-first micro-learning platform for Filipino students and job seekers, with a complete admin dashboard for monitoring and management.

**Current Status:** ✅ Fully functional prototype with mock data  
**Next Step:** Connect to real database (Supabase or similar)

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| **[README.md](./README.md)** | Project overview, features, quick start |
| **[DEV_GUIDE.md](./DEV_GUIDE.md)** | Complete development guide for coding |
| **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** | Admin dashboard documentation |
| **[QUICK_START.md](./QUICK_START.md)** | How to use the app (user & admin) |
| **[LOCALIZATION_GUIDE.md](./LOCALIZATION_GUIDE.md)** | English/Tagalog translation system |
| **[ANIMATION_SHOWCASE.md](./ANIMATION_SHOWCASE.md)** | Animation examples & patterns |
| **[FEEDBACK_FEATURE.md](./FEEDBACK_FEATURE.md)** | Feedback system guide |
| **[ZINDEX_HIERARCHY.md](./ZINDEX_HIERARCHY.md)** | Z-index layering standards |
| **[guidelines/Guidelines.md](./guidelines/Guidelines.md)** | Design system & coding standards |
| **[Attributions.md](./Attributions.md)** | Credits and licenses |

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **Components:** ShadCN UI
- **Icons:** Lucide React
- **Animation:** Motion (Framer Motion)
- **Maps:** Leaflet
- **Charts:** Recharts
- **Backend:** Mock data (ready for Supabase)

### Folder Structure
```
/
├── App.tsx                    # Router & main logic
├── main.tsx                   # React entry point
├── index.html                 # HTML template
├── package.json               # Dependencies
├── vite.config.ts             # Build config
│
├── components/                # React components
│   ├── WelcomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── ... (17 user screens)
│   │
│   ├── admin/                 # Admin screens
│   │   ├── AdminDashboardScreen.tsx
│   │   └── ... (7 admin screens)
│   │
│   ├── ui/                    # ShadCN components
│   │   └── ... (40+ UI components)
│   │
│   └── figma/                 # System components
│       └── ImageWithFallback.tsx
│
├── utils/
│   └── locales.ts             # EN/TL translations
│
├── styles/
│   └── globals.css            # Global CSS & tokens
│
└── guidelines/
    └── Guidelines.md          # Design standards
```

---

## 🚀 Quick Commands

```bash
# Development
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# View app
open http://localhost:5173         # User app
open http://localhost:5173/admin   # Admin dashboard (add manually)
```

---

## 🎨 Key Features

### User App (17 Screens)
- ✅ Welcome & onboarding
- ✅ Login & signup
- ✅ Dashboard with progress
- ✅ Career assessment quiz
- ✅ 5 learning modules (25+ lessons)
- ✅ Interactive map with resources
- ✅ Profile & achievements
- ✅ Settings & preferences
- ✅ Feedback system (floating button)
- ✅ English/Tagalog localization
- ✅ Smooth animations
- ✅ Mobile-optimized

### Admin Dashboard (7 Screens)
- ✅ Admin login
- ✅ Metrics dashboard
- ✅ User management
- ✅ Learning analytics (charts)
- ✅ Resource management
- ✅ Reports & export (CSV/PDF)
- ✅ Feedback inbox

---

## 🔧 Development Workflow

### 1. Setup
```bash
git clone <repo>
cd skillup-app
npm install
npm run dev
```

### 2. Make Changes
- Edit components in `/components`
- Update translations in `/utils/locales.ts`
- Modify styles in `/styles/globals.css`
- Test in browser

### 3. Add New Screen
1. Create `/components/MyScreen.tsx`
2. Import in `App.tsx`
3. Add route logic
4. Add translations to `locales.ts`

### 4. Deploy
```bash
npm run build
# Deploy /dist folder to hosting platform
```

---

## 📱 Screens Reference

### User Screens

| Screen | Route/State | Description |
|--------|-------------|-------------|
| Welcome | `welcome` | Onboarding splash |
| Login | `login` | User authentication |
| Signup | `signup` | New user registration |
| Dashboard | `dashboard` | Main learning hub |
| Career Assessment | `assessment` | Interactive career quiz |
| Assessment Results | `assessment-results` | Quiz results & recommendations |
| Module List | `modules` | Browse learning modules |
| Lesson | `lesson` | Individual lesson content |
| Community Resources | `community` | Map with training centers |
| Profile | `profile` | User info & achievements |
| Settings | `settings` | App preferences |
| Feedback | `feedback` | Submit feedback form |

### Admin Screens

| Screen | Route/State | Description |
|--------|-------------|-------------|
| Admin Login | `admin-login` | Admin authentication |
| Admin Dashboard | `admin-dashboard` | Metrics overview |
| User Management | `admin-users` | View/manage users |
| Analytics | `admin-analytics` | Charts & insights |
| Resources | `admin-resources` | Manage map resources |
| Reports | `admin-reports` | Generate CSV/PDF |
| Feedback Inbox | `admin-feedback` | View user feedback |

---

## 🌐 Localization

Two languages supported:
- **English** (en)
- **Tagalog** (tl)

Toggle with language selector (🇬🇧/🇵🇭 flag) in header.

All text is in `/utils/locales.ts`:

```typescript
export const locales = {
  en: { /* English strings */ },
  tl: { /* Tagalog strings */ }
};
```

---

## 🎨 Design System

### Colors
- **Primary:** `#FF6B35` (Orange)
- **Secondary:** `#4ECDC4` (Teal)
- **Accent:** `#FFD93D` (Yellow)
- **Success:** `#6BCF7F` (Green)
- **Error:** `#F56565` (Red)

### Typography
Pre-defined in `globals.css` (don't override):
- H1: 2rem, bold
- H2: 1.5rem, semibold
- H3: 1.25rem, semibold
- P: 1rem, normal
- Small: 0.875rem, normal

### Components
- **AnimatedButton** - Button with glow effect
- **AnimatedCard** - Card with lift effect
- **FeedbackButton** - Floating feedback button
- **LanguageSelector** - EN/TL toggle
- **LoadingScreen** - Loading animation

---

## 🔌 Mock Data → Real Database

Currently uses mock data in components. To connect to real database:

### 1. Setup Supabase (or similar)
```bash
npm install @supabase/supabase-js
```

### 2. Create `/utils/database.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 3. Add Environment Variables
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

### 4. Replace Mock Data
```tsx
// Before (mock):
const [users, setUsers] = useState(mockUsers);

// After (real):
const [users, setUsers] = useState([]);

useEffect(() => {
  async function fetchUsers() {
    const { data } = await supabase
      .from('users')
      .select('*');
    setUsers(data);
  }
  fetchUsers();
}, []);
```

---

## 🎯 Database Schema (Recommended)

For production, create these tables:

### users
- id (uuid, primary key)
- email (text, unique)
- name (text)
- role (text: 'user' | 'admin')
- created_at (timestamp)

### progress
- id (uuid, primary key)
- user_id (uuid, foreign key)
- module_id (text)
- lesson_id (text)
- completed (boolean)
- score (integer, optional)
- updated_at (timestamp)

### feedback
- id (uuid, primary key)
- user_id (uuid, foreign key, nullable)
- category (text)
- message (text)
- rating (integer, 1-5)
- status (text: 'new' | 'reviewed' | 'resolved')
- created_at (timestamp)

### resources
- id (uuid, primary key)
- name (text)
- type (text: 'training_center' | 'job_fair')
- address (text)
- latitude (float)
- longitude (float)
- contact (text)
- created_at (timestamp)

---

## ⚡ Performance Tips

- ✅ Images optimized with `ImageWithFallback`
- ✅ Code splitting with React.lazy (if needed)
- ✅ Memoize expensive computations
- ✅ Lazy load map components
- ✅ Use production build for deployment

---

## 🐛 Common Issues

### Map not loading
- Check Leaflet CDN in `index.html`
- Ensure div has height: `className="h-96"`

### Animations laggy
- Reduce motion complexity
- Use `transform` instead of `top/left`
- Enable GPU acceleration

### Build fails
- Run `npm install`
- Check for TypeScript errors
- Verify all imports exist

### Styles not applying
- Check Tailwind class spelling
- Don't override typography (h1, p, etc.)
- Clear browser cache

---

## 📦 Dependencies

### Production
- react, react-dom (18.3.1)
- motion (11.18.0)
- lucide-react (0.344.0)
- recharts (2.12.2)
- leaflet (1.9.4)
- @radix-ui/* (various)
- tailwind-merge, clsx, class-variance-authority

### Development
- vite (5.2.0)
- typescript (5.4.3)
- tailwindcss (4.0.0)
- @vitejs/plugin-react (4.2.1)

---

## 📈 Metrics & Analytics

Ready to track:
- User registrations
- Module completions
- Assessment results
- Feedback submissions
- Resource views
- Session duration
- Active users

Implement with:
- Google Analytics
- Mixpanel
- PostHog
- Custom analytics

---

## 🚀 Deployment Options

### Static Hosting
- **Vercel** - Push to GitHub, auto-deploy
- **Netlify** - Drag & drop `/dist`
- **GitHub Pages** - Free hosting
- **Cloudflare Pages** - Global CDN

### Full-Stack
- **Vercel + Supabase** - Frontend + backend
- **Netlify + Firebase** - Alternative
- **Custom VPS** - Full control

---

## ✅ Production Checklist

Before going live:

- [ ] Connect to real database
- [ ] Add proper authentication
- [ ] Set up environment variables
- [ ] Enable error tracking (Sentry)
- [ ] Add analytics tracking
- [ ] Test on real devices
- [ ] Optimize images
- [ ] Enable HTTPS
- [ ] Set up backups
- [ ] Create privacy policy
- [ ] Test email delivery (for feedback)

---

## 🎓 Learning Resources

- [React Docs](https://react.dev) - React fundamentals
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Motion Docs](https://motion.dev) - Animation library
- [Supabase Guide](https://supabase.com/docs) - Backend setup
- [Vite Guide](https://vitejs.dev) - Build tool

---

## 🤝 Contributing

This is an educational project. To extend:

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

Educational project - Free to use for learning purposes.

See [Attributions.md](./Attributions.md) for third-party credits.

---

## 🎉 You're All Set!

**Start developing:**
```bash
npm run dev
```

**Need help?** Check the documentation files above! 🚀

---

**Last Updated:** November 3, 2025  
**Version:** 1.0.0 (Production-Ready Prototype)
