import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="font-sora font-bold text-4xl mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using Convert2n8n's services, you agree to be bound by these Terms of Service 
            and all applicable laws and regulations.
          </p>

          <h2>2. Services Description</h2>
          <p>
            Convert2n8n provides workflow migration, automation strategy consulting, and managed hosting 
            services for n8n automation platform.
          </p>

          <h2>3. Payment Terms</h2>
          <p>
            All services are subject to the pricing outlined on our website. Migration services are 
            billed separately at $20 per node unless otherwise specified.
          </p>

          <h2>4. Refund Policy</h2>
          <p>
            We offer a 30-day money-back guarantee for our monthly subscription services. Migration 
            services are non-refundable once work has commenced.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            Convert2n8n shall not be liable for any indirect, incidental, special, consequential, or 
            punitive damages resulting from your use of our services.
          </p>

          <h2>6. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at hello@convert2n8n.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;