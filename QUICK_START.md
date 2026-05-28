# 🚀 QUICK START GUIDE - Portfolio Platform

## Current Status: ✅ PRODUCTION READY

---

## 📋 What's Already Done

Everything you requested has been implemented and tested:

✅ **Complete Authentication System**
- Better Auth with MongoDB Adapter
- Google OAuth 2.0 integration
- Email/Password login & registration
- Role-based access control (Admin/User)

✅ **Admin System**
- Admin Dashboard at `/admin`
- Access restricted to: `masud.dev01@gmail.com`, `mr3377006@gmail.com`, `masudranamdra@gmail.com`
- 9 content managers (Projects, Blog, Articles, Skills, Testimonials, Activities, Images, Videos, Messages)
- Full CRUD operations on all content

✅ **User Features**
- User Dashboard at `/dashboard`
- Profile management
- Access to galleries
- Beautiful responsive design

✅ **Gallery System**
- Image Gallery (`/gallery/images`) - CRUD operations
- Video Gallery (`/gallery/videos`) - YouTube & Google Drive support
- Admin management interface
- Responsive masonry/grid layouts

✅ **UI/UX**
- Dark/Light theme with persistence
- Premium glassmorphism design
- Smooth animations with Framer Motion
- Fully responsive (mobile → tablet → desktop)

✅ **Build & Quality**
- Full TypeScript coverage
- Zero build errors
- All API routes implemented
- Production-ready code

---

## 🎯 First Steps to Get Running

### 1. Clone and Install
```bash
cd website
npm install
```

### 2. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add:
MONGODB_URI=your-mongodb-connection-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Where to get these:**
- **MongoDB**: mongodb+srv://username:password@cluster.mongodb.net (from MongoDB Atlas)
- **Google OAuth**: From Google Cloud Console

### 3. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Test the System

#### Test as Regular User
1. Go to `/register`
2. Create account with email: `user@example.com`
3. You'll be redirected to `/dashboard`
4. Access galleries at `/gallery/images` and `/gallery/videos`

#### Test as Admin
1. Go to `/register`
2. Create account with: `masud.dev01@gmail.com`
3. You'll be auto-redirect to `/admin`
4. Use all 9 content managers

#### Test Google OAuth
1. Click "Sign in with Google" on `/login` or `/register`
2. If using admin email → redirects to `/admin`
3. If using other email → redirects to `/dashboard`

---

## 📁 Key Files & Locations

### Authentication
- **Setup**: `src/lib/auth.ts` - Better Auth configuration
- **Client**: `src/lib/auth-client.ts` - Client-side auth
- **API Route**: `src/app/api/auth/[...all]/route.ts`
- **Context**: `src/context/AuthContext.tsx`

### Admin
- **Admin Page**: `src/app/admin/page.tsx`
- **Admin Emails**: `src/lib/admin.ts`
- **Admin Check**: Uses `isAdminEmail()` function

### Galleries
- **Image Gallery**: `src/app/gallery/images/page.tsx`
- **Video Gallery**: `src/app/gallery/videos/page.tsx`
- **API Routes**: `src/app/api/gallery/[kind]/route.ts`

### Content Management
- **API Handlers**: `src/lib/content-api.ts`
- **MongoDB Connection**: `src/lib/mongodb.ts`

---

## 🔐 Admin Access

Only these emails can access admin:
```javascript
masud.dev01@gmail.com
mr3377006@gmail.com
masudranamdra@gmail.com
```

To add more admins:
1. Edit `src/lib/admin.ts`
2. Add email to `ADMIN_EMAILS` array
3. Restart dev server

---

## 🌐 Routes Overview

### Public Routes
```
/                    → Home
/blog                → Blog listing
/blog/[id]           → Blog detail
/projects            → Projects listing
/projects/[id]       → Project detail
/activities          → Activities
/activities/[id]     → Activity detail
/articles            → Articles
/articles/[id]       → Article detail
/login               → Login page
/register            → Register page
```

### Protected Routes (Login Required)
```
/dashboard           → User dashboard
/gallery/images      → Image gallery
/gallery/videos      → Video gallery
/admin               → Admin panel (admin only)
```

---

## 🎨 Customization

### Change Admin Emails
**File**: `src/lib/admin.ts`
```typescript
export const ADMIN_EMAILS = [
  'your-email@gmail.com',
  // Add more emails here
];
```

### Change Theme Colors
**File**: `src/app/globals.css` and `tailwind.config.ts`
```css
/* Modify CSS variables for colors */
--primary: blue;  /* or sky, green, orange */
```

### Change Logo/Brand
**File**: `src/components/Navbar.tsx`
```typescript
// Update brand name and logo
```

---

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)
```bash
1. Push to GitHub
2. Go to vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!
```

### Option 2: Your Own Server
```bash
npm run build
npm start
```

See `DEPLOYMENT.md` for detailed instructions.

---

## 📊 API Quick Reference

### Get All Projects
```bash
curl http://localhost:3000/api/projects
```

### Get All Images (requires login)
```bash
curl http://localhost:3000/api/gallery/images \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add New Image (admin only)
```bash
curl -X POST http://localhost:3000/api/gallery/images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My Image",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

---

## 🐛 Common Issues & Solutions

### "MongoDB connection failed"
- Check `MONGODB_URI` in `.env.local`
- Whitelist your IP in MongoDB Atlas
- Ensure database is created

### "Google auth not working"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check redirect URI in Google Cloud Console
- Clear browser cache

### "Admin not showing up"
- Check email exactly matches `ADMIN_EMAILS`
- Restart dev server after changes
- Clear localStorage

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

---

## 📚 Documentation Files

- **`DEPLOYMENT.md`** - Complete deployment & setup guide
- **`IMPLEMENTATION_SUMMARY.md`** - Detailed feature checklist
- **`README.md`** - Project overview
- **`.env.example`** - Environment variables template
- **`server/.env.example`** - Backend env template

---

## 🎓 Tech Stack Reference

- **Next.js 15** - React framework
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Better Auth** - Authentication
- **MongoDB** - Database
- **Axios** - HTTP client

---

## ✅ Quality Assurance

### Build Check
```bash
npm run build
# Should show: ✓ Compiled successfully (0 errors)
```

### Development Check
- All pages load without errors
- Authentication works (email & Google)
- Admin redirect functions
- Gallery CRUD operations work
- Theme toggle works
- Responsive design verified

---

## 🎯 Next Steps

1. **Setup Environment**
   - Copy `.env.example` to `.env.local`
   - Add your MongoDB URI
   - Add Google OAuth credentials

2. **Test Locally**
   - Run `npm run dev`
   - Test registration & login
   - Test admin panel
   - Test galleries

3. **Deploy**
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Deploy!

4. **Customize** (Optional)
   - Update admin emails
   - Customize colors/theme
   - Add your content
   - Optimize performance

---

## 💬 Support Resources

- **Better Auth Docs**: https://www.better-auth.com
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## 🎉 You're Ready!

Your portfolio platform is complete and production-ready.

Next: Follow the "First Steps" section above to get started!

---

**Questions?** Check `DEPLOYMENT.md` or review `IMPLEMENTATION_SUMMARY.md` for complete feature list.

**Last Updated**: 2026-05-27  
**Status**: ✅ Production Ready - Ready to Deploy
