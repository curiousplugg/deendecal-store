import { NextRequest, NextResponse } from 'next/server';
import { fetchClientSecret } from '@/app/actions/stripe';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const clientSecret = await fetchClientSecret(items);
    
    return NextResponse.json({ clientSecret });
  } catch (error) {
    console.error('Error fetching client secret:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
