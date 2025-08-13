import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const OrderReviewSimple = () => {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('OrderReviewSimple mounting');
    
    // Try to load checkout data
    let data = sessionStorage.getItem('checkoutData');
    if (!data) {
      data = localStorage.getItem('checkoutData');
    }
    
    if (data) {
      setCheckoutData(JSON.parse(data));
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Header for now */}
      
      <main className="container mx-auto px-4 py-24">
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calculator
        </button>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Complete Your Order
          </h1>
          <p className="text-muted-foreground text-lg">
            Review your order details below
          </p>
        </div>

        {/* Simple Content */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {checkoutData ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Nodes:</span>
                    <span className="font-bold">{checkoutData.totalNodes || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Workflows:</span>
                    <span className="font-bold">{checkoutData.workflows?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold">${checkoutData.amount || 0}</span>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/checkout-stripe')}
                    className="w-full mt-6"
                    size="lg"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-4">
                    No checkout data found. Please start from the calculator.
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                  >
                    Go to Calculator
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Skip Footer for now */}
    </div>
  );
};

export default OrderReviewSimple;