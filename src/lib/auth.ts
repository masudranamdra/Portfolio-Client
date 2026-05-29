import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { isAdminEmail } from './admin';

// Lazy load database to avoid issues at build time
let authInstance: any = null;

async function initializeAuth() {
  if (authInstance) return authInstance;
  
  const { getDb } = await import('./mongodb');
  
  authInstance = betterAuth({
    database: mongodbAdapter(await getDb()),
    secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'default-secret-change-in-production',
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    trustedOrigins: [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.CLIENT_URL,
      "https://masuddev01.vercel.app",'http://localhost:3000',
    ].filter(Boolean) as string[],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      autoSignIn: true,
      sendResetPassword: async ({ user, url }) => {
        const resetHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .header { background: linear-gradient(135deg, #2563eb, #1e4ed8); padding: 30px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
                .content { padding: 30px; text-align: center; }
                .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
                .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 28px; }
                .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); }
                .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Masud Rana Portfolio</h1>
                </div>
                <div class="content">
                  <div class="title">Reset Your Password</div>
                  <p class="text">
                    Hello ${user.name || 'User'},<br><br>
                    We received a request to reset your password. Click the button below to set a new password. This link is valid for 1 hour.
                  </p>
                  <a href="${url}" class="cta-button">Reset Password</a>
                  <p class="text" style="margin-top: 28px; font-size: 12px;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </div>
                <div class="footer">
                  &copy; ${new Date().getFullYear()} Masud Rana. All rights reserved.
                </div>
              </div>
            </body>
          </html>
        `;
        const { sendEmail } = await import('./email');
        await sendEmail({
          to: user.email,
          subject: 'Reset your password - Masud Rana Portfolio',
          html: resetHtml,
        });
      },
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
    },
    databaseHooks: {
      user: {
        create: {
          async before(user) {
            return {
              data: {
                ...user,
                role: isAdminEmail(user.email) ? 'admin' : 'user',
              },
            };
          },
        },
      },
    },
    plugins: [
      admin({
        defaultRole: 'user',
        adminRoles: ['admin'],
      }),
    ],
  });

  return authInstance;
}

// Export wrapped auth for handler compatibility
export const auth = {
  handler: async (...args: any[]) => {
    const authInst = await initializeAuth();
    return authInst.handler(...args);
  },
  api: {
    getSession: async (...args: any[]) => {
      const authInst = await initializeAuth();
      return authInst.api.getSession(...args);
    },
  },
} as any;

export const getAuth = initializeAuth;
