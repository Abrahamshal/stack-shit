// This is a simple API endpoint for creating Stripe checkout sessions
// For production, you should use a proper backend framework like Express, Next.js API routes, or serverless functions

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS headers for development
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, customerEmail, metadata } = JSON.parse(event.body);

    // Validate required fields
    if (!amount || !customerEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Workflow Migration Service',
              description: `Migration of ${metadata.workflowCount} workflows (${metadata.totalNodes} total nodes)`,
              images: ['https://flowstrate.com/logo.png'], // Replace with your actual logo URL
            },
            unit_amount: amount, // Amount is already in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.DOMAIN || 'http://localhost:8080'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN || 'http://localhost:8080'}/calculator`,
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
      ]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create checkout session' })
    };
  }
};

// For local development with Express
if (process.env.NODE_ENV === 'development') {
  const express = require('express');
  const cors = require('cors');
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  app.post('/api/create-checkout-session', async (req, res) => {
    const result = await exports.handler(
      { httpMethod: 'POST', body: JSON.stringify(req.body) },
      {}
    );
    res.status(result.statusCode).json(JSON.parse(result.body));
  });
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}