import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
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
          <h1 className="font-sora font-bold text-4xl mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            request services, or contact us for support.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, process 
            transactions, and communicate with you.
          </p>

          <h2>3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            We may share your information with third-party service providers who perform services on 
            our behalf, such as payment processing and hosting.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. You may also 
            opt out of certain communications from us.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at hello@stackshift.com
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;