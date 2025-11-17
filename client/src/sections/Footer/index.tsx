import { FooterContent } from "./components/FooterContent";

export const Footer = () => {
  return (
    <div className="relative self-stretch box-border caret-transparent grid col-end-2 col-start-1 row-end-[14] row-start-13 grid-cols-[1fr] grid-rows-[1fr] justify-self-stretch">
      <section className="relative bg-transparent caret-transparent flex flex-col max-h-[99999px] max-w-[99999px] pointer-events-auto">
        
        {/* Removed py-[2%] padding which was causing the bottom gap */}
        <div className="relative cover caret-transparent grid grow grid-cols-[minmax(0px,1fr)] grid-rows-[minmax(204.891px,auto)] pointer-events-none px-[0%] md:grid-rows-[minmax(189.875px,auto)]">
          <FooterContent />
        </div>
      </section>
    </div>
  );
};