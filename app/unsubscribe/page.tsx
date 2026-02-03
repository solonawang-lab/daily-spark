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
      setMessage('You have been unsubscribed from Daily Spark emails.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 max-w-md text-center">
          <div className="text-5xl mb-6">👋</div>
          <h1 className="text-2xl font-bold text-white mb-4">You're unsubscribed</h1>
          <p className="text-zinc-400 mb-8">{message}</p>
          <p className="text-zinc-500 text-sm mb-8">
            We're sorry to see you go. If you change your mind, you can always subscribe again.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Unsubscribe from Daily Spark</h1>
        
        {email ? (
          <>
            <p className="text-zinc-400 mb-8">
              Are you sure you want to stop receiving daily wallpapers at <strong className="text-white">{email}</strong>?
            </p>
            
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
                {message}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleUnsubscribe}
                disabled={status === 'loading'}
                className="w-full py-3 px-6 bg-red-600 text-white font-medium rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Unsubscribing...' : 'Yes, unsubscribe me'}
              </button>
              
              <Link
                href="/"
                className="block w-full py-3 px-6 border border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-900 transition-colors"
              >
                No, keep my subscription
              </Link>
            </div>
          </>
        ) : (
          <p className="text-zinc-400">
            Invalid unsubscribe link. Please use the link from your Daily Spark email.
          </p>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
