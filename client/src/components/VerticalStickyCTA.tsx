import { useState, useEffect } from 'react';

type Side = 'left' | 'right';

interface VerticalStickyCTAProps {
  side?: Side;
  /** How far from top (e.g. "40%") */
  topOffset?: string;
}

export const VerticalStickyCTA = ({
  side = 'right',
  topOffset = '40%',
}: VerticalStickyCTAProps) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Fade in after a short delay so it doesn't flash on load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const isRight = side === 'right';

  return (
    <div
      className="fixed z-50 flex flex-col items-center transition-all duration-700"
      style={{
        [isRight ? 'right' : 'left']: 0,
        top: topOffset,
        transform: visible ? 'translateX(0)' : `translateX(${isRight ? '100%' : '-100%'})`,
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Top accent tab */}
      {/* <div
        style={{
          width: 4,
          height: 24,
          background: '#0B9C2C',
          border: '1px solid #003366',
          flexShrink: 0,
        }}
      /> */}
       <div
        className="relative mb-2"
        style={{ width: 10, height: 10 }}
      >
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: '#0B9C2C', opacity: 0.5 }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: '#0B9C2C', border: '1px solid #003366' }}
        />
      </div>

      {/* Main button */}
      <a
        href="/campaigns"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex items-center justify-center transition-all duration-200"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: hovered
            ? `rotate(180deg) translate(${isRight ? '3px' : '-3px'}, -3px)`
            : 'rotate(180deg)',
          background: hovered ? '#FF7F00' : '#003366',
          color: hovered ? '#003366' : '#fff',
          border: '2px solid #003366',
          borderRight: isRight ? 'none' : '2px solid #003366',
          borderLeft: isRight ? '2px solid #003366' : 'none',
          boxShadow: hovered
            ? (isRight ? '-4px 4px 0 #FF7F00' : '4px 4px 0 #FF7F00')
            : (isRight ? '-3px 3px 0 #0B9C2C' : '3px 3px 0 #0B9C2C'),
          padding: '18px 10px',
          fontFamily: 'sans-serif',
          fontWeight: 900,
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {/* Tricolor stripe */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            [isRight ? 'right' : 'left']: 0,
            width: 3,
            bottom: 0,
            background: 'linear-gradient(to bottom, #FF7F00 33%, #fff 33%, #fff 66%, #0B9C2C 66%)',
            opacity: 0.8,
          }}
        />

       

        Support Dreams

      
      </a>

      {/* Bottom accent tab */}
      {/* <div
        style={{
          width: 4,
          height: 24,
          background: '#FF7F00',
          border: '1px solid #003366',
          flexShrink: 0,
        }}
      /> */}

      {/* Pulse dot */}
      <div
        className="relative mt-1"
        style={{ width: 10, height: 10 }}
      >
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: '#0B9C2C', opacity: 0.5 }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: '#0B9C2C', border: '1px solid #003366' }}
        />
      </div>
    </div>
  );
};