import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sendWelcomeEmail } from '@/lib/email';

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
    const { email, category, style, deliveryTime, plan } = body;

    // Validate
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Check if already subscribed
    const subscribers = await getSubscribers();
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
    }

    // For paid plan, create Stripe checkout session
    if (plan === 'annual') {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      
      if (!stripeKey) {
        // Stripe not configured, fall back to free trial
        console.warn('Stripe not configured, starting free trial instead');
      } else {
        // Create Stripe checkout session
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(stripeKey);
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Daily Spark Annual',
                  description: 'Premium daily wallpapers with curated quotes',
                },
                unit_amount: 4900, // $49.00
                recurring: {
                  interval: 'year',
                },
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`,
          customer_email: email,
          metadata: {
            category,
            style,
            deliveryTime,
          },
        });

        return NextResponse.json({ checkoutUrl: session.url });
      }
    }

    // Free trial: create subscriber directly
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const newSubscriber: Subscriber = {
      email: email.toLowerCase(),
      category,
      style,
      deliveryTime,
      plan: 'free',
      status: 'trial',
      createdAt: new Date().toISOString(),
      trialEndsAt: trialEndsAt.toISOString(),
    };

    subscribers.push(newSubscriber);
    await saveSubscribers(subscribers);

    // Send welcome email
    if (process.env.RESEND_API_KEY) {
      await sendWelcomeEmail({
        email: newSubscriber.email,
        category: newSubscriber.category,
        style: newSubscriber.style,
        deliveryTime: newSubscriber.deliveryTime,
        isTrial: true,
      });
    }

    console.log('New subscriber:', newSubscriber);

    return NextResponse.json({ 
      success: true, 
      message: 'Trial started',
      trialEndsAt: trialEndsAt.toISOString(),
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
