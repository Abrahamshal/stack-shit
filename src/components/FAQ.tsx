import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do you count nodes for pricing?",
      answer: "We analyze your exported JSON workflow files and count each unique \"id\" occurrence, which represents individual automation steps or nodes. This includes triggers, actions, filters, and conditional logic blocks. Our automated analysis tool gives you transparent, instant pricing based on exact node count."
    },
    {
      question: "What's the typical turnaround time for migration?",
      answer: "Most migrations are completed within 3-7 business days depending on complexity. Simple workflows (10-50 nodes) typically take 2-3 days, while complex enterprise workflows (100+ nodes) may take up to 7 days. We provide detailed timelines during the quote process."
    },
    {
      question: "Do I need my own server for self-hosting?",
      answer: "Not necessarily. We offer three options: 1) Use our managed hosting service (recommended for most), 2) We can set up n8n on your existing cloud infrastructure, or 3) We provide guidance for self-installation on your own servers. For orders ≥$500, we include free server setup."
    },
    {
      question: "Can you migrate custom nodes and integrations?",
      answer: "Yes! We can migrate most custom nodes and will recreate any custom integrations using n8n's flexible HTTP request nodes or custom JavaScript functions. If a direct equivalent doesn't exist, we'll build custom solutions to maintain your workflow functionality."
    },
    {
      question: "Is n8n GDPR compliant for EU businesses?",
      answer: "Absolutely. Self-hosted n8n gives you complete data control, making GDPR compliance much easier since your data never leaves your infrastructure. We can help configure your setup to meet specific compliance requirements and provide documentation for audits."
    },
    {
      question: "Do you provide training for our team?",
      answer: "Yes! All plans include onboarding training. Starter plans get a 60-minute training session, Growth plans include 2 hours of training, and Enterprise customers receive comprehensive team training. We also provide documentation and best practices guides."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sora font-bold text-3xl lg:text-5xl mb-6">
              Frequently Asked 
              <span className="text-gradient"> Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about migrating to n8n
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-muted/50 last:border-b-0">
                  <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                    <span className="font-sora font-semibold text-lg pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <a 
              href="mailto:hello@stackshift.com"
              className="text-primary hover:text-primary-light font-semibold transition-colors"
            >
              Contact us at hello@stackshift.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;