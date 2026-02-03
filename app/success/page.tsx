'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="container mx-auto px-6 py-20 max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Welcome to Daily Spark</h1>
          <p className="text-slate-500">Your subscription is active.</p>
        </div>

        <div className="space-y-3 mb-10">
          {[
            { title: 'Check your inbox', desc: 'We sent a welcome email.' },
            { title: 'Tomorrow morning', desc: 'Your first wallpaper arrives.' },
            { title: 'One tap to save', desc: 'Long-press to save to photos.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-xl p-4">
              <h3 className="text-slate-900 font-medium text-sm">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <h3 className="text-slate-900 font-medium mb-2">Want auto-set?</h3>
          <p className="text-slate-600 text-sm mb-3">
            Our iOS Shortcut sets your wallpaper automatically.
          </p>
          <Link href="/shortcut" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
            Set up shortcut →
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm">Back to home</Link>
          {sessionId && <p className="text-slate-300 text-xs mt-6 font-mono">{sessionId.slice(0, 20)}...</p>}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
