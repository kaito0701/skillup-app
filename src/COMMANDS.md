# 🛠️ Helpful Commands Reference

Quick reference for common tasks during development and deployment.

---

## 📦 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Git Commands

### Initial Setup
```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/skill-up-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Regular Updates
```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Branches
```bash
# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# Delete branch
git branch -d feature-name
```

---

## 🗄️ Supabase CLI

### Setup
```bash
# Install globally
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref YOUR_PROJECT_REF

# Check status
supabase status
```

### Edge Functions
```bash
# List functions
supabase functions list

# Deploy function
supabase functions deploy make-server-4192bdc4

# Deploy with no verification (faster)
supabase functions deploy make-server-4192bdc4 --no-verify-jwt

# View logs
supabase functions logs make-server-4192bdc4

# Delete function
supabase functions delete make-server-4192bdc4
```

### Secrets Management
```bash
# List all secrets
supabase secrets list

# Set a secret
supabase secrets set SECRET_NAME="value"

# Set Gemini API key
supabase secrets set GEMINI_API_KEY="your-gemini-api-key"

# Set multiple secrets
supabase secrets set KEY1="value1" KEY2="value2"

# Unset a secret
supabase secrets unset SECRET_NAME
```

### Database
```bash
# Run SQL file
supabase db execute -f path/to/file.sql

# Reset database (WARNING: Deletes all data!)
supabase db reset

# Create migration
supabase migration new migration_name

# Push migrations
supabase db push
```

---

## 🚀 Vercel CLI

### Setup
```bash
# Install globally
npm install -g vercel

# Login
vercel login

# Link to project
vercel link
```

### Deployment
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

### Environment Variables
```bash
# Add environment variable
vercel env add VARIABLE_NAME

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME

# Pull environment variables to local
vercel env pull
```

### Domains
```bash
# Add domain
vercel domains add yourdomain.com

# List domains
vercel domains ls

# Remove domain
vercel domains rm yourdomain.com
```

---

## 🧪 Testing Commands

### Run Tests
```bash
# If you add testing later
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Linting (if configured)
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## 📊 Database Queries (Supabase SQL Editor)

### Check Users
```sql
-- View all users
SELECT key, value->>'email', value->>'full_name', value->>'is_admin'
FROM kv_store_4192bdc4
WHERE key LIKE 'user:%';

-- Count total users
SELECT COUNT(*)
FROM kv_store_4192bdc4
WHERE key LIKE 'user:%';

-- View specific user
SELECT *
FROM kv_store_4192bdc4
WHERE key = 'user:USER_ID_HERE';
```

### Check Sessions
```sql
-- View all active sessions
SELECT key, value->>'email', value->>'created_at'
FROM kv_store_4192bdc4
WHERE key LIKE 'session:%';

-- Count active sessions
SELECT COUNT(*)
FROM kv_store_4192bdc4
WHERE key LIKE 'session:%';

-- Delete old sessions (older than 30 days)
DELETE FROM kv_store_4192bdc4
WHERE key LIKE 'session:%'
AND (value->>'created_at')::timestamp < NOW() - INTERVAL '30 days';
```

### Check Feedback
```sql
-- View all feedback
SELECT key, value->>'subject', value->>'status', value->>'created_at'
FROM kv_store_4192bdc4
WHERE key LIKE 'feedback:%'
ORDER BY (value->>'created_at')::timestamp DESC;

-- Count feedback by status
SELECT value->>'status' as status, COUNT(*)
FROM kv_store_4192bdc4
WHERE key LIKE 'feedback:%'
GROUP BY value->>'status';
```

### Cleanup
```sql
-- Delete all sessions (logout everyone)
DELETE FROM kv_store_4192bdc4
WHERE key LIKE 'session:%';

-- Delete specific user
DELETE FROM kv_store_4192bdc4
WHERE key = 'user:USER_ID_HERE';

-- Delete all feedback
DELETE FROM kv_store_4192bdc4
WHERE key LIKE 'feedback:%';

-- DANGER: Delete everything
-- DELETE FROM kv_store_4192bdc4;
```

---

## 🔍 Debugging

### Check Logs
```bash
# Supabase Edge Function logs
supabase functions logs make-server-4192bdc4 --tail

# Vercel deployment logs
vercel logs --follow

# Check local server logs
# (In browser DevTools Console)
```

### Test API Endpoints
```bash
# Using curl
curl -X GET https://YOUR_PROJECT.supabase.co/functions/v1/make-server-4192bdc4/health

# Check if Edge Function is running
curl -X GET https://YOUR_PROJECT.supabase.co/functions/v1/make-server-4192bdc4/health
```

### Common Debug Tasks
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check installed packages
npm list --depth=0

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update packages
npm update
```

---

## 🔧 Maintenance

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name

# Update to latest (may break)
npx npm-check-updates -u
npm install
```

### Backup Database
```bash
# Export data (via Supabase Dashboard)
# Settings → Database → Backups → Create Backup

# Or use SQL
# Run in Supabase SQL Editor:
COPY (SELECT * FROM kv_store_4192bdc4) TO '/tmp/backup.csv' CSV HEADER;
```

### Monitor App
```bash
# Vercel: View analytics
# Dashboard → Your Project → Analytics

# Supabase: View logs
# Dashboard → Your Project → Logs → Edge Functions
```

---

## 🆘 Emergency Commands

### Rollback Deployment (Vercel)
```bash
# List deployments
vercel ls

# Promote a previous deployment
vercel promote DEPLOYMENT_URL
```

### Rollback Edge Function
```bash
# Redeploy previous version
# (Keep old code in git, checkout and redeploy)
git checkout PREVIOUS_COMMIT
supabase functions deploy make-server-4192bdc4
git checkout main
```

### Reset Admin Password
```sql
-- Run in Supabase SQL Editor
-- First, get the user ID
SELECT key, value->>'email'
FROM kv_store_4192bdc4
WHERE value->>'email' = 'admin@skillup.com';

-- Then update password
-- (Password hash for "newpassword123")
UPDATE kv_store_4192bdc4
SET value = jsonb_set(
  value,
  '{password_hash}',
  '"GENERATED_HASH_HERE"'::jsonb
)
WHERE value->>'email' = 'admin@skillup.com';

-- Better: Use the signup flow to create new admin
```

---

## 📝 Quick Reference

### Environment Variables Needed

**Vercel (.env or Vercel Dashboard):**
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Supabase Edge Functions (via CLI):**
```bash
supabase secrets set GEMINI_API_KEY="your-key"
```

### Important URLs

- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google AI Studio**: https://makersuite.google.com/app/apikey
- **GitHub**: https://github.com/YOUR_USERNAME/skill-up-app

---

## 💡 Tips

- Always commit before major changes
- Test locally before pushing
- Keep `.env` in `.gitignore`
- Use environment variables for secrets
- Check logs when things break
- Make small, frequent commits
- Write descriptive commit messages
- Create branches for new features
- Keep documentation updated

---

**Happy coding! 🚀**
