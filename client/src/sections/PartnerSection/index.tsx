export const PartnersSection = () => {
  const partners = [
    {
      name: "Q: Is my donation tax-deductible? (Corporate/Foundation)",
      logo: "https://via.placeholder.com/200x100/0B9C2C/FFFFFF?text=Tech+Mahindra",
      category: "A: Yes! 80G certificate auto-generated. 50% deduction."
    },
    {
      name: "Q: Can I donate anonymously?",
      logo: "https://via.placeholder.com/200x100/000080/FFFFFF?text=Infosys",
      category: "A: Yes, you can choose to remain anonymous when making a donation."
    },
    {
      name: "Q:What if the project fails?",
      logo: "https://via.placeholder.com/200x100/FF6B35/FFFFFF?text=TCS",
      category: "A: Rare (95% completion rate). If it happens, we transparently share reasons. Funds already used can't be refunded, but unused funds can be redirected."
    },
    {
      name: "Q: Can I donate from outside India?",
      logo: "https://via.placeholder.com/200x100/0B9C2C/FFFFFF?text=Wipro",
      category: "A: Yes! We accept international cards and wire transfers."
    },
    {
      name: "Q: Do I get to meet the students?",
      logo: "https://via.placeholder.com/200x100/000080/FFFFFF?text=Microsoft",
      category: "A: For donations ₹25,000+, yes! Video calls or in-person if you're in the same city."
    },
    {
      name: "Q: How is DreamXec different from Ketto/Milaap?",
      logo: "https://via.placeholder.com/200x100/FF6B35/FFFFFF?text=AWS",
      category: "A: We're India's ONLY platform exclusively for student research projects. Not medical fundraisers or personal causes—pure innovation support."
    }
  ];

  return (
    <section className="relative py-16 px-4 ">
      

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-tricolor-horizontal h-3 w-48 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-berkeley-blue mb-4">
           Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-dreamxec-berkeley-blue font-sans max-w-3xl mx-auto leading-relaxed">
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
            <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue font-display mb-4 mt-4">
              Partner With Us
            </h3>
            <p className="text-dreamxec-navy font-sans text-lg mb-6 leading-relaxed">
              Join our mission to empower student innovation and drive technological advancement across India.
            </p>
            <button className="btn-primary-animated text-dreamxec-gray-900 font-bold py-3 px-8 rounded-lg font-display box-border text-lg hover:scale-105 transition-transform">
              Become a Partner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
