import { StarDecoration } from "./icons/StarDecoration";

export type SectionHeaderProps = {
  variant: "simple" | "detailed";
  title?: string;
  subtitle?: string;
  showDecorations?: boolean;
  stages?: Array<{
    day: string;
    label: string;
  }>;
};

export const SectionHeader = (props: SectionHeaderProps) => {
  const { variant, title, subtitle, showDecorations = false, stages } = props;

  if (variant === "simple") {
    return (
      <div
        role=""
        className="relative caret-transparent flex flex-col mx-[0%] self-center box-border max-h-[99999px] max-w-[99999px] order-1 w-[331px] mt-[0%] mb-[30px] md:w-[76.7732%] md:mb-[5.76098%]"
      >
        <div className="absolute bg-transparent caret-transparent inset-0"></div>
        
        {/* Tricolor decorative line */}
        <div className="flex justify-center mb-6">
          <div className="bg-tricolor-horizontal h-2 w-32 rounded-full"></div>
        </div>
        
        {/* Decorative stars */}
        <div className="absolute -top-4 left-4">
          <StarDecoration className="w-8 h-8 md:w-10 md:h-10 opacity-40" color="#FF9933" />
        </div>
        <div className="absolute -top-4 right-4">
          <StarDecoration className="w-8 h-8 md:w-10 md:h-10 opacity-40" color="#138808" />
        </div>
        
        <div className="relative caret-transparent self-center max-h-[99999px] max-w-[99999px] order-1 break-words w-full px-4 mt-[0%] mb-4 mx-[0%] md:mb-6">
          <h2 className="text-dreamxec-navy text-3xl md:text-5xl font-extrabold caret-transparent leading-tight break-words text-center font-display">
            <span className="relative inline-block">
              {title || "At DreamXec, we're looking for"}
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-saffron-pastel opacity-30 -rotate-1"></div>
            </span>
          </h2>
        </div>
        <div className="relative self-center caret-transparent max-w-[99999px] order-2 break-words w-full mt-[0%] mx-[0%] px-4 md:px-[10%]">
          <h2 className="text-dreamxec-navy text-base md:text-xl caret-transparent leading-relaxed break-words text-center font-sans font-semibold">
            {subtitle ||
              "High-potential, innovative students and young professionals who are committed to transforming their industries through groundbreaking ideas, mentorship, and corporate collaboration"}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full py-8 md:py-16">
      {/* Main title */}
      <div className="text-center max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-neutral-700 text-3xl md:text-5xl font-bold leading-tight text-center">
          {title || "What WTFund brings to the table"}
        </h2>
      </div>
      
      {/* Stages */}
      {stages && stages.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-6xl mx-auto px-4">
          {stages.map((stage, index) => (
            <div key={`stage-${index}`} className="flex items-center">
              <div className="text-center">
                <div className="text-neutral-700 text-lg md:text-2xl font-medium mb-2">
                  {stage.day}
                </div>
                <div className="text-neutral-700 text-sm md:text-xl font-bold">
                  {stage.label}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="w-4 h-4 md:w-6 md:h-6 mx-4 md:mx-6">
                  <img
                    src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-6.svg"
                    alt="Arrow"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Decorative elements - simplified */}
      {showDecorations && (
        <>
          <div className="absolute top-4 left-4 w-16 h-16 opacity-20 pointer-events-none">
            <img
              src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/4dcc2d_8b1f3b1a918543b091599ea4f1da13e2~mv2.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute top-8 right-8 w-4 h-4 opacity-30 pointer-events-none">
            <img
              src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-22.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute bottom-4 right-12 w-6 h-6 opacity-30 pointer-events-none">
            <img
              src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-23.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </>
      )}
    </div>
  );
};
