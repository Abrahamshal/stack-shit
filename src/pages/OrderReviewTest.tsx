import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OrderReviewTest = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-4">Order Review Test Page</h1>
      <p className="mb-4">If you can see this, the component is rendering.</p>
      <Button onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );
};

export default OrderReviewTest;