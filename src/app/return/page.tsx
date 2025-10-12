'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function ReturnPage() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [session, setSession] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!session_id) {
        setError('Please provide a valid session_id');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/session-status?session_id=${session_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setSession(data.session);
      } catch {
        setError('Failed to retrieve session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [session_id]);

  // Background success page trigger
  useEffect(() => {
    if (session && session.status === 'complete') {
      // Create hidden iframe to trigger success page tracking
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.src = '/success';
      document.body.appendChild(iframe);
      
      // Clean up after 5 seconds
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 5000);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-red-500 text-6xl mb-6">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-700 text-lg mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-yellow-500 text-6xl mb-6">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Session Not Found</h1>
            <p className="text-gray-700 text-lg mb-6">
              We couldn&apos;t find your payment session. Please contact us if you have any questions.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (session.status === 'open') {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-yellow-500 text-6xl mb-6">
              <i className="fas fa-clock"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Pending</h1>
            <p className="text-gray-700 text-lg mb-6">
              Your payment is still being processed. Please wait or contact us if you have any questions.
            </p>
            <Link
              href="/cart"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (session.status === 'complete') {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="flex-grow flex items-center justify-center py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-green-500 text-6xl mb-6">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-700 text-lg mb-6">
              Thank you for your purchase! A confirmation email will be sent to{' '}
              {session.customer_details?.email}.<br />
              If you have any questions, please email{' '}
              <a href="mailto:deendecal@gmail.com" className="text-blue-600 hover:text-blue-800">
                deendecal@gmail.com
              </a>.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
            
            {/* X (Twitter) Event Tracking */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  twq('event', 'tw-qm4yw-qm4yx', {
                    conversion_id: '${session_id || 'unknown'}',
                    email_address: '${session.customer_details?.email || ''}',
                    phone_number: null
                  });
                `,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Handle other statuses
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="flex-grow flex items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-yellow-500 text-6xl mb-6">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Status Unknown</h1>
          <p className="text-gray-700 text-lg mb-6">
            We&apos;re not sure what happened with your payment. Please contact us if you have any questions.
          </p>
          <Link
            href="/cart"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}