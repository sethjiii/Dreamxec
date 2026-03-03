import { useEffect, useRef, useState } from "react";
import { useHeroCampaigns } from "../../../hooks/useHeroCampaigns";
import { CampaignCard } from "./CampaignCard";
import { SkeletonCard } from "./SkeletonCard";

const SPEED = 1;

export const CampaignCarousel = () => {
  const { data, loading, error } = useHeroCampaigns();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const items = data.length > 0 ? [...data, ...data, ...data] : [];

  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;
    const container = containerRef.current;
    let lastCheck = 0;

    const animate = () => {
      if (!isPausedRef.current && container) {
        container.scrollLeft += SPEED;
        const maxScroll = container.scrollWidth / 3;
        if (container.scrollLeft >= maxScroll) container.scrollLeft = 0;
        const now = Date.now();
        if (now - lastCheck > 100) { checkScroll(); lastCheck = now; }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data.length]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    isPausedRef.current = true;
    const targetScroll = direction === 'left'
      ? container.scrollLeft - 350
      : container.scrollLeft + 350;
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setTimeout(() => { isPausedRef.current = false; checkScroll(); }, 500);
  };

  return (
    <div className="w-full">

      {/* ── SECTION HEADING ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">

          {/* Left: title stack */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white"
                style={{ background: '#003366', border: '2px solid #003366' }}
              >
                ★ Live Now
              </span>
              <span
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-dreamxec-navy"
                style={{ border: '2px solid #003366', background: '#fff7ed' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FF7F00' }} />
                Active Campaigns
              </span>
            </div>

            <h2 className="font-black leading-none">
              <span className="block text-2xl sm:text-3xl md:text-4xl text-dreamxec-navy uppercase tracking-tight">
                Featured
              </span>
              <span className="relative inline-block mt-1">
                <span
                  className="absolute inset-0 translate-x-[4px] translate-y-[4px]"
                  style={{ background: '#0B9C2C' }}
                  aria-hidden
                />
                <span
                  className="relative z-10 inline-block px-3 py-0.5 text-2xl sm:text-3xl md:text-4xl text-white font-black uppercase tracking-tight"
                  style={{ background: '#003366', border: '3px solid #003366' }}
                >
                  Campaigns
                </span>
              </span>
            </h2>
          </div>

          {/* Right: subtle label */}
          <p className="text-[10px] sm:text-xs font-black text-dreamxec-navy/40 uppercase tracking-widest pb-1 hidden sm:block">
            Scroll to explore →
          </p>
        </div>

        {/* Accent rule */}
        <div className="flex items-center gap-2 mt-4 mb-0">
          <div className="h-1 w-10" style={{ background: '#FF7F00' }} />
          <div className="h-1 w-4" style={{ background: '#003366' }} />
          <div className="h-1 w-2" style={{ background: '#0B9C2C' }} />
        </div>
      </div>

      {/* ── CAROUSEL ── */}
      <div className="mt-6 relative w-full overflow-hidden">

        {/* Error state */}
        {error && (
          <div
            className="mx-4 mb-4 px-4 py-3 flex items-center gap-3 bg-white text-dreamxec-navy font-black text-xs uppercase tracking-wide"
            style={{ border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
          >
            <span className="text-base">🕐</span>
            <span>Campaigns are on their way — check back in a moment.</span>
          </div>
        )}

        {/* Left arrow */}
        {!loading && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white transition-all hover:bg-dreamxec-navy hover:translate-x-[-1px] hover:translate-y-[-1px] group"
            style={{ border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
            aria-label="Scroll left"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path
                d="M8 2L2 8L8 14"
                stroke="#003366"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-white transition-colors duration-150"
              />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {!loading && canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white transition-all hover:bg-dreamxec-navy hover:translate-x-[-1px] hover:translate-y-[-1px] group"
            style={{ border: '3px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}
            aria-label="Scroll right"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path
                d="M2 2L8 8L2 14"
                stroke="#003366"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-white transition-colors duration-150"
              />
            </svg>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={containerRef}
          onScroll={checkScroll}
          onMouseEnter={() => (isPausedRef.current = true)}
          onMouseLeave={() => (isPausedRef.current = false)}
          onTouchStart={() => (isPausedRef.current = true)}
          onTouchEnd={() => (isPausedRef.current = false)}
          className="flex gap-4 sm:gap-5 px-6 sm:px-8 overflow-x-auto overflow-y-hidden scrollbar-hide pb-2"
          style={{ alignItems: 'stretch', scrollBehavior: 'auto' }}
        >
          {/* Skeleton */}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px]">
                <SkeletonCard />
              </div>
            ))}

          {/* Cards */}
          {!loading &&
            items.map((campaign, i) => (
              <div
                key={`${campaign.id}-${i}`}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] h-auto"
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};