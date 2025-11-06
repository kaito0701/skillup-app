# 🛠️ SKILL-UP Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Code editor (VS Code recommended)
- Git (optional)

### Installation

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📁 File Structure

```
/
├── App.tsx                   # Main router & app logic
├── main.tsx                  # React entry point
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
│
├── components/               # All React components
│   ├── [Screen].tsx          # User screens
│   ├── admin/                # Admin screens
│   ├── ui/                   # ShadCN UI components
│   └── figma/                # System components (don't edit)
│
├── utils/
│   └── locales.ts            # Translation strings (EN/TL)
│
└── styles/
    └── globals.css           # Global CSS & design tokens
```

---

## 🎨 Styling System

### Tailwind CSS v4

Use utility classes for most styling:

```tsx
<div className="flex gap-4 p-6 rounded-lg bg-white">
  <button className="px-4 py-2 bg-blue-500 text-white">Click</button>
</div>
```

### Typography (DO NOT OVERRIDE)

Font sizes, weights, and line heights are pre-defined in `globals.css`:

```css
/* Already defined - don't add these classes! */
h1, h2, h3, h4, h5, h6
p, span, li, a
```

**❌ Don't use:**
- `text-xl`, `text-2xl`, etc. (font-size)
- `font-bold`, `font-semibold`, etc. (font-weight)
- `leading-tight`, `leading-relaxed`, etc. (line-height)

**✅ Use these instead:**
- HTML semantic tags: `<h1>`, `<h2>`, `<p>`, etc.
- Custom classes if really needed

### Color System

Primary colors are defined in `globals.css`:

```css
--color-primary: #FF6B35;      /* Orange */
--color-secondary: #4ECDC4;    /* Teal */
--color-accent: #FFD93D;       /* Yellow */
--color-success: #6BCF7F;      /* Green */
--color-error: #F56565;        /* Red */
```

Use Tailwind utilities:
- `bg-[#FF6B35]` or `bg-[var(--color-primary)]`
- `text-[#4ECDC4]` or `text-[var(--color-secondary)]`

---

## 🧩 Component Architecture

### Screen Components

Each screen is a separate component:

```tsx
// components/MyScreen.tsx
import { AnimatedButton } from './AnimatedButton';

export function MyScreen({ onNavigate }) {
  return (
    <div className="min-h-screen p-4">
      <h1>My Screen</h1>
      <AnimatedButton onClick={() => onNavigate('home')}>
        Go Home
      </AnimatedButton>
    </div>
  );
}
```

### Reusable Components

**AnimatedButton** - Button with hover glow effect:

```tsx
import { AnimatedButton } from './components/AnimatedButton';

<AnimatedButton 
  onClick={handleClick}
  variant="primary" // or "secondary", "outline", "ghost"
  className="w-full"
>
  Click Me
</AnimatedButton>
```

**AnimatedCard** - Card with hover lift effect:

```tsx
import { AnimatedCard } from './components/AnimatedCard';

<AnimatedCard>
  <h3>Card Title</h3>
  <p>Card content here</p>
</AnimatedCard>
```

**FeedbackButton** - Floating feedback button:

```tsx
import { FeedbackButton } from './components/FeedbackButton';

<FeedbackButton onNavigate={onNavigate} />
```

**LanguageSelector** - EN/TL toggle:

```tsx
import { LanguageSelector } from './components/LanguageSelector';

<LanguageSelector language={language} setLanguage={setLanguage} />
```

---

## 🌐 Localization

### Using Translations

Import the locales and access by language:

```tsx
import { locales } from './utils/locales';

function MyComponent({ language }) {
  const t = locales[language];
  
  return (
    <div>
      <h1>{t.welcome.title}</h1>
      <p>{t.welcome.subtitle}</p>
    </div>
  );
}
```

### Adding New Translations

Edit `/utils/locales.ts`:

```typescript
export const locales = {
  en: {
    myScreen: {
      title: "My Title",
      description: "My description"
    }
  },
  tl: {
    myScreen: {
      title: "Aking Titulo",
      description: "Aking paglalarawan"
    }
  }
};
```

See [LOCALIZATION_GUIDE.md](./LOCALIZATION_GUIDE.md) for full details.

---

## ✨ Animations

### Motion (Framer Motion)

Import and use motion components:

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

### Common Animation Patterns

**Fade in:**
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
```

**Slide up:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
```

**Stagger children:**
```tsx
<motion.div variants={container}>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

See [ANIMATION_SHOWCASE.md](./ANIMATION_SHOWCASE.md) for examples.

---

## 🗺️ Interactive Maps

### Leaflet Integration

Maps use Leaflet with React:

```tsx
// Map is loaded from CDN in index.html
// Use in components:

useEffect(() => {
  if (typeof window !== 'undefined' && window.L) {
    const map = L.map('map').setView([14.5995, 120.9842], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    L.marker([14.5995, 120.9842])
      .addTo(map)
      .bindPopup('Manila');
  }
}, []);

return <div id="map" className="h-96 w-full" />;
```

**Important:** Leaflet CSS and JS are loaded from CDN in `index.html`.

---

## 🔄 Routing

Navigation is handled in `App.tsx`:

```tsx
const [currentScreen, setCurrentScreen] = useState('welcome');

const navigateToScreen = (screen: string) => {
  setCurrentScreen(screen);
};

// In screens:
<Button onClick={() => onNavigate('dashboard')}>
  Go to Dashboard
</Button>
```

### Screen Names

**User Screens:**
- `welcome` - Welcome/onboarding
- `login` - Login form
- `signup` - Signup form
- `dashboard` - Main dashboard
- `assessment` - Career quiz
- `assessment-results` - Quiz results
- `modules` - Module list
- `lesson` - Lesson content
- `community` - Map & resources
- `profile` - User profile
- `settings` - App settings
- `feedback` - Feedback form

**Admin Screens:**
- `admin-login` - Admin login
- `admin-dashboard` - Admin overview
- `admin-users` - User management
- `admin-analytics` - Charts & stats
- `admin-resources` - Resource management
- `admin-reports` - Reports & export
- `admin-feedback` - Feedback inbox

---

## 📊 Data Management

Currently using **mock data** stored in each component.

### Example Mock Data

```tsx
const mockLessons = [
  {
    id: 1,
    title: "Introduction to Marketing",
    duration: "15 min",
    completed: true
  },
  {
    id: 2,
    title: "Social Media Strategy",
    duration: "20 min",
    completed: false
  }
];
```

### Converting to Real Database

To use Supabase or another backend:

1. **Create database tables**
2. **Set up API client** in `/utils/database.ts`
3. **Replace mock data** with API calls:

```tsx
// Before (mock):
const [lessons, setLessons] = useState(mockLessons);

// After (real API):
const [lessons, setLessons] = useState([]);

useEffect(() => {
  async function fetchLessons() {
    const data = await api.getLessons();
    setLessons(data);
  }
  fetchLessons();
}, []);
```

---

## 🎯 Icons

Use **Lucide React** for icons:

```tsx
import { Home, User, Settings, Menu } from 'lucide-react';

<button>
  <Home className="w-5 h-5" />
  Home
</button>
```

Browse all icons: [lucide.dev](https://lucide.dev)

---

## 🧪 Testing Features Locally

### User Flow Testing

1. Start at `welcome` screen
2. Click "Get Started" → `login`
3. Login → `dashboard`
4. Test each feature:
   - Career Assessment
   - Learning Modules
   - Community Resources
   - Profile
   - Settings
   - Feedback button (floating)

### Admin Flow Testing

1. Navigate to `/admin` (change URL or add button)
2. Login with admin credentials
3. Test admin screens:
   - Dashboard metrics
   - User management
   - Analytics charts
   - Resource management
   - Reports & export
   - Feedback inbox

---

## 🐛 Debugging Tips

### Common Issues

**"Module not found"**
- Run `npm install`
- Check import paths (case-sensitive)
- Restart dev server

**Styles not applying**
- Check `globals.css` is imported in `main.tsx`
- Verify Tailwind classes are correct
- Clear browser cache

**Animations not working**
- Ensure `motion` package is installed
- Check import: `import { motion } from 'motion/react'`
- Verify no conflicting CSS

**Map not loading**
- Check Leaflet CDN in `index.html`
- Ensure `#map` div has height
- Check browser console for errors

### Browser DevTools

- **Elements Tab**: Inspect DOM and styles
- **Console Tab**: View errors and logs
- **Network Tab**: Check API calls and assets
- **React DevTools**: Inspect component state (install extension)

---

## 📦 Building for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

Build output goes to `/dist` folder. Deploy this folder to your hosting platform.

---

## 🔐 Environment Variables

Create `.env` file (don't commit to Git):

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_API_URL=https://api.example.com
```

Access in code:

```tsx
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

**Note:** Must start with `VITE_` to be accessible in browser!

---

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Motion Docs](https://motion.dev)
- [ShadCN UI](https://ui.shadcn.com)
- [Vite Guide](https://vitejs.dev)

---

## ✅ Development Checklist

When adding new features:

- [ ] Create component in correct folder
- [ ] Add route in `App.tsx` (if screen)
- [ ] Add translations to `locales.ts`
- [ ] Use semantic HTML (`<h1>`, `<p>`, etc.)
- [ ] Don't override typography classes
- [ ] Add animations where appropriate
- [ ] Include `FeedbackButton` on user screens
- [ ] Test on mobile viewport (responsive)
- [ ] Check accessibility (keyboard navigation, screen readers)

---

Need help? Check the documentation or ask questions! 🚀
