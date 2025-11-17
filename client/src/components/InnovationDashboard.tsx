import { LightBulbIcon, HandshakeIcon, LabFlaskIcon, ChartIcon } from "./icons";
import { StarDecoration } from "./icons/StarDecoration";

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "saffron" | "green" | "navy";
  stats?: {
    label: string;
    value: string;
  };
}

const DashboardCard = ({ icon, title, description, color, stats }: DashboardCardProps) => {
  const borderColors = {
    saffron: "border-dreamxec-saffron",
    green: "border-dreamxec-green",
    navy: "border-dreamxec-navy"
  };
  
  const bgColors = {
    saffron: "bg-saffron-pastel",
    green: "bg-green-pastel",
    navy: "bg-navy-pastel"
  };

  return (
    <div className={`card-pastel p-6 md:p-8 card-pastel-tilt-right hover:card-pastel-tilt-left transition-transform duration-300`}>
      {/* Icon with tricolor header bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`icon-pastel-container ${bgColors[color]} bg-opacity-20`}>
          {icon}
        </div>
        <div className="absolute top-0 left-0 right-0 h-2 bg-tricolor-horizontal"></div>
      </div>
      
      {/* Title */}
      <h3 className="text-dreamxec-navy text-2xl md:text-3xl font-display font-bold mb-3 relative">
        {title}
        <StarDecoration className="absolute -top-2 -right-8 w-6 h-6" color="#FF9933" />
      </h3>
      
      {/* Description */}
      <p className="text-dreamxec-navy text-base md:text-lg mb-4 leading-relaxed">
        {description}
      </p>
      
      {/* Stats if provided */}
      {stats && (
        <div className={`mt-4 pt-4 border-t-4 ${borderColors[color]} border-dashed`}>
          <p className="text-sm text-dreamxec-navy opacity-70 font-semibold mb-1">
            {stats.label}
          </p>
          <p className={`text-3xl font-display font-extrabold text-dreamxec-${color}`}>
            {stats.value}
          </p>
        </div>
      )}
    </div>
  );
};

export const InnovationDashboard = () => {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-saffron-pastel rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-pastel rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <div className="bg-tricolor-horizontal h-2 w-32 mb-4"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-dreamxec-navy mb-4">
            India's Innovation <span className="text-dreamxec-saffron">Ecosystem</span>
          </h2>
          <p className="text-lg md:text-xl text-dreamxec-navy opacity-80 max-w-3xl mx-auto">
            Building tomorrow's leaders through collaboration, mentorship, and cutting-edge innovation
          </p>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <DashboardCard
            icon={<LightBulbIcon className="w-12 h-12 md:w-16 md:h-16" />}
            title="Student Projects"
            description="Empowering students to transform ideas into reality with mentorship and resources."
            color="saffron"
            stats={{
              label: "Active Projects",
              value: "500+"
            }}
          />
          
          <DashboardCard
            icon={<HandshakeIcon className="w-12 h-12 md:w-16 md:h-16" />}
            title="Expert Mentors"
            description="Industry leaders guiding the next generation of innovators and entrepreneurs."
            color="green"
            stats={{
              label: "Mentors Available",
              value: "200+"
            }}
          />
          
          <DashboardCard
            icon={<LabFlaskIcon className="w-12 h-12 md:w-16 md:h-16" />}
            title="Innovation Labs"
            description="State-of-the-art facilities for research, development, and prototyping."
            color="navy"
            stats={{
              label: "Lab Facilities",
              value: "50+"
            }}
          />
          
          <DashboardCard
            icon={<ChartIcon className="w-12 h-12 md:w-16 md:h-16" />}
            title="Funding Progress"
            description="Track your journey from idea to funded startup with transparent milestones."
            color="saffron"
            stats={{
              label: "Total Funding",
              value: "₹10Cr+"
            }}
          />
        </div>
      </div>
    </section>
  );
};
