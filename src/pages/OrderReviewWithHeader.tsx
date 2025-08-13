import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Create a simple header for testing
const SimpleHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl">Stack Shift</div>
        <Button 
          onClick={() => window.location.href = '/'} 
          size="sm"
        >
          Home
        </Button>
      </div>
    </header>
  );
};

const OrderReviewWithHeader = () => {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('OrderReviewWithHeader mounting');
    
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
      <SimpleHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
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
    </div>
  );
};

export default OrderReviewWithHeader;