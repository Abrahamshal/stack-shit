const SocialProof = () => {
  const logos = [
    { name: 'HubSpot', width: '120px' },
    { name: 'Shopify', width: '110px' },
    { name: 'Notion', width: '100px' },
    { name: 'Airtable', width: '130px' },
  ];

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-muted-foreground font-medium">
            Trusted by teams using leading platforms
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-60 hover:opacity-80 transition-opacity duration-300">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              style={{ width: logo.width }}
            >
              <div className="text-2xl font-bold text-muted-foreground">
                {logo.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;