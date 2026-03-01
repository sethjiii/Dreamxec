import { useEffect, useState, useRef } from 'react';

/* ─────────────────────────────────────────────
   SOURCED DATA (OECD / WIPO / NSF 2024-25)
   All annual figures, converted to per-second rates for the clock
───────────────────────────────────────────── */
const SECONDS_PER_YEAR = 365.25 * 24 * 3600;

const countries = [
  {
    code: 'IN',
    flag: '🇮🇳',
    name: 'India',
    color: '#FF7F00',
    shadowColor: '#FF7F00',
    textColor: '#000080',
    stats: {
      // $71B annual R&D (WIPO 2024), ~$15B higher education share (~21%)
      rdSpendPerSec: (71_000_000_000 * 0.21) / SECONDS_PER_YEAR,
      // ~1.2M STEM graduates/year India
      stemsPerYear: 1_200_000,
      // GDP % R&D: 0.64%
      gdpPercent: 0.64,
      // Research papers 2023: ~350K
      papersPerSec: 350_000 / SECONDS_PER_YEAR,
      // Patents filed 2023: ~85K
      patentsPerSec: 85_000 / SECONDS_PER_YEAR,
    },
    highlight: 'Fastest growing research output',
  },
  {
    code: 'CN',
    flag: '🇨🇳',
    name: 'China',
    color: '#dc2626',
    shadowColor: '#dc2626',
    textColor: '#fff',
    stats: {
      // $785B total R&D 2024, ~14% higher ed = ~$110B
      rdSpendPerSec: (785_000_000_000 * 0.14) / SECONDS_PER_YEAR,
      // ~5M STEM graduates/year
      stemsPerYear: 5_000_000,
      // GDP % R&D: 2.4%
      gdpPercent: 2.4,
      // Papers 2023: ~1.1M
      papersPerSec: 1_100_000 / SECONDS_PER_YEAR,
      // Patents filed 2023: ~1.5M
      patentsPerSec: 1_500_000 / SECONDS_PER_YEAR,
    },
    highlight: '#1 global R&D spender in 2024',
  },
  {
    code: 'KR',
    flag: '🇰🇷',
    name: 'S. Korea',
    color: '#0B9C2C',
    shadowColor: '#0B9C2C',
    textColor: '#fff',
    stats: {
      // $120B total R&D, ~8% higher ed = ~$9.6B
      rdSpendPerSec: (120_000_000_000 * 0.08) / SECONDS_PER_YEAR,
      // ~600K STEM graduates
      stemsPerYear: 600_000,
      // GDP % R&D: 4.9% — highest in OECD
      gdpPercent: 4.9,
      // Papers 2023: ~95K
      papersPerSec: 95_000 / SECONDS_PER_YEAR,
      // Patents: ~240K
      patentsPerSec: 240_000 / SECONDS_PER_YEAR,
    },
    highlight: 'Highest R&D intensity on Earth (4.9% GDP)',
  },
  {
    code: 'US',
    flag: '🇺🇸',
    name: 'USA',
    color: '#000080',
    shadowColor: '#000080',
    textColor: '#fff',
    stats: {
      // $806B total, 15% higher ed = ~$121B
      rdSpendPerSec: (806_000_000_000 * 0.15) / SECONDS_PER_YEAR,
      // ~900K STEM graduates/year
      stemsPerYear: 900_000,
      // GDP % R&D: 3.5%
      gdpPercent: 3.5,
      // Papers 2023: ~800K
      papersPerSec: 800_000 / SECONDS_PER_YEAR,
      // Patents: ~600K
      patentsPerSec: 600_000 / SECONDS_PER_YEAR,
    },
    highlight: 'Highest absolute research output',
  },
];

/* Format large numbers nicely */
function fmt(n: number, decimals = 0): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(decimals);
}

function fmtMoney(usd: number): string {
  if (usd >= 1_000_000) return '$' + (usd / 1_000_000).toFixed(2) + 'M';
  if (usd >= 1_000) return '$' + (usd / 1_000).toFixed(1) + 'K';
  return '$' + usd.toFixed(2);
}

/* ─────────────────────────────────────────────
   STAT BAR — thin horizontal progress bar
───────────────────────────────────────────── */
function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 mt-1" style={{ border: '1.5px solid #000080', background: '#f3f4f6' }}>
      <div
        className="h-full transition-all duration-1000"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   COUNTRY CARD
───────────────────────────────────────────── */
function CountryCard({
  country,
  elapsed,
  isIndia,
}: {
  country: typeof countries[0];
  elapsed: number;
  isIndia: boolean;
}) {
  const s = country.stats;
  const rdSpent = s.rdSpendPerSec * elapsed;
  const papers = s.papersPerSec * elapsed;
  const patents = s.patentsPerSec * elapsed;

  // Max values for bar scaling (USA as reference)
  const maxRd = countries[3].stats.rdSpendPerSec * elapsed || 1;
  const maxPapers = countries[1].stats.papersPerSec * elapsed || 1; // China max papers
  const maxPatents = countries[1].stats.patentsPerSec * elapsed || 1;

  return (
    <div
      className={`bg-white flex flex-col transition-all duration-200 ${isIndia ? 'ring-2 ring-offset-2' : ''}`}
      style={{
        border: `3px solid #000080`,
        boxShadow: `5px 5px 0 ${country.color}`,
        ...(isIndia ? { ringColor: country.color } : {}),
      }}
    >
      {/* Top stripe */}
      <div className="h-2 flex-shrink-0" style={{ background: country.color }} />

      {/* Header */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-2.5"
        style={{ borderBottom: '2px solid #000080', background: isIndia ? '#fff7ed' : '#f9fafb' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl leading-none">{country.flag}</span>
          <div>
            <p className="font-black text-xs sm:text-sm text-dreamxec-navy uppercase tracking-wide leading-none">
              {country.name}
            </p>
            <p
              className="text-[9px] font-black uppercase tracking-widest mt-0.5"
              style={{ color: country.color }}
            >
              {country.stats.gdpPercent}% of GDP
            </p>
          </div>
        </div>

        {isIndia && (
          <span
            className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white"
            style={{ background: '#FF7F00', border: '1.5px solid #000080' }}
          >
            🇮🇳 Us
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="p-3 sm:p-4 flex flex-col gap-3 flex-1">

        {/* R&D Spent this session */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest">
              Student R&D Spent
            </span>
            <span
              className="text-xs sm:text-sm font-black tabular-nums"
              style={{ color: country.color }}
            >
              {fmtMoney(rdSpent)}
            </span>
          </div>
          <StatBar value={rdSpent} max={maxRd} color={country.color} />
        </div>

        {/* Papers published */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest">
              Papers Published
            </span>
            <span className="text-xs font-black tabular-nums text-dreamxec-navy">
              {fmt(papers, 3)}
            </span>
          </div>
          <StatBar value={papers} max={maxPapers} color={country.color} />
        </div>

        {/* Patents filed */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest">
              Patents Filed
            </span>
            <span className="text-xs font-black tabular-nums text-dreamxec-navy">
              {fmt(patents, 3)}
            </span>
          </div>
          <StatBar value={patents} max={maxPatents} color={country.color} />
        </div>

        {/* Annual STEM grads */}
        <div
          className="mt-auto px-2.5 py-1.5 flex items-center justify-between"
          style={{ border: `1.5px solid ${country.color}`, background: `${country.color}10` }}
        >
          <span className="text-[9px] font-black uppercase tracking-widest text-dreamxec-navy/60">
            STEM Grads / yr
          </span>
          <span className="text-xs font-black" style={{ color: country.color }}>
            {fmt(country.stats.stemsPerYear)}
          </span>
        </div>

        {/* Highlight */}
        <p
          className="text-[9px] font-bold text-dreamxec-navy/50 leading-snug mt-1"
          style={{ borderLeft: `2px solid ${country.color}`, paddingLeft: '6px' }}
        >
          {country.highlight}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export const ResearchClock = () => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const startRef = useRef(Date.now());
  const pausedAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);

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
    if (running) {
      pausedAtRef.current = elapsed;
      setRunning(false);
    } else {
      startRef.current = Date.now() - pausedAtRef.current * 1000;
      setRunning(true);
    }
  };

  const reset = () => {
    startRef.current = Date.now();
    setElapsed(0);
    setRunning(true);
  };

  // Format elapsed nicely
  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);
  const elapsedStr = mins > 0
    ? `${mins}m ${secs.toString().padStart(2, '0')}s`
    : `${secs}s`;

  return (
    <section className="w-full mt-16 sm:mt-20 md:mt-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-7 bg-[#FF7F00] flex-shrink-0" />
            <div>
              <p className="text-[10px] font-black text-dreamxec-navy/40 uppercase tracking-[0.2em] mb-0.5">
                Live Comparison
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-dreamxec-navy uppercase tracking-tight leading-none">
                Research{' '}
                <span
                  className="inline-block px-2 py-0.5"
                  style={{ background: '#FF7F00', color: '#000080' }}
                >
                  Clock
                </span>
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-dreamxec-navy/50 max-w-sm leading-relaxed">
            Real-time estimates since you opened this page — based on OECD, WIPO & NSF 2024–25 data.
          </p>
        </div>

        {/* ── Timer bar ── */}
        <div
          className="flex items-center justify-between px-4 py-3 mb-5 bg-white"
          style={{ border: '3px solid #000080', boxShadow: '4px 4px 0 #FF7F00' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: running ? '#0B9C2C' : '#dc2626', boxShadow: running ? '0 0 0 3px #0B9C2C30' : 'none' }}
            />
            <span className="text-xs font-black text-dreamxec-navy/50 uppercase tracking-widest">
              {running ? 'Live' : 'Paused'}
            </span>
            <span className="text-lg sm:text-xl font-black text-dreamxec-navy tabular-nums">
              {elapsedStr}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className="px-3 py-1.5 font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
              style={{
                background: running ? '#000080' : '#FF7F00',
                color: running ? '#fff' : '#000080',
                border: '2px solid #000080',
                boxShadow: '2px 2px 0 #FF7F00',
              }}
            >
              {running ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              onClick={reset}
              className="px-3 py-1.5 font-black text-[10px] sm:text-xs uppercase tracking-widest bg-white transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
              style={{ border: '2px solid #000080', boxShadow: '2px 2px 0 #000080' }}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* ── Country cards grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {countries.map(country => (
            <CountryCard
              key={country.code}
              country={country}
              elapsed={elapsed}
              isIndia={country.code === 'IN'}
            />
          ))}
        </div>

        {/* ── India gap callout ── */}
        <div
          className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 bg-white"
          style={{ border: '3px solid #000080', boxShadow: '5px 5px 0 #FF7F00' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-10 flex-shrink-0"
              style={{ background: '#FF7F00' }}
            />
            <div>
              <p className="text-[10px] font-black text-dreamxec-navy/50 uppercase tracking-widest mb-0.5">
                The Gap We're Closing
              </p>
              <p className="text-xs sm:text-sm font-black text-dreamxec-navy leading-snug">
                India spends ~<span style={{ color: '#FF7F00' }}>0.64%</span> of GDP on R&D vs China's{' '}
                <span style={{ color: '#dc2626' }}>2.4%</span> and S. Korea's{' '}
                <span style={{ color: '#0B9C2C' }}>4.9%</span>.
                DreamXec exists to help close this gap — one student project at a time.
              </p>
            </div>
          </div>
          <p
            className="text-[9px] font-bold text-dreamxec-navy/40 leading-relaxed max-w-xs flex-shrink-0"
          >
            Sources: OECD MSTI, WIPO 2024, NSF Science & Engineering Indicators 2024
          </p>
        </div>
      </div>
    </section>
  );
};