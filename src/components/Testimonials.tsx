import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingDown, Clock } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Director",
      company: "TechFlow Solutions",
      content: "Our migration to n8n cut our automation costs by 83% - from $2,400/month with Zapier to just $399 with managed n8n hosting. The migration was seamless and completed in 3 days.",
      costSaved: "83%",
      migrationTime: "3 days",
      rating: 5
    },
    {
      name: "Marcus Rodriguez", 
      role: "RevOps Manager",
      company: "GrowthStack Inc",
      content: "The strategy consultation helped us identify $18K in annual savings opportunities. We eliminated 15 different automation tools and consolidated everything into our own n8n instance.",
      costSaved: "76%",
      migrationTime: "5 days", 
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "CTO",
      company: "DataFlow Ventures",
      content: "Self-hosting with n8n gives us complete control and GDPR compliance. The managed hosting service handles all technical aspects while we focus on building workflows that drive our business.",
      costSaved: "71%",
      migrationTime: "2 days",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
            Real Results from 
            <span className="text-gradient"> Real Customers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how teams are saving thousands while gaining complete control over their automations
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-soft p-8 lg:p-12">
            <div className="text-center mb-8">
              {/* Star Rating */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Testimonial Content */}
              <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed mb-8 italic">
                "{testimonials[currentSlide].content}"
              </blockquote>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="flex items-center gap-2 bg-accent/10 rounded-lg px-4 py-2">
                  <TrendingDown size={20} className="text-accent" />
                  <span className="font-semibold text-accent">
                    {testimonials[currentSlide].costSaved} cost saved
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-4 py-2">
                  <Clock size={20} className="text-primary" />
                  <span className="font-semibold text-primary">
                    {testimonials[currentSlide].migrationTime} to migrate
                  </span>
                </div>
              </div>

              {/* Author */}
              <div>
                <h4 className="font-sora font-semibold text-lg">
                  {testimonials[currentSlide].name}
                </h4>
                <p className="text-muted-foreground">
                  {testimonials[currentSlide].role} at {testimonials[currentSlide].company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-soft rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-soft rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;