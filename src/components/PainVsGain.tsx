import { X, Check, DollarSign, Lock, Shield, Infinity, Zap, Settings } from 'lucide-react';

const PainVsGain = () => {
  const pains = [
    {
      icon: <DollarSign className="text-destructive" size={24} />,
      title: "Pay Per Task Fees",
      description: "Every automation run costs money, limiting your scaling potential"
    },
    {
      icon: <Lock className="text-destructive" size={24} />,
      title: "Platform Lock-in",
      description: "Vendor dependency makes switching costly and complex"
    },
    {
      icon: <Shield className="text-destructive" size={24} />,
      title: "Data Privacy Risks",
      description: "Your sensitive business data flows through third-party servers"
    }
  ];

  const gains = [
    {
      icon: <Infinity className="text-accent" size={24} />,
      title: "Unlimited Tasks",
      description: "Run as many automations as you need with flat monthly cost"
    },
    {
      icon: <Zap className="text-accent" size={24} />,
      title: "Full Control",
      description: "Own your infrastructure, customize everything to your needs"
    },
    {
      icon: <Settings className="text-accent" size={24} />,
      title: "Self-Hosted Security",
      description: "Keep your data on your servers, maintain complete privacy"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Stop Paying Per Task, Start 
            <span className="text-gradient"> Owning Your Stack</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform from expensive SaaS dependency to cost-effective self-hosted automation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Pain Points */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="font-sora font-semibold text-2xl lg:text-3xl text-destructive mb-4 flex items-center justify-center lg:justify-start gap-3">
                <X size={32} />
                SaaS Automation Pains
              </h3>
            </div>
            
            {pains.map((pain, index) => (
              <div key={index} className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  {pain.icon}
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{pain.title}</h4>
                    <p className="text-muted-foreground">{pain.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gains */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="font-sora font-semibold text-2xl lg:text-3xl text-accent mb-4 flex items-center justify-center lg:justify-start gap-3">
                <Check size={32} />
                Self-Hosted n8n Gains
              </h3>
            </div>
            
            {gains.map((gain, index) => (
              <div key={index} className="bg-accent/5 border border-accent/20 rounded-xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  {gain.icon}
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{gain.title}</h4>
                    <p className="text-muted-foreground">{gain.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainVsGain;