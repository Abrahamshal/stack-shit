// Vercel Serverless Function for creating Stripe checkout sessions
// This file should be placed in /api directory for Vercel deployment

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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Lazy load stripe to improve cold start performance
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // Check if Stripe key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return res.status(500).json({ 
      error: 'Payment system not configured. Please contact support.' 
    });
  }

  try {
    const { amount, customerEmail, metadata } = req.body;

    // Validate required fields
    if (!amount || !customerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount and customerEmail are required' 
      });
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount: must be a positive number' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    console.log('Creating checkout session for:', customerEmail, 'Amount:', amount);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Workflow Migration Service',
              description: metadata?.workflowCount 
                ? `Migration of ${metadata.workflowCount} workflows (${metadata.totalNodes} total nodes)`
                : 'Workflow Migration Service',
              images: ['https://flowstrate.com/logo.png'], // Replace with your actual logo URL
            },
            unit_amount: amount, // Amount should already be in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080'}/calculator`,
      customer_email: customerEmail,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      },
      // Optional: Add custom fields for additional info
      custom_fields: [
        {
          key: 'project_timeline',
          label: {
            type: 'custom',
            custom: 'Preferred Timeline'
          },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'ASAP', value: 'asap' },
              { label: 'Within 1 week', value: '1week' },
              { label: 'Within 1 month', value: '1month' },
              { label: 'Flexible', value: 'flexible' }
            ]
          }
        }
      ],
      // Add optional configuration
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'] // Add countries as needed
      }
    });

    console.log('Checkout session created:', session.id);

    // Return the session URL
    return res.status(200).json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        error: 'Card error: ' + error.message 
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid request: ' + error.message 
      });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ 
        error: 'Stripe API error. Please try again later.' 
      });
    } else if (error.type === 'StripeConnectionError') {
      return res.status(500).json({ 
        error: 'Network error. Please check your connection and try again.' 
      });
    } else if (error.type === 'StripeAuthenticationError') {
      console.error('Stripe authentication error - check your API keys');
      return res.status(500).json({ 
        error: 'Payment configuration error. Please contact support.' 
      });
    } else {
      // Generic error
      return res.status(500).json({ 
        error: 'Failed to create checkout session. Please try again.' 
      });
    }
  }
}