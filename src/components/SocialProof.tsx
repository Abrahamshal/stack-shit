const SocialProof = () => {
  const integrations = [
    'Slack',
    'Google Sheets',
    'HubSpot',
    'Salesforce',
    'Stripe',
    'Shopify',
    'Airtable',
    'Notion',
    'Discord',
    'Mailchimp',
    'GitHub',
    'GitLab',
    'Dropbox',
    'Twitter',
    'LinkedIn',
    'Facebook',
    'Instagram',
    'WhatsApp',
    'Telegram',
    'Microsoft Teams',
    'Zoom',
    'Calendly',
    'Typeform',
    'Jira',
    'Asana',
    'Trello',
    'Monday.com',
    'ClickUp',
    'Todoist',
    'Evernote',
    'PayPal',
    'Square',
    'QuickBooks',
    'Xero',
    'FreshBooks',
    'SendGrid',
    'Twilio',
    'AWS',
    'Google Cloud',
    'Azure',
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedIntegrations = [...integrations, ...integrations];

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-infinite-scroll {
          animation: scroll-left 40s linear infinite;
        }
        
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <section className="py-12 bg-muted/50 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Integrate with 400+ apps using n8n
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect your entire tech stack with n8n's extensive library of integrations
            </p>
          </div>
          
          <div className="relative">
            <div className="flex gap-8 items-center animate-infinite-scroll">
              {duplicatedIntegrations.map((integration, index) => (
                <div
                  key={`${integration}-${index}`}
                  className="flex-shrink-0 px-4 py-2 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  <span className="text-lg font-medium text-muted-foreground whitespace-nowrap">
                    {integration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SocialProof;