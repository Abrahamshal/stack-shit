import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle,
  FileJson,
  Trash2,
  Zap,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import HeaderFixed from '@/components/HeaderFixed';

interface Workflow {
  name: string;
  size: number;
  type: string;
  nodeCount?: number;
}

interface CheckoutData {
  amount: number;
  totalNodes: number;
  workflows: Workflow[];
  files: any[];
  timestamp: number;
}

const OrderReviewFinal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedWorkflows, setSelectedWorkflows] = useState<Workflow[]>([]);
  const [selectedUpsell, setSelectedUpsell] = useState<string>('none');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('OrderReviewFinal component mounted');
    
    // Load checkout data from storage
    let data = sessionStorage.getItem('checkoutData');
    if (!data) {
      data = localStorage.getItem('checkoutData');
    }

    if (!data) {
      console.error('No checkout data found');
      toast({
        title: "No checkout data found",
        description: "Please start from the calculator",
        variant: "destructive"
      });
      navigate('/#enhanced-quote-calculator');
      return;
    }

    const parsedData = JSON.parse(data) as CheckoutData;
    setCheckoutData(parsedData);
    
    // Set workflows from the checkout data
    if (parsedData.workflows && parsedData.workflows.length > 0) {
      setSelectedWorkflows(parsedData.workflows);
    } else if (parsedData.files && parsedData.files.length > 0) {
      // Fallback to files if workflows not available
      setSelectedWorkflows(parsedData.files.map(f => ({
        name: f.name,
        size: f.size,
        type: f.type || 'application/json',
        nodeCount: Math.ceil(parsedData.totalNodes / parsedData.files.length)
      })));
    }
    
    setIsLoading(false);
  }, [navigate, toast]);

  const handleRemoveWorkflow = (index: number) => {
    const updated = selectedWorkflows.filter((_, i) => i !== index);
    setSelectedWorkflows(updated);
    
    // Update checkout data
    if (checkoutData) {
      const updatedData = {
        ...checkoutData,
        workflows: updated,
        files: updated,
        totalNodes: updated.reduce((sum, w) => sum + (w.nodeCount || 0), 0)
      };
      setCheckoutData(updatedData);
      sessionStorage.setItem('checkoutData', JSON.stringify(updatedData));
      localStorage.setItem('checkoutData', JSON.stringify(updatedData));
    }
  };

  const getWorkflowName = (filename: string) => {
    // Remove file extension and clean up the name
    return filename.replace(/\.(json|blueprint)$/i, '').replace(/[-_]/g, ' ');
  };

  const calculatePrices = () => {
    const pricePerWorkflow = 40;
    const workflowCost = selectedWorkflows.length * pricePerWorkflow;
    
    let upsellCost = 0;
    let upsellMonthly = 0;
    
    if (selectedUpsell === 'environment') {
      upsellCost = 500;
    } else if (selectedUpsell === 'management') {
      upsellMonthly = 200;
    }
    
    const oneTimeTotal = workflowCost + upsellCost;
    
    return {
      workflowCost,
      upsellCost,
      upsellMonthly,
      oneTimeTotal,
      pricePerWorkflow
    };
  };

  const handleProceedToPayment = () => {
    // Store the selected upsell
    const updatedCheckoutData = {
      ...checkoutData,
      selectedUpsell,
      ...calculatePrices()
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData));
    localStorage.setItem('checkoutData', JSON.stringify(updatedCheckoutData));
    
    // Navigate to Stripe checkout page
    navigate('/checkout-stripe');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderFixed />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  const prices = calculatePrices();

  return (
    <div className="min-h-screen bg-background">
      <HeaderFixed />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back to Calculator Link */}
        <button
          onClick={() => navigate('/#enhanced-quote-calculator')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calculator
        </button>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Complete Your <span className="text-yellow-500">Migration</span> <span className="text-purple-500">Order</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Review your selected workflows and customize your migration package
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Selected Workflows */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  Selected Workflows ({selectedWorkflows.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedWorkflows.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    No workflows selected. Please go back to the calculator.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="font-medium text-sm text-muted-foreground mb-4">
                      {selectedWorkflows[0]?.name.includes('zap') ? 'Zapier' : 'Make.com'} Workflows
                    </div>
                    {selectedWorkflows.map((workflow, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{getWorkflowName(workflow.name)}</div>
                          <div className="text-sm text-muted-foreground">
                            {workflow.nodeCount || 2} nodes • {workflow.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${prices.pricePerWorkflow}</span>
                          <button
                            onClick={() => handleRemoveWorkflow(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove workflow"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What You Get */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Full Workflow Migration</div>
                        <div className="text-sm text-muted-foreground">
                          All {checkoutData?.totalNodes || 0} nodes converted to n8n
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Documentation</div>
                        <div className="text-sm text-muted-foreground">
                          Complete workflow documentation
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Testing & Validation</div>
                        <div className="text-sm text-muted-foreground">
                          Ensure everything works perfectly
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">30-Day Support</div>
                        <div className="text-sm text-muted-foreground">
                          Post-migration assistance included
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Workflow Migration Cost */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">Workflow Migration</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedWorkflows.length} workflow{selectedWorkflows.length !== 1 ? 's' : ''} × ${prices.pricePerWorkflow}/node
                      </div>
                    </div>
                    <span className="font-semibold">${prices.workflowCost}</span>
                  </div>
                </div>

                <Separator />

                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">${prices.workflowCost}</span>
                </div>

                <Separator />

                {/* Add-on Services */}
                <div>
                  <h4 className="font-medium mb-4">Add-on Services</h4>
                  <RadioGroup value={selectedUpsell} onValueChange={setSelectedUpsell} className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="environment" id="environment" className="mt-1" />
                      <Label htmlFor="environment" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">n8n Environment Setup</div>
                            <div className="text-sm text-muted-foreground">
                              Complete server setup & configuration
                            </div>
                          </div>
                          <span className="font-semibold text-nowrap ml-2">$500</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="management" id="management" className="mt-1" />
                      <Label htmlFor="management" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">Ongoing Management</div>
                            <div className="text-sm text-muted-foreground">
                              24/7 monitoring & maintenance
                            </div>
                          </div>
                          <span className="font-semibold text-nowrap ml-2">$200/mo</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="none" id="none" className="mt-1" />
                      <Label htmlFor="none" className="flex-1 cursor-pointer">
                        <div className="font-medium">No add-ons needed</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {selectedUpsell === 'environment' && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Environment Setup</span>
                      <span className="font-semibold">$500</span>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total (One-time)</span>
                    <span className="font-bold">${prices.oneTimeTotal}</span>
                  </div>
                  {selectedUpsell === 'management' && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Plus monthly</span>
                      <span>$200/mo</span>
                    </div>
                  )}
                </div>

                {/* Proceed to Payment Button */}
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full"
                  size="lg"
                  disabled={selectedWorkflows.length === 0}
                >
                  Proceed to Payment
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderReviewFinal;