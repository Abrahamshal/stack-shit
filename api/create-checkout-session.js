// Vercel Serverless Function for creating Stripe checkout sessions (Embedded mode)
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

  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ 
        error: 'Payment system not configured. Please check server configuration.' 
      });
    }

    // Initialize Stripe with the secret key
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
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

    console.log('Creating embedded checkout session for:', customerEmail, 'Amount (cents):', amount);

    // Create Stripe checkout session for embedded mode
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',  // This enables embedded checkout
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
            },
            unit_amount: amount, // Amount should already be in cents from frontend
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080'}/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: customerEmail,
      metadata: {
        customerName: metadata?.customerName || '',
        customerPhone: metadata?.customerPhone || '',
        customerCompany: metadata?.customerCompany || '',
        totalNodes: metadata?.totalNodes || '0',
        workflowCount: metadata?.workflowCount || '0',
        timestamp: new Date().toISOString()
      },
    });

    console.log('Embedded checkout session created:', session.id);

    // Return the client secret for embedded checkout
    return res.status(200).json({ 
      clientSecret: session.client_secret,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    
    // Handle specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({ 
        error: 'Authentication failed. Please check Stripe API key configuration.' 
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: `Invalid request: ${error.message}` 
      });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ 
        error: 'Stripe API error. Please try again later.' 
      });
    } else if (error.type === 'StripeConnectionError') {
      return res.status(500).json({ 
        error: 'Network error. Please check your connection and try again.' 
      });
    } else {
      // Generic error
      return res.status(500).json({ 
        error: 'Failed to create checkout session. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}