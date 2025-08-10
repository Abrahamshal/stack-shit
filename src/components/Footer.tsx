import { Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-background border-t border-muted">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-sora font-bold text-2xl text-gradient mb-4">
              Stack Shift
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Professional workflow migration and automation strategy services. 
              Transform your SaaS automation stack to self-hosted n8n infrastructure.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail size={16} />
              <a 
                href="mailto:hello@stackshift.com" 
                className="hover:text-primary transition-colors"
              >
                hello@stackshift.com
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sora font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-primary transition-colors"
                >
                  Workflow Migration
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-primary transition-colors"
                >
                  Strategy Consulting
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-primary transition-colors"
                >
                  Managed Hosting
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sora font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('calendly')}
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-muted pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © {currentYear} Stack Shift. All rights reserved.
            </div>
            
            <div className="text-muted-foreground text-sm text-center md:text-right">
              <p className="mb-2">
                Trademark disclaimer: Zapier, Make.com, and n8n are trademarks of their respective owners.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4">
                <a 
                  href="https://zapier.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  Zapier <ExternalLink size={12} />
                </a>
                <a 
                  href="https://make.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  Make.com <ExternalLink size={12} />
                </a>
                <a 
                  href="https://n8n.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  n8n <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;