# Portfolio Platform - Complete Setup & Deployment Guide

## 🚀 Project Overview

A professional, production-ready portfolio platform with:
- **Better Auth** for secure authentication
- **Google OAuth 2.0** integration
- **MongoDB** for data persistence
- **Admin Dashboard** for content management
- **User Dashboard** with profile management
- **Image & Video Gallery** with CRUD operations
- **Responsive Design** (mobile, tablet, desktop)
- **Dark/Light Theme** support
- **Premium UI** with glassmorphism and animations

---

## 📋 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 18** with Hooks
- **TypeScript 5**
- **Tailwind CSS 3** for styling
- **Framer Motion** for animations
- **Better Auth** client for authentication
- **Lucide React** for icons
- **React Hook Form** for forms
- **React Hot Toast** for notifications
- **Axios** for API requests

### Backend (MongoDB Adapter)
- **Express.js 4** (optional legacy backend)
- **MongoDB Atlas** for cloud database
- **Mongoose 8** for ODM
- **JWT** for token management
- **bcryptjs** for password hashing

---

## 🔧 Prerequisites

Before starting, ensure you have:

1. **Node.js 18+** and **npm** or **yarn**
2. **MongoDB Atlas** account (free tier available)
3. **Google Cloud Console** project
4. **Git** for version control

---

## 📝 Environment Setup

### Step 1: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Web Client credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy **Client ID** and **Client Secret**

### Step 2: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with admin privileges
4. Whitelist your IP (or allow all: `0.0.0.0/0`)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`

### Step 3: Environment Variables

#### Frontend (.env.local)
```bash
# MongoDB
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/?appName=Cluster0
MONGODB_DB=portfolio

# Better Auth
BETTER_AUTH_SECRET=generate-32-character-secret
BETTER_AUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-from-google
GOOGLE_CLIENT_SECRET=your-client-secret-from-google
```

#### Backend (server/.env) - Optional
```bash
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/?appName=Cluster0
MONGODB_DB=portfolio
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ADMIN_EMAILS=masud.dev01@gmail.com,mr3377006@gmail.com,masudranamdra@gmail.com
```

---

## 🚀 Local Development Setup

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd website

# Install frontend dependencies
npm install

# Install backend dependencies (optional)
cd server && npm install && cd ..
```

### 2. Configure Environment

```bash
# Copy example env files
cp .env.example .env.local
cp server/.env.example server/.env

# Edit .env.local with your credentials
# Edit server/.env with your credentials (if using backend)
```

### 3. Start Development

```bash
# Terminal 1: Frontend (Next.js)
npm run dev
# Frontend runs on http://localhost:3000

# Terminal 2: Backend (optional - if needed)
cd server && npm run dev
# Backend runs on http://localhost:5000
```

### 4. Access Application

- **Home**: http://localhost:3000
- **Admin**: http://localhost:3000/admin (log in with admin email)
- **Dashboard**: http://localhost:3000/dashboard (regular user login)
- **Gallery**: http://localhost:3000/gallery/images and /gallery/videos

---

## 🔐 Authentication Flow

### User Registration

1. User visits `/register`
2. Enters email, username, password OR signs in with Google
3. Better Auth creates user in MongoDB
4. If email is in `ADMIN_EMAILS`, user role = 'admin', else 'user'
5. Redirects to `/admin` for admins, `/dashboard` for regular users

### User Login

1. User visits `/login`
2. Enters credentials OR uses Google OAuth
3. Better Auth validates credentials
4. Session created in MongoDB
5. JWT token stored in httpOnly cookie + localStorage (backup)
6. Redirects based on role (admin → /admin, user → /dashboard)

### Google OAuth

1. User clicks "Sign in/up with Google"
2. Redirected to Google login
3. Google redirects back to `/api/auth/callback/google`
4. Better Auth creates/updates user
5. Same redirect logic applies based on role

---

## 📊 Admin Dashboard Features

Only users with emails in `ADMIN_EMAILS` can access `/admin`.

### Available Managers

1. **Projects Manager** - Create/Edit/Delete portfolio projects
2. **Blog Manager** - Create/Edit/Delete blog posts
3. **Articles Manager** - Create/Edit/Delete articles
4. **Skills Manager** - Manage technical skills
5. **Testimonials Manager** - Manage client reviews
6. **Activities Manager** - Create/Edit/Delete events
7. **Image Gallery** - Upload/Edit/Delete images
8. **Video Gallery** - Upload/Edit/Delete videos
9. **Messages Manager** - View contact form submissions

### CRUD Operations

All managers support:
- **Create**: "Add" button opens modal with form
- **Read**: Items displayed in list/grid
- **Update**: Click edit icon to modify
- **Delete**: Confirm & remove item

---

## 👤 User Dashboard Features

Regular users can access `/dashboard` to view:
- Profile picture (from Google or default avatar)
- User name and email
- Account type (admin/user)
- Join date
- Links to galleries and downloads

---

## 🎨 Gallery Features

### Image Gallery (`/gallery/images`)
- View all images in masonry grid
- **Admins can**:
  - Add images (upload via URL)
  - Edit image details
  - Delete images

### Video Gallery (`/gallery/videos`)
- View embedded videos
- Support for:
  - Google Drive videos
  - YouTube videos
- **Admins can**:
  - Add video links
  - Edit video details
  - Delete videos

---

## 🌗 Theme System

- **Default**: Dark mode
- **Toggle**: Click moon/sun icon in navbar
- **Persistence**: Saved in localStorage
- **System preference**: Detected if no saved preference

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub

```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables:
   - Add all `.env.local` variables
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
   - Update `BETTER_AUTH_URL` to your Vercel domain

6. Update Google OAuth redirect URI:
   - Add: `https://your-domain.vercel.app/api/auth/callback/google`

7. Deploy!

```bash
# After deployment, update .env for production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
BETTER_AUTH_URL=https://your-domain.vercel.app
```

### Deploy Backend to Render (Optional)

1. Create `render.yaml` in backend root:

```yaml
services:
  - type: web
    name: portfolio-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
```

2. Push to GitHub
3. Connect on [Render Dashboard](https://render.com)
4. Set environment variables
5. Deploy!

### MongoDB Atlas Configuration for Production

1. Create database user for production
2. Whitelist Vercel IP (or `0.0.0.0/0`)
3. Ensure connection string is correct
4. Test connection before deploying

---

## 🔒 Security Best Practices

✅ **Implemented**:
- Password hashing with bcryptjs
- JWT in httpOnly cookies
- Admin-only API endpoints
- CORS configured
- Rate limiting (configure if needed)

⚠️ **Additional Steps**:
- Keep `BETTER_AUTH_SECRET` secure (32+ chars, random)
- Rotate secrets periodically
- Monitor admin access logs
- Whitelist MongoDB IPs
- Use HTTPS in production
- Enable 2FA for admin accounts

---

## 🧪 Testing

### Build Check

```bash
npm run build
# Should complete with no errors
```

### Development Testing

1. Test registration with email/password
2. Test Google OAuth
3. Test admin redirect (use admin emails)
4. Test gallery CRUD operations
5. Test theme toggle
6. Test responsive design (DevTools)

---

## 📚 Project Structure

```
website/
├── src/
│   ├── app/              # Next.js app routes
│   │   ├── api/          # API endpoints
│   │   ├── admin/        # Admin dashboard
│   │   ├── dashboard/    # User dashboard
│   │   ├── gallery/      # Image/video galleries
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable components
│   ├── context/          # Auth & Theme context
│   ├── lib/              # Utilities (auth, API, etc)
│   ├── middleware.ts     # Route protection
│   └── services/         # API client setup
├── server/               # Express backend (optional)
├── .env.local            # Environment variables
├── .env.example          # Template
├── package.json
└── tsconfig.json
```

---

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### MongoDB Connection Issues

```bash
# Check connection string
# Verify IP whitelist in MongoDB Atlas
# Test with MongoDB Compass
```

### Google OAuth Not Working

```bash
# Verify Client ID/Secret in .env.local
# Check redirect URI in Google Cloud Console
# Ensure http://localhost:3000 for dev
```

### Admin Not Redirecting

```bash
# Check ADMIN_EMAILS in auth.ts
# Verify user email matches exactly
# Clear localStorage and retry
```

---

## 📞 Support & Resources

- **Better Auth Docs**: https://www.better-auth.com
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Google OAuth**: https://developers.google.com/identity

---

## 📄 License

This project is private and confidential.

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Google OAuth URIs updated
- [ ] MongoDB Atlas IP whitelisted
- [ ] npm run build completes successfully
- [ ] All tests passing
- [ ] Admin emails verified in code
- [ ] BETTER_AUTH_SECRET is 32+ characters
- [ ] NEXT_PUBLIC_APP_URL is correct domain
- [ ] Dark/Light theme working
- [ ] Mobile responsive design verified
- [ ] All galleries functional
- [ ] Admin dashboard accessible

---

**Last Updated**: 2026-05-27
**Version**: 1.0.0 - Production Ready
