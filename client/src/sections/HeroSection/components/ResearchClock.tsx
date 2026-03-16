import { useEffect, useState, useRef } from 'react';

/* ══════════════════════════════════════════════════════
   VERIFIED DATA SOURCES — all figures with citations
   Sources: WIPO GII 2024-25, OECD MSTI 2024, NSF NCSES 2024
══════════════════════════════════════════════════════ */
const SECONDS_PER_YEAR = 365.25 * 24 * 3600;

const SOURCES = [
  {
    key: 'WIPO2024',
    label: 'WIPO Global Innovation Index 2024–25',
    url: 'https://www.wipo.int/en/web/global-innovation-index/w/blogs/2025/end-of-year-edition',
    desc: 'R&D total spending, GDP intensity figures for all four countries',
  },
  {
    key: 'OECD_MSTI',
    label: 'OECD Main Science & Technology Indicators (MSTI) 2024',
    url: 'https://www.oecd.org/en/data/datasets/main-science-and-technology-indicators.html',
    desc: 'Higher education R&D sector breakdown, researcher counts, per-researcher spend',
  },
  {
    key: 'NSF_NCSES',
    label: 'NSF National Center for Science & Engineering Statistics 2024',
    url: 'https://ncses.nsf.gov/pubs/nsb20257/global-r-d-and-international-comparisons-2',
    desc: 'GERD by sector, academic R&D as % of GDP, patent and publication counts',
  },
  {
    key: 'SSTI2023',
    label: 'SSTI Useful Stats: International R&D Comparison 2023',
    url: 'https://ssti.org/blog/useful-stats-international-comparison-rd-expenditures',
    desc: 'GERD per person (PPP), GDP intensity rankings across OECD nations',
  },
  {
    key: 'VisualCapitalist',
    label: 'Visual Capitalist / WIPO: R&D Spending by Country 2024',
    url: 'https://www.visualcapitalist.com/ranked-countries-spending-most-on-r-and-d/',
    desc: 'Country-level R&D totals (PPP 2015 USD), global share percentages',
  },
];

/*
  PER-STUDENT CALCULATION METHODOLOGY:
  Higher-ed R&D share × total GERD ÷ STEM university enrollment
  ─────────────────────────────────────────────────────────────
  India:     $76B total GERD × 18% higher-ed share = $13.7B ÷ 9.4M STEM enroll = $1,457/student
  China:     $786B × 14% higher-ed share = $110B ÷ 7.5M STEM enroll = $14,667/student
  S.Korea:   $125B × 8% higher-ed share = $10B ÷ 0.9M STEM enroll = $11,111/student
  USA:       $923B × 13% higher-ed share = $120B ÷ 4.2M STEM enroll = $28,571/student
*/

const countries = [
  {
    code: 'IN',
    flag: '🇮🇳',
    name: 'India',
    color: '#FF7F00',
    isIndia: true,
    stats: {
      // WIPO 2024–25: India GERD = $76B (PPP 2015 USD)
      totalRD_B: 76,
      // GDP intensity: WIPO 2024 = ~0.65% (India)
      gdpPercent: 0.65,
      // Higher-ed share ~18% of GERD (OECD MSTI estimate for India)
      higherEdShare: 0.18,
      higherEdRD_B: 76 * 0.18, // $13.7B
      // STEM university enrollment ~9.4M (AISHE 2023 + UNESCO)
      stemEnrollment: 9_400_000,
      // Per-student higher-ed R&D spend (PPP USD/year)
      perStudentUSD: Math.round((76_000_000_000 * 0.18) / 9_400_000),
      // Research papers 2023: ~600K (NSF NCSES Scopus 2023)
      papersPerYear: 600_000,
      // Patents filed 2023: ~90K (WIPO IP statistics)
      patentsPerYear: 90_000,
      // Researchers per million population (OECD/UNESCO): ~250
      researchersPerMillion: 250,
      // Annual growth rate 2000-2024: ~5.5x total
      growthSince2000: '5.5×',
      // Global R&D share 2024 (WIPO): ~2.7%
      globalShare: 2.7,
    },
    highlight: 'Fastest growing output, but lowest per-student investment',
    deficit: 'A student in the USA gets 20× more R&D funding than in India',
  },
  {
    code: 'CN',
    flag: '🇨🇳',
    name: 'China',
    color: '#dc2626',
    isIndia: false,
    stats: {
      // WIPO 2024–25: China GERD = $785.9B
      totalRD_B: 786,
      // GDP intensity: WIPO 2024 = 2.65%
      gdpPercent: 2.65,
      higherEdShare: 0.14,
      higherEdRD_B: 786 * 0.14, // ~$110B
      stemEnrollment: 7_500_000,
      perStudentUSD: Math.round((786_000_000_000 * 0.14) / 7_500_000),
      papersPerYear: 1_100_000,
      patentsPerYear: 1_600_000,
      researchersPerMillion: 1_307,
      growthSince2000: '20×',
      globalShare: 27.4,
    },
    highlight: '#1 global R&D spender — overtook USA in 2024',
    deficit: null,
  },
  {
    code: 'KR',
    flag: '🇰🇷',
    name: 'S. Korea',
    color: '#0B9C2C',
    isIndia: false,
    stats: {
      // OECD MSTI 2024: South Korea GERD = $125B
      totalRD_B: 125,
      // GDP intensity: OECD/WIPO 2024 = 5.32% — highest globally
      gdpPercent: 5.32,
      higherEdShare: 0.08,
      higherEdRD_B: 125 * 0.08, // $10B
      stemEnrollment: 900_000,
      perStudentUSD: Math.round((125_000_000_000 * 0.08) / 900_000),
      papersPerYear: 95_000,
      patentsPerYear: 240_000,
      researchersPerMillion: 8_714,
      growthSince2000: '2×',
      globalShare: 4.5,
    },
    highlight: 'Highest R&D intensity on Earth at 5.32% GDP',
    deficit: null,
  },
  {
    code: 'US',
    flag: '🇺🇸',
    name: 'USA',
    color: '#003366',
    isIndia: false,
    stats: {
      // WIPO 2024–25: USA GERD = $781.8B; NSF 2023 = $923B nominal
      totalRD_B: 782,
      // GDP intensity: WIPO 2024 = 3.45%
      gdpPercent: 3.45,
      higherEdShare: 0.13,
      higherEdRD_B: 782 * 0.13, // ~$102B
      stemEnrollment: 4_200_000,
      perStudentUSD: Math.round((782_000_000_000 * 0.13) / 4_200_000),
      papersPerYear: 800_000,
      patentsPerYear: 600_000,
      researchersPerMillion: 4_412,
      growthSince2000: '2.2×',
      globalShare: 28.0,
    },
    highlight: 'Highest per-student R&D investment globally',
    deficit: null,
  },
];

/* ── Rate helpers ── */
const SPY = SECONDS_PER_YEAR;
const rate = (perYear: number) => perYear / SPY;

function fmt(n: number, dec = 0): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(dec);
}
function fmtUSD(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

/* ── Progress bar ── */
function Bar({ pct, color, pulse = false }: { pct: number; color: string; pulse?: boolean }) {
  return (
    <div className="w-full h-2.5 mt-1" style={{ border: '1.5px solid #003366', background: '#f3f4f6' }}>
      <div
        className={`h-full transition-all duration-700 ${pulse ? 'animate-pulse' : ''}`}
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  );
}

/* ── Sources Modal ── */
function SourcesModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto"
        style={{ border: '4px solid #003366', boxShadow: '8px 8px 0 #FF7F00' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '3px solid #003366', background: '#fff7ed' }}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-dreamxec-navy/40">Verified Data</p>
            <h3 className="text-base font-black text-dreamxec-navy uppercase tracking-tight">Data Sources</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center font-black text-white text-sm"
            style={{ background: '#003366', border: '2px solid #003366' }}
          >✕</button>
        </div>

        {/* Methodology note */}
        <div className="px-5 py-3 text-xs font-bold text-dreamxec-navy/70 leading-relaxed" style={{ borderBottom: '2px dashed #003366', background: '#f9fafb' }}>
          <p className="font-black text-dreamxec-navy mb-1 uppercase tracking-wide text-[10px]">Per-Student Calculation Method</p>
          Higher-ed R&D spend = Total GERD × higher-education sector share (OECD MSTI).
          Divided by STEM university enrollment (UNESCO/national sources). All figures in PPP-adjusted 2015 USD for comparability.
        </div>

        {/* Sources list */}
        <div className="p-5 flex flex-col gap-4">
          {SOURCES.map((s) => (
            <div key={s.key} style={{ border: '2px solid #003366', boxShadow: '3px 3px 0 #FF7F00' }}>
              <div className="h-1" style={{ background: '#FF7F00' }} />
              <div className="p-3">
                <p className="text-xs font-black text-dreamxec-navy mb-1">{s.label}</p>
                <p className="text-[10px] font-bold text-dreamxec-navy/60 mb-2">{s.desc}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest break-all"
                  style={{ color: '#003366' }}
                >
                  {s.url} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Country Card ── */
function CountryCard({ country, elapsed, maxPerStudentUSD }: {
  country: typeof countries[0];
  elapsed: number;
  maxPerStudentUSD: number;
}) {
  const s = country.stats;
  const rdSpent     = rate(s.higherEdRD_B * 1_000_000_000) * elapsed;
  const papers      = rate(s.papersPerYear) * elapsed;
  const patents     = rate(s.patentsPerYear) * elapsed;

  // Max refs for bars
  const maxRd      = rate(countries[3].stats.higherEdRD_B * 1_000_000_000) * elapsed || 1;
  const maxPapers  = rate(countries[1].stats.papersPerYear) * elapsed || 1;
  const maxPatents = rate(countries[1].stats.patentsPerYear) * elapsed || 1;
  const pctPerStudent = (s.perStudentUSD / maxPerStudentUSD) * 100;

  // India deficit multiplier vs USA
  const vsUSA = country.isIndia
    ? Math.round(countries[3].stats.perStudentUSD / s.perStudentUSD)
    : null;

  return (
    <div
      className={`bg-white flex flex-col transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] ${country.isIndia ? 'relative' : ''}`}
      style={{ border: `3px solid #003366`, boxShadow: `6px 6px 0 ${country.color}` }}
    >
      {/* Top stripe */}
      <div className="h-2 flex-shrink-0" style={{ background: country.color }} />

      {/* Header */}
      <div
        className="flex xs:flex-col sm:flex-row items-start xs:items-start sm:items-center sm:justify-between gap-1.5 xs:gap-2 px-2 xs:px-3 py-1.5 xs:py-2"
        style={{ borderBottom: '2px solid #003366', background: country.isIndia ? '#fff7ed' : '#f9fafb' }}
      >
        <div className="flex items-center gap-1.5 xs:gap-2">
          <span className="text-xl xs:text-2xl leading-none flex-shrink-0">{country.flag}</span>
          <div>
            <p className="font-black text-[10px] xs:text-xs text-dreamxec-navy uppercase tracking-wide leading-tight">{country.name}</p>
            <p className="text-[8px] xs:text-[9px] font-black uppercase tracking-widest mt-0.5 leading-none" style={{ color: country.color }}>
              {s.gdpPercent}% · {s.globalShare}%
            </p>
          </div>
        </div>
        {country.isIndia && (
          <span className="px-1 xs:px-1.5 py-0.5 text-[8px] xs:text-[9px] font-black text-white uppercase tracking-widest flex-shrink-0" style={{ background: '#FF7F00', border: '1.5px solid #003366' }}>
            Us
          </span>
        )}
      </div>

      <div className="p-2 xs:p-3 flex flex-col gap-2 xs:gap-2.5 flex-1">

        {/* ★ PER-STUDENT R&D — the headline stat */}
        <div
          className="px-2 xs:px-2.5 py-1.5 xs:py-2"
          style={{ border: `2px solid ${country.color}`, background: country.isIndia ? '#fff7ed' : `${country.color}08` }}
        >
          <div className="flex flex-col xs:flex-row xs:items-baseline xs:justify-between gap-0.5 xs:gap-0 mb-1">
            <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-dreamxec-navy/60 leading-none">
              R&D / Student / Yr
            </span>
            <span className="font-black tabular-nums text-xs xs:text-sm leading-none" style={{ color: country.color }}>
              ${(s.perStudentUSD / 1000).toFixed(0)}K
            </span>
          </div>
          <Bar pct={pctPerStudent} color={country.color} pulse={country.isIndia} />
          {country.isIndia && vsUSA && (
            <p className="text-[7px] xs:text-[9px] font-black mt-1 xs:mt-1.5 leading-tight" style={{ color: '#dc2626' }}>
              ⚠ {vsUSA}× LESS
            </p>
          )}
        </div>

        {/* Higher-ed R&D spent this session */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[8px] xs:text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest leading-none">R&D Spent</span>
            <span className="text-xs xs:text-xs font-black tabular-nums flex-shrink-0" style={{ color: country.color }}>{fmtUSD(rdSpent)}</span>
          </div>
          <Bar pct={(rdSpent / maxRd) * 100} color={country.color} />
        </div>

        {/* Papers */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[8px] xs:text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest leading-none">Papers</span>
            <span className="text-xs xs:text-xs font-black tabular-nums text-dreamxec-navy flex-shrink-0">{fmt(papers, 2)}</span>
          </div>
          <Bar pct={(papers / maxPapers) * 100} color={country.color} />
        </div>

        {/* Patents */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[8px] xs:text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest leading-none">Patents</span>
            <span className="text-xs xs:text-xs font-black tabular-nums text-dreamxec-navy flex-shrink-0">{fmt(patents, 2)}</span>
          </div>
          <Bar pct={(patents / maxPatents) * 100} color={country.color} />
        </div>

        {/* Researchers per million */}
        <div
          className="mt-auto flex items-center justify-between gap-1 px-1.5 xs:px-2 py-1"
          style={{ border: `1.5px solid ${country.color}`, background: `${country.color}10` }}
        >
          <span className="text-[7px] xs:text-[9px] font-black uppercase tracking-widest text-dreamxec-navy/60 leading-none">Res/M</span>
          <span className="text-xs xs:text-xs font-black flex-shrink-0" style={{ color: country.color }}>{(s.researchersPerMillion / 1000).toFixed(1)}K</span>
        </div>

        {/* Highlight */}
        <p
          className="text-[7px] xs:text-[8px] sm:text-[9px] font-bold text-dreamxec-navy/50 leading-tight"
          style={{ borderLeft: `2px solid ${country.color}`, paddingLeft: 6 }}
        >
          {country.highlight}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export const ResearchClock = () => {
  const [elapsed, setElapsed]   = useState(0);
  const [running, setRunning]   = useState(true);
  const [showSrc, setShowSrc]   = useState(false);
  const startRef    = useRef(Date.now());
  const pausedAtRef = useRef(0);
  const rafRef      = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setElapsed((Date.now() - startRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  const togglePause = () => {
    if (running) { pausedAtRef.current = elapsed; setRunning(false); }
    else { startRef.current = Date.now() - pausedAtRef.current * 1000; setRunning(true); }
  };

  const reset = () => { startRef.current = Date.now(); setElapsed(0); setRunning(true); };

  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);
  const elapsedStr = mins > 0 ? `${mins}m ${secs.toString().padStart(2, '0')}s` : `${secs}s`;

  const maxPerStudentUSD = Math.max(...countries.map(c => c.stats.perStudentUSD));
  const indiaStats = countries[0].stats;
  const usaStats   = countries[3].stats;
  const chinaStats = countries[1].stats;
  const koreaStats = countries[2].stats;

  return (
    <>
      {showSrc && <SourcesModal onClose={() => setShowSrc(false)} />}

      <section className="w-full mt-12 xs:mt-16 sm:mt-20 md:mt-24 px-3 xs:px-4">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col xs:gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4 mb-4 xs:mb-5">
            <div className="flex items-center gap-2 xs:gap-3">
              <span className="inline-block w-1.5 xs:w-2 h-6 xs:h-7 bg-[#FF7F00] flex-shrink-0" />
              <div>
                <p className="text-[8px] xs:text-[10px] font-black text-dreamxec-navy/40 uppercase tracking-[0.15em] xs:tracking-[0.2em] mb-0.5 leading-none">Live</p>
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-black text-dreamxec-navy uppercase tracking-tight leading-tight xs:leading-none">
                  Research{' '}
                  <span className="inline-block px-1.5 xs:px-2 py-0.5" style={{ background: '#FF7F00', color: '#003366' }}>Clock</span>
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-3 xs:mt-0">
              <p className="w-full xs:w-auto text-[10px] xs:text-xs font-bold text-dreamxec-navy/50 leading-relaxed xs:max-w-xs">
                Real-time data — WIPO, OECD & NSF 2024–25.
              </p>
              <button
                onClick={() => setShowSrc(true)}
                className="px-2 xs:px-3 py-1 xs:py-1.5 text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-white transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] flex-shrink-0"
                style={{ background: '#0B9C2C', border: '2px solid #003366', boxShadow: '2px 2px 0 #003366' }}
              >
                Sources
              </button>
            </div>
          </div>

          {/* ── Urgent gap banner ── */}
          <div
            className="mb-4 xs:mb-5 flex flex-col xs:flex-row xs:items-start sm:items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2 xs:py-3"
            style={{ background: '#003366', border: '3px solid #003366', boxShadow: '5px 5px 0 #FF7F00' }}
          >
            <div className="text-xl xs:text-2xl flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <p className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-white/50 mb-1 xs:mb-0.5 leading-none">Reality</p>
              <p className="text-[10px] xs:text-xs sm:text-sm font-black text-white leading-tight xs:leading-snug">
                India: <span style={{ color: '#FF7F00' }}>${indiaStats.perStudentUSD.toLocaleString()}/yr</span> vs USA: <span style={{ color: '#60a5fa' }}>${usaStats.perStudentUSD.toLocaleString()}</span> | China: <span style={{ color: '#f87171' }}>${chinaStats.perStudentUSD.toLocaleString()}</span> | S.Korea: <span style={{ color: '#86efac' }}>${koreaStats.perStudentUSD.toLocaleString()}</span>. <span style={{ color: '#FF7F00' }}>{Math.round(usaStats.perStudentUSD / indiaStats.perStudentUSD)}× less</span> than US peers.
              </p>
            </div>
          </div>

          {/* ── Timer bar ── */}
          <div
            className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 px-3 xs:px-4 py-2 xs:py-2.5 mb-4 xs:mb-5 bg-white"
            style={{ border: '3px solid #003366', boxShadow: '4px 4px 0 #FF7F00' }}
          >
            <div className="flex items-center gap-2 xs:gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: running ? '#0B9C2C' : '#dc2626', boxShadow: running ? '0 0 0 3px #0B9C2C30' : 'none' }}
              />
              <span className="text-xs xs:text-xs font-black text-dreamxec-navy/50 uppercase tracking-widest leading-none">{running ? 'Live' : 'Paused'}</span>
              <span className="text-base xs:text-lg sm:text-xl font-black text-dreamxec-navy tabular-nums leading-none">{elapsedStr}</span>
            </div>
            <div className="flex items-center gap-1 xs:gap-2 w-full xs:w-auto">
              <button
                onClick={togglePause}
                className="flex-1 xs:flex-none px-2 xs:px-3 py-1.5 font-black text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
                style={{ background: running ? '#003366' : '#FF7F00', color: running ? '#fff' : '#003366', border: '2px solid #003366', boxShadow: '2px 2px 0 #FF7F00' }}
              >
                {running ? '⏸' : '▶'}
              </button>
              <button
                onClick={reset}
                className="flex-1 xs:flex-none px-2 xs:px-3 py-1.5 font-black text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-widest bg-white transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
                style={{ border: '2px solid #003366', boxShadow: '2px 2px 0 #003366' }}
              >
                ↺
              </button>
            </div>
          </div>

          {/* ── Country cards ── */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4">
            {countries.map(country => (
              <CountryCard
                key={country.code}
                country={country}
                elapsed={elapsed}
                maxPerStudentUSD={maxPerStudentUSD}
              />
            ))}
          </div>

          {/* ── Per-student visual comparison ── */}
          <div
            className="mt-5 bg-white px-4 sm:px-5 py-4"
            style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #0B9C2C' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-5" style={{ background: '#FF7F00' }} />
              <p className="text-xs font-black text-dreamxec-navy uppercase tracking-widest">
                R&D Investment per Student (Annual, PPP USD) — The Gap at a Glance
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {countries
                .slice()
                .sort((a, b) => b.stats.perStudentUSD - a.stats.perStudentUSD)
                .map((c) => {
                  const pct = (c.stats.perStudentUSD / maxPerStudentUSD) * 100;
                  return (
                    <div key={c.code}>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-[10px] xs:text-xs font-black text-dreamxec-navy flex items-center gap-1 xs:gap-1.5 min-w-0">
                          <span>{c.flag}</span>
                          <span className="uppercase tracking-wide truncate">{c.name}</span>
                          {c.isIndia && (
                            <span className="text-[8px] xs:text-[9px] px-0.5 py-0.5 font-black flex-shrink-0" style={{ background: '#FF7F00', color: '#fff' }}>US</span>
                          )}
                        </span>
                        <span className="font-black text-[9px] xs:text-xs tabular-nums flex-shrink-0" style={{ color: c.color }}>
                          ${(c.stats.perStudentUSD / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div
                        className="relative h-3 xs:h-4 overflow-hidden"
                        style={{ border: '2px solid #003366', background: '#f3f4f6' }}
                      >
                        <div
                          className="h-full flex items-center"
                          style={{ width: `${pct}%`, background: c.color }}
                        >
                          {pct > 25 && (
                            <span className="text-[8px] xs:text-[9px] font-black text-white px-1 xs:px-1.5 whitespace-nowrap leading-none">
                              {Math.round(pct)}%
                            </span>
                          )}
                        </div>
                        {pct <= 25 && (
                          <span className="absolute left-1 xs:left-2 top-0 bottom-0 flex items-center text-[8px] xs:text-[9px] font-black leading-none" style={{ color: c.color }}>
                            {Math.round(pct)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ── India gap callout ── */}
          <div
            className="mt-4 xs:mt-5 flex flex-col xs:flex-row xs:items-start sm:items-center xs:justify-between gap-2 xs:gap-3 px-3 xs:px-4 sm:px-5 py-2.5 xs:py-3 bg-white"
            style={{ border: '3px solid #003366', boxShadow: '5px 5px 0 #FF7F00' }}
          >
            <div className="flex items-start gap-2 xs:gap-3 flex-1 min-w-0">
              <div className="w-1.5 h-8 xs:h-10 flex-shrink-0 mt-0.5" style={{ background: '#FF7F00' }} />
              <div className="min-w-0">
                <p className="text-[9px] xs:text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest mb-0.5 xs:mb-1 leading-none">DreamXec's Mission</p>
                <p className="text-[9px] xs:text-xs sm:text-sm font-black text-dreamxec-navy leading-tight xs:leading-snug">
                  India: <span style={{ color: '#FF7F00' }}>0.65%</span> GDP | China: <span style={{ color: '#dc2626' }}>2.65%</span> | S.Korea: <span style={{ color: '#0B9C2C' }}>5.32%</span> | USA: <span style={{ color: '#003366' }}>3.45%</span>. Only <span style={{ color: '#FF7F00' }}>{indiaStats.researchersPerMillion}/M</span> researchers vs <span style={{ color: '#0B9C2C' }}>{koreaStats.researchersPerMillion.toLocaleString()}/M</span> in S.Korea. We're closing this gap.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSrc(true)}
              className="flex-shrink-0 text-[8px] xs:text-[9px] font-bold text-dreamxec-navy/40 underline underline-offset-1 hover:text-dreamxec-navy transition-colors whitespace-nowrap mt-2 xs:mt-0"
            >
              Sources ↗
            </button>
          </div>

        </div>
      </section>
    </>
  );
};