'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-32 left-1/2 -translate-x-1/2 bg-amber-500 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-lg">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-semibold text-white mb-4">Welcome to Daily Spark</h1>
          <p className="text-zinc-400 text-lg">
            Your subscription is active. Tomorrow starts different.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Check your inbox</h3>
                <p className="text-zinc-500 text-sm">We sent a welcome email with your first wallpaper preview.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Tomorrow morning</h3>
                <p className="text-zinc-500 text-sm">Your first AI-generated wallpaper arrives before you wake up.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Save & set</h3>
                <p className="text-zinc-500 text-sm">Long-press the image in the email, save to photos, set as wallpaper.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
          <h3 className="text-white font-medium mb-2">Want it fully automated?</h3>
          <p className="text-zinc-500 text-sm mb-4">
            Our iOS Shortcut fetches and sets your wallpaper automatically — zero taps required.
          </p>
          <Link 
            href="/shortcut"
            className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
          >
            Set up automation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-zinc-600 hover:text-white transition-colors"
          >
            Back to home
          </Link>
          
          {sessionId && (
            <p className="text-zinc-800 text-xs mt-6 font-mono">
              {sessionId.slice(0, 24)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
