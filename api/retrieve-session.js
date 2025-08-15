// Vercel Serverless Function for retrieving Stripe session details
import Stripe from 'stripe';

export default async function handler(req, res) {
  // Configure CORS - ONLY allow your domain
  const allowedOrigins = [
    'https://stack-shit.vercel.app',
    'https://stackshift.com',
    'https://www.stackshift.com',
    process.env.DOMAIN_URL,
    // Only allow localhost in development
    process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : null
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ 
        error: 'Payment system not configured.' 
      });
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
    
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ 
        error: 'Missing session_id parameter' 
      });
    }

    // Basic validation: Stripe session IDs follow a specific format
    // This prevents arbitrary enumeration attempts
    if (!session_id.startsWith('cs_') || session_id.length < 20) {
      console.warn('Invalid session ID format attempted:', session_id.substring(0, 10));
      return res.status(400).json({ error: 'Invalid session ID format' });
    }

    console.log('Retrieving session:', session_id);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer', 'payment_intent']
    });

    console.log('Session retrieved successfully');
    console.log('Payment Intent ID:', session.payment_intent);

    // Return session details
    return res.status(200).json({ 
      id: session.id,
      payment_intent: session.payment_intent, // This is the payment transaction ID
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || session.customer_email,
      customer_name: session.customer_details?.name,
      customer_phone: session.customer_details?.phone,
      amount_total: session.amount_total,
      metadata: session.metadata
    });

  } catch (error) {
    console.error('Error retrieving session:', error);
    
    return res.status(500).json({ 
      error: 'Failed to retrieve session details',
      details: error.message
    });
  }
}