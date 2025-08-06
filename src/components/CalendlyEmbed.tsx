import { Calendar, Clock, DollarSign } from 'lucide-react';

const CalendlyEmbed = () => {
  return (
    <section id="calendly" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
              Book a 60-min 
              <span className="text-gradient"> Automation Strategy Call</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get expert guidance on optimizing your workflow architecture - $149
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-3 shadow-sm">
                <Clock size={20} className="text-primary" />
                <span className="font-medium">60 minutes</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-3 shadow-sm">
                <DollarSign size={20} className="text-accent" />
                <span className="font-medium">$149 flat rate</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-3 shadow-sm">
                <Calendar size={20} className="text-primary" />
                <span className="font-medium">Same-day availability</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {/* Placeholder Calendly iframe */}
            <div className="aspect-[4/3] lg:aspect-[16/10] bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
              <div className="text-center p-8">
                <Calendar size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sora font-semibold text-xl mb-2">Calendly Booking Widget</h3>
                <p className="text-muted-foreground mb-6">
                  Interactive calendar will be embedded here
                </p>
                <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                  <code>
                    &lt;iframe src="https://calendly.com/flowstrate/strategy-call" 
                    <br />width="100%" height="600px"&gt;&lt;/iframe&gt;
                  </code>
                </div>
              </div>
            </div>
            
            {/* What's Included */}
            <div className="p-8 border-t border-muted">
              <h4 className="font-sora font-semibold text-lg mb-4">What's included in your strategy call:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <span className="text-muted-foreground">Complete process audit & analysis</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <span className="text-muted-foreground">ROI optimization recommendations</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <span className="text-muted-foreground">Technology stack review</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <span className="text-muted-foreground">Custom implementation roadmap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendlyEmbed;