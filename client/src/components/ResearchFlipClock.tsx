import { useEffect, useState, useRef } from 'react';

const COUNTRIES = [
  { flag: '🇰🇷', name: 'S. Korea', value: 8714, isIndia: false },
  { flag: '🇩🇰', name: 'Denmark',  value: 7953, isIndia: false },
  { flag: '🇺🇸', name: 'USA',      value: 4412, isIndia: false },
  { flag: '🇨🇳', name: 'China',    value: 1307, isIndia: false },
  { flag: '🇧🇷', name: 'Brazil',   value: 888,  isIndia: false },
  { flag: '🇮🇳', name: 'India',    value: 255,  isIndia: true  },
];

function FlipDigit({ digit, isRed }) {
  const [current, setCurrent] = useState(digit);
  const [next, setNext] = useState(digit);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(digit);

  useEffect(() => {
    if (digit !== prevRef.current) {
      setNext(digit);
      setFlipping(true);
      const t = setTimeout(() => {
        setCurrent(digit);
        setFlipping(false);
        prevRef.current = digit;
      }, 340);
      return () => clearTimeout(t);
    }
  }, [digit]);

  const bg  = isRed ? '#dc2626' : '#003366';
  const bdr = isRed ? '#991b1b' : '#001a4d';
  const half = {
    position: 'absolute', left: 0, right: 0, height: '50%',
    background: bg, border: `1px solid ${bdr}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', color: '#fff',
    fontFamily: "'Courier New', monospace", fontWeight: 900,
    fontSize: '1em', lineHeight: 1,
  };

  return (
    <span style={{
      position: 'relative', display: 'inline-block',
      width: '0.65em', height: '1.1em', margin: '0 1px',
      verticalAlign: 'middle', perspective: 400,
    }}>
      <span style={{ ...half, top: 0, borderBottom: 'none', alignItems: 'flex-end', paddingBottom: 1 }}>
        <span style={{ transform: 'translateY(50%)' }}>{current}</span>
      </span>
      <span style={{ ...half, bottom: 0, borderTop: 'none', alignItems: 'flex-start', paddingTop: 1 }}>
        <span style={{ transform: 'translateY(-50%)' }}>{current}</span>
      </span>
      <span style={{
        position: 'absolute', top: '50%', left: 0, right: 0, height: 1.5,
        background: 'rgba(0,0,0,0.35)', zIndex: 5, transform: 'translateY(-50%)',
      }} />
      {flipping && (
        <span style={{ ...half, top: 0, borderBottom: 'none', alignItems: 'flex-end', paddingBottom: 1,
          transformOrigin: 'bottom center', animation: 'flipDown 0.34s ease-in forwards', zIndex: 6 }}>
          <span style={{ transform: 'translateY(50%)' }}>{next}</span>
        </span>
      )}
      {flipping && (
        <span style={{ ...half, bottom: 0, borderTop: 'none', alignItems: 'flex-start', paddingTop: 1,
          transformOrigin: 'top center', animation: 'flipUp 0.34s ease-out forwards', zIndex: 6 }}>
          <span style={{ transform: 'translateY(-50%)' }}>{next}</span>
        </span>
      )}
    </span>
  );
}

function FlipNumber({ value, isRed }) {
  const str = value.toLocaleString('en-IN');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {str.split('').map((ch, i) =>
        ch === ',' ? (
          <span key={i} style={{
            color: isRed ? '#fca5a5' : '#93c5fd',
            fontSize: '0.55em', fontWeight: 900, margin: '0 1px',
          }}>,</span>
        ) : (
          <FlipDigit key={i} digit={ch} isRed={isRed} />
        )
      )}
    </span>
  );
}

export const ResearchFlipClock = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % COUNTRIES.length), 2200);
    return () => clearInterval(t);
  }, []);

  const active  = COUNTRIES[activeIdx];
  const isIndia = active.isIndia;

  return (
    <>
      <style>{`
        @keyframes flipDown { 0%{transform:rotateX(0deg);opacity:1} 100%{transform:rotateX(-90deg);opacity:0} }
        @keyframes flipUp   { 0%{transform:rotateX(90deg);opacity:0} 100%{transform:rotateX(0deg);opacity:1} }
        @keyframes ping     { 75%,100%{transform:scale(2);opacity:0} }
      `}</style>

      {/* Full-width centering wrapper */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '12px 16px 0' }}>

        {/* The pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0,
          border: `2px solid ${isIndia ? '#dc2626' : '#003366'}`,
          boxShadow: isIndia ? '3px 3px 0 #dc2626' : '3px 3px 0 #FF7F00',
          background: '#fff',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          overflow: 'hidden',
          flexWrap: 'wrap',        // graceful on very small screens
        }}>

          {/* "No. of Researchers per Million:" label */}
          <div style={{
            background: isIndia ? '#dc2626' : '#003366',
            padding: '0 12px',
            alignSelf: 'stretch',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.3s',
          }}>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 9,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: isIndia ? '#fecaca' : 'rgba(255,255,255,0.65)',
              whiteSpace: 'nowrap',
            }}>
              No. of Researchers per Million :
            </span>
          </div>

          {/* Flag + country name */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRight: `1.5px solid ${isIndia ? '#fecaca' : '#e5e7eb'}`,
            background: isIndia ? 'rgba(220,38,38,0.04)' : 'transparent',
            transition: 'background 0.3s',
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{active.flag}</span>
            <span style={{
              fontFamily: 'sans-serif',
              fontWeight: 900,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: isIndia ? '#dc2626' : '#003366',
              minWidth: 46,
              transition: 'color 0.3s',
            }}>
              {active.name}
            </span>
          </div>

          {/* Flip number */}
          <div style={{
            padding: '6px 12px',
            fontSize: '1.5rem',
            background: isIndia ? 'rgba(220,38,38,0.04)' : 'transparent',
            borderRight: `1.5px solid ${isIndia ? '#fecaca' : '#e5e7eb'}`,
            transition: 'background 0.3s',
          }}>
            <FlipNumber value={active.value} isRed={isIndia} />
          </div>

          {/* Badge / pulse */}
          <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
            {isIndia ? (
              <span style={{
                background: '#dc2626', color: '#fff',
                fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 8,
                padding: '3px 7px', textTransform: 'uppercase',
                letterSpacing: '0.1em', whiteSpace: 'nowrap',
                border: '1px solid #991b1b',
              }}>
                ⚠ 34× LESS
              </span>
            ) : (
              <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: '#4ade80', opacity: 0.65,
                  animation: 'ping 1.2s cubic-bezier(0,0,.2,1) infinite',
                }} />
                <span style={{ borderRadius: '50%', width: 8, height: 8, background: '#4ade80' }} />
              </span>
            )}
          </div>

          {/* Dot nav */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '0 10px',
            borderLeft: `1.5px solid ${isIndia ? '#fecaca' : '#e5e7eb'}`,
            alignSelf: 'stretch',
            background: '#f9fafb',
          }}>
            {COUNTRIES.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  width: i === activeIdx ? 16 : 5,
                  height: 5,
                  border: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all .3s',
                  background: i === activeIdx
                    ? (c.isIndia ? '#dc2626' : '#003366')
                    : '#d1d5db',
                }}
                aria-label={`Show ${c.name}`}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
};