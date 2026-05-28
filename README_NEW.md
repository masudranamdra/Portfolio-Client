# 🎨 Masud Rana - Professional Portfolio Platform

A production-ready, premium portfolio platform built with **Next.js 15**, **Better Auth**, **MongoDB**, and **Tailwind CSS**. Features secure authentication, admin dashboard, content galleries, and a beautiful responsive design.

## ✨ Key Features

### 🔐 Authentication & Security
- ✅ **Better Auth** - Modern, secure authentication
- ✅ **Google OAuth 2.0** - One-click social login
- ✅ **Email/Password** - Traditional registration & login
- ✅ **Role-Based Access Control** - Admin & user roles
- ✅ **Persistent Sessions** - Secure httpOnly cookies
- ✅ **Protected Routes** - Middleware-based route protection

### 👨‍💼 User Features
- ✅ **User Dashboard** - Profile, stats, and account settings
- ✅ **Image Gallery** - Responsive masonry grid
- ✅ **Video Gallery** - YouTube & Google Drive embedded videos
- ✅ **Public Sections** - Home, About, Projects, Blog, etc.
- ✅ **Contact Form** - Message submissions

### 🛠️ Admin Features
- ✅ **Admin Dashboard** - Centralized content management
- ✅ **Projects Manager** - CRUD operations for portfolio projects
- ✅ **Blog Manager** - Create & manage blog posts
- ✅ **Gallery Manager** - Upload & manage images/videos
- ✅ **Skills Manager** - Organize technical skills
- ✅ **Testimonials Manager** - Client reviews & ratings
- ✅ **Articles & Activities** - Additional content types
- ✅ **Messages Manager** - View contact submissions

### 🎨 Design & UX
- ✅ **Dark/Light Theme** - System preference detection
- ✅ **Glassmorphism UI** - Premium modern design
- ✅ **Framer Motion** - Smooth animations
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Accessibility** - WCAG compliant components
- ✅ **Performance** - Optimized build, lazy loading

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+, npm/yarn, MongoDB Atlas account, Google OAuth credentials
```

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd website

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
# MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

---

## 📋 Admin Emails

Only these emails get admin access. Update in `src/lib/admin.ts`:

```typescript
export const ADMIN_EMAILS = [
  'masud.dev01@gmail.com',
  'mr3377006@gmail.com',
  'masudranamdra@gmail.com',
];
```

When admins login:
- **Google OAuth** → Redirects to `/admin`
- **Email/Password** → Redirects to `/admin`

Regular users redirect to `/dashboard`.

---

## 📚 Project Structure

```
src/
├── app/                      # Next.js 15 App Router
│   ├── api/                  # API routes
│   │   ├── auth/[...all]/    # Better Auth handler
│   │   ├── [resource]/       # Dynamic resource CRUD
│   │   └── gallery/          # Image & video endpoints
│   ├── admin/                # Admin dashboard
│   ├── dashboard/            # User dashboard
│   ├── gallery/              # Public galleries
│   ├── login/                # Authentication
│   ├── register/
│   ├── blog/                 # Blog pages
│   ├── projects/             # Portfolio
│   └── page.tsx              # Home with all sections
├── components/               # Reusable React components
├── context/                  # Auth & Theme context
├── lib/
│   ├── auth.ts               # Better Auth server config
│   ├── auth-client.ts        # Better Auth client
│   ├── mongodb.ts            # MongoDB connection
│   ├── content-api.ts        # API handlers
│   └── admin.ts              # Admin utilities
├── middleware.ts             # Route protection
└── types/                    # TypeScript definitions
```

---

## 🔧 Environment Variables

See `.env.example` for complete setup guide.

### Required

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...
MONGODB_DB=portfolio

# Better Auth
BETTER_AUTH_SECRET=min-32-character-random-string
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository on Vercel
3. Add environment variables
4. Update Google OAuth redirect URIs
5. Deploy!

See `DEPLOYMENT.md` for detailed instructions.

---

## 📊 API Endpoints

### Public Routes

```
GET  /api/projects       # List projects
GET  /api/projects/:id   # Get project details
GET  /api/blogs          # List blogs
GET  /api/blogs/:id      # Get blog post
GET  /api/articles       # List articles
GET  /api/activities     # List activities
GET  /api/skills         # List skills
GET  /api/testimonials   # List testimonials
```

### Protected Routes (Logged In)

```
GET  /api/gallery/images      # List images
POST /api/gallery/images      # Add image (admin only)
DELETE /api/gallery/images/:id # Delete (admin only)

GET  /api/gallery/videos      # List videos
POST /api/gallery/videos      # Add video (admin only)
DELETE /api/gallery/videos/:id # Delete (admin only)
```

### Authentication

```
POST /api/auth/signup           # Register
POST /api/auth/signin           # Login
POST /api/auth/signin/google    # Google OAuth
GET  /api/auth/session          # Current user
POST /api/auth/signout          # Logout
```

---

## 🎯 Features in Detail

### Authentication Flow

```
User Registration
├── Email/Password Input
├── Form Validation (client-side)
├── POST /api/auth/signup
├── Better Auth creates user
├── Role assignment (admin check)
└── Redirect (admin → /admin, user → /dashboard)

User Login
├── Email/Password OR Google
├── Credential verification
├── Session creation
├── JWT in httpOnly cookie
└── Redirect based on role

Session Persistence
├── Token stored in cookie
├── Token verified on page load
├── Auto-logout on expiry
└── Refresh on activity
```

### Admin Dashboard Workflow

```
Admin Login → /admin
├── Check admin role
├── Display content managers
├── Select manager type
├── View all items
├── Add/Edit/Delete operations
├── Real-time updates
└── Logout
```

### User Dashboard Workflow

```
User Login → /dashboard
├── Display profile info
├── Show joined date
├── Account settings
├── Access to galleries
└── View activity
```

---

## 🧪 Testing

### Build Check

```bash
npm run build
# Should complete with 0 errors, 0 warnings
```

### Development Testing

```bash
npm run dev
# Test each feature:
# 1. Registration (email & Google)
# 2. Login (email & Google)
# 3. Admin redirect
# 4. Dashboard access
# 5. Gallery CRUD
# 6. Theme toggle
# 7. Mobile responsiveness
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Frontend uses port 3000
# Change in package.json if needed
npm run dev -- -p 3001
```

### MongoDB Connection Error
```bash
# Check connection string
# Whitelist your IP in MongoDB Atlas
# Ensure network access enabled
```

### Google OAuth Not Working
```bash
# Verify credentials in .env.local
# Check redirect URI in Google Cloud Console
# Clear browser cache and cookies
```

### Build Fails
```bash
# Clear build artifacts
rm -rf .next
# Reinstall dependencies
rm -rf node_modules
npm install
# Rebuild
npm run build
```

---

## 📦 Dependencies

### Core
- **next**: 15.5.18 - React framework
- **react**: 18 - UI library
- **typescript**: 5 - Type safety

### Authentication
- **better-auth**: 1.6.11 - Auth solution
- **@better-auth/mongo-adapter**: 1.6.11 - MongoDB adapter
- **mongodb**: 7.2.0 - Database driver

### UI & Styling
- **tailwindcss**: 3.4.1 - Utility CSS
- **framer-motion**: 12.39.0 - Animations
- **lucide-react**: 1.16.0 - Icons
- **react-hook-form**: 7.76.0 - Form handling
- **react-hot-toast**: 2.6.0 - Notifications

### Utilities
- **axios**: 1.16.1 - HTTP client

See `package.json` for full list.

---

## 🤝 Contributing

This is a personal portfolio project. For suggestions or improvements, create an issue or contact the maintainer.

---

## 📄 License

© 2026 Masud Rana. All rights reserved.

---

## 📞 Contact

- **Email**: masud.dev01@gmail.com
- **Website**: https://masudrana.dev
- **GitHub**: https://github.com/masud-rana

---

## 🎓 Learning Resources

This project demonstrates:
- ✅ Modern Next.js 15 with App Router
- ✅ TypeScript best practices
- ✅ Better Auth implementation
- ✅ MongoDB integration
- ✅ API design patterns
- ✅ Component architecture
- ✅ Responsive design
- ✅ Authentication & authorization
- ✅ Form handling & validation
- ✅ State management with Context
- ✅ Error handling
- ✅ Production deployment

---

**Last Updated**: 2026-05-27  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
