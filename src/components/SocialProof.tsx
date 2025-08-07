const SocialProof = () => {
  const integrations = [
    { name: 'Shopify', width: '110px' },
    { name: 'Airtable', width: '130px' },
    { name: 'HubSpot', width: '120px' },
    { name: 'Slack', width: '100px' },
    { name: 'Google Sheets', width: '140px' },
    { name: 'Notion', width: '100px' },
    { name: 'Stripe', width: '90px' },
    { name: 'Mailchimp', width: '120px' },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-muted-foreground font-medium text-lg">
            We integrate with
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Connect with 400+ apps through n8n's extensive integration library
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12 opacity-60 hover:opacity-80 transition-opacity duration-300">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              style={{ width: integration.width }}
            >
              <div className="text-xl font-semibold text-muted-foreground">
                {integration.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;