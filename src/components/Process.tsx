import { Upload, Clock, Server, Phone } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      icon: <Upload size={32} className="text-accent" />,
      title: "Upload JSON",
      description: "Export your workflows from Zapier or Make.com and upload the JSON files to our secure analysis tool.",
      step: "01"
    },
    {
      icon: <Clock size={32} className="text-primary" />,
      title: "Fixed Quote in Minutes",
      description: "Our automated analysis counts nodes and complexity, providing you with transparent, fixed pricing instantly.",
      step: "02"
    },
    {
      icon: <Server size={32} className="text-accent" />,
      title: "We Port & Harden Your n8n Server",
      description: "Our experts migrate your workflows, set up security, and optimize performance. Free server setup for orders ≥ $500.",
      step: "03"
    },
    {
      icon: <Phone size={32} className="text-primary" />,
      title: "Go-Live Call & 7-Day Support",
      description: "Personal onboarding session to walk through your new setup, plus a full week of priority support.",
      step: "04"
    }
  ];

  return (
    <section id="process" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Simple 4-Step 
            <span className="text-gradient"> Migration Process</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From upload to go-live in days, not weeks. Transparent pricing with no hidden surprises.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2" style={{ zIndex: 1 }} />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 mx-auto lg:mx-0 pulse-glow">
                  {step.step}
                </div>
                
                {/* Content */}
                <div className="text-center lg:text-left">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0">
                    {step.icon}
                  </div>
                  <h3 className="font-sora font-semibold text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden w-1 h-8 bg-gradient-to-b from-primary to-accent mx-auto mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-6 py-3 rounded-full font-semibold">
            🎉 Orders ≥ $500 include free n8n server installation & hardening
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;