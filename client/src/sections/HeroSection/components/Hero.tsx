export const Hero = () => {
  return (
    <div className="relative self-center caret-transparent w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="relative inline-block w-full">
        {/* Premium glow border - Responsive inset */}
        <div className="absolute -inset-3 sm:-inset-4 md:-inset-6 lg:-inset-8 bg-gradient-to-r from-dreamxec-saffron/10 via-white/50 to-dreamxec-green/10 rounded-2xl sm:rounded-3xl border sm:border-2 border-dreamxec-saffron shadow-lg sm:shadow-xl md:shadow-2xl shadow-dreamxec-navy/20"></div>

        {/* Main Heading */}
        <h1 className="relative text-dreamxec-navy text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-black caret-transparent leading-tight break-words text-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 transition-all duration-300">
          <span className="block mb-1 sm:mb-2">
            <span className="text-dreamxec-berkeley-blue inline-block">
              Research Karega India
            </span>
          </span>

          <span className="block my-1 sm:my-1.5 md:my-2">
            <span className="text-dreamxec-babyPowder-50 font-bold inline-block">
              Toh
            </span>
          </span>

          <span className="block mt-1 sm:mt-2">
            <span className="text-dreamxec-berkeley-blue inline-block">
              Badhega India
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
};
