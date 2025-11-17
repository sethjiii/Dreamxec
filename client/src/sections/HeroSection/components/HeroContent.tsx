import { HeroTitle } from "./HeroTitle";
import { HeroDescription } from "./HeroDescription";

export const HeroContent = () => {
  return (
    <div
      role=""
      className="relative self-start box-border caret-transparent flex flex-col col-end-2 col-start-1 row-end-2 row-start-1 justify-self-center w-11/12 md:w-5/6 lg:w-3/4 xl:w-2/3 mx-auto mt-[35%] md:mt-[20%] lg:mt-[15%]"
    >
      <div className="relative self-center caret-transparent max-h-[99999px] max-w-[99999px] order-1 w-full mt-0 mb-[8%] md:mb-[10%]">
        <div className="relative inline-block w-full">
          
          {/* UPDATED: Increased inset for a larger glow to match larger SVGs. */}
          <div className="absolute -inset-6 md:-inset-8 bg-gradient-to-r from-dreamxec-saffron/10 via-white/50 to-dreamxec-green/10 rounded-3xl border-2 border-dreamxec-saffron shadow-xl md:shadow-2xl shadow-dreamxec-navy/20"></div>

          {/* UPDATED: Significantly larger and repositioned SVG Corner Accent - Top Left */}
          <img
            src="/assets/icon-pack/DX-ILLUSTRATION-PACK/1.svg"
            alt="Top Left Corner Decoration"
            className="absolute -top-16 -left-16 w-32 h-32 md:-top-20 md:-left-20 md:w-40 md:h-40 lg:-top-24 lg:-left-24 lg:w-48 lg:h-48 xl:-top-28 xl:-left-28 xl:w-56 xl:h-56 pointer-events-none"
          />

          {/* UPDATED: Significantly larger and repositioned SVG Corner Accent - Bottom Right */}
          <img
            src="/assets/icon-pack/DX-ILLUSTRATION-PACK/13.svg"
            alt="Bottom Right Corner Decoration"
            className="absolute -bottom-16 -right-16 w-32 h-32 md:-bottom-20 md:-right-20 md:w-40 md:h-40 lg:-bottom-24 lg:-right-24 lg:w-48 lg:h-48 xl:-bottom-28 xl:-right-28 xl:w-56 xl:h-56 pointer-events-none"
          />

          <h1 className="relative text-dreamxec-navy text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black caret-transparent leading-tight break-words text-center p-6 md:p-8 lg:p-10 xl:p-12">
            <span className="block mb-2 relative">
              <span className="relative z-10 text-dreamxec-sky-blue drop-shadow-[2px_2px_0_rgba(11,156,44,0.3)] md:drop-shadow-[3px_3px_0_rgba(11,156,44,0.3)]  hover:scale-102 transition-transform inline-block">
                Research Karega India
              </span>
            </span>
            <span className="block my-1 md:my-2 relative">
              <span className="relative z-10 text-dreamxec-babyPowder-50 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold drop-shadow-[3px_3px_0_rgba(0,0,128,0.3)] md:drop-shadow-[4px_4px_0_rgba(0,0,128,0.3)] hover:scale-105 transition-transform inline-block">
                Toh
              </span>
            </span>
            <span className="block mt-2 relative">
              <span className="relative z-10 text-dreamxec-sky-blue drop-shadow-[2px_2px_0_rgba(11,156,44,0.3)] md:drop-shadow-[3px_3px_0_rgba(11,156,44,0.3)] hover:scale-102 transition-transform inline-block">
                Badhega India
              </span>
            </span>
          </h1>
          
          {/* UPDATED: Significantly larger and repositioned SVG Corner Accent - Bottom Left */}
          <img
            src="/assets/icon-pack/DX-ILLUSTRATION-PACK/19.svg"
            alt="Bottom Left Corner Decoration"
            className="absolute -bottom-16 -left-16 w-32 h-32 md:-bottom-20 md:-left-20 md:w-40 md:h-40 lg:-bottom-24 lg:-left-24 lg:w-48 lg:h-48 xl:-bottom-28 xl:-left-28 xl:w-56 xl:h-56 pointer-events-none"
          />

          {/* UPDATED: Significantly larger and repositioned SVG Corner Accent - Top Right */}
          <img
            src="/assets/icon-pack/DX-ILLUSTRATION-PACK/11.svg"
            alt="Top Right Corner Decoration"
            className="absolute -top-16 -right-16 w-32 h-32 md:-top-20 md:-right-20 md:w-40 md:h-40 lg:-top-24 lg:-right-24 lg:w-48 lg:h-48 xl:-top-28 xl:-right-28 xl:w-56 xl:h-56 pointer-events-none"
          />

        </div>
      </div>
      <HeroTitle />
      <HeroDescription />
    </div>
  );
};
