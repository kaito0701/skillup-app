# 🚀 Complete Vercel Deployment Guide - Step by Step

## 📋 Prerequisites

Before you start, you'll need:

- [ ] GitHub account (free) - [Sign up here](https://github.com/signup)
- [ ] Vercel account (free) - [Sign up here](https://vercel.com/signup)
- [ ] Git installed on your computer
- [ ] Your SKILL-UP app code ready

---

## 🎯 Overview

**What we'll do:**
1. Prepare your code for deployment
2. Create a GitHub repository
3. Push your code to GitHub
4. Connect GitHub to Vercel
5. Configure environment variables
6. Deploy!
7. Test your live app

**Time needed:** 15-20 minutes

---

## Step 1: Prepare Your Code

### 1.1 Create Required Files

You already have these files, but let's verify:

**Check that these files exist:**
- [ ] `.gitignore` - Prevents sensitive files from being uploaded
- [ ] `.env.example` - Template for environment variables
- [ ] `vercel.json` - Vercel configuration
- [ ] `package.json` - Project dependencies

### 1.2 Create `.gitignore` (if missing)

Create a file named `.gitignore` in your project root:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Vercel
.vercel
```

### 1.3 Create `.env.example`

Create a file named `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Note: Copy this file to .env and fill in your actual values
# Never commit the .env file to Git!
```

### 1.4 Verify `vercel.json`

Your `vercel.json` should already have the CSP headers for the map. It should look like this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://*.supabase.co; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob: https://*.tile.openstreetmap.org; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.tile.openstreetmap.org https://generativelanguage.googleapis.com; frame-src 'none'; object-src 'none';"
        }
      ]
    }
  ]
}
```

---

## Step 2: Create GitHub Repository

### 2.1 Sign in to GitHub

1. Go to [github.com](https://github.com)
2. Sign in to your account (or create one if needed)

### 2.2 Create New Repository

1. Click the **"+"** button in top-right corner
2. Select **"New repository"**

### 2.3 Configure Repository

Fill in the form:

- **Repository name**: `skill-up-app` (or your preferred name)
- **Description**: `SKILL-UP - Online Micro-learning and Career Guidance Platform`
- **Visibility**: Choose **Public** or **Private**
- **DO NOT** check "Add a README file"
- **DO NOT** add .gitignore (we already have one)
- **DO NOT** choose a license yet

### 2.4 Click "Create repository"

GitHub will show you a page with setup instructions. Keep this page open!

---

## Step 3: Initialize Git Locally

### 3.1 Open Terminal/Command Prompt

**On Windows:**
- Press `Win + R`
- Type `cmd` and press Enter
- Navigate to your project folder:
  ```bash
  cd C:\path\to\your\skill-up-project
  ```

**On Mac/Linux:**
- Open Terminal
- Navigate to your project folder:
  ```bash
  cd /path/to/your/skill-up-project
  ```

### 3.2 Initialize Git Repository

Run these commands one by one:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - SKILL-UP app with map fix"
```

### 3.3 Connect to GitHub

**Copy the commands from your GitHub page** (they look like this):

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/skill-up-app.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### 3.4 Verify Upload

1. Go back to your GitHub repository page
2. Refresh the page
3. You should see all your files!

---

## Step 4: Connect Vercel to GitHub

### 4.1 Sign in to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (if new) or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 4.2 Import Project

1. On Vercel dashboard, click **"Add New..."**
2. Select **"Project"**
3. You'll see "Import Git Repository"

### 4.3 Find Your Repository

1. Look for your repository in the list
2. If you don't see it, click **"Adjust GitHub App Permissions"**
3. Grant access to the repository
4. Click **"Import"** next to your repository

---

## Step 5: Configure Project Settings

### 5.1 Project Settings

Vercel will auto-detect your settings:

- **Framework Preset**: Vite ✅ (auto-detected)
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run build` ✅ (auto-detected)
- **Output Directory**: `dist` ✅ (auto-detected)
- **Install Command**: `npm install` ✅ (auto-detected)

**Don't change these!** ✅

### 5.2 Add Environment Variables

**This is the most important step!** Click **"Environment Variables"** section.

Add these variables one by one:

#### Variable 1: VITE_SUPABASE_URL
- **Name**: `VITE_SUPABASE_URL`
- **Value**: Your Supabase project URL (from Supabase dashboard)
- Example: `https://abcdefghijklmnop.supabase.co`

#### Variable 2: VITE_SUPABASE_ANON_KEY
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon public key
- Find it in: Supabase → Settings → API → Project API keys → `anon` `public`

#### Variable 3: VITE_GEMINI_API_KEY
- **Name**: `VITE_GEMINI_API_KEY`
- **Value**: Your Google Gemini API key
- Get it from: [Google AI Studio](https://aistudio.google.com/app/apikey)

#### Variable 4: SUPABASE_URL (for backend)
- **Name**: `SUPABASE_URL`
- **Value**: Same as VITE_SUPABASE_URL

#### Variable 5: SUPABASE_ANON_KEY (for backend)
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: Same as VITE_SUPABASE_ANON_KEY

#### Variable 6: SUPABASE_SERVICE_ROLE_KEY (for backend)
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your Supabase service role key
- Find it in: Supabase → Settings → API → Project API keys → `service_role` `secret`
- ⚠️ **KEEP THIS SECRET!** Never share it publicly!

#### Variable 7: SUPABASE_DB_URL (for backend)
- **Name**: `SUPABASE_DB_URL`
- **Value**: Your Supabase database URL
- Find it in: Supabase → Settings → Database → Connection string → URI
- Example: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

#### Variable 8: GEMINI_API_KEY (for backend)
- **Name**: `GEMINI_API_KEY`
- **Value**: Same as VITE_GEMINI_API_KEY

### 5.3 Verify Environment Variables

You should have **8 environment variables** total:
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] VITE_GEMINI_API_KEY
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] SUPABASE_DB_URL
- [ ] GEMINI_API_KEY

---

## Step 6: Deploy!

### 6.1 Click "Deploy"

Once environment variables are set, click the big **"Deploy"** button!

### 6.2 Wait for Build

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build your app
4. Deploy to production

**This takes 2-5 minutes.** ⏱️

You'll see:
- ✅ Installing dependencies...
- ✅ Building...
- ✅ Deploying...

### 6.3 Deployment Complete!

When done, you'll see:
- 🎉 **Congratulations!** 
- Your app URL: `https://your-app-name.vercel.app`

---

## Step 7: Test Your Deployment

### 7.1 Visit Your App

1. Click the **"Visit"** button or your deployment URL
2. Your app should load!

### 7.2 Test Core Features

#### Test 1: Welcome Screen
- [ ] Welcome screen loads
- [ ] Language selector works
- [ ] Animations play smoothly

#### Test 2: Authentication
- [ ] Can access signup page
- [ ] Can create account (or use existing)
- [ ] Can log in
- [ ] Redirects to dashboard

#### Test 3: Dashboard
- [ ] Dashboard loads with greeting
- [ ] All menu items visible
- [ ] Bottom navigation works

#### Test 4: Career Assessment
- [ ] Can start assessment
- [ ] Questions load from AI
- [ ] Can submit answers
- [ ] Results display

#### Test 5: Learning Modules
- [ ] Module list loads
- [ ] Can open a module
- [ ] Lessons display
- [ ] Can mark complete

#### Test 6: **COMMUNITY RESOURCES (THE MAP!)**
- [ ] Navigate to Community Resources
- [ ] **Wait 5 seconds**
- [ ] Map displays with tiles ✅
- [ ] Blue marker visible (TESDA)
- [ ] Green marker visible (Career Expo)
- [ ] Can click markers
- [ ] Popups show info
- [ ] Can zoom/pan

#### Test 7: Profile
- [ ] Profile screen loads
- [ ] Shows user info
- [ ] Settings accessible

#### Test 8: Feedback
- [ ] Feedback button visible on screens
- [ ] Can open feedback form
- [ ] Can submit feedback

#### Test 9: Admin (if applicable)
- [ ] Can access admin login
- [ ] Admin dashboard loads
- [ ] Analytics work
- [ ] Can manage resources

### 7.3 Test on Mobile

1. Open your phone browser
2. Visit your Vercel URL
3. Test key features:
   - [ ] Responsive layout
   - [ ] Touch navigation works
   - [ ] Map works on mobile
   - [ ] Animations smooth

### 7.4 Check Browser Console

1. Press **F12** (or right-click → Inspect)
2. Go to **Console** tab
3. Look for errors

**Expected for map:**
```
Leaflet loaded successfully
Map initialized successfully
```

**No errors about:**
- ❌ "Map container not found"
- ❌ "L is not defined"

---

## Step 8: Configure Custom Domain (Optional)

### 8.1 Buy a Domain

If you want a custom domain like `skill-up.com`:
1. Buy domain from: Namecheap, GoDaddy, Google Domains
2. Go to Vercel → Your Project → Settings → Domains
3. Click "Add"
4. Enter your domain
5. Follow DNS configuration instructions

### 8.2 Free Vercel Domain

Your free domain is already live:
- `https://your-app-name.vercel.app`

You can customize it:
1. Go to Settings → Domains
2. Click your domain
3. Edit the subdomain

---

## 🎉 Deployment Complete!

Your SKILL-UP app is now live on the internet! 🚀

### Your URLs:

- **Production**: `https://your-app-name.vercel.app`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/skill-up-app`
- **Vercel Dashboard**: `https://vercel.com/YOUR_USERNAME/skill-up-app`

---

## 🔄 Making Updates

### When you make changes to your code:

```bash
# 1. Save your changes in your code editor

# 2. Add changes to git
git add .

# 3. Commit changes
git commit -m "Description of what you changed"

# 4. Push to GitHub
git push

# 5. Vercel automatically deploys! (takes 2-3 minutes)
```

**That's it!** Vercel automatically rebuilds when you push to GitHub.

---

## 🐛 Troubleshooting

### Issue: Build Failed

**Solution:**
1. Check build logs in Vercel dashboard
2. Look for error message
3. Common issues:
   - Missing environment variables
   - Syntax errors in code
   - Missing dependencies

### Issue: Map Doesn't Show

**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Wait 5 seconds for Leaflet to load
3. Check console for errors
4. See: [MAP_PRODUCTION_FIX_V2.md](./MAP_PRODUCTION_FIX_V2.md)

### Issue: API Calls Failing

**Solution:**
1. Verify environment variables in Vercel
2. Check Supabase is accessible
3. Check API quotas (Gemini)

### Issue: 404 Errors on Refresh

**Solution:**
- Already fixed in `vercel.json` with rewrites
- If still happening, check `vercel.json` is deployed

### Issue: Environment Variables Not Working

**Solution:**
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Verify all 8 variables are set
3. Click **"Redeploy"** button in Deployments tab

---

## 📊 Monitor Your App

### Vercel Dashboard

Access at: `https://vercel.com/YOUR_USERNAME/skill-up-app`

**You can see:**
- 📈 Visitor analytics
- 🚀 Deployment history
- 📊 Performance metrics
- 🐛 Error logs
- ⚙️ Settings

### Supabase Dashboard

Monitor:
- 👥 User signups
- 💾 Database usage
- 📊 API requests
- 🔐 Auth activity

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Dashboard displays
- [ ] Career assessment works (AI)
- [ ] Learning modules load (AI)
- [ ] **Map displays with markers** ✅
- [ ] Feedback submission works
- [ ] Admin dashboard accessible
- [ ] Mobile responsive
- [ ] No console errors
- [ ] All animations work

---

## 🎓 What You've Learned

You now know how to:
- ✅ Use Git version control
- ✅ Push code to GitHub
- ✅ Deploy to Vercel
- ✅ Configure environment variables
- ✅ Set up CI/CD (auto-deploy)
- ✅ Monitor production apps
- ✅ Make updates and redeploy

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Guides](https://guides.github.com/)
- [Supabase Docs](https://supabase.com/docs)

---

## 🆘 Need Help?

**Check these guides:**
1. [MAP_PRODUCTION_FIX_V2.md](./MAP_PRODUCTION_FIX_V2.md) - Map issues
2. [GITHUB_VERCEL_DEPLOYMENT.md](./GITHUB_VERCEL_DEPLOYMENT.md) - Deployment troubleshooting
3. [MAP_TROUBLESHOOTING.md](./MAP_TROUBLESHOOTING.md) - Map debugging

**GitHub Issues:**
- Create an issue in your repository
- Describe the problem
- Include error messages

---

## 🎉 Congratulations!

Your SKILL-UP app is now live and accessible worldwide! 🌍

**Share your app:**
- Send the URL to friends: `https://your-app-name.vercel.app`
- Add to your portfolio
- Include in your class assignment

**You did it! 🚀✨**

---

## Quick Command Reference

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Making updates
git add .
git commit -m "Your message"
git push

# Check status
git status

# View commit history
git log --oneline
```

---

**Ready to deploy? Follow the steps above! Good luck! 🍀**
