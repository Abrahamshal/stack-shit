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
export const createCheckoutSession = async (checkoutData: CheckoutData, navigate?: any) => {
  try {
    console.log('Preparing checkout with data:', {
      amount: checkoutData.amount,
      email: checkoutData.customerInfo.email,
      totalNodes: checkoutData.totalNodes
    });

    // Store checkout data in sessionStorage for the embedded checkout page
    sessionStorage.setItem('checkoutData', JSON.stringify({
      ...checkoutData,
      migrationCost: checkoutData.amount // Ensure migrationCost is set
    }));
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
    
    // Navigate to embedded checkout page instead of redirecting to Stripe
    if (navigate) {
      navigate('/checkout-payment');
    } else {
      // Fallback for cases where navigate is not provided
      window.location.href = '/checkout-payment';
    }
  } catch (error) {
    console.error('Error preparing checkout:', error);
    throw error;
  }
};

export { stripePromise };