# Portfolio Client 🚀

The frontend application for Masud Rana's Portfolio, developer blog, and admin dashboard built with **Next.js 15**, **React 18**, **Tailwind CSS**, and **Framer Motion**.

## 📁 Project Structure

```
client/
├── src/
│   ├── app/          # Next.js App Router (pages & API proxies)
│   ├── components/   # Reusable UI components
│   ├── context/      # Theme and Auth context providers
│   ├── lib/          # Helper utilities & configuration (auth, api clients)
│   ├── sections/     # Modular website sections (Hero, About, Projects)
│   ├── services/     # API service layer
│   └── types/        # TypeScript type declarations
├── public/           # Static assets (images, icons)
├── tailwind.config.ts# Tailwind CSS config
└── tsconfig.json     # TypeScript config
```

## 🛠️ Local Setup & Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Scripts

- `npm run dev`: Start the dev server.
- `npm run build`: Create an optimized production build.
- `npm run start`: Run the built production build locally.
- `npm run lint`: Run ESLint check.
- `npx tsc --noEmit`: Verify TypeScript types.

## ☁️ Vercel Deployment

This project is fully optimized for **Vercel** with zero-error build preparation.

1. Connect your Github repository `Portfolio-Client` to Vercel.
2. Ensure the **Framework Preset** is set to **Next.js**.
3. Set the **Root Directory** of your Vercel project to `client` if deploying from a monorepo, or directly if using the split repository.
4. Add the required environment variables:
   - `NEXT_PUBLIC_APP_URL` (Set to your custom domain or Vercel deployment URL)
5. Click **Deploy**.
