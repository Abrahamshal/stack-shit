import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Migration Package",
      price: "$20",
      period: "per node",
      description: "Complete workflow migration service",
      features: [
        "Full workflow analysis & mapping",
        "Complete migration & testing", 
        "Data validation & optimization",
        "Documentation & training",
        "30-day post-migration support",
        "FREE n8n setup on orders $1,000+"
      ],
      footnote: "🎁 Orders over $1,000 include FREE setup",
      cta: "Get Started",
      popular: false
    },
    {
      name: "Maintenance Plan",
      price: "$200",
      period: "/month",
      description: "Essential automation maintenance",
      features: [
        "Weekly automation backups",
        "Security updates",
        "Basic monitoring",
        "Email support",
        "Free migration included",
        "Monitor major bugs, logs, and fix/optimize"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Development Plan", 
      price: "$499",
      period: "/month",
      description: "For growing automation needs",
      features: [
        "Everything in Maintenance Plan",
        "Monthly development hours included",
        "Priority SLA support",
        "Advanced monitoring & alerts",
        "Custom integrations",
        "Dedicated support channel"
      ],
      cta: "Get Started",
      popular: false
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 section-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6 text-white">
            Simple, Transparent 
            <span className="text-accent"> Pricing</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Choose the right level of support for your automation transformation journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
              plan.popular 
                ? 'border-accent shadow-accent/20 shadow-lg' 
                : 'border-white/10 hover:border-white/20'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star size={14} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-sora font-semibold text-xl text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-3xl lg:text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-white/60 ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-white/70 text-sm">
                  {plan.description}
                </p>
                {plan.footnote && (
                  <p className="text-accent text-xs mt-2">
                    {plan.footnote}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? "cta" : "outline-light"}
                className="w-full"
                onClick={() => scrollToSection(plan.name === "Migration Package" ? "quote-calculator" : "calendly")}
              >
                {plan.cta}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-white/60 text-sm">
            * Migration is billed separately and not included in monthly plans (except where noted)
          </p>
          <div className="space-y-2">
            <p className="text-white/80 text-base">
              Need a complex buildout?
            </p>
            <Button 
              variant="cta" 
              size="lg"
              className="mt-2"
              onClick={() => scrollToSection('calendly')}
            >
              Book a Call
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;