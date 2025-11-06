# 🚀 Deploying SKILL-UP to GitHub & Vercel

Complete step-by-step guide to deploy your app from Figma Make to GitHub and Vercel.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- [ ] GitHub account ([Sign up here](https://github.com/join))
- [ ] Vercel account ([Sign up here](https://vercel.com/signup))
- [ ] Supabase account ([Sign up here](https://supabase.com))
- [ ] Google AI Studio account for Gemini API ([Get key here](https://makersuite.google.com/app/apikey))
- [ ] Git installed on your computer ([Download here](https://git-scm.com/downloads))
- [ ] Node.js installed (v18 or higher) ([Download here](https://nodejs.org/))

---

## Part 1: Set Up Supabase Project

### Step 1: Create New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `skill-up-app`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your users
   - **Pricing Plan**: Free tier is fine
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### Step 2: Create Database Table

1. In your Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Paste this SQL and click **"Run"**:

```sql
-- Create the key-value store table
CREATE TABLE IF NOT EXISTS kv_store_4192bdc4 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_4192bdc4(key);

-- Enable Row Level Security
ALTER TABLE kv_store_4192bdc4 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access"
  ON kv_store_4192bdc4
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Step 3: Get Supabase Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **"API"** tab
3. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...` (long string)
   - **service_role key**: `eyJhbGci...` (different long string - keep this SECRET!)

### Step 4: Deploy Edge Function

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. After downloading the code (see Part 2), navigate to your project folder:
```bash
cd skill-up-app
```

4. Link to your Supabase project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
   - Find `YOUR_PROJECT_REF` in your Supabase project URL: `https://YOUR_PROJECT_REF.supabase.co`

5. Deploy the Edge Function:
```bash
supabase functions deploy make-server-4192bdc4
```

6. Set Edge Function secrets:
```bash
supabase secrets set GEMINI_API_KEY="your-gemini-api-key-here"
```

---

## Part 2: Download Code from Figma Make

### Option A: Manual Download

1. In Figma Make, select all your code files
2. Copy the entire project structure to your local computer
3. Maintain the same folder structure as shown in the file tree

### Option B: Use the File Structure

Create a new folder on your computer and recreate this structure:

```
skill-up-app/
├── components/
│   ├── admin/
│   ├── figma/
│   └── ui/
├── supabase/
│   └── functions/
│       └── server/
├── styles/
├── utils/
│   └── supabase/
├── guidelines/
├── .env.example
├── .gitignore
├── App.tsx
├── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

Copy all your files from Figma Make into this structure.

---

## Part 3: Update Configuration Files

### Step 1: Update Supabase Info

Edit `/utils/supabase/info.tsx`:

```typescript
// Replace with YOUR Supabase project details
export const projectId = "YOUR_PROJECT_REF"; // e.g., "abcdefgh"
export const publicAnonKey = "YOUR_ANON_KEY"; // Long string starting with eyJ...
```

### Step 2: Create Environment File

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` with your credentials:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **NEVER commit `.env` to GitHub!** It's already in `.gitignore`.

---

## Part 4: Push to GitHub

### Step 1: Initialize Git Repository

```bash
# Navigate to your project folder
cd skill-up-app

# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: SKILL-UP mobile learning platform"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Fill in:
   - **Repository name**: `skill-up-app`
   - **Description**: "AI-powered mobile learning platform for Filipino students"
   - **Visibility**: Public or Private (your choice)
   - ⚠️ **DO NOT** check "Initialize with README" (you already have files)
4. Click **"Create repository"**

### Step 3: Push Code to GitHub

GitHub will show you commands - use these:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/skill-up-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

🎉 Your code is now on GitHub!

---

## Part 5: Deploy to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find your `skill-up-app` repository
5. Click **"Import"**

### Step 2: Configure Project

1. **Framework Preset**: Vercel should auto-detect "Vite"
2. **Root Directory**: Leave as `./`
3. **Build Command**: `npm run build` (auto-filled)
4. **Output Directory**: `dist` (auto-filled)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your anon key from Supabase |

⚠️ **DO NOT** add `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` here! 
These are already set in Supabase Edge Functions.

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. 🎉 Your app is live!

Vercel will give you a URL like: `https://skill-up-app.vercel.app`

---

## Part 6: Verify Deployment

### Test User Flow

1. Visit your Vercel URL
2. Click **"Sign Up"** → Create account
3. Should successfully create account and redirect to dashboard
4. Take career assessment
5. View learning modules (should be AI-generated)
6. Submit feedback

### Test Admin Flow

1. Click **"Admin Portal"** from welcome screen
2. Login:
   - Email: `admin@skillup.com`
   - Password: `admin123`
3. View dashboard metrics
4. Manage users
5. View analytics

### Check for Errors

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab - API calls should succeed (status 200)

If you see errors:
- ✅ Verify Supabase credentials are correct
- ✅ Check Edge Function is deployed
- ✅ Verify environment variables in Vercel

---

## Part 7: Custom Domain (Optional)

### Add Your Own Domain

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Enter your domain (e.g., `skillup.yourdomain.com`)
4. Follow Vercel's DNS configuration instructions
5. Wait for DNS to propagate (5-60 minutes)

---

## 🔧 Troubleshooting

### Issue: "User not found" after signup

**Solution**: Check that Edge Function is deployed:
```bash
supabase functions list
```

Should show: `make-server-4192bdc4`

Redeploy if needed:
```bash
supabase functions deploy make-server-4192bdc4
```

### Issue: "Failed to fetch" errors

**Solution**: 
1. Check Supabase project is running (not paused)
2. Verify `VITE_SUPABASE_URL` in Vercel env vars
3. Check CORS is enabled in Edge Function (already done in code)

### Issue: AI features not working

**Solution**: Verify Gemini API key is set:
```bash
supabase secrets list
```

Should show: `GEMINI_API_KEY`

Set if missing:
```bash
supabase secrets set GEMINI_API_KEY="your-key"
```

### Issue: Build fails on Vercel

**Solution**:
1. Check `package.json` has all dependencies
2. Verify Node version (should be 18+)
3. Check build logs for specific error
4. Ensure no `.env` is committed (use env vars in Vercel)

### Issue: Interactive map doesn't show (Community Resources screen)

**Solution**: Already fixed! The map now works in production.
- Leaflet CSS is in `index.html`
- CSP headers configured in `vercel.json`
- See [MAP_DEPLOYMENT_FIX.md](./MAP_DEPLOYMENT_FIX.md) for details

If map still doesn't work after deployment:
1. Hard refresh browser (Ctrl+Shift+R)
2. Check browser console for errors
3. Wait 5 seconds for Leaflet to load
4. See [MAP_TROUBLESHOOTING.md](./MAP_TROUBLESHOOTING.md)

### Issue: Admin login fails

**Solution**: The admin account is auto-created on first login attempt. Just try logging in with the default credentials and it will be created.

---

## 📊 Monitoring Your App

### Vercel Analytics

1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. View page views, visitors, performance

### Supabase Logs

1. Go to Supabase Dashboard
2. Click **"Logs"** → **"Edge Functions"**
3. View API requests and errors

### Error Tracking

Add error tracking (optional):
- [Sentry](https://sentry.io) for error monitoring
- [LogRocket](https://logrocket.com) for session replay

---

## 🔒 Security Checklist

Before making your app public:

- [ ] Change admin password from default
- [ ] Review all environment variables
- [ ] Verify `.env` is in `.gitignore`
- [ ] Check Supabase RLS policies are enabled
- [ ] Add rate limiting (Vercel Edge Config)
- [ ] Enable Vercel security headers (already in `vercel.json`)
- [ ] Set up monitoring and alerts
- [ ] Backup database regularly

---

## 🎯 Next Steps

### After Deployment:

1. **Test thoroughly** on different devices
2. **Share the link** with friends/classmates for feedback
3. **Monitor usage** via Vercel Analytics
4. **Update your portfolio** with the live link
5. **Document** any issues you encounter

### Future Enhancements:

- Add email notifications (using Resend or SendGrid)
- Implement password reset flow
- Add social login (Google, Facebook)
- Set up automated backups
- Add real-time features (Supabase Realtime)
- Implement push notifications (PWA)

---

## 📝 Updating Your App

### To Push Updates:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys on push!
```

### To Update Edge Function:

```bash
# After changing server code
supabase functions deploy make-server-4192bdc4
```

---

## 🆘 Getting Help

### Resources:

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/

### Support:

- Vercel Discord: https://vercel.com/discord
- Supabase Discord: https://discord.supabase.com/
- GitHub Issues: Create issues in your repo

---

## ✅ Deployment Checklist

Use this to verify everything is set up:

**Supabase:**
- [ ] Project created
- [ ] Database table created (`kv_store_4192bdc4`)
- [ ] Edge Function deployed
- [ ] Secrets configured (GEMINI_API_KEY)
- [ ] Credentials copied

**GitHub:**
- [ ] Repository created
- [ ] Code pushed
- [ ] `.env` NOT committed
- [ ] `.gitignore` includes `.env`

**Vercel:**
- [ ] Project imported from GitHub
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Live URL works

**Testing:**
- [ ] User signup/login works
- [ ] Career assessment works (AI)
- [ ] Learning modules load (AI)
- [ ] Progress tracking works
- [ ] Community map displays
- [ ] Feedback submission works
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] User management works
- [ ] Analytics charts display

---

## 🎉 Success!

Your SKILL-UP app is now live on the internet! 

**Share your live link:**
- Add to your resume/CV
- Include in academic portfolio
- Share with potential employers
- Post on LinkedIn
- Add to GitHub README

**Example README badge:**
```markdown
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-app.vercel.app)
```

---

**Questions?** Check the other documentation files:
- `README.md` - Project overview
- `DEPLOYMENT.md` - General deployment info
- `DEV_GUIDE.md` - Development guide
- `ADMIN_GUIDE.md` - Admin features

**Good luck with your deployment! 🚀**
