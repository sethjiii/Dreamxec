import { SectionHeader } from "../../components/SectionHeader";

export const WhatWeBringSection = () => {
  return (
    <section className="relative w-full bg-transparent py-8 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          variant="detailed"
          title="What DreamXec brings to the table"
          showDecorations={true}
          stages={[
            { day: "Stage 1", label: "CORPORATE PARTNERS" },
            { day: "Stage 2", label: "EXPERT MENTORS" },
            { day: "Stage 3", label: "INNOVATION BUILDERS" },
          ]}
        />
      </div>
    </section>
  );
};
