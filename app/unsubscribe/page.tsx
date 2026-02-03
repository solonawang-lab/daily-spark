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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 max-w-md text-center">
          <div className="text-5xl mb-6">👋</div>
          
          <h1 className="text-xl font-bold text-amber-900 mb-3">You've been unsubscribed</h1>
          <p className="text-amber-700 mb-8">
            We're sad to see you go! If you ever want to start your mornings inspired again, we'll be here ☀️
          </p>
          
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-12 max-w-md text-center">
        <div className="text-5xl mb-6">😢</div>

        <h1 className="text-xl font-bold text-amber-900 mb-3">Unsubscribe</h1>
        
        {email ? (
          <>
            <p className="text-amber-700 mb-8">
              Are you sure? You'll stop receiving Daily Spark emails at<br />
              <span className="font-semibold text-amber-900">{email}</span>
            </p>
            
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm">
                {message}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleUnsubscribe}
                disabled={status === 'loading'}
                className="w-full py-3 bg-amber-200 text-amber-800 font-semibold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Processing...' : 'Yes, unsubscribe me'}
              </button>
              
              <Link
                href="/"
                className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
              >
                No, keep sending me sparks! ☀️
              </Link>
            </div>
          </>
        ) : (
          <p className="text-amber-700">
            Invalid link. Please use the link from your Daily Spark email.
          </p>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-amber-500 text-2xl">☀️</div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
