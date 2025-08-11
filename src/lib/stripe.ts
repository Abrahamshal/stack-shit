import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface CheckoutData {
  amount: number;
  customerInfo: CustomerInfo;
  workflows: any[];
  totalNodes: number;
  files?: File[];
}

/**
 * Creates a Stripe checkout session with dynamic pricing
 */
export const createCheckoutSession = async (checkoutData: CheckoutData) => {
  try {
    console.log('Creating checkout session with data:', {
      amount: checkoutData.amount,
      email: checkoutData.customerInfo.email,
      totalNodes: checkoutData.totalNodes
    });

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(checkoutData.amount * 100), // Convert to cents
        customerEmail: checkoutData.customerInfo.email,
        metadata: {
          customerName: checkoutData.customerInfo.name,
          customerPhone: checkoutData.customerInfo.phone || '',
          customerCompany: checkoutData.customerInfo.company || '',
          totalNodes: checkoutData.totalNodes.toString(),
          workflowCount: checkoutData.workflows.length.toString(),
        }
      }),
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to create checkout session: ${response.status} - ${errorText}`);
    }

    const { url } = await response.json();
    
    // Store checkout data in sessionStorage for retrieval after payment
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    sessionStorage.setItem('customerInfo', JSON.stringify(checkoutData.customerInfo));
    
    // Store files as base64 strings to persist them across page navigation
    if (checkoutData.files && checkoutData.files.length > 0) {
      const filePromises = checkoutData.files.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result as string
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      const fileData = await Promise.all(filePromises);
      sessionStorage.setItem('uploadedFiles', JSON.stringify(fileData));
    }
    
    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export { stripePromise };