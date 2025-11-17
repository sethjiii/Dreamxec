import TypingEffect from "../../../components/TypingEffect";


export const HeroTitle = () => {
  return (
    <div
      role=""
      className="relative self-center box-border caret-transparent flex flex-col order-2 w-full mt-[10%] mb-[11.8029%] mx-[0%] md:w-[98.3104%] md:mb-[5.52669%]"
    >
      <div className="absolute bg-transparent caret-transparent inset-0"></div>

      {/* Decorative stars */}
      {/* <div className="absolute -top-8 left-4 md:left-12">
        <StarDecoration className="w-8 h-8 md:w-12 md:h-12" color="#FF9933" />
      </div>
      <div className="absolute -top-8 right-4 md:right-12">
        <StarDecoration className="w-8 h-8 md:w-12 md:h-12" color="#138808" />
      </div> */}

      <div className="relative self-center caret-transparent max-h-[99999px] max-w-[99999px] order-1 break-words w-full text-center mt-[0%] mb-[12.2875px] mx-[0%] md:mb-[16px] px-4">
        <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-popper font-extrabold caret-transparent leading-tight break-words text-center mb-4">
          <span className="block mb-3 relative inline-block">
            <span className="relative z-10">Igniting India's Next Generation of</span>
            
          </span>
          <span className="block relative">
            <span className="text-dreamxec-red-800 font-popper font-extrabold">
              <TypingEffect />
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-saffron-pastel opacity-30 "></div>
          </span>

        </h1>

        {/* Subtitle with hand-drawn underline */}
        <div className="mt-10 relative inline-block">
          <p className="text-dreamxec-gray-700 text-lg md:text-2xl font-sans font-semibold">
            Invest in the Minds That Will Define Our Tomorrow
          </p>
          
        </div>
      </div>

      <div
        role=""
        className="relative self-center box-border caret-transparent flex flex-wrap justify-center gap-3 md:gap-6 min-h-[18px] order-2 w-full mt-[0%] mx-[0%] md:min-h-0 px-4"
      >
        <div className="absolute bg-transparent caret-transparent inset-0"></div>

        {/* Pill-style badges with oil pastel design */}
        <div className="relative self-start caret-transparent order-1">
          <div className="card-pastel px-6 py-3 rounded-full transform ">
            <h2 className="text-dreamxec-navy text-sm md:text-lg font-sans font-bold caret-transparent leading-tight break-words text-center whitespace-nowrap">
              <span className=" font-extrabold">🤝 Mentorship</span>
            </h2>
          </div>
        </div>

        <div className="relative self-start caret-transparent order-2 flex items-center">

        </div>

        <div className="relative self-start caret-transparent order-3">
          <div className="card-pastel px-6 py-3 rounded-full transform ">
            <h2 className="text-dreamxec-navy text-sm md:text-lg font-sans font-bold caret-transparent leading-tight break-words text-center whitespace-nowrap">
              <span className=" font-extrabold">💡 Student Innovation</span>
            </h2>
          </div>
        </div>

        <div className="relative self-start caret-transparent order-4 flex items-center">

        </div>

        <div className="relative self-start caret-transparent order-5">
          <div className="card-pastel px-6 py-3 rounded-full transform ">
            <h2 className="text-dreamxec-navy text-sm md:text-lg font-sans font-bold caret-transparent leading-tight break-words text-center whitespace-nowrap">
              <span className=" font-extrabold">🚀 Opportunity</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
