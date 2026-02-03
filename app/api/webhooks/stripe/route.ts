import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { promises as fs } from 'fs';
import path from 'path';

// Lazy initialization to avoid build-time errors when API key is not set
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return stripeClient;
}

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
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripeClient().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email?.toLowerCase();
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const metadata = session.metadata;

        if (!email) {
          console.error('No email in checkout session');
          break;
        }

        const subscribers = await getSubscribers();
        let subscriber = subscribers.find(s => s.email === email);

        if (subscriber) {
          // Update existing subscriber
          subscriber.plan = 'annual';
          subscriber.status = 'active';
          subscriber.stripeCustomerId = customerId;
          subscriber.stripeSubscriptionId = subscriptionId;
          delete subscriber.trialEndsAt;
        } else {
          // Create new subscriber from checkout
          subscriber = {
            email,
            category: metadata?.category || 'stoicism',
            style: metadata?.style || 'dark',
            deliveryTime: metadata?.deliveryTime || '6am',
            plan: 'annual',
            status: 'active',
            createdAt: new Date().toISOString(),
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          };
          subscribers.push(subscriber);
        }

        await saveSubscribers(subscribers);
        console.log(`Activated subscription for ${email}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const subscribers = await getSubscribers();
        const subscriber = subscribers.find(s => s.stripeCustomerId === customerId);

        if (subscriber) {
          subscriber.status = 'cancelled';
          await saveSubscribers(subscribers);
          console.log(`Cancelled subscription for ${subscriber.email}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const subscribers = await getSubscribers();
        const subscriber = subscribers.find(s => s.stripeCustomerId === customerId);

        if (subscriber) {
          console.log(`Payment failed for ${subscriber.email}`);
          // Could send a payment failed email here
        }
        break;
      }
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
