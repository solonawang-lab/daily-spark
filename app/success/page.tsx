'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 max-w-xl text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Daily Spark!</h1>
        <p className="text-zinc-400 mb-8">
          Your subscription is now active. Your first wallpaper will arrive tomorrow morning.
        </p>
        
        <div className="bg-zinc-900 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4">What happens next:</h3>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="text-amber-500">✓</span>
              <span>Check your inbox for a welcome email with your first wallpaper</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">✓</span>
              <span>Every morning at your selected time, you'll receive a fresh wallpaper</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500">✓</span>
              <span>Long-press the image in the email to save, then set as your wallpaper</span>
            </li>
          </ul>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-3">⚡ Want zero-tap automation?</h3>
          <p className="text-zinc-500 text-sm mb-4">
            Download our iOS Shortcut to automatically set your wallpaper every morning — completely hands-free.
          </p>
          <Link 
            href="/shortcut"
            className="inline-block px-6 py-2 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Get iOS Shortcut
          </Link>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-3 px-6 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Back to Home
          </Link>
          
          <p className="text-zinc-600 text-sm">
            Questions? Reply to any Daily Spark email and we'll help.
          </p>
        </div>

        {sessionId && (
          <p className="text-zinc-700 text-xs mt-8">
            Order ID: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
