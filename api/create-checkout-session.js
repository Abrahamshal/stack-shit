// Vercel Serverless Function for creating Stripe checkout sessions (Embedded mode)
import Stripe from 'stripe';

// Environment variable DOMAIN_URL should be set to your custom domain (e.g., https://yourdomain.com)
// This ensures Stripe redirects to your custom domain instead of the Vercel URL
export default async function handler(req, res) {
  // Configure CORS - ONLY allow your domain
  const allowedOrigins = [
    'https://convert2n8n.com',
    'https://www.convert2n8n.com',
    process.env.DOMAIN_URL,
    // Only allow localhost in development
    process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : null
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
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
    console.log('Received checkout request:', {
      method: req.method,
      body: req.body,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY
    });

    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return res.status(500).json({ 
        error: 'Payment system not configured. Please check server configuration.' 
      });
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
    
    const { amount, metadata } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ 
        error: 'Missing required field: amount is required' 
      });
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount: must be a positive number' 
      });
    }

    // Server-side price validation
    const PRICE_PER_WORKFLOW = 40; // $40 per workflow
    const MINIMUM_ORDER = 150; // $150 minimum order
    const workflowCount = parseInt(metadata?.workflowCount || '0');
    
    // Calculate expected base price
    const expectedBasePrice = workflowCount * PRICE_PER_WORKFLOW;
    
    // For subscription plans, we only validate the base price
    // The subscription amount is handled separately via environment variables
    let expectedTotal = expectedBasePrice;
    
    // Validate the amount (convert cents to dollars for comparison)
    const requestedAmount = amount / 100;
    const tolerance = 1; // Allow $1 difference for minor adjustments
    
    // Check minimum order amount
    if (requestedAmount < MINIMUM_ORDER) {
      console.error('Order below minimum:', {
        requested: requestedAmount,
        minimum: MINIMUM_ORDER
      });
      return res.status(400).json({ 
        error: `Minimum order amount is $${MINIMUM_ORDER}. Your order total is $${requestedAmount}.`
      });
    }
    
    if (Math.abs(requestedAmount - expectedTotal) > tolerance && workflowCount > 0) {
      console.error('Price validation failed:', {
        requested: requestedAmount,
        expected: expectedTotal,
        workflowCount,
        selectedPlan: metadata?.selectedPlan
      });
      return res.status(400).json({ 
        error: 'Invalid checkout amount. Please refresh and try again.'
      });
    }

    console.log('Creating embedded checkout session. Amount (cents):', amount);
    console.log('Selected plan:', metadata?.selectedPlan);

    // Build line items array
    const lineItems = [];
    
    // Always add the migration service (one-time payment)
    lineItems.push({
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
    });

    // Add subscription plan if selected
    let hasSubscription = false;
    if (metadata?.selectedPlan === 'maintenance') {
      hasSubscription = true;
      
      // Use Maintenance Plan price ID
      const priceId = process.env.STRIPE_MAINTENANCE_PRICE_ID;
      if (!priceId) {
        console.warn('STRIPE_MAINTENANCE_PRICE_ID not configured, using price_data fallback');
        // Fallback to price_data if environment variable not set
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Maintenance Package',
              description: '24/7 monitoring, updates & support',
            },
            unit_amount: 20000, // $200 in cents
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1,
        });
      } else {
        lineItems.push({
          price: priceId,
          quantity: 1,
        });
      }
    // For mixed cart (one-time + subscription), we need to use subscription mode
    // and add the one-time payment as an invoice item
    let sessionConfig;
    
    if (hasSubscription) {
      // Create checkout session with subscription mode
      // The one-time payment will be added to the first invoice
      sessionConfig = {
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'subscription',
        subscription_data: {
          // Add trial period so subscription starts after 30 days
          trial_period_days: 30,
          metadata: {
            selectedPlan: metadata.selectedPlan,
            totalNodes: metadata?.totalNodes || '0',
            workflowCount: metadata?.workflowCount || '0',
          }
        },
        // Remove payment_intent_data - not allowed in subscription mode
        return_url: `${process.env.DOMAIN_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080')}/success?session_id={CHECKOUT_SESSION_ID}`,
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true
        },
        metadata: {
          totalNodes: metadata?.totalNodes || '0',
          workflowCount: metadata?.workflowCount || '0',
          selectedPlan: metadata?.selectedPlan || 'none',
          checkoutAmount: metadata?.checkoutAmount || '0',
          hasFiles: metadata?.hasFiles || 'false',
          timestamp: new Date().toISOString()
        },
      };
    } else {
      // Simple payment mode for one-time payment only
      sessionConfig = {
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        return_url: `${process.env.DOMAIN_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080')}/success?session_id={CHECKOUT_SESSION_ID}`,
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true
        },
        metadata: {
          totalNodes: metadata?.totalNodes || '0',
          workflowCount: metadata?.workflowCount || '0',
          selectedPlan: 'none',
          checkoutAmount: metadata?.checkoutAmount || '0',
          hasFiles: metadata?.hasFiles || 'false',
          timestamp: new Date().toISOString()
        },
      };
    }

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Embedded checkout session created:', session.id);
    console.log('Mode:', hasSubscription ? 'subscription' : 'payment');

    // Return the client secret for embedded checkout
    return res.status(200).json({ 
      clientSecret: session.client_secret,
      sessionId: session.id,
      mode: hasSubscription ? 'subscription' : 'payment'
    });

  } catch (error) {
    console.error('Stripe error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      raw: error.raw,
      requestId: error.requestId,
      stack: error.stack
    });
    
    // Handle specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({ 
        error: 'Authentication failed. Please check Stripe API key configuration.',
        details: error.message,
        code: error.code
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: `Invalid request: ${error.message}`,
        code: error.code,
        param: error.param
      });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ 
        error: 'Stripe API error. Please try again later.',
        details: error.message,
        code: error.code
      });
    } else if (error.type === 'StripeConnectionError') {
      return res.status(500).json({ 
        error: 'Network error. Please check your connection and try again.',
        details: error.message
      });
    } else {
      // Generic error - provide more details for debugging
      return res.status(500).json({ 
        error: 'Failed to create checkout session. Please try again later.',
        code: error.code || 'unknown_error'
      });
    }
  }
}