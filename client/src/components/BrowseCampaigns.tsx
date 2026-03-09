import { useState, useEffect, useRef, useCallback } from 'react';
import CampaignCard from './CampaignCard';
import { StarDecoration } from './icons/StarDecoration';
import { FooterContent } from '../sections/Footer/components/FooterContent';
import { getPublicUserProjects } from '../services/userProjectService';
import { mapUserProjectToCampaign } from '../services/mappers';
import type { Campaign } from '../types';

const LIMIT = 20;

/* ── Icons ── */
const SearchIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SlidersIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
    <line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" />
    <line x1="18" x2="22" y1="16" y2="16" />
  </svg>
);

/* ──────────────────────────────────────────────
   SKELETON CARD
─────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      style={{
        background: '#fff',
        border: '2.5px solid #111',
        borderRadius: '12px',
        boxShadow: '5px 5px 0 #111',
        overflow: 'hidden',
      }}
    >
      <div className="browse-skeleton-shimmer" style={{ height: 200 }} />
      <div style={{ padding: '16px' }}>
        <div className="browse-skeleton-shimmer" style={{ height: 22, borderRadius: 6, marginBottom: 10, width: '75%' }} />
        <div className="browse-skeleton-shimmer" style={{ height: 16, borderRadius: 6, marginBottom: 8, width: '55%' }} />
        <div className="browse-skeleton-shimmer" style={{ height: 10, borderRadius: 4, marginBottom: 14, width: '100%' }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div className="browse-skeleton-shimmer" style={{ height: 24, width: 70, borderRadius: 5 }} />
          <div className="browse-skeleton-shimmer" style={{ height: 24, width: 90, borderRadius: 5 }} />
        </div>
        <div className="browse-skeleton-shimmer" style={{ height: 40, borderRadius: 8 }} />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   INITIAL FULL-PAGE SKELETON (first load)
─────────────────────────────────────────────── */
function InitialSkeleton() {
  return (
    <div>
      <div className="mb-10">
        <div
          className="browse-skeleton-shimmer"
          style={{ height: 48, width: 160, borderRadius: 8 }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   LOAD-MORE SPINNER (bottom of page)
─────────────────────────────────────────────── */
function LoadMoreSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '40px 0 20px' }}>
      <div
        style={{
          width: 52,
          height: 52,
          border: '4px solid #003366',
          borderTopColor: '#FF7F00',
          borderRadius: '50%',
          boxShadow: '3px 3px 0 #111',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      <p style={{
        fontFamily: "'Sora', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#003366',
      }}>
        Loading more campaigns...
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   ALL LOADED BADGE
─────────────────────────────────────────────── */
function AllLoadedBadge({ total }: { total: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0 24px' }}>
      <div
        style={{
          background: '#0B9C2C',
          border: '2.5px solid #111',
          borderRadius: 8,
          boxShadow: '4px 4px 0 #111',
          padding: '10px 24px',
          fontFamily: "'Sora', system-ui, sans-serif",
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#fff',
        }}
      >
        ✓ All {total} campaign{total !== 1 ? 's' : ''} loaded
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   MAIN COMPONENT (self-contained, fetches own data)
─────────────────────────────────────────────── */
type SortOption = 'recent' | 'goal' | 'progress';

interface BrowseCampaignsProps {
  // kept for backwards-compat but ignored; component fetches its own data
  campaigns?: Campaign[];
  onViewCampaign?: (id: string) => void;
}

export default function BrowseCampaigns(_props: BrowseCampaignsProps) {
  /* ── state ── */
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(async (cursor: string | null) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await getPublicUserProjects({ limit: LIMIT, ...(cursor ? { cursor } : {}) });
      const projects = res.data?.userProjects ?? [];
      const pag = res.pagination ?? res.data?.pagination;

      const mapped = projects.map(mapUserProjectToCampaign);

      setCampaigns(prev => cursor ? [...prev, ...mapped] : mapped);
      setNextCursor(pag?.nextCursor ?? null);
      setHasNextPage(pag?.hasNextPage ?? false);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      await fetchPage(null);
      setInitialLoading(false);
    })();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPage || !nextCursor) return;
    setLoadingMore(true);
    await fetchPage(nextCursor);
    setLoadingMore(false);
  }, [loadingMore, hasNextPage, nextCursor, fetchPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const filtered = campaigns
    .filter(c => {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.club?.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'goal') return b.goalAmount - a.goalAmount;
      if (sortBy === 'progress') return (b.currentAmount / b.goalAmount) - (a.currentAmount / a.goalAmount);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // 'recent'
    });

  /* ────────────────────────────────────────────────────────── */

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#FFF5E4',
        backgroundImage: 'radial-gradient(circle, #FF7F0018 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* ── HERO HEADER ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B1F3A 0%, #0a2e5c 100%)',
          borderBottom: '3px solid #111',
          boxShadow: '0 6px 0 #111',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '6px', background: 'repeating-linear-gradient(90deg, #FF7F00, #FF7F00 40px, #111 40px, #111 44px)' }} />
        <div className="absolute top-8 right-12 opacity-20"><StarDecoration className="w-14 h-14" color="#FF7F00" /></div>
        <div className="absolute bottom-10 left-10 opacity-10"><StarDecoration className="w-10 h-10" color="#0B9C2C" /></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div
            className="inline-flex items-center gap-2 mb-5"
            style={{
              background: '#FFE066', border: '2px solid #111', borderRadius: '5px',
              padding: '4px 14px', boxShadow: '3px 3px 0 #111',
              fontFamily: "'Sora', system-ui, sans-serif", fontSize: '12px',
              fontWeight: 800, color: '#111', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
             DreamXec Platform
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4"
            style={{
              fontFamily: "'Sora', system-ui, sans-serif", fontWeight: 900,
              color: '#FF7F00', letterSpacing: '-0.03em', textShadow: '4px 4px 0 #FF450044',
            }}
          >
            Explore Campaigns
          </h1>

          <p
            className="text-xl sm:text-2xl max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,245,228,0.90)', fontWeight: 500, fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Discover and support student-led initiatives across clubs &amp; colleges.
          </p>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 mb-12">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#111', opacity: 0.5 }} />
            <input
              type="text"
              placeholder="Search campaigns, clubs, colleges..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', paddingLeft: '44px', paddingRight: '20px',
                paddingTop: '14px', paddingBottom: '14px',
                border: '2.5px solid #111', borderRadius: '10px', fontSize: '16px',
                fontWeight: 600, color: '#111', background: '#fff',
                boxShadow: '4px 4px 0 #111', outline: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: 'box-shadow 0.15s ease',
              }}
              onFocus={e => { e.target.style.boxShadow = '6px 6px 0 #FF7F00'; e.target.style.borderColor = '#FF7F00'; }}
              onBlur={e => { e.target.style.boxShadow = '4px 4px 0 #111'; e.target.style.borderColor = '#111'; }}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#111', opacity: 0.6, zIndex: 1 }} />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              style={{
                width: '100%', minWidth: '240px', paddingLeft: '44px', paddingRight: '36px',
                paddingTop: '14px', paddingBottom: '14px',
                border: '2.5px solid #111', borderRadius: '10px', fontSize: '15px',
                fontWeight: 700, color: '#111', background: '#fff',
                boxShadow: '4px 4px 0 #111', outline: 'none', appearance: 'none',
                cursor: 'pointer', fontFamily: "'Sora', system-ui, sans-serif",
                transition: 'box-shadow 0.15s ease',
              }}
              onFocus={e => { e.target.style.boxShadow = '6px 6px 0 #0B9C2C'; e.target.style.borderColor = '#0B9C2C'; }}
              onBlur={e => { e.target.style.boxShadow = '4px 4px 0 #111'; e.target.style.borderColor = '#111'; }}
            >
              <option value="recent">Most Recent First</option>
              <option value="goal">Highest Goals</option>
              <option value="progress">Nearing Completion</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div
            className="text-center mb-8 p-6"
            style={{ background: '#fee2e2', border: '2.5px solid #dc2626', borderRadius: 12, boxShadow: '4px 4px 0 #dc2626' }}
          >
            <p style={{ fontFamily: "'Sora', system-ui, sans-serif", fontWeight: 800, color: '#dc2626' }}>{error}</p>
            <button
              onClick={() => { setError(null); setInitialLoading(true); fetchPage(null).then(() => setInitialLoading(false)); }}
              style={{ marginTop: 12, padding: '8px 20px', background: '#dc2626', color: '#fff', border: '2px solid #111', borderRadius: 6, fontWeight: 800, cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Initial loading skeleton ── */}
        {initialLoading ? (
          <InitialSkeleton />
        ) : filtered.length === 0 ? (
          /* ── Empty state ── */
          <div
            className="text-center max-w-xl mx-auto p-16 sm:p-20"
            style={{ background: '#fff', border: '2.5px solid #111', borderRadius: '16px', boxShadow: '6px 6px 0 #111' }}
          >
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
              style={{ background: '#FFE066', border: '2.5px solid #111', borderRadius: '12px', boxShadow: '4px 4px 0 #111' }}>
              <SearchIcon className="w-12 h-12" style={{ color: '#111' }} />
            </div>
            <h2 className="text-3xl sm:text-4xl mb-3"
              style={{ fontFamily: "'Sora', system-ui, sans-serif", fontWeight: 900, color: '#111', letterSpacing: '-0.02em' }}>
              {searchQuery ? 'No Campaigns Found' : 'No Campaigns Yet'}
            </h2>
            <p style={{ fontSize: '16px', color: '#555', fontWeight: 500, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {searchQuery ? 'Try adjusting your search terms' : 'Check back soon for new campaigns!'}
            </p>
          </div>
        ) : (
          /* ── Results ── */
          <div>
            {/* Count badge + showing info */}
            <div className="mb-10 flex items-center gap-4 flex-wrap">
              <div
                className="inline-flex items-center gap-3"
                style={{
                  background: '#FF7F00', border: '2.5px solid #111',
                  borderRadius: '8px', padding: '8px 18px', boxShadow: '4px 4px 0 #111',
                  fontFamily: "'Sora', system-ui, sans-serif",
                }}
              >
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{campaigns.length}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                  campaign{campaigns.length !== 1 ? 's' : ''} loaded
                </span>
              </div>
              {hasNextPage && (
                <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 600, fontSize: 14, color: '#666' }}>
                  Scroll for more ↓
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map(campaign => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  href={`/campaign/${campaign.id}`}
                />
              ))}
              {loadingMore && Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}
            </div>

            <div ref={sentinelRef}>
              {loadingMore && <LoadMoreSpinner />}
            </div>

            {!hasNextPage && campaigns.length > LIMIT && (
              <AllLoadedBadge total={campaigns.length} />
            )}
          </div>
        )}
      </div>

      <FooterContent />
    </div>
  );
}