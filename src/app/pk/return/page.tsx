import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import Navigation from '@/components/Navigation';

interface ReturnPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PakistaniReturnPage({ searchParams }: ReturnPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  if (session.status === 'open') {
    return redirect('/pk/cart');
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
                href="/pk"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
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
            href="/pk/cart"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
