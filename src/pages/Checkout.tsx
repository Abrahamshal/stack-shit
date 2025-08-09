import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Package, 
  Settings, 
  CheckCircle,
  Gift,
  FileJson,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Workflow {
  workflowName: string;
  fileName: string;
  totalNodes: number;
  totalPrice: number;
  platform: string;
}

interface CheckoutData {
  workflows: Workflow[];
  totalNodes: number;
  migrationCost: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [addManagement, setAddManagement] = useState(false);
  const [addSetup, setAddSetup] = useState(false);
  const [includesFreeSetup, setIncludesFreeSetup] = useState(false);

  useEffect(() => {
    // Load checkout data from sessionStorage
    const storedData = sessionStorage.getItem('checkoutData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setCheckoutData(data);
      
      // Check if migration cost is over $1000 for free setup
      if (data.migrationCost >= 1000) {
        setIncludesFreeSetup(true);
      }
    } else {
      // Redirect back if no data
      navigate('/');
    }
  }, [navigate]);

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const managementCost = addManagement ? 200 : 0;
  const setupCost = addSetup && !includesFreeSetup ? 500 : 0;
  const subtotal = checkoutData.migrationCost;
  const totalCost = subtotal + setupCost;
  const monthlyRecurring = managementCost;

  const handleProceedToPayment = () => {
    // Store final order details
    const orderDetails = {
      ...checkoutData,
      addManagement,
      addSetup: addSetup || includesFreeSetup,
      setupCost,
      managementCost,
      totalCost,
      monthlyRecurring,
      includesFreeSetup
    };
    
    sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    
    // Here you would integrate with your payment processor
    // For now, we'll just show an alert
    alert('Payment integration would go here. Order details saved!');
  };

  // Group workflows by platform
  const groupedWorkflows = checkoutData.workflows.reduce((acc, workflow) => {
    if (!acc[workflow.platform]) {
      acc[workflow.platform] = [];
    }
    acc[workflow.platform].push(workflow);
    return acc;
  }, {} as Record<string, Workflow[]>);

  return (
    <div className="min-h-screen bg-muted/50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calculator
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-sora font-bold text-3xl lg:text-5xl mb-4">
              Complete Your
              <span className="text-gradient"> Migration Order</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Review your selected workflows and customize your migration package
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Workflows */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileJson className="h-5 w-5" />
                    Selected Workflows ({checkoutData.workflows.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(groupedWorkflows).map(([platform, workflows]) => (
                      <div key={platform}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold capitalize">{platform} Workflows</h3>
                          <Badge variant="secondary">
                            {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {workflows.map((workflow, index) => (
                            <div 
                              key={`${platform}-${index}`}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div>
                                <p className="font-medium">{workflow.workflowName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {workflow.totalNodes} nodes • {workflow.fileName}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${workflow.totalPrice}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add-on Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Enhance Your Migration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Setup Service */}
                  <div className={`p-4 rounded-lg border-2 ${includesFreeSetup ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="setup"
                        checked={addSetup || includesFreeSetup}
                        onCheckedChange={(checked) => setAddSetup(checked as boolean)}
                        disabled={includesFreeSetup}
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor="setup" 
                          className="font-semibold cursor-pointer flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          n8n Personal Environment Setup
                          {includesFreeSetup && (
                            <Badge variant="default" className="ml-2">
                              <Gift className="h-3 w-3 mr-1" />
                              FREE (Order over $1000)
                            </Badge>
                          )}
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Complete end-to-end setup of your personal n8n environment, including:
                        </p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Server configuration and optimization
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Security hardening and SSL setup
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Database configuration
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Initial workflow deployment
                          </li>
                        </ul>
                        {!includesFreeSetup && (
                          <p className="font-semibold mt-2">$500 one-time</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Management Service */}
                  <div className="p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="management"
                        checked={addManagement}
                        onCheckedChange={(checked) => setAddManagement(checked as boolean)}
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor="management" 
                          className="font-semibold cursor-pointer flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          Ongoing Management & Maintenance
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Keep your workflows running smoothly with our management service:
                        </p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            24/7 monitoring and alerts
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Regular updates and security patches
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Performance optimization
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            Priority support
                          </li>
                        </ul>
                        <p className="font-semibold mt-2">$200/month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    What You Get
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Full Workflow Migration</p>
                        <p className="text-sm text-muted-foreground">
                          All {checkoutData.totalNodes} nodes converted to n8n
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Testing & Validation</p>
                        <p className="text-sm text-muted-foreground">
                          Ensure everything works perfectly
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Documentation</p>
                        <p className="text-sm text-muted-foreground">
                          Complete workflow documentation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">30-Day Support</p>
                        <p className="text-sm text-muted-foreground">
                          Post-migration assistance included
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Migration Cost */}
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Workflow Migration</span>
                      <span>${subtotal}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {checkoutData.totalNodes} nodes × $20/node
                    </p>
                  </div>

                  {/* Setup Cost */}
                  {(addSetup || includesFreeSetup) && (
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Environment Setup</span>
                        <span>
                          {includesFreeSetup ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `$${setupCost}`
                          )}
                        </span>
                      </div>
                      {includesFreeSetup && (
                        <p className="text-xs text-green-600 mt-1">
                          Included with orders over $1000
                        </p>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* One-time Total */}
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total (One-time)</span>
                    <span className="text-primary">${totalCost}</span>
                  </div>

                  {/* Monthly Recurring */}
                  {addManagement && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Management Service</span>
                          <span>${managementCost}/mo</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Billed monthly, cancel anytime
                        </p>
                      </div>
                    </>
                  )}

                  {/* Free Setup Alert */}
                  {includesFreeSetup && (
                    <Alert className="bg-green-50 border-green-200">
                      <Gift className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        You qualify for FREE environment setup ($500 value)!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    onClick={handleProceedToPayment}
                    size="lg"
                    className="w-full"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment powered by Stripe
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}