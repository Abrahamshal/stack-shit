import { Button } from '@/components/ui/button';
import { RefreshCw, Brain, Cloud, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <RefreshCw size={40} className="text-primary" />,
      title: "Workflow Migration",
      description: "Seamlessly port your Zapier and Make.com automations to your private n8n instance. We handle the technical complexity while you maintain business continuity.",
      price: "$20 per node",
      features: ["Complete workflow analysis", "Data mapping & validation", "Testing & optimization", "Go-live support"]
    },
    {
      icon: <Brain size={40} className="text-accent" />,
      title: "Automation Strategy",
      description: "60-minute deep-dive consultation to optimize your automation architecture, identify new opportunities, and create a scalable workflow strategy.",
      price: "$149 / session",
      features: ["Process audit", "ROI optimization", "Tech stack review", "Implementation roadmap"]
    },
    {
      icon: <Cloud size={40} className="text-primary" />,
      title: "Managed n8n Hosting",
      description: "Fully managed n8n infrastructure with continuous improvements, monitoring, backups, and expert support to keep your automations running smoothly.",
      price: "From $199/mo",
      features: ["24/7 monitoring", "Automatic backups", "Security updates", "Performance optimization"]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Complete Automation 
            <span className="text-gradient"> Transformation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From migration to strategy to managed hosting - we handle every aspect of your n8n journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-soft card-hover group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-sora font-semibold text-xl lg:text-2xl mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="text-primary font-bold text-lg mb-4">
                  {service.price}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full group-hover:variant-hero group-hover:text-white transition-all duration-300"
                onClick={() => scrollToSection('pricing')}
              >
                Learn More
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;