import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const HeaderFixed = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white/98 backdrop-blur-xl shadow-premium border-b border-gold/20`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div 
            className="font-bold text-2xl cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            Convert2n8n
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="cta" 
              size="lg"
              onClick={() => handleNavigation('/')}
              className="font-bold"
            >
              Back to Home
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 p-4 shadow-soft">
            <Button 
              variant="cta" 
              size="lg" 
              className="w-full mt-4 font-bold"
              onClick={() => handleNavigation('/')}
            >
              Back to Home
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default HeaderFixed;