import { CriteriaGrid } from "./components/CriteriaGrid";


export const LookingForSection = () => {
  return (
    <section className="relative self-stretch bg-transparent caret-transparent flex flex-col col-end-2 col-start-1 row-end-4 row-start-3 justify-self-stretch max-h-[99999px] max-w-[99999px] pointer-events-auto">
      <div className="absolute caret-transparent h-full [mask-repeat:no-repeat] [mask-size:100%] w-full overflow-hidden left-0 top-0">
        <div className="caret-transparent h-full"></div>
      </div>
      
      <CriteriaGrid />
    </section>
  );
};
