# 🎓 SKILL-UP - AI-Powered Learning Platform

> Mobile-first micro-learning and career guidance platform for Filipino students and job seekers

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-app.vercel.app)
[![Built with React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Powered by AI](https://img.shields.io/badge/AI-Gemini-orange)](https://ai.google.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black)](https://vercel.com)

![SKILL-UP Screenshot](https://via.placeholder.com/1200x630/6366f1/ffffff?text=SKILL-UP+Mobile+Learning+Platform)

---

## ✨ Features

### 🎯 For Students & Job Seekers

- **AI-Powered Career Assessment** - Personalized career recommendations using Google Gemini AI
- **Micro-Learning Modules** - Bite-sized lessons on in-demand skills
- **Progress Tracking** - XP system, levels, and achievement badges
- **Interactive Quizzes** - Test your knowledge after each lesson
- **Community Resources** - Interactive map with training centers and job fairs
- **Bilingual Support** - Switch between English and Tagalog
- **Mobile-First Design** - Beautiful, responsive UI optimized for phones

### 🔧 For Administrators

- **User Management** - View, edit, and manage user accounts
- **Learning Analytics** - Track completion rates and engagement
- **Feedback System** - Collect and manage user feedback
- **Resource Management** - Add/edit community resources
- **Reports & Export** - Generate CSV and PDF reports
- **Real-time Metrics** - Dashboard with key statistics

---

## 🚀 Live Demo

**🌐 [View Live App](https://your-app.vercel.app)**

### Demo Credentials

**User Account:**
- Create your own via Sign Up

**Admin Panel:**
- Email: `admin@skillup.com`
- Password: `admin123`
- Access: Click "Admin Portal" from welcome screen

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS v4 |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Server** | Hono (lightweight web framework) |
| **AI** | Google Gemini API |
| **Maps** | Leaflet |
| **Charts** | Recharts |
| **Animation** | Motion (Framer Motion) |
| **UI Components** | ShadCN UI |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 📱 Screenshots

### User App
| Welcome Screen | Dashboard | Career Assessment |
|:---:|:---:|:---:|
| ![Welcome](https://via.placeholder.com/300x600/6366f1/ffffff?text=Welcome) | ![Dashboard](https://via.placeholder.com/300x600/8b5cf6/ffffff?text=Dashboard) | ![Assessment](https://via.placeholder.com/300x600/ec4899/ffffff?text=Assessment) |

### Admin Dashboard
| Overview | User Management | Analytics |
|:---:|:---:|:---:|
| ![Overview](https://via.placeholder.com/400x300/6366f1/ffffff?text=Admin+Dashboard) | ![Users](https://via.placeholder.com/400x300/8b5cf6/ffffff?text=User+Management) | ![Analytics](https://via.placeholder.com/400x300/f59e0b/ffffff?text=Analytics) |

---

## 🎥 Demo Video

[Add a demo video link or GIF here]

---

## 🏃 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/skill-up-app.git
cd skill-up-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# VITE_SUPABASE_URL=your-url
# VITE_SUPABASE_ANON_KEY=your-key

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Full Deployment Guide

See [GITHUB_VERCEL_DEPLOYMENT.md](./GITHUB_VERCEL_DEPLOYMENT.md) for complete deployment instructions.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Project overview and setup |
| [GITHUB_VERCEL_DEPLOYMENT.md](./GITHUB_VERCEL_DEPLOYMENT.md) | Complete deployment guide |
| [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) | Fast deployment checklist |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | Admin dashboard guide |
| [DEV_GUIDE.md](./DEV_GUIDE.md) | Developer documentation |
| [COMMANDS.md](./COMMANDS.md) | Helpful command reference |
| [LOCALIZATION_GUIDE.md](./LOCALIZATION_GUIDE.md) | Translation guide |
| [ANIMATION_SHOWCASE.md](./ANIMATION_SHOWCASE.md) | Animation features |

---

## 🎯 Project Goals

This project was created as an academic assignment to demonstrate:

✅ Full-stack web development  
✅ AI integration (Google Gemini)  
✅ Database design and management  
✅ RESTful API development  
✅ User authentication and authorization  
✅ Responsive mobile-first design  
✅ Data visualization  
✅ Internationalization (i18n)  
✅ Modern development practices  

---

## 🌟 Key Features Deep Dive

### AI-Powered Career Assessments

Uses Google Gemini AI to:
- Analyze user's interests, skills, and goals
- Generate personalized career path recommendations
- Suggest relevant learning modules
- Adapt content based on user responses

### Micro-Learning System

- **5 Complete Courses**: Social Media Marketing, Content Creation, Communication, Time Management, Canva Design
- **Interactive Lessons**: Engaging content with examples
- **Quizzes**: Test knowledge retention
- **Progress Tracking**: XP, levels, and badges
- **Certificates**: Downloadable completion certificates

### Admin Dashboard

- **User Analytics**: Track user engagement and progress
- **Content Management**: Manage learning modules and resources
- **Feedback System**: Review and respond to user feedback
- **Reports**: Export data as CSV or PDF
- **Real-time Metrics**: Live dashboard with key statistics

---

## 🔒 Security

- Session-based authentication
- Password hashing (SHA-256)
- SQL injection prevention
- XSS protection (React default)
- CORS configuration
- Environment variable security
- Row-level security (Supabase)

---

## 📊 Project Stats

- **Lines of Code**: 7,000+
- **Components**: 25+ user screens, 7 admin screens
- **API Endpoints**: 30+
- **Languages**: English & Tagalog
- **Database Tables**: 1 flexible KV store
- **Dependencies**: 40+ npm packages

---

## 🚧 Roadmap

Future enhancements planned:

- [ ] Email verification for new users
- [ ] Password reset flow
- [ ] Social login (Google, Facebook)
- [ ] Push notifications (PWA)
- [ ] Real-time chat/messaging
- [ ] Video lessons
- [ ] Peer-to-peer learning
- [ ] Gamification enhancements
- [ ] Mobile app (React Native)
- [ ] More AI features

---

## 🤝 Contributing

This is an academic project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Educational Use**: Free to use for learning and academic purposes.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Email: your.email@example.com
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- Built with [Figma Make](https://figma.com) - AI-powered web app builder
- UI components from [ShadCN UI](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Maps powered by [Leaflet](https://leafletjs.com/)
- Animations by [Motion](https://motion.dev/)
- Backend by [Supabase](https://supabase.com/)
- AI by [Google Gemini](https://ai.google.dev/)
- Deployed on [Vercel](https://vercel.com/)

Special thanks to:
- My professor for the assignment
- Classmates for feedback and testing
- The open-source community

---

## 📞 Support

Having issues? Check out:

- [Documentation](./README.md)
- [Deployment Guide](./GITHUB_VERCEL_DEPLOYMENT.md)
- [Common Commands](./COMMANDS.md)
- [GitHub Issues](https://github.com/YOUR_USERNAME/skill-up-app/issues)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

---

**Made with ❤️ for Filipino students and job seekers**

[![Built with Figma Make](https://img.shields.io/badge/Built%20with-Figma%20Make-blue)](https://figma.com)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green)](https://supabase.com)
[![AI by Gemini](https://img.shields.io/badge/AI%20by-Gemini-orange)](https://ai.google.dev/)
