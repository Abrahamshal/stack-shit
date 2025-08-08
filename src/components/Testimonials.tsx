import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingDown, Clock, Youtube, Twitter, Play } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      type: "twitter",
      name: "@afuentest",
      role: "SEO Agency Owner",
      company: "Twitter",
      content: "This n8n automation has generated over $200k in sales for my clients... I use it every single day in my SEO agency and it works like a charm",
      engagement: "Real testimonial",
      date: "Augusto Fuentes",
      rating: 5
    },
    {
      type: "n8n",
      name: "jsreally",
      role: "70k workflow runs/month",
      company: "Reddit r/n8n",
      content: "We are on the cloud pro plan. It's much cheaper than make or zapier. We are saving over $600 a month so far switching from make.",
      source: "Reddit r/n8n",
      verified: true,
      rating: 5
    },
    {
      type: "twitter",
      name: "@maximpoulsen",
      role: "Developer",
      company: "Twitter",
      content: "I've said it many times. But I'll say it again. n8n is the GOAT. Anything is possible with n8n. You just need some technical knowledge + imagination. I'm actually looking to start a side project. Just to have an excuse to use n8n more 😅",
      engagement: "Real testimonial",
      date: "Maxim Poulsen",
      rating: 5
    },
    {
      type: "n8n",
      name: "Francois Laßl",
      role: "Developer",
      company: "n8n Community",
      content: "Found the holy grail of automation yesterday... What would've taken me 3 days to code from scratch? Done in 2 hours. The best part? If you still want to get your hands dirty with code, you can just drop in custom code nodes. Zero restrictions.",
      source: "n8n Community",
      verified: true,
      rating: 5
    },
    {
      type: "youtube",
      name: "Bart Slodyczka",
      role: "n8n Expert (21.3K subs)",
      company: "YouTube",
      content: "Analyzed 2,000+ real production n8n workflows",
      thumbnail: "44% of workflows use AI processing. Average workflow uses 14 nodes. Most users save 30-40 hours/month with n8n automations.",
      costSaved: "30-40 hrs/mo",
      views: "8K+ views",
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
            <span className="text-gradient"> n8n Users</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how users are saving using n8n
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-soft rounded-full flex items-center justify-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} className="text-primary" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-soft rounded-full flex items-center justify-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} className="text-primary" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;