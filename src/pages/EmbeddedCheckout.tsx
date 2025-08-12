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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  ArrowLeft, 
  AlertCircle, 
  Zap, 
  Shield, 
  Rocket, 
  Clock,
  CheckCircle,
  Settings,
  HeadphonesIcon,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const EmbeddedCheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpsells, setShowUpsells] = useState(true);
  const [baseAmount, setBaseAmount] = useState(0);
  
  // Upsell selections - only one can be selected at a time
  const [selectedPlan, setSelectedPlan] = useState<'maintenance' | 'development' | null>(null);

  // Calculate total amount including upsells
  const calculateTotalAmount = useCallback(() => {
    // For monthly plans, we don't add to the one-time payment
    // Monthly subscriptions are handled separately
    return baseAmount;
  }, [baseAmount]);

  // Fetch client secret for embedded checkout
  const fetchClientSecret = useCallback(async (includeUpsells = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get checkout data from sessionStorage
      const checkoutDataStr = sessionStorage.getItem('checkoutData');

      if (!checkoutDataStr) {
        // Redirect to home if no checkout data
        navigate('/#enhanced-quote-calculator');
        return null;
      }

      const checkoutData = JSON.parse(checkoutDataStr);
      
      // Store base amount
      if (!includeUpsells) {
        setBaseAmount(checkoutData.migrationCost || checkoutData.amount || 0);
      }
      
      // Calculate final amount with upsells
      const finalAmount = includeUpsells ? calculateTotalAmount() : (checkoutData.migrationCost || checkoutData.amount);

      console.log('Creating checkout session with amount:', finalAmount);

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
          amount: Math.round(finalAmount * 100), // Convert to cents
          metadata: {
            totalNodes: (checkoutData.totalNodes || 0).toString(),
            workflowCount: (checkoutData.workflows?.length || 0).toString(),
            selectedPlan: selectedPlan || 'none',
          }
        }),
      });

      console.log('API Response received:', response.status, response.statusText);

      if (!response.ok) {
        // Check if this is a dev environment 404
        if (response.status === 404 && window.location.hostname === 'localhost') {
          throw new Error('Stripe checkout is not available in development mode. The API endpoint requires deployment to Vercel.');
        }
        
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Server error (${response.status})` };
        }
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
  }, [toast, navigate, calculateTotalAmount, selectedPlan]);

  useEffect(() => {
    // Check if we have checkout data first
    const checkoutDataStr = sessionStorage.getItem('checkoutData');
    if (!checkoutDataStr) {
      // Show message briefly then redirect
      setError('No checkout session found. Redirecting to calculator...');
      setTimeout(() => {
        navigate('/#enhanced-quote-calculator');
      }, 2000);
      setIsLoading(false);
      return;
    }
    
    // Only fetch initial client secret if not showing upsells
    if (!showUpsells) {
      fetchClientSecret(true).then(secret => {
        if (secret) {
          setClientSecret(secret);
          setIsLoading(false);
        }
      });
    } else {
      // Just parse the checkout data to get base amount
      const checkoutData = JSON.parse(checkoutDataStr);
      setBaseAmount(checkoutData.migrationCost || checkoutData.amount || 0);
      setIsLoading(false);
    }
  }, []);

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

  const handleProceedWithUpsells = async () => {
    setShowUpsells(false);
    setIsLoading(true);
    
    const secret = await fetchClientSecret(true);
    if (secret) {
      setClientSecret(secret);
    }
    // Always set loading to false, even if secret is null (error will be shown)
    setIsLoading(false);
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

  // Show loading state - only when actually loading, not when there's an error
  if (isLoading) {
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

  // Show error if no client secret and not showing upsells
  if (!clientSecret && !showUpsells && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-2 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Checkout Initialization Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to initialize checkout session. This might be due to:
                  <ul className="list-disc list-inside mt-2">
                    <li>Network connectivity issues</li>
                    <li>Invalid session data</li>
                    <li>Server configuration issues</li>
                  </ul>
                </AlertDescription>
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

  // Show upsells or checkout
  if (showUpsells && !isLoading && !error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* Header */}
          <Button
            onClick={handleBackToCalculator}
            variant="ghost"
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculator
          </Button>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">Choose Your Support Plan</h1>
            <p className="text-muted-foreground text-lg">
              Optional ongoing support to keep your workflows running smoothly
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Support Plans */}
            <div className="lg:col-span-2 space-y-4">
              {/* Maintenance Plan */}
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedPlan === 'maintenance' 
                    ? 'border-primary shadow-lg ring-2 ring-primary ring-opacity-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(selectedPlan === 'maintenance' ? null : 'maintenance')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedPlan === 'maintenance' 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {selectedPlan === 'maintenance' && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Maintenance Plan</h3>
                        <Badge variant="secondary">Most Popular</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Keep your workflows running smoothly with proactive monitoring and maintenance
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">24/7 workflow monitoring</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Automatic error recovery</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Monthly health reports</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">48-hour support response</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Security updates</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">Backup management</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-3xl font-bold">$200</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Cancel anytime</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Development Plan */}
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedPlan === 'development' 
                    ? 'border-primary shadow-lg ring-2 ring-primary ring-opacity-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPlan(selectedPlan === 'development' ? null : 'development')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedPlan === 'development' 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {selectedPlan === 'development' && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Development Plan</h3>
                        <Badge variant="default">Best Value</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Everything in Maintenance plus ongoing development and optimization
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm font-medium">Everything in Maintenance</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Priority 4-hour support</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">10 hours monthly development</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Workflow optimization</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Custom integrations</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Dedicated Slack channel</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Quarterly strategy reviews</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">Performance tuning</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-3xl font-bold">$499</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Cancel anytime</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* No Plan Option */}
              <div className="text-center py-4">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  No thanks, I'll manage it myself
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Migration Service</span>
                      <span className="font-semibold">${baseAmount}</span>
                    </div>
                    
                    {selectedPlan && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>
                              {selectedPlan === 'maintenance' ? 'Maintenance Plan' : 'Development Plan'}
                            </span>
                            <span className="text-muted-foreground">
                              ${selectedPlan === 'maintenance' ? '200' : '499'}/mo
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Billed monthly, cancel anytime
                          </p>
                        </div>
                      </>
                    )}
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Due Today</span>
                        <span className="text-primary">${baseAmount}</span>
                      </div>
                      
                      {selectedPlan && (
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Starting Next Month</span>
                            <span className="font-medium">
                              ${selectedPlan === 'maintenance' ? '200' : '499'}/mo
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            First charge on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleProceedWithUpsells}
                    size="lg"
                    className="w-full"
                  >
                    Continue to Payment
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      setShowUpsells(false);
                      setIsLoading(true);
                      setSelectedPlan(null); // Ensure no plan is selected
                      const secret = await fetchClientSecret(false);
                      if (secret) {
                        setClientSecret(secret);
                      }
                      setIsLoading(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    Skip & Continue Without Support Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
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