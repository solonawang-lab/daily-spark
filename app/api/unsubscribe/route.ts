import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

interface Subscriber {
  email: string;
  category: string;
  style: string;
  deliveryTime: string;
  plan: 'free' | 'annual';
  status: 'trial' | 'active' | 'cancelled';
  createdAt: string;
  trialEndsAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const subscribers = await getSubscribers();
    const subscriberIndex = subscribers.findIndex(
      s => s.email.toLowerCase() === email.toLowerCase()
    );

    if (subscriberIndex === -1) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Mark as cancelled (don't delete - for record keeping)
    subscribers[subscriberIndex].status = 'cancelled';
    await saveSubscribers(subscribers);

    console.log(`Unsubscribed: ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
