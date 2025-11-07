export const PartnersSection = () => {
  const partners = [
    {
      name: "Tech Mahindra",
      logo: "https://via.placeholder.com/200x100/0B9C2C/FFFFFF?text=Tech+Mahindra",
      category: "Technology Partner"
    },
    {
      name: "Infosys Foundation",
      logo: "https://via.placeholder.com/200x100/000080/FFFFFF?text=Infosys",
      category: "Innovation Partner"
    },
    {
      name: "Tata Consultancy Services",
      logo: "https://via.placeholder.com/200x100/FF6B35/FFFFFF?text=TCS",
      category: "Strategic Partner"
    },
    {
      name: "Wipro Limited",
      logo: "https://via.placeholder.com/200x100/0B9C2C/FFFFFF?text=Wipro",
      category: "Technology Partner"
    },
    {
      name: "Microsoft India",
      logo: "https://via.placeholder.com/200x100/000080/FFFFFF?text=Microsoft",
      category: "Cloud Partner"
    },
    {
      name: "Amazon Web Services",
      logo: "https://via.placeholder.com/200x100/FF6B35/FFFFFF?text=AWS",
      category: "Infrastructure Partner"
    }
  ];

  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-dreamxec-cream via-white to-dreamxec-cream">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-dreamxec-saffron opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-dreamxec-green opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-dreamxec-navy opacity-5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-tricolor-horizontal h-3 w-48 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-navy mb-4">
            Our <span className="text-gradient-india">Corporate Partners</span>
          </h2>
          <p className="text-lg md:text-xl text-dreamxec-navy font-sans max-w-3xl mx-auto leading-relaxed">
            Collaborating with industry leaders to bridge the gap between academic innovation and real-world impact
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {partners.map((partner, index) => (
            <div 
              key={partner.name}
              className="card-pastel-offwhite rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 text-center hover:scale-105 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-tricolor-tag"></div>
              
              {/* Partner Logo */}
              <div className="bg-white rounded-lg border-2 border-dreamxec-navy p-4 mb-4 group-hover:shadow-lg transition-shadow">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className="w-full h-16 object-contain"
                />
              </div>
              
              {/* Partner Info */}
              <h3 className="text-xl font-bold text-dreamxec-navy font-display mb-2">
                {partner.name}
              </h3>
              <p className="text-dreamxec-orange font-semibold font-sans text-sm bg-dreamxec-cream px-3 py-1 rounded-full inline-block">
                {partner.category}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-8 max-w-2xl mx-auto">
            <div className="card-tricolor-tag"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-navy font-display mb-4 mt-4">
              Partner With Us
            </h3>
            <p className="text-dreamxec-navy font-sans text-lg mb-6 leading-relaxed">
              Join our mission to empower student innovation and drive technological advancement across India.
            </p>
            <button className="btn-primary-animated text-white font-bold py-3 px-8 rounded-lg font-display text-lg hover:scale-105 transition-transform">
              Become a Partner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
