// Vercel Serverless Function for retrieving Stripe session details
import Stripe from 'stripe';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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