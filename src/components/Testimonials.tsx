import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingDown, Clock, Youtube, Twitter, Play } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      type: "youtube",
      name: "Alex Thompson",
      role: "Tech Review Channel",
      company: "DevOps Weekly",
      content: "n8n vs Zapier: Why I saved $2,000/month by switching",
      thumbnail: "I tested both platforms extensively. n8n's self-hosted approach gives you unlimited executions for a fraction of the cost.",
      costSaved: "$2,000/mo",
      views: "45K views",
      rating: 5
    },
    {
      type: "twitter", 
      name: "@automation_guru",
      role: "Automation Consultant",
      company: "Twitter",
      content: "Just migrated a client from Zapier to @n8n_io. They went from paying $600/month for 50k tasks to $50/month hosting their own instance. 🤯",
      engagement: "234 likes • 52 retweets",
      date: "2 weeks ago",
      rating: 5
    },
    {
      type: "youtube",
      name: "Sarah's Automation Lab",
      role: "Workflow Specialist",
      company: "YouTube",
      content: "Complete n8n Setup Guide: Save 90% on Automation Costs",
      thumbnail: "Step-by-step guide showing how I replaced my entire automation stack with n8n. Includes real cost comparisons.",
      costSaved: "90%",
      views: "28K views",
      rating: 5
    },
    {
      type: "twitter",
      name: "@startup_steve",
      role: "Startup Founder",
      company: "Twitter",
      content: "Switching to n8n was the best decision for our startup. We're saving $800/month and have WAY more flexibility. Stack Shift handled the entire migration in 3 days. 🚀",
      engagement: "156 likes • 31 retweets",
      date: "1 month ago",
      rating: 5
    },
    {
      type: "n8n",
      name: "Community Testimonial",
      role: "n8n Forum User",
      company: "n8n Community",
      content: "I saved $15,000 annually by moving from Zapier to n8n. The community support is incredible and the platform is so much more powerful.",
      source: "n8n Community Forum",
      verified: true,
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
              {/* Platform Icon */}
              <div className="flex justify-center mb-4">
                {testimonials[currentSlide].type === 'youtube' && (
                  <div className="bg-red-100 p-3 rounded-full">
                    <Youtube size={24} className="text-red-600" />
                  </div>
                )}
                {testimonials[currentSlide].type === 'twitter' && (
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Twitter size={24} className="text-blue-600" />
                  </div>
                )}
                {testimonials[currentSlide].type === 'n8n' && (
                  <div className="flex justify-center gap-1">
                    {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                      <Star key={i} size={20} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Content */}
              {testimonials[currentSlide].type === 'youtube' && (
                <div className="mb-6">
                  <h3 className="font-sora font-bold text-xl mb-3 flex items-center justify-center gap-2">
                    <Play size={20} className="text-red-600" />
                    {testimonials[currentSlide].content}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {testimonials[currentSlide].thumbnail}
                  </p>
                  <div className="flex justify-center gap-4 text-sm">
                    <span className="text-muted-foreground">{testimonials[currentSlide].views}</span>
                    {testimonials[currentSlide].costSaved && (
                      <span className="text-accent font-semibold">Saved {testimonials[currentSlide].costSaved}</span>
                    )}
                  </div>
                </div>
              )}
              
              {testimonials[currentSlide].type === 'twitter' && (
                <div className="mb-6">
                  <blockquote className="text-lg text-foreground leading-relaxed mb-4">
                    {testimonials[currentSlide].content}
                  </blockquote>
                  <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                    <span>{testimonials[currentSlide].engagement}</span>
                    <span>•</span>
                    <span>{testimonials[currentSlide].date}</span>
                  </div>
                </div>
              )}
              
              {testimonials[currentSlide].type === 'n8n' && (
                <div className="mb-6">
                  <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed mb-4 italic">
                    "{testimonials[currentSlide].content}"
                  </blockquote>
                  <div className="flex justify-center items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{testimonials[currentSlide].source}</span>
                    {testimonials[currentSlide].verified && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Author */}
              <div className="mt-6">
                <h4 className="font-sora font-semibold text-lg">
                  {testimonials[currentSlide].name}
                </h4>
                <p className="text-muted-foreground">
                  {testimonials[currentSlide].role}
                  {testimonials[currentSlide].company !== 'Twitter' && 
                   testimonials[currentSlide].company !== 'YouTube' && 
                   ` • ${testimonials[currentSlide].company}`}
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