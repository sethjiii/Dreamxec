export type FeatureCardProps = {
  title: string;
  description: string;
  iconUrl: string;
};

export const FeatureCard = (props: FeatureCardProps) => {
  return (
    <div className="relative w-full bg-dreamxec-navy border-dreamxec-orange border-solid border-4 md:border-8 shadow-orange-glow rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center p-6 md:p-8 gap-4 md:gap-6">
        {/* Icon */}
        <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
          <img
            src={props.iconUrl}
            alt="Feature icon"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-dreamxec-orange text-xl md:text-2xl font-bold font-display mb-3 md:mb-4">
            {props.title}
          </h3>
          <p className="text-dreamxec-cream text-sm md:text-base leading-relaxed font-sans">
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
};