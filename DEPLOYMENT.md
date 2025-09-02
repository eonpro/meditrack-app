# 🚀 Deployment Guide - MediTrack to Railway

## ✅ Step 1: Git Repository (COMPLETED)
Your code is committed and ready to push!

## 📦 Step 2: Create GitHub Repository

### Option A: Using GitHub CLI (if installed)
```bash
gh repo create meditrack-app --public --source=. --remote=origin --push
```

### Option B: Manual GitHub Setup

1. **Go to GitHub.com** and sign in
2. Click the **"+"** icon → **"New repository"**
3. Fill in:
   - Repository name: `meditrack-app`
   - Description: "Medication Inventory Management System"
   - Set to **Public** (or Private if you prefer)
   - ⚠️ **DO NOT** initialize with README, .gitignore, or license
4. Click **"Create repository"**

5. **Back in your terminal**, run these commands:
```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/meditrack-app.git

# Push the code
git branch -M main
git push -u origin main
```

## 🚂 Step 3: Deploy to Railway

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up/login with GitHub (recommended)

### 2. Create New Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose your `meditrack-app` repository
- Railway will automatically detect Next.js

### 3. Add PostgreSQL Database
- In your Railway project, click **"+ New"**
- Select **"Database"** → **"PostgreSQL"**
- Database will be created instantly

### 4. Connect Database to App
- Click on your app service
- Go to **"Variables"** tab
- Railway automatically provides `DATABASE_URL`
- Add these additional variables:
  ```
  NEXTAUTH_SECRET=<generate-with-command-below>
  NEXTAUTH_URL=https://<your-railway-app-url>
  ```

To generate NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

### 5. Configure Build Settings
- Railway should auto-detect the build commands from `railway.json`
- If not, set:
  - Build Command: `npm run build && npx prisma generate && npx prisma migrate deploy`
  - Start Command: `npm start`

### 6. Deploy
- Click **"Deploy"** 
- Railway will:
  1. Install dependencies
  2. Build the Next.js app
  3. Run database migrations
  4. Start the application

### 7. Run Database Seed (First Time Only)
After deployment, in Railway:
- Click on your app service
- Go to **"Settings"** → **"Deploy"**
- Under "Run command", enter: `npm run db:seed`
- Click "Run"

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Application deployed
- [ ] Database seeded with initial data
- [ ] Application accessible at Railway URL

## 🔗 Your Application URLs

After deployment:
- **Production App**: `https://meditrack-app-production.up.railway.app` (or similar)
- **Database Dashboard**: Available in Railway dashboard

## 🧪 Test Production Deployment

1. Visit your Railway app URL
2. Login with test credentials:
   - Admin: `admin@meditrack.com` / `admin123`
   - Manager: `manager@meditrack.com` / `manager123`
3. Verify all tabs load correctly
4. Test adding medications and recording usage

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify `railway.json` is committed

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check if migrations ran (look for "migrate deploy" in logs)
- Try running migrations manually in Railway console

### Authentication Not Working
- Ensure `NEXTAUTH_SECRET` is set
- Update `NEXTAUTH_URL` to match your Railway domain
- Check browser console for errors

## 📝 Post-Deployment

### Custom Domain (Optional)
1. In Railway project settings
2. Go to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Monitoring
- Railway provides logs and metrics
- Set up error tracking (Sentry) for production
- Configure uptime monitoring

---

**Need help?** Check Railway docs at [docs.railway.app](https://docs.railway.app) or ask in their Discord!
