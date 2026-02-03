import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { promises as fs } from 'fs';
import path from 'path';
import { Category } from '@/lib/quotes';
import { Style } from '@/lib/styles';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

interface Subscriber {
  email: string;
  category: Category;
  style: Style;
  deliveryTime: string;
  plan: 'free' | 'annual';
  status: 'trial' | 'active' | 'cancelled';
  createdAt: string;
  trialEndsAt?: string;
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
  }

  const resend = new Resend(resendKey);
  const subscribers = await getSubscribers();
  
  // Filter active subscribers
  const activeSubscribers = subscribers.filter(sub => {
    if (sub.status === 'cancelled') return false;
    if (sub.status === 'trial' && sub.trialEndsAt) {
      return new Date(sub.trialEndsAt) > new Date();
    }
    return true;
  });

  console.log(`Sending to ${activeSubscribers.length} active subscribers`);

  const results = [];

  for (const subscriber of activeSubscribers) {
    try {
      // Generate wallpaper for this subscriber
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const generateResponse = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: subscriber.category,
          style: subscriber.style,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate wallpaper');
      }

      const wallpaper = await generateResponse.json();

      // Extract base64 image data for email attachment
      const base64Data = wallpaper.imageUrl.replace(/^data:image\/png;base64,/, '');

      // Send email
      const { data, error } = await resend.emails.send({
        from: 'Daily Spark <spark@dailyspark.app>',
        to: subscriber.email,
        subject: `✨ Your Daily Spark: "${wallpaper.quote.slice(0, 50)}..."`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Daily Spark</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <span style="color: #71717a; font-size: 14px;">Your Daily Spark ✨</span>
            </td>
          </tr>
          
          <!-- Quote -->
          <tr>
            <td style="padding: 0 20px 20px;">
              <p style="color: #ffffff; font-size: 24px; line-height: 1.4; margin: 0 0 10px; text-align: center;">
                "${wallpaper.quote}"
              </p>
              <p style="color: #a1a1aa; font-size: 16px; margin: 0; text-align: center;">
                — ${wallpaper.author}
              </p>
            </td>
          </tr>
          
          <!-- Wallpaper preview -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img 
                src="cid:wallpaper" 
                alt="Today's wallpaper" 
                style="max-width: 280px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);"
              />
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <p style="color: #71717a; font-size: 14px; margin: 0 0 10px;">
                Long-press the image above to save to Photos
              </p>
              <p style="color: #52525b; font-size: 12px; margin: 0;">
                Then go to Settings → Wallpaper to set it
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 40px; border-top: 1px solid #27272a;">
              <p style="color: #52525b; font-size: 12px; margin: 0;">
                You're receiving this because you signed up for Daily Spark.<br>
                <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="color: #71717a;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
        attachments: [
          {
            filename: 'daily-spark-wallpaper.png',
            content: base64Data,
            contentId: 'wallpaper',
          },
        ],
      });

      if (error) {
        throw error;
      }

      results.push({ email: subscriber.email, status: 'sent', id: data?.id });
      console.log(`Sent to ${subscriber.email}`);
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error);
      results.push({ email: subscriber.email, status: 'failed', error: String(error) });
    }
  }

  return NextResponse.json({
    sent: results.filter(r => r.status === 'sent').length,
    failed: results.filter(r => r.status === 'failed').length,
    results,
  });
}
