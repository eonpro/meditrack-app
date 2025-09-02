# 🚨 URGENT: Reset All Inventory to 0

## Quick Reset Steps (Do This Now!)

### Step 1: Open Railway Dashboard
1. Go to your Railway project: https://railway.app/dashboard
2. Click on your `meditrack-app` service

### Step 2: Open the Shell
1. Click the **"Settings"** tab
2. Scroll down to **"Deploy"** section
3. You'll see a command input field

### Step 3: Run Reset Command
Copy and paste this EXACT command:
```bash
npm run db:reset-inventory
```

Press ENTER to run it.

### Step 4: Verify
After running, you should see:
```
🔄 Resetting all inventory to 0...
✅ Reset X inventory records to 0 stock
```

### Alternative: Complete Database Reset
If the above doesn't work, use this nuclear option:
```bash
npx prisma db push --force-reset && npm run db:seed
```

This will:
- Drop ALL tables
- Recreate them fresh
- Seed with 0 inventory

## After Reset:
- Refresh your MediTrack app page
- All medications should show Stock: 0
- You can then add real inventory values

## If Railway Command Doesn't Work:
Try using Railway CLI locally:
```bash
railway login
railway link
railway run npm run db:reset-inventory
```

The inventory MUST be at 0 for proper tracking!
