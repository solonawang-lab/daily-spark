import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateImage } from '@/lib/replicate';
import { getRandomQuote, Category } from '@/lib/quotes';
import { Style, styles, getStylePrompt } from '@/lib/styles';
import { createWallpaperWithOverlay } from '@/lib/overlay';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

interface Subscriber {
  email: string;
  category: Category;
  style: Style;
  deliveryTime: string;
  plan: 'free' | 'annual';
  status: 'trial' | 'active' | 'cancelled';
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

// API endpoint for iOS Shortcut to fetch today's wallpaper
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  const token = request.nextUrl.searchParams.get('token');
  
  // Simple token auth (in production, use proper API keys)
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Find subscriber
  const subscribers = await getSubscribers();
  const subscriber = subscribers.find(
    s => s.email.toLowerCase() === email.toLowerCase() && s.status !== 'cancelled'
  );

  if (!subscriber) {
    return NextResponse.json({ error: 'Subscription not found or inactive' }, { status: 404 });
  }

  // Check trial
  if (subscriber.status === 'trial') {
    const trialEnd = subscriber.trialEndsAt ? new Date(subscriber.trialEndsAt) : null;
    if (trialEnd && trialEnd < new Date()) {
      return NextResponse.json({ error: 'Trial expired. Please subscribe to continue.' }, { status: 403 });
    }
  }

  try {
    // Generate wallpaper
    const quote = getRandomQuote(subscriber.category);
    const prompt = getStylePrompt(subscriber.style, subscriber.category);
    const imageUrl = await generateImage(prompt, subscriber.style);
    const styleConfig = styles[subscriber.style];

    const wallpaperBuffer = await createWallpaperWithOverlay({
      imageUrl,
      quote: quote.text,
      author: quote.author,
      category: subscriber.category,
      textColor: styleConfig.textColor,
      shadowColor: styleConfig.shadowColor,
    });

    // Return as PNG image directly (for iOS Shortcut)
    return new NextResponse(wallpaperBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="daily-spark-wallpaper.png"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Failed to generate wallpaper:', error);
    return NextResponse.json({ error: 'Failed to generate wallpaper' }, { status: 500 });
  }
}
