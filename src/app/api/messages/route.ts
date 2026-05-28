import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { getDb } from '../../../lib/mongodb';
import { listResource } from '../../../lib/content-api';


// Input Zod Validation Schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  phone: z.string().optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message, phone } = result.data;

    // 2. Spam & Rate Limiting (Max 3 submissions per hour per IP)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const db = await getDb();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const count = await db.collection('messages').countDocuments({
      ip,
      createdAt: { $gte: oneHourAgo },
    });

    if (count >= 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many messages sent. Please try again in an hour.',
        },
        { status: 429 }
      );
    }

    // 3. Save Message to Database
    const messageDoc = {
      name,
      email,
      subject,
      message,
      phone: phone || '',
      read: false,
      ip,
      createdAt: new Date(),
    };

    const insertResult = await db.collection('messages').insertOne(messageDoc);

    // 4. Nodemailer Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Send Alert Mail to Admin
    const adminMailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #2563eb, #0284c7); padding: 30px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
            .content { padding: 30px; }
            .field { margin-bottom: 20px; }
            .label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 6px; }
            .value { font-size: 14px; font-weight: 500; color: #0f172a; line-height: 1.5; }
            .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; font-style: italic; white-space: pre-wrap; font-size: 14px; color: #334155; }
            .footer { background-color: #f1f5f9; padding: 15px 30px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Project Inquiry / Contact</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Full Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
              </div>
              ${
                phone
                  ? `<div class="field">
                      <div class="label">Phone Number</div>
                      <div class="value">${phone}</div>
                    </div>`
                  : ''
              }
              <div class="field">
                <div class="label">Subject</div>
                <div class="value" style="font-weight: 700;">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
            <div class="footer">
              Received on ${new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Dhaka',
              })} (BD Time)
            </div>
          </div>
        </body>
      </html>
    `;

    // 6. Send Auto-Reply Mail to Visitor
    const visitorReplyHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 35px 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
            .content { padding: 35px; text-align: center; }
            .icon-circle { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background-color: #ecfdf5; border-radius: 50%; margin-bottom: 24px; }
            .icon-check { font-size: 32px; color: #10b981; line-height: 64px; }
            .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
            .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 28px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 13px; text-decoration: none; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); }
            .divider { height: 1px; background-color: #e2e8f0; margin: 30px 0; }
            .footer-info { font-size: 12px; color: #64748b; line-height: 1.5; }
            .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Masud Rana</h1>
            </div>
            <div class="content">
              <div class="icon-circle">
                <span class="icon-check">✓</span>
              </div>
              <div class="title">Message Received!</div>
              <p class="text">
                Hi ${name},<br><br>
                Thank you for contacting me. I have received your message regarding <strong>"${subject}"</strong> successfully. I am reviewing your request and will get back to you as soon as possible (usually within 24 business hours).
              </p>
              <a href="https://masudrana.dev" class="cta-button" target="_blank">Visit Portfolio</a>
              <div class="divider"></div>
              <div class="footer-info">
                <strong>Masud Rana</strong><br>
                Full-Stack Next.js Engineer &amp; SaaS Architect<br>
                <a href="mailto:masud.dev01@gmail.com" style="color: #2563eb; text-decoration: none;">masud.dev01@gmail.com</a>
              </div>
            </div>
            <div class="footer">
              This is an automated receipt confirmation. Please do not reply directly to this mail.
            </div>
          </div>
        </body>
      </html>
    `;

    // 7. Fire SMTP Mails (concurrently)
    await Promise.all([
      // Alert to Admin
      transporter.sendMail({
        from: `"SaaS Portfolio" <${process.env.EMAIL_USER}>`,
        to: 'masud.dev01@gmail.com',
        subject: `[Portfolio Inquiry] ${subject}`,
        html: adminMailHtml,
      }),
      // Auto-Reply to Visitor
      transporter.sendMail({
        from: `"Masud Rana" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Receipt Confirmation: ${subject}`,
        html: visitorReplyHtml,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been successfully delivered and saved!',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'An internal error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return listResource(request, 'messages');
}

