'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) { setStatus('error'); setMessage('No email'); return; }
    setStatus('loading');
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed');
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-3">Unsubscribed</h1>
          <p className="text-slate-500 mb-8">You won't receive any more emails.</p>
          <Link href="/" className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 max-w-sm text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-3">Unsubscribe</h1>
        {email ? (
          <>
            <p className="text-slate-500 mb-8">Stop receiving emails at <span className="text-slate-700">{email}</span>?</p>
            {status === 'error' && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{message}</div>}
            <div className="space-y-3">
              <button onClick={handleUnsubscribe} disabled={status === 'loading'} className="w-full py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 disabled:opacity-50">
                {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
              </button>
              <Link href="/" className="block w-full py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800">Keep subscription</Link>
            </div>
          </>
        ) : (
          <p className="text-slate-500">Invalid link.</p>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" /></div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
