'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 py-20 max-w-lg">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-stone-900 mb-3">Welcome to Daily Spark</h1>
          <p className="text-stone-500">
            Your subscription is active. Tomorrow starts different.
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {[
            { 
              icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
              title: 'Check your inbox',
              desc: 'We sent a welcome email with your first wallpaper preview.'
            },
            { 
              icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
              title: 'Tomorrow morning',
              desc: 'Your first AI-generated wallpaper arrives before you wake up.'
            },
            { 
              icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
              title: 'Save & set',
              desc: 'Long-press the image in the email, save to photos, set as wallpaper.'
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-stone-900 font-medium text-sm mb-0.5">{item.title}</h3>
                  <p className="text-stone-500 text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-stone-900 font-medium mb-2">Want it fully automated?</h3>
          <p className="text-stone-600 text-sm mb-3">
            Our iOS Shortcut fetches and sets your wallpaper automatically — zero taps.
          </p>
          <Link 
            href="/shortcut"
            className="inline-flex items-center gap-1 text-amber-700 text-sm font-medium hover:text-amber-800 transition-colors"
          >
            Set up automation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-stone-500 hover:text-stone-900 transition-colors">
            Back to home
          </Link>
          
          {sessionId && (
            <p className="text-stone-300 text-xs mt-6 font-mono">
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
