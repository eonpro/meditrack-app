# MediTrack - Medication Inventory Management System

A comprehensive medication inventory management platform built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Current Status

✅ **Phase 1 Complete**: Basic infrastructure is set up and running!

- Next.js application is running at: **http://localhost:3000**
- Login page available at: **http://localhost:3000/login**
- Dashboard with 7 functional tabs ready

## 📋 Features Implemented

- **Authentication System**: Secure login with NextAuth.js
- **Role-Based Access Control**: Admin, Manager, Staff, and Viewer roles
- **Multi-Pharmacy Support**: Mycelium and Angel Pharmacy
- **Dashboard Tabs**:
  - Inventory Management
  - Daily Usage Tracking
  - Supplier Debt Management
  - Purchase Orders
  - Suppliers Directory
  - Licensing Information
  - Reports Generation

## 🔑 Test Credentials

```
Admin: admin@meditrack.com / admin123
Manager: manager@meditrack.com / manager123
Mycelium Staff: mycelium.staff@meditrack.com / staff123
Angel Staff: angel.staff@meditrack.com / staff123
```

## 🛠️ Next Steps

### 1. Set Up Railway PostgreSQL

1. Create a Railway account at [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL database (one-click)
4. Copy the DATABASE_URL from Railway

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="your-railway-postgresql-url-here"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Restart Development Server

```bash
npm run dev
```

## 📦 Project Structure

```
meditrack-app/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard
│   └── login/            # Authentication
├── components/            # React components
│   ├── dashboard/        # Dashboard tabs
│   └── ui/              # Reusable UI
├── lib/                  # Utilities
│   ├── auth.ts          # NextAuth config
│   └── prisma.ts        # Database client
├── prisma/              # Database
│   ├── schema.prisma    # Data models
│   └── seed.ts         # Initial data
└── railway.json         # Deployment config
```

## 🚀 Deployment to Railway

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Railway will auto-detect Next.js
4. Set environment variables in Railway dashboard
5. Deploy!

## 📊 Database Schema

- **Users**: Authentication and role management
- **Pharmacies**: Mycelium and Angel pharmacy data
- **Medications**: 8 medication types (Semaglutide & Tirzepatide)
- **Inventory**: Stock levels per pharmacy
- **UsageRecords**: Daily usage tracking
- **DebtRecords**: Supplier debt management
- **Orders**: Purchase order tracking
- **AuditLog**: Complete change history

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based sessions
- Role-based access control
- Pharmacy-level data isolation
- Audit logging for compliance

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio
```

## 🎯 Business Rules

- **EONMeds**: Owns inventory (cost = $0 for their usage)
- **Pharmacies**: Must pay full cost when using inventory
- **Debt Creation**: Automatic when pharmacies use inventory
- **Reorder Level**: Set at 15 units by default

## 📄 License Information

### Mycelium Pharmacy
Licensed in 10 states: FL, NJ, GA, NC, PA, CO, IL, TN, AZ, NY

### Angel Pharmacy
Licensed in 23 states: FL, OH, NC, IN, PA, RI, IL, DC, GA, AL, AZ, HI, DE, WI, NY, MO, CT, WA, CO, ID, MD, NM, NJ

---

**Ready to continue?** Set up your Railway database and run the migrations to see the full application in action!