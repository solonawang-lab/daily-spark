import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

// Simple admin endpoint to view subscribers
// In production, add proper authentication
export async function GET(request: NextRequest) {
  // Simple auth check
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET;
  
  if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    const subscribers = JSON.parse(data);

    // Summary stats
    const stats = {
      total: subscribers.length,
      active: subscribers.filter((s: { status: string }) => s.status === 'active').length,
      trial: subscribers.filter((s: { status: string }) => s.status === 'trial').length,
      cancelled: subscribers.filter((s: { status: string }) => s.status === 'cancelled').length,
    };

    return NextResponse.json({ stats, subscribers });
  } catch {
    return NextResponse.json({ stats: { total: 0 }, subscribers: [] });
  }
}
