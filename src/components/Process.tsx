import { Upload, Clock, Server, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const Process = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload JSON",
      description: "Export your workflows from Zapier or Make.com and upload the JSON files to our secure analysis tool.",
      step: 1,
      color: "text-blue-500"
    },
    {
      icon: Clock,
      title: "Fixed Quote in Minutes",
      description: "Our automated analysis counts nodes and complexity, providing you with transparent, fixed pricing instantly.",
      step: 2,
      color: "text-green-500"
    },
    {
      icon: Server,
      title: "We Port & Harden Your n8n Server",
      description: "Our experts migrate your workflows, set up security, and optimize performance. Free server setup for orders ≥ $500.",
      step: 3,
      color: "text-purple-500"
    },
    {
      icon: Phone,
      title: "Go-Live Call & 7-Day Support",
      description: "Personal onboarding session to walk through your new setup, plus a full week of priority support.",
      step: 4,
      color: "text-orange-500"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index} 
                className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
                    {step.step}
                  </div>
                </div>
                
                <CardHeader className="space-y-4">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 rounded-lg bg-secondary/50 flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  
                  <CardTitle className="text-lg font-sora">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>

                {/* Mobile Step Indicator - Dots between cards */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 -mb-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                    </div>
                  </div>
                )}
                
                {/* Desktop Connector - Subtle dots */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-0">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground/20 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground/20 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground/20 rounded-full" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Badge variant="secondary" className="px-6 py-3 text-base font-medium">
            🎉 Orders ≥ $500 include free n8n server installation & hardening
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default Process;