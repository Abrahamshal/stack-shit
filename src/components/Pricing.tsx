import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Pay-As-You-Go Migration",
      price: "$20",
      period: "per node",
      description: "Perfect for one-time migrations",
      features: [
        "Complete workflow analysis",
        "Full migration & testing", 
        "Data validation",
        "Basic documentation",
        "Email support"
      ],
      footnote: "Minimum 10 nodes",
      cta: "Get Quote",
      popular: false
    },
    {
      name: "Starter",
      price: "$199",
      period: "/month",
      description: "Ideal for small teams getting started",
      features: [
        "2 hours monthly development",
        "Weekly automated backups",
        "Security updates",
        "Basic monitoring",
        "Email support",
        "Free migration (>$500 orders)"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Growth", 
      price: "$399",
      period: "/month",
      description: "Perfect for scaling businesses",
      features: [
        "6 hours monthly development",
        "Daily automated backups",
        "Priority SLA support",
        "Advanced monitoring & alerts",
        "Custom integrations",
        "Free migration & server setup"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For mission-critical operations", 
      features: [
        "Unlimited development hours",
        "High-availability cluster",
        "24×7 pager support",
        "Dedicated success manager",
        "Custom SLA agreements",
        "White-label options"
      ],
      cta: "Talk to Us",
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
            Transparent Pricing for 
            <span className="text-accent"> Every Scale</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            No hidden fees, no surprises. Choose the plan that grows with your automation needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                onClick={() => scrollToSection(plan.name === "Enterprise" ? "contact" : "calendly")}
              >
                {plan.cta}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            * Orders ≥ $500 include free n8n server installation & hardening
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;