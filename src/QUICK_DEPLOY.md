# ⚡ Quick Deploy Guide (TL;DR)

Super fast deployment guide if you're familiar with the tools.

---

## 🎯 Prerequisites

```bash
# Install globally
npm install -g supabase vercel
```

Have ready:
- GitHub account
- Vercel account  
- Supabase account
- Google Gemini API key

---

## 🚀 5-Step Deployment

### 1️⃣ Set Up Supabase (5 min)

```bash
# Create project at app.supabase.com
# Run this SQL in SQL Editor:
```

```sql
CREATE TABLE IF NOT EXISTS kv_store_4192bdc4 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_4192bdc4(key);
ALTER TABLE kv_store_4192bdc4 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access"
  ON kv_store_4192bdc4 FOR ALL USING (true) WITH CHECK (true);
```

Copy from Settings → API:
- Project URL
- Anon key
- Service role key

### 2️⃣ Download & Setup Code (2 min)

```bash
# Create project folder
mkdir skill-up-app
cd skill-up-app

# Copy all files from Figma Make here

# Update /utils/supabase/info.tsx with your project ID and anon key

# Create .env
cp .env.example .env
# Edit .env with your Supabase URL and anon key
```

### 3️⃣ Deploy Edge Function (2 min)

```bash
# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy make-server-4192bdc4

# Set secret
supabase secrets set GEMINI_API_KEY="your-gemini-key"
```

### 4️⃣ Push to GitHub (2 min)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/skill-up-app.git
git branch -M main
git push -u origin main
```

### 5️⃣ Deploy to Vercel (2 min)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click Deploy
5. ✅ Done!

---

## 🧪 Test It

```
Visit: https://your-app.vercel.app

User Test:
1. Sign up → Create account
2. Take assessment
3. View modules

Admin Test:
1. Click "Admin Portal"
2. Login: admin@skillup.com / admin123
3. View dashboard
```

---

## 🔧 Common Issues

**"User not found"** → Edge function not deployed
```bash
supabase functions deploy make-server-4192bdc4
```

**"Failed to fetch"** → Wrong Supabase URL in Vercel env vars

**Build fails** → Check Node version is 18+

**AI not working** → Set Gemini API key
```bash
supabase secrets set GEMINI_API_KEY="your-key"
```

---

## 📝 Update App

```bash
# Make changes
git add .
git commit -m "Update description"
git push

# Vercel auto-deploys!
```

Update Edge Function:
```bash
supabase functions deploy make-server-4192bdc4
```

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database table created
- [ ] Edge function deployed
- [ ] Gemini API key set
- [ ] Code updated with Supabase info
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Tested user signup
- [ ] Tested admin login

---

**That's it! Your app is live! 🎉**

Full guide: See `GITHUB_VERCEL_DEPLOYMENT.md`
