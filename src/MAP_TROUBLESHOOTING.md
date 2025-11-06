# 🗺️ Interactive Map Troubleshooting Guide

## ✅ Fixes Applied for Production Deployment

### What Was Fixed:

1. **Added Leaflet CSS to `index.html`** - Ensures styles load before map initialization
2. **Added integrity and crossorigin attributes** - Better security and reliability for CDN resources
3. **Improved error handling** - Console logs and user-friendly error messages
4. **Fixed timing issues** - Synchronous script loading with delayed initialization
5. **Enhanced map container** - Explicit height with inline styles for reliability
6. **Better cleanup** - Prevents memory leaks when navigating away

### Why Maps Fail in Production:

- **CSP restrictions** - Some hosts block external resources
- **Build optimization** - Vite may strip dynamic imports
- **Timing issues** - Scripts load differently in production
- **CDN availability** - Network issues or CDN downtime

**The map should now work in both development AND production (Vercel/Netlify)!** ✅

---

## 🔧 Quick Fix Steps

### 1. Restart Your Dev Server

```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Clear Browser Cache

- **Chrome/Edge**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Firefox**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Or open DevTools → Network tab → Check "Disable cache"

### 3. Check if Map Works

1. Navigate to "Community Resources" screen
2. You should see the map with markers for:
   - TESDA Manila Training Center
   - Metro Manila Career Expo 2025

---

## 🐛 If Map Still Doesn't Work

### Check Browser Console

Open DevTools (F12) and look for errors:

**Common Errors:**

1. **"L is not defined"**
   - Leaflet script hasn't loaded yet
   - Solution: Wait a moment and refresh

2. **Map container has no height**
   - CSS issue
   - The map container should have `min-h-[400px]` class

3. **Tiles not loading (gray map)**
   - Network issue or CORS
   - Check your internet connection
   - Try refreshing the page

4. **"Map container is already initialized"**
   - Multiple instances trying to mount
   - Solution: Navigate away and back to the screen

---

## 🔍 Verify Setup

### Check These Files:

1. **index.html** - Should have Leaflet CSS:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin="" />
```

2. **package.json** - Should have leaflet dependency:
```json
"leaflet": "^1.9.4",
"@types/leaflet": "^1.9.8"
```

3. **CommunityResourcesScreen.tsx** - Should load Leaflet dynamically

---

## 🧪 Test the Map

### Expected Behavior:

✅ **Map displays**: Interactive OpenStreetMap tiles  
✅ **Markers show**: Custom pin markers with colors  
✅ **Popups work**: Click markers to see resource details  
✅ **Pan/Zoom**: Map is interactive  
✅ **Responsive**: Works on mobile screens  

### Default Resources:

If no resources are in the database, you'll see:

1. **TESDA Manila Training Center** (Blue marker)
   - Location: Intramuros, Manila
   - Coordinates: 14.5906, 120.9736

2. **Metro Manila Career Expo 2025** (Green marker)
   - Location: SM Megamall, Mandaluyong
   - Coordinates: 14.5854, 121.0565

---

## 💡 Additional Tips

### For Better Performance:

1. **Keep the map screen open** - Don't navigate away immediately after loading
2. **Wait for tiles to load** - Initial load may take a few seconds
3. **Check internet connection** - Map tiles load from OpenStreetMap servers

### For Development:

1. **Hot reload may break map** - Refresh browser after code changes
2. **Component cleanup** - Map properly unmounts when navigating away
3. **Multiple map instances** - Automatically cleaned up to prevent memory leaks

---

## 🚀 Advanced: Alternative Leaflet Import

If the CDN approach doesn't work, you can use the npm package directly:

### Option 1: Import Leaflet CSS in main.tsx

Add to `/main.tsx`:
```typescript
import 'leaflet/dist/leaflet.css';
```

Then restart dev server:
```bash
npm run dev
```

### Option 2: Import in CommunityResourcesScreen

Add to top of `/components/CommunityResourcesScreen.tsx`:
```typescript
import 'leaflet/dist/leaflet.css';
```

---

## 🔧 Emergency Fix: Recreate Map Container

If all else fails, try this manual fix:

1. Navigate to Community Resources
2. Open Browser Console (F12)
3. Run this command:
```javascript
// Force remove all leaflet elements
document.querySelectorAll('[class*="leaflet"]').forEach(el => el.remove());
// Then refresh the page
location.reload();
```

---

## ✅ Success Indicators

You'll know the map is working when you see:

1. ✅ Interactive map tiles (street view)
2. ✅ Colored pin markers on the map
3. ✅ Ability to zoom in/out
4. ✅ Ability to pan around
5. ✅ Click markers to see popup info
6. ✅ Map fills the container (not blank/white space)

---

## 📞 Still Having Issues?

### Check These:

1. **Node version**: Should be 18+ (`node --version`)
2. **NPM version**: Latest is best (`npm --version`)
3. **Dependencies installed**: Run `npm install`
4. **Port conflicts**: Try different port with `vite --port 3000`

### Debug Commands:

```bash
# Check if leaflet is installed
npm list leaflet

# Reinstall leaflet
npm uninstall leaflet @types/leaflet
npm install leaflet @types/leaflet

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

---

## 🎯 What Was Fixed

**Before**: Map wouldn't display because Leaflet CSS wasn't loading properly in local development.

**After**: Leaflet CSS is now included in `index.html`, ensuring styles load before the map initializes.

**Why it works**: The CSS link in the `<head>` ensures Leaflet styles are available immediately, rather than being dynamically injected by JavaScript.

---

## 🌐 Production Deployment (Vercel/Netlify)

### After Deploying, If Map Still Doesn't Show:

1. **Check Browser Console in Production**
   - Open your deployed site
   - Press F12 → Console tab
   - Look for Leaflet errors

2. **Common Production Issues:**

   **Issue: "Refused to load script"**
   - **Cause**: Content Security Policy (CSP) blocking CDN
   - **Fix**: Add CSP headers in `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: https://*.tile.openstreetmap.org; connect-src 'self' https://*.tile.openstreetmap.org;"
           }
         ]
       }
     ]
   }
   ```

   **Issue: Map container shows but no tiles**
   - **Cause**: Network blocking tile requests
   - **Fix**: Check Network tab in DevTools for failed requests
   - **Workaround**: Try a different tile provider

   **Issue: Map works locally but not on Vercel**
   - **Cause**: Build optimization removing Leaflet
   - **Fix**: Already applied (CSS in index.html + integrity checks)

3. **Verify Deployment:**

   After pushing to GitHub and Vercel deploys:
   - Visit your site
   - Navigate to Community Resources
   - Wait 3-5 seconds for map to load
   - You should see blue/green markers

4. **Force Refresh on Deployed Site:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - This clears cached assets

### Alternative: Use NPM Package Instead of CDN

If CDN continues to fail in production, switch to npm package:

1. **Install Leaflet** (already in package.json):
```bash
npm install leaflet @types/leaflet
```

2. **Import CSS in `/main.tsx`**:
```typescript
import 'leaflet/dist/leaflet.css';
```

3. **Import Leaflet in component**:
```typescript
import L from 'leaflet';
// Remove the dynamic script loading
```

This bundles Leaflet with your app instead of loading from CDN.

---

## 🌐 Production Note

**With the fixes applied**, the map will work in production (Vercel/Netlify) because:
- ✅ Leaflet CSS loads from index.html (before React)
- ✅ Script has integrity check for security
- ✅ Error handling shows helpful messages
- ✅ Proper timing prevents race conditions
- ✅ Map container has explicit height

**This fix ensures it works in both local development AND production deployment!**

---

## 🧪 Testing After Deploy

### On Vercel:

1. Deploy to Vercel (push to GitHub)
2. Wait for deployment to complete
3. Visit your live site
4. Navigate to "Community Resources"
5. Wait 3-5 seconds
6. ✅ You should see the interactive map with markers

### If it still doesn't work:

1. Check console for errors
2. Try the CSP header fix above
3. Consider switching to npm package approach
4. Check Vercel logs for build errors

---

**The map should now work! 🗺️✨**

If you see the map with blue and green markers, you're all set! 🎉

### 📸 What Success Looks Like:

- ✅ Interactive OpenStreetMap tiles visible
- ✅ Blue marker for TESDA Manila Training Center
- ✅ Green marker for Metro Manila Career Expo
- ✅ Clickable markers with popup info
- ✅ Pan and zoom controls working
- ✅ Map responds to touch on mobile
