# ⚡ Quick Deploy Guide - TL;DR

**Time needed:** 15 minutes | **Difficulty:** Easy

---

## 🚀 5-Step Deployment

### Step 1: Create GitHub Account
👉 [github.com/signup](https://github.com/signup)

### Step 2: Create Repository
1. Click "+" → "New repository"
2. Name: `skill-up-app`
3. Click "Create repository"

### Step 3: Push Your Code

```bash
# In your project folder, run these commands:

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skill-up-app.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

### Step 4: Deploy to Vercel

1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Click "Continue with GitHub"
3. Click "Add New..." → "Project"
4. Select your `skill-up-app` repository
5. Click "Import"

### Step 5: Add Environment Variables

In Vercel, add these 8 variables:

| Variable Name | Where to Get It |
|---------------|-----------------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `VITE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `SUPABASE_URL` | Same as VITE_SUPABASE_URL |
| `SUPABASE_ANON_KEY` | Same as VITE_SUPABASE_ANON_KEY |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `SUPABASE_DB_URL` | Supabase → Settings → Database → Connection string |
| `GEMINI_API_KEY` | Same as VITE_GEMINI_API_KEY |

**Click "Deploy"** and wait 3 minutes! ✅

---

## 🎯 Test Your Deployment

Visit: `https://your-app-name.vercel.app`

**Quick test:**
1. ✅ Welcome screen loads
2. ✅ Can sign up/login
3. ✅ Dashboard displays
4. ✅ **Map shows in Community Resources** (wait 5 seconds)
5. ✅ Career assessment works
6. ✅ Learning modules load

---

## 🔄 Update Your App Later

```bash
# Make changes in your code editor
# Then run:

git add .
git commit -m "What you changed"
git push

# Vercel auto-deploys in 2-3 minutes!
```

---

## 🆘 Common Issues

**Build Failed?**
→ Check environment variables in Vercel settings

**Map Not Showing?**
→ Hard refresh: `Ctrl+Shift+R` and wait 5 seconds

**404 Errors?**
→ Check `vercel.json` is in your repository

**Need Help?**
→ See full guide: [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md)

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All 8 env variables added
- [ ] Deployment successful
- [ ] App accessible at Vercel URL
- [ ] Map working in Community Resources
- [ ] Can sign up and login
- [ ] All features tested

---

**You're live! 🎉 Share your URL!**

`https://your-app-name.vercel.app`

---

**Need detailed instructions?** → [VERCEL_DEPLOY_GUIDE.md](./VERCEL_DEPLOY_GUIDE.md)
