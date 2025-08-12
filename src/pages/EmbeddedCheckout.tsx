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
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const EmbeddedCheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client secret for embedded checkout
  const fetchClientSecret = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get checkout data from sessionStorage
      const checkoutDataStr = sessionStorage.getItem('checkoutData');

      if (!checkoutDataStr) {
        throw new Error('Missing checkout information. Please start from the calculator.');
      }

      const checkoutData = JSON.parse(checkoutDataStr);

      console.log('Creating checkout session with amount:', checkoutData.migrationCost);

      // Build the full API URL
      const apiUrl = '/api/create-checkout-session';
      console.log('Calling API at:', apiUrl);

      // Create checkout session
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round((checkoutData.migrationCost || checkoutData.amount) * 100), // Convert to cents
          metadata: {
            totalNodes: (checkoutData.totalNodes || 0).toString(),
            workflowCount: (checkoutData.workflows?.length || 0).toString(),
          }
        }),
      });

      console.log('API Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create checkout session (${response.status})`);
      }

      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('No client secret received from server');
      }

      return data.clientSecret;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize checkout';
      setError(errorMessage);
      toast({
        title: "Checkout Error",
        description: errorMessage,
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  }, [toast]);

  useEffect(() => {
    fetchClientSecret().then(secret => {
      if (secret) {
        setClientSecret(secret);
        setIsLoading(false);
      }
    });
  }, [fetchClientSecret]);

  const handleBackToCalculator = () => {
    navigate('/');
    // Scroll to calculator section
    setTimeout(() => {
      const calculatorSection = document.getElementById('quote-calculator');
      if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-2 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Checkout Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              
              <div className="flex gap-4">
                <Button
                  onClick={handleBackToCalculator}
                  variant="outline"
                  size="lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Calculator
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
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="py-20">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Initializing secure checkout...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show embedded checkout
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-2xl py-12">
        {/* Header with back button */}
        <Button
          onClick={handleBackToCalculator}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calculator
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Complete Your Purchase</h1>
          <p className="text-muted-foreground text-lg">
            Secure payment processing powered by Stripe
          </p>
        </div>

        {/* Embedded Checkout with custom styling */}
        <div className="bg-white rounded-xl shadow-lg p-1 mb-12">
          <style>{`
            #checkout iframe {
              border-radius: 12px;
            }
            /* Override Stripe's dark theme */
            .StripeElement {
              background: white !important;
            }
          `}</style>
          <div id="checkout">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>

        {/* Security badges */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 mb-2">
            <span>🔒</span>
            <span>Your payment information is encrypted and secure</span>
          </p>
          <p>
            Powered by Stripe • PCI Compliant • 256-bit SSL Encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedCheckoutPage;