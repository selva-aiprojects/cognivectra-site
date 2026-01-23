# Troubleshooting Guide - Local Development

## Common Issues and Solutions

### Issue 1: Dev Server Won't Start

**Symptoms:**
- `npm run dev` fails or doesn't start
- Port already in use error
- Module not found errors

**Solutions:**

1. **Check if dependencies are installed:**
   ```bash
   npm install
   ```

2. **Check if port 5173 is already in use:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :5173
   
   # Kill the process if needed (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

3. **Try a different port:**
   ```bash
   npm run dev -- --port 3000
   ```

4. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

### Issue 2: Blank Page or White Screen

**Symptoms:**
- Browser shows blank page
- Console shows errors

**Solutions:**

1. **Check browser console (F12):**
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify environment variables:**
   - Check `.env` file exists in project root
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Restart dev server after changing `.env`

3. **Check Supabase connection:**
   - Verify Supabase URL is correct
   - Check if Supabase project is active
   - Verify API keys are valid

### Issue 3: "Cannot find module" Errors

**Symptoms:**
- Import errors in console
- Module resolution failures

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   # Should be v18 or higher
   ```

3. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Issue 4: Supabase Connection Errors

**Symptoms:**
- "Supabase environment variables are missing" warning
- API calls failing
- Authentication not working

**Solutions:**

1. **Verify `.env` file:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Check file location:**
   - `.env` must be in project root (same level as `package.json`)
   - Not in `src/` or other subdirectories

3. **Restart dev server:**
   - Vite only reads `.env` on startup
   - Stop server (Ctrl+C) and restart: `npm run dev`

4. **Check Supabase project:**
   - Go to Supabase Dashboard
   - Verify project is active
   - Check API settings for correct URL and keys

### Issue 5: Routing Not Working

**Symptoms:**
- 404 errors on routes
- Links not working
- Page refreshes show 404

**Solutions:**

1. **Check `vite.config.js`:**
   - Should have React plugin configured
   - No special routing config needed for Vite

2. **Verify React Router setup:**
   - Check `src/main.jsx` has `BrowserRouter`
   - Check `src/App.jsx` has routes defined

3. **For production builds:**
   - Configure server to serve `index.html` for all routes
   - Vercel/Netlify handle this automatically

### Issue 6: Edge Function Not Working

**Symptoms:**
- Publishing fails
- "Function not found" errors
- 404 errors from Edge Function

**Solutions:**

1. **Verify Edge Function is deployed:**
   - Go to Supabase Dashboard → Edge Functions
   - Check `publish-social` function exists
   - Verify it's deployed (not just saved)

2. **Check Edge Function secrets:**
   - Go to Project Settings → Edge Functions → Secrets
   - Verify all required secrets are set:
     - `LINKEDIN_ACCESS_TOKEN`
     - `LINKEDIN_PERSON_URN` or `LINKEDIN_COMPANY_URN`
     - (Instagram/Facebook when ready)

3. **Check function logs:**
   - Go to Edge Functions → `publish-social` → Logs
   - Look for error messages
   - Check if secrets are accessible

4. **Test Edge Function directly:**
   ```bash
   # Use the test script
   npm run test:publish 1 blog linkedin
   ```

### Issue 7: Admin Dashboard Not Loading

**Symptoms:**
- Admin page is blank
- Login redirects not working
- Posts not loading

**Solutions:**

1. **Check authentication:**
   - Verify you're logged in
   - Check browser localStorage for Supabase session
   - Try logging out and back in

2. **Check database permissions:**
   - Go to Supabase Dashboard → Authentication → Policies
   - Verify RLS policies allow authenticated users to read posts

3. **Check browser console:**
   - Look for API errors
   - Check Network tab for failed requests
   - Verify Supabase client is initialized

### Issue 8: Publishing Fails Silently

**Symptoms:**
- Click publish but nothing happens
- No error messages
- Status doesn't update

**Solutions:**

1. **Check browser console:**
   - Look for JavaScript errors
   - Check Network tab for failed API calls

2. **Verify Edge Function response:**
   - Check browser Network tab
   - Look for `publish-social` function call
   - Check response for error messages

3. **Check Supabase logs:**
   - Go to Edge Functions → Logs
   - Look for recent invocations
   - Check for error messages

4. **Test credentials:**
   ```bash
   npm run test:publish 1 blog linkedin
   ```

## Quick Diagnostic Steps

### Step 1: Verify Basic Setup

```bash
# Check Node.js version
node --version  # Should be v18+

# Check if dependencies are installed
ls node_modules  # Should show many folders

# Check if .env exists
ls .env  # Should show the file
```

### Step 2: Check Environment Variables

```bash
# Windows PowerShell
Get-Content .env | Select-String "VITE_SUPABASE"

# Should show:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### Step 3: Try Starting Dev Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Check Browser Console

1. Open `http://localhost:5173`
2. Press F12 to open DevTools
3. Check Console tab for errors
4. Check Network tab for failed requests

## Getting Help

If none of these solutions work:

1. **Check the error message:**
   - Copy the exact error from console
   - Check the full stack trace

2. **Verify your setup:**
   - Node.js version
   - npm version
   - Operating system

3. **Check project files:**
   - `package.json` exists
   - `src/` directory has files
   - `vite.config.js` exists

4. **Try clean install:**
   ```bash
   # Remove everything
   rm -rf node_modules package-lock.json
   
   # Reinstall
   npm install
   
   # Start fresh
   npm run dev
   ```

## Common Error Messages

### "Cannot find module 'X'"
- **Solution:** Run `npm install`

### "Port 5173 is already in use"
- **Solution:** Kill the process or use different port

### "Supabase environment variables are missing"
- **Solution:** Check `.env` file and restart dev server

### "Function not found"
- **Solution:** Deploy Edge Function to Supabase

### "Invalid API key"
- **Solution:** Verify Supabase keys in `.env` are correct

### "CORS error"
- **Solution:** Check Supabase CORS settings in dashboard

## Still Having Issues?

1. **Check logs:**
   - Browser console (F12)
   - Terminal where `npm run dev` is running
   - Supabase Edge Function logs

2. **Verify versions:**
   ```bash
   node --version
   npm --version
   ```

3. **Try minimal test:**
   - Create a simple HTML file
   - Test if Vite serves it
   - Gradually add complexity

4. **Check file permissions:**
   - Ensure you have read/write access
   - Check if files are locked by another process
