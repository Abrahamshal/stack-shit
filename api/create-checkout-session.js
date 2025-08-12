// Vercel Serverless Function for creating Stripe checkout sessions (Embedded mode)
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
    if (metadata?.selectedPlan && metadata.selectedPlan !== 'none') {
      hasSubscription = true;
      
      // Determine which price ID to use
      let priceId;
      if (metadata.selectedPlan === 'maintenance') {
        priceId = process.env.STRIPE_MAINTENANCE_PRICE_ID;
        if (!priceId) {
          console.warn('STRIPE_MAINTENANCE_PRICE_ID not configured, using price_data fallback');
          // Fallback to price_data if environment variable not set
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Maintenance Plan',
                description: '24/7 monitoring, error recovery, and support',
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
      } else if (metadata.selectedPlan === 'development') {
        priceId = process.env.STRIPE_DEVELOPMENT_PRICE_ID;
        if (!priceId) {
          console.warn('STRIPE_DEVELOPMENT_PRICE_ID not configured, using price_data fallback');
          // Fallback to price_data if environment variable not set
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Development Plan',
                description: 'Everything in Maintenance plus 10 hours monthly development',
              },
              unit_amount: 49900, // $499 in cents
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
      }
    }

    // Determine checkout mode based on whether there's a subscription
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
        payment_intent_data: {
          metadata: {
            totalNodes: metadata?.totalNodes || '0',
            workflowCount: metadata?.workflowCount || '0',
            selectedPlan: metadata?.selectedPlan || 'none',
          }
        },
        return_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080'}/success?session_id={CHECKOUT_SESSION_ID}`,
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true
        },
        metadata: {
          totalNodes: metadata?.totalNodes || '0',
          workflowCount: metadata?.workflowCount || '0',
          selectedPlan: metadata?.selectedPlan || 'none',
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
        return_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080'}/success?session_id={CHECKOUT_SESSION_ID}`,
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true
        },
        metadata: {
          totalNodes: metadata?.totalNodes || '0',
          workflowCount: metadata?.workflowCount || '0',
          selectedPlan: 'none',
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
        error: error.message || 'Failed to create checkout session',
        type: error.type || 'Unknown',
        code: error.code || 'unknown_error',
        // Include debug info
        debug: {
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          hasMaintenancePriceId: !!process.env.STRIPE_MAINTENANCE_PRICE_ID,
          hasDevelopmentPriceId: !!process.env.STRIPE_DEVELOPMENT_PRICE_ID,
          keyLength: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
          keyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) : 'not_set'
        }
      });
    }
  }
}