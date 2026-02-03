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
    if (!email) {
      setStatus('error');
      setMessage('No email provided');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-white mb-4">You've been unsubscribed</h1>
          <p className="text-zinc-500 mb-8">
            You won't receive any more emails from Daily Spark.<br />
            We hope to see you again someday.
          </p>
          
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-4">Unsubscribe</h1>
        
        {email ? (
          <>
            <p className="text-zinc-500 mb-8">
              Stop receiving Daily Spark emails at<br />
              <span className="text-white">{email}</span>
            </p>
            
            {status === 'error' && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                {message}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleUnsubscribe}
                disabled={status === 'loading'}
                className="w-full py-3 px-6 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Unsubscribe'
                )}
              </button>
              
              <Link
                href="/"
                className="block w-full py-3 px-6 border border-zinc-800 text-zinc-500 rounded-xl hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Never mind, keep my subscription
              </Link>
            </div>
          </>
        ) : (
          <p className="text-zinc-500">
            Invalid unsubscribe link.<br />
            Please use the link from your Daily Spark email.
          </p>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
