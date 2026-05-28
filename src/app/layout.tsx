import type { Metadata } from "next";
import { Providers } from "../providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Masud Rana",
  description: "Explore the professional portfolio, developer blog, and admin bento panel of Masud Rana - a Full-stack SaaS Architect specialized in Next.js, Node.js, and Cloud Solutions.",
  keywords: ["Masud Rana", "Full-stack Developer", "Software Engineer Portfolio", "Next.js 14 Developer", "Express.js API", "Mongoose"],
  authors: [{ name: "Masud Rana" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
