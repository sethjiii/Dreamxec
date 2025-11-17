import { StarDecoration } from "./icons/StarDecoration";

export const ApplyButton = () => {
  return (
    <div className="relative self-start caret-transparent hidden col-end-2 col-start-1 row-end-2 row-start-1 h-[89.5px] justify-self-end max-h-[99999px] max-w-[99999px] pointer-events-auto w-[232.403px] ml-[0%] mr-[1.67531%] my-[0%] md:self-center md:block md:col-end-4 md:col-start-3 md:mr-[-0.0056016%] md:w-[99.9939%]">
      {/* Decorative star */}
      <div className="absolute -top-3 -right-3 z-10">
        <StarDecoration className="w-8 h-8" color="#FF7F00" />
      </div>
      
      <a
        href="https://airtable.com/appaTroW9uFyIHCfw/pagqXo4d7xJgANThd/form"
        aria-label="Apply Now"
        className="btn-pastel-primary box-border caret-transparent block h-full min-h-2.5 min-w-2.5 w-full rounded-2xl"
      >
        <span className="items-center caret-transparent flex grow h-full justify-center w-full overflow-hidden px-4">
          <span className="text-white text-base font-bold caret-transparent block leading-tight max-w-full text-center mr-2 font-display md:text-xl">
            Apply Now
          </span>
          <span className="caret-transparent block shrink-0 h-5 w-5 md:h-6 md:w-6">
            <span className="caret-transparent flex h-5 w-5 md:h-6 md:w-6">
              <img
                src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/icon-2.svg"
                alt="Icon"
                className="caret-transparent flex h-5 w-5 md:h-6 md:w-6 brightness-0 invert"
              />
            </span>
          </span>
        </span>
      </a>
    </div>
  );
};

