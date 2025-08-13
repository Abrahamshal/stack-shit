import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  ArrowLeft, 
  AlertCircle,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const StripeCheckout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<any>(null);

  // Fetch client secret for embedded checkout
  const fetchClientSecret = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get checkout data from storage
      let checkoutDataStr = sessionStorage.getItem('checkoutData');
      if (!checkoutDataStr) {
        checkoutDataStr = localStorage.getItem('checkoutData');
      }

      if (!checkoutDataStr) {
        navigate('/checkout-payment');
        return null;
      }

      const checkoutData = JSON.parse(checkoutDataStr);
      setOrderSummary(checkoutData);
      
      // Determine the final amount and selected plan
      // Pass the selected upsell directly (maintenance or development)
      const selectedPlan = checkoutData.selectedUpsell || 'none';
      
      const finalAmount = checkoutData.oneTimeTotal || checkoutData.workflowCost || checkoutData.amount;

      console.log('Creating Stripe session with:', {
        amount: finalAmount,
        selectedPlan,
        upsell: checkoutData.selectedUpsell
      });

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(finalAmount * 100), // Convert to cents
          metadata: {
            totalNodes: (checkoutData.totalNodes || 0).toString(),
            workflowCount: (checkoutData.workflows?.length || 0).toString(),
            selectedPlan: selectedPlan,
            checkoutAmount: finalAmount.toString(),
            hasFiles: (checkoutData.files?.length > 0).toString(),
            environmentSetup: checkoutData.selectedUpsell === 'environment' ? 'true' : 'false',
            selectedUpsell: checkoutData.selectedUpsell || 'none'
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { clientSecret: secret } = await response.json();
      return secret;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize checkout');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchClientSecret().then(setClientSecret);
  }, [fetchClientSecret]);

  const handleBackToOrder = () => {
    navigate('/checkout-payment');
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <Card className="max-w-2xl mx-auto border-2 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Payment Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              
              <div className="flex gap-4">
                <Button
                  onClick={handleBackToOrder}
                  variant="outline"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  size="lg"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-20">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Initializing secure payment...</p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show payment form
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        {/* Back to Order Link */}
        <button
          onClick={handleBackToOrder}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Order Review
        </button>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Complete Your Payment
          </h1>
          <p className="text-muted-foreground">
            Secure payment processing powered by Stripe
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Order Summary Card */}
          {orderSummary && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Workflow Migration</span>
                    <span className="font-medium">
                      ${orderSummary.workflowCost || orderSummary.amount || 0}
                    </span>
                  </div>
                  
                  {orderSummary.selectedUpsell === 'maintenance' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maintenance Package (Monthly)</span>
                      <span className="font-medium">$200/mo</span>
                    </div>
                  )}
                  
                  {orderSummary.selectedUpsell === 'development' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Development Package (Monthly)</span>
                      <span className="font-medium">$499/mo</span>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Due Now</span>
                      <span>${orderSummary.oneTimeTotal || orderSummary.amount || 0}</span>
                    </div>
                    {(orderSummary.selectedUpsell === 'maintenance' || orderSummary.selectedUpsell === 'development') && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Plus {orderSummary.selectedUpsell === 'maintenance' ? '$200' : '$499'}/month starting in 30 days
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stripe Embedded Checkout */}
          {clientSecret && (
            <Card>
              <CardContent className="p-0">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StripeCheckout;