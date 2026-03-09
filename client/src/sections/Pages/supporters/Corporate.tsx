import { useRef, useState, useEffect } from "react";
import { Header } from '../../Header';
import { Footer } from '../../Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const sdgAlignments = [
  { icon: "🏫", sdg: "SDG 4", label: "Quality Education",           accent: "#FF7F00", description: "We fund student innovation, capacity building, and skill development—core to NEP 2020." },
  { icon: "💼", sdg: "SDG 8", label: "Decent Work & Growth",        accent: "#003262", description: "Funded students get jobs, start companies, create employment for others." },
  { icon: "♀️", sdg: "SDG 5", label: "Gender Equality",             accent: "#0B9C2C", description: "We actively encourage female innovators." },
  { icon: "⚖️", sdg: "SDG 10", label: "Reduced Inequality",         accent: "#FF7F00", description: "Focus on underrepresented geographies including Tier 2/3 cities across India." },
  { icon: "🤝", sdg: "SDG 17", label: "Partnerships for Goals",     accent: "#003262", description: "Multi-stakeholder model: corporates, mentors, government, and students united." },
];

const partnerships = [
  {
    num: "01",
    icon: "💰",
    accent: "#FF7F00",
    budget: "₹50L – ₹200L",
    title: "Annual Innovation Grant",
    tagline: "Fund a Cohort of India's Best Student Projects",
    description: "You allocate CSR budget to the 'Research karega India to Badhega India' initiative. DreamXec vets projects; you decide the thematic focus — e.g., 'AI for Social Good' or 'Women-Led Startups'. We curate 10–20 projects per year. All funded projects acknowledge your support with quarterly impact reports, co-hosted webinars, and intern pathways to your company.",
  },
  {
    num: "02",
    icon: "🏆",
    accent: "#003262",
    budget: "₹1Cr – ₹5Cr",
    title: "Long-Term Founding Partnership",
    tagline: "Multi-Year Deep Collaboration",
    description: "Deep collaboration — you become a founding partner. Dedicated program: 'Acme Corporation Innovation Fund' with 500+ funded projects over 3 years. Includes executive mentor network, internship pipeline, recruitment from DreamXec alumni, and a co-branded learning hub. Maximum credibility, leadership positioning, and talent acquisition at scale.",
  },
  {
    num: "03",
    icon: "",
    accent: "#0B9C2C",
    budget: "₹10L – ₹50L",
    title: "Project / Club / Event Sponsorship",
    tagline: "Targeted Brand Alignment",
    description: "You choose projects aligning with your brand — green tech, women entrepreneurs, healthcare innovation, intercollege fests. You fund them fully or co-fund with other supporters. Heavy branding: your logo on all material, creator mentions in updates, case study in your CSR report. Emotional connection with young innovators, authentic impact story, and media coverage.",
  },
];

const corporateBenefits = [
  {
    icon: "⭐",
    accent: "#FF7F00",
    category: "Brand & Reputation",
    points: [
      "Position as 'supporting India's next generation' and 'India's leap into the future'",
      "Media coverage — startup stories, CSR features, thought leadership pieces",
      "Employee volunteer opportunities through mentoring student innovators",
      "Authentic brand love from young demographics — your future customers",
    ],
  },
  {
    icon: "👥",
    accent: "#003262",
    category: "Talent Acquisition",
    points: [
      "Direct pipeline to pre-vetted student innovators across India",
      "Internship pathways — find exceptional talent before competitors do",
      "Recruitment advantage by associating your brand with innovation",
      "Alumni network to track funded students throughout their careers",
    ],
  },
  {
    icon: "💡",
    accent: "#0B9C2C",
    category: "Strategic Insight",
    points: [
      "Early signals of tech trends — funded projects indicate market direction",
      "Customer feedback by interacting with India's most curious young minds",
      "Innovation ideas from students who think creatively about industry challenges",
    ],
  },
  {
    icon: "🧾",
    accent: "#FF7F00",
    category: "Tax Benefits",
    points: [
      "80G certification — all donations are fully tax-deductible",
      "CSR spend recognition — counts toward mandatory 2% of net profit",
      "Measurable impact reporting with audited outcomes for your board",
    ],
  },
];

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ children, accent = "#FF7F00", dark = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "1rem" }}>
      <div style={{ width: 12, height: 12, flexShrink: 0, background: accent }} />
      <div style={{
        padding: "0.3rem 0.9rem",
        fontSize: "0.7rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.25em",
        background: dark ? "#FF7F00" : "#003262",
        color: dark ? "#003262" : "#fff",
        border: `2px solid ${dark ? "#FF7F00" : "#003262"}`,
        fontFamily: "inherit",
      }}>
        {children}
      </div>
      <div style={{ width: 12, height: 12, flexShrink: 0, background: "#0B9C2C" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  .nb-page { background: #fffbf5; font-family: 'Space Grotesk', sans-serif; color: #003262; }

  .sr-fade  { opacity:0; transform:translateY(36px);  transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1); }
  .sr-left  { opacity:0; transform:translateX(-48px); transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1); }
  .sr-scale { opacity:0; transform:scale(.88);        transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-fade.v,.sr-left.v,.sr-scale.v { opacity:1; transform:none; }
  .sr-stagger > * { opacity:0; transform:translateY(28px); transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1); }
  .sr-stagger.v > *:nth-child(1){opacity:1;transform:none;transition-delay:.05s}
  .sr-stagger.v > *:nth-child(2){opacity:1;transform:none;transition-delay:.15s}
  .sr-stagger.v > *:nth-child(3){opacity:1;transform:none;transition-delay:.25s}
  .sr-stagger.v > *:nth-child(4){opacity:1;transform:none;transition-delay:.35s}
  .sr-stagger.v > *:nth-child(5){opacity:1;transform:none;transition-delay:.45s}

  /* ── HERO ── */
  .nb-hero { background:#fffbf5; border-bottom:4px solid #003262; padding:5rem 2rem 4rem; position:relative; overflow:hidden; }
  .nb-hero-inner { max-width:1100px; margin:0 auto; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .stamp-block { position:relative; display:inline-block; margin-bottom:0.75rem; }
  .stamp-shadow { position:absolute; inset:0; }
  .stamp-h1 { position:relative; z-index:1; display:inline-block; padding:0.4rem 1.2rem; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:-0.5px; line-height:1; border:4px solid #003262; font-size:clamp(1.3rem,4vw,3rem); }
  .nb-hero-sub { margin-top:1.5rem; font-size:clamp(1rem,2vw,1.2rem); font-weight:700; color:rgba(0,50,98,.65); max-width:620px; line-height:1.75; text-align:justify; }
  .pill-row { display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem; margin-top:2rem; }
  .pill { padding:0.5rem 1.1rem; font-size:0.7rem; font-weight:900; text-transform:uppercase; letter-spacing:3px; color:#fff; border:2px solid #003262; }

  /* ── STATS ── */
  .nb-stats-band { background:#003262; border-bottom:4px solid #003262; }
  .nb-stats-inner { max-width:1100px; margin:0 auto; padding:2.5rem 2rem; display:grid; grid-template-columns:repeat(4,1fr); }
  @media(max-width:640px){ .nb-stats-inner{ grid-template-columns:1fr 1fr; } }
  .nb-stat { text-align:center; padding:1.25rem 1rem; border-right:3px solid rgba(255,255,255,.12); }
  .nb-stat:last-child { border-right:none; }
  .nb-stat-icon { font-size:1.75rem; display:block; margin-bottom:0.4rem; }
  .nb-stat-num { font-size:clamp(1.6rem,3.5vw,2.5rem); font-weight:900; color:#FF7F00; letter-spacing:-2px; line-height:1; }
  .nb-stat-label { font-size:0.65rem; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,.55); margin-top:0.35rem; }

  /* ── SECTIONS ── */
  .nb-section { max-width:1100px; margin:0 auto; padding:5rem 2rem; }
  .nb-section-head { display:flex; flex-direction:column; align-items:center; text-align:center; margin-bottom:3rem; }
  .nb-section-title { font-size:clamp(1.6rem,3.5vw,2.8rem); font-weight:900; color:#003262; text-transform:uppercase; line-height:1.05; letter-spacing:-1px; }
  .nb-section-title-dark { color:#fff; }
  .hl-orange { background:#FF7F00; color:#003262; display:inline-block; padding:0 0.4rem; }
  .hl-green  { background:#0B9C2C; color:#fff;    display:inline-block; padding:0 0.4rem; }
  .hl-navy   { background:#003262; color:#fff;    display:inline-block; padding:0 0.4rem; }

  /* ── SDG GRID ── */
  .sdg-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
  @media(max-width:900px){ .sdg-grid{ grid-template-columns:1fr 1fr; } }
  @media(max-width:580px){ .sdg-grid{ grid-template-columns:1fr; } }

  .sdg-card { background:#fff; border:3px solid #003262; display:flex; flex-direction:column; transition:transform .15s,box-shadow .15s; }
  .sdg-card:hover { transform:translate(-3px,-3px); }
  .sdg-top-bar { height:6px; }
  .sdg-header { display:flex; align-items:center; gap:0.75rem; padding:1rem 1.25rem; border-bottom:2px solid #003262; background:#fffbf5; }
  .sdg-badge { font-size:0.6rem; font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#fff; padding:0.2rem 0.5rem; border:2px solid #003262; flex-shrink:0; }
  .sdg-label { font-size:clamp(0.85rem,1.5vw,1rem); font-weight:900; text-transform:uppercase; color:#003262; letter-spacing:-0.3px; }
  .sdg-icon-box { font-size:1.5rem; flex-shrink:0; }
  .sdg-desc { padding:1rem 1.25rem; font-size:clamp(0.88rem,1.5vw,1rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.75; text-align:justify; flex:1; }
  .sdg-bottom-bar { height:4px; }

  /* ── DARK BG ── */
  .nb-dark { background:#003262; border-top:4px solid #003262; border-bottom:4px solid #003262; padding:5rem 0; }

  /* ── PARTNERSHIP CARDS ── */
  .partner-card { background:#fff; border:3px solid #003262; display:flex; flex-direction:column; transition:transform .15s,box-shadow .15s; margin-bottom:0; }
  .partner-card:hover { transform:translate(-3px,-3px); }
  .partner-header { display:flex; align-items:center; gap:1rem; padding:1rem 1.5rem; border-bottom:3px solid #003262; background:#fffbf5; }
  .partner-icon-box { width:60px; height:60px; display:flex; align-items:center; justify-content:center; font-size:1.6rem; flex-shrink:0; border:3px solid #003262; }
  .partner-titles { flex:1; }
  .partner-model-title { font-size:clamp(1rem,2vw,1.3rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#003262; line-height:1.1; }
  .partner-tagline { font-size:0.75rem; font-weight:700; color:rgba(0,50,98,.55); text-transform:uppercase; letter-spacing:1.5px; margin-top:0.25rem; }
  .partner-budget { padding:0.35rem 0.8rem; font-size:0.8rem; font-weight:900; color:#fff; text-transform:uppercase; letter-spacing:1px; border:2px solid #003262; flex-shrink:0; }
  .partner-desc { padding:1.25rem 1.5rem; font-size:clamp(0.95rem,1.8vw,1.1rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.8; text-align:justify; }
  .partner-bottom-bar { height:6px; }

  /* ── BENEFIT CARDS (swiper) ── */
  .benefit-card { background:#fff; border:3px solid #fff; display:flex; flex-direction:column; height:100%; transition:transform .15s,box-shadow .15s; }
  .benefit-card:hover { transform:translate(-3px,-3px); }
  .benefit-top-bar { height:6px; }
  .benefit-header { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.5rem; border-bottom:2px solid #003262; background:#fffbf5; }
  .benefit-icon-box { font-size:1.75rem; width:52px; height:52px; display:flex; align-items:center; justify-content:center; border:3px solid #003262; flex-shrink:0; }
  .benefit-cat { font-size:clamp(1rem,2vw,1.25rem); font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#003262; }
  .benefit-points { padding:1.25rem 1.5rem; display:flex; flex-direction:column; gap:0.75rem; flex:1; }
  .benefit-point { display:flex; align-items:flex-start; gap:0.75rem; }
  .benefit-bullet { font-size:0.6rem; font-weight:900; color:#fff; padding:0.15rem 0.4rem; border:2px solid #003262; flex-shrink:0; margin-top:0.2rem; }
  .benefit-text { font-size:clamp(0.88rem,1.5vw,1rem); font-weight:600; color:rgba(0,50,98,.68); line-height:1.75; text-align:justify; }

  /* custom swiper nav */
  .swiper-nb-prev, .swiper-nb-next { position:absolute; top:50%; transform:translateY(-50%); z-index:10; width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1rem; cursor:pointer; transition:transform .15s,box-shadow .15s; }
  .swiper-nb-prev:hover, .swiper-nb-next:hover { transform:translateY(-50%) translate(-2px,-2px); }
  .swiper-nb-prev { left:0; }
  .swiper-nb-next { right:0; }

  /* ── STRIPE ── */
  .nb-stripe { width:100%; height:16px; background:repeating-linear-gradient(-45deg,#003262 0px,#003262 12px,#FF7F00 12px,#FF7F00 24px); border-top:3px solid #003262; border-bottom:3px solid #003262; }

  /* ── CTA ── */
  .nb-cta { background:#fffbf5; border-top:4px solid #003262; padding:5rem 2rem; position:relative; overflow:hidden; }
  .nb-cta-inner { max-width:840px; margin:0 auto; text-align:center; }
  .nb-cta-title { font-size:clamp(1.8rem,4vw,3rem); font-weight:900; text-transform:uppercase; line-height:1.1; letter-spacing:-1px; color:#003262; margin-bottom:1rem; }
  .nb-cta-sub { font-size:clamp(0.95rem,2vw,1.15rem); font-weight:600; color:rgba(0,50,98,.65); line-height:1.8; max-width:600px; margin:0 auto 2rem; text-align:justify; }
  .tricolor { display:flex; height:6px; max-width:240px; margin:0 auto 2rem; }
  .tricolor div { flex:1; }
  .nb-cta-buttons { display:flex; flex-wrap:wrap; gap:1rem; justify-content:center; }
  .nb-btn-1 { padding:1.1rem 2.5rem; font-size:clamp(.85rem,1.5vw,1rem); font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#003262; background:#FF7F00; border:4px solid #003262; box-shadow:7px 7px 0 #003262; text-decoration:none; transition:transform .15s,box-shadow .15s; display:inline-block; }
  .nb-btn-1:hover { transform:translate(-3px,-3px); box-shadow:10px 10px 0 #003262; }
  .nb-btn-2 { padding:1.1rem 2.5rem; font-size:clamp(.85rem,1.5vw,1rem); font-weight:900; text-transform:uppercase; letter-spacing:2px; color:#fff; background:#003262; border:4px solid #003262; box-shadow:7px 7px 0 #FF7F00; text-decoration:none; transition:transform .15s,box-shadow .15s; display:inline-block; }
  .nb-btn-2:hover { transform:translate(-3px,-3px); box-shadow:10px 10px 0 #FF7F00; }
`;

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
const CorporateCSRPartnerships = () => {

  const heroReveal     = useScrollReveal();
  const csrReveal      = useScrollReveal();
  const partnerReveal  = useScrollReveal();
  const benefitReveal  = useScrollReveal();
  const ctaReveal      = useScrollReveal();

  return (
    <>
      <style>{CSS}</style>

      <title>Corporate & CSR Partnerships | DreamXec</title>
      <meta name="description" content="Turn Your CSR Into Real Student Impact. Partner with DreamXec to fund innovation, build brand love, and align with NEP 2020 goals." />

      <Header />

      <main className="nb-page">

        {/* ══════════════════════════════════════
            §1  HERO
        ══════════════════════════════════════ */}
        <section className="nb-hero">
          <div style={{ position:"absolute",top:0,right:0,width:320,height:320,background:"#FF7F00",transform:"rotate(-12deg)",opacity:0.04,pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:0,left:0,width:240,height:240,background:"#0B9C2C",transform:"rotate(6deg)",opacity:0.04,pointerEvents:"none" }} />

          <div ref={heroReveal.ref} className={`nb-hero-inner sr-fade ${heroReveal.isVisible ? "v" : ""}`}>
            <SectionLabel>💼 Corporate & CSR Partnerships</SectionLabel>

            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem",marginBottom:"2rem" }}>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#0B9C2C" }} />
                <h1 className="stamp-h1" style={{ background:"#FF7F00" }}>Turn Your CSR Into</h1>
              </div>
              <div className="stamp-block">
                <div className="stamp-shadow" style={{ background:"#FF7F00" }} />
                <h1 className="stamp-h1" style={{ background:"#003262" }}>Real Student Impact</h1>
              </div>
            </div>

            <p className="nb-hero-sub">
              Partner with DreamXec to fund innovation, build brand love, align with NEP 2020 goals, and create measurable, auditable impact that your board and stakeholders will be proud of.
            </p>

            <div className="pill-row">
              {[
                { label: "80G Tax Deductible", bg: "#FF7F00" },
                { label: "CSR Compliant",       bg: "#0B9C2C" },
                { label: "NEP 2020 Aligned",    bg: "#003262" },
                { label: "Audited Impact",       bg: "#FF7F00" },
              ].map(({ label, bg }) => (
                <div key={label} className="pill" style={{ background: bg }}>{label}</div>
              ))}
            </div>
          </div>
        </section>

        {/* §2  STATS BAND */}
        {/* <div className="nb-stats-band">
          <div className="nb-stats-inner">
            {[
              { icon: "🏢", num: "120+",  label: "Corporate Partners"  },
              { icon: "📊", num: "17",    label: "SDGs Addressed"       },
              { icon: "🎓", num: "840+",  label: "Projects Co-Funded"   },
              { icon: "💰", num: "₹3Cr+", label: "CSR Funds Mobilised"  },
            ].map(({ icon, num, label }) => (
              <div className="nb-stat" key={label}>
                <span className="nb-stat-icon">{icon}</span>
                <div className="nb-stat-num">{num}</div>
                <div className="nb-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div> */}

        {/* ══════════════════════════════════════
            §3  CSR ALIGNMENT — SDG GRID
        ══════════════════════════════════════ */}
        <div className="nb-section">
          <div ref={csrReveal.ref} className={`nb-section-head sr-fade ${csrReveal.isVisible ? "v" : ""}`}>
            <SectionLabel accent="#FF7F00">🌐 CSR Alignment</SectionLabel>
            <h2 className="nb-section-title">
              Why DreamXec Fits <span className="hl-orange">Your CSR Strategy</span>
            </h2>
            <p style={{ marginTop:"0.75rem",fontWeight:700,color:"rgba(0,50,98,.6)",fontSize:"clamp(0.95rem,1.8vw,1.1rem)",maxWidth:640,lineHeight:1.75,textAlign:"justify" }}>
              DreamXec directly aligns with multiple UN Sustainable Development Goals and Indian government priorities — making every rupee doubly impactful.
            </p>
          </div>

          <div className={`sdg-grid sr-stagger ${csrReveal.isVisible ? "v" : ""}`}>
            {sdgAlignments.map(({ icon, sdg, label, accent, description }) => (
              <div key={sdg} className="sdg-card" style={{ boxShadow:`5px 5px 0 ${accent}` }}>
                <div className="sdg-top-bar" style={{ background: accent }} />
                <div className="sdg-header">
                  <div className="sdg-icon-box">{icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap" }}>
                      <span className="sdg-badge" style={{ background: accent }}>{sdg}</span>
                      <span className="sdg-label">{label}</span>
                    </div>
                  </div>
                </div>
                <p className="sdg-desc">{description}</p>
                <div className="sdg-bottom-bar" style={{ background: accent }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── STRIPE ── */}
        <div className="nb-stripe" />

        {/* ══════════════════════════════════════
            §4  PARTNERSHIP MODELS — timeline
        ══════════════════════════════════════ */}
        <div className="nb-section">
          <div ref={partnerReveal.ref} className={`nb-section-head sr-fade ${partnerReveal.isVisible ? "v" : ""}`}>
            <SectionLabel accent="#0B9C2C">🤝 Partnership Models</SectionLabel>
            <h2 className="nb-section-title">
              Choose Your <span className="hl-green">Engagement Level</span>
            </h2>
          </div>

          {/* vertical timeline */}
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",left:35,top:40,bottom:40,width:2,background:"#003262",opacity:0.1,pointerEvents:"none" }} />

            <div className={`sr-stagger ${partnerReveal.isVisible ? "v" : ""}`} style={{ display:"flex",flexDirection:"column",gap:0 }}>
              {partnerships.map(({ num, icon, accent, budget, title, tagline, description }) => (
                <div key={num} style={{ display:"flex",gap:"1.5rem",alignItems:"flex-start",paddingBottom:"1.5rem",position:"relative" }}>
                  {/* Step badge */}
                  <div style={{ flexShrink:0,zIndex:1 }}>
                    <div style={{ width:72,height:72,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:accent,border:"4px solid #003262",boxShadow:"4px 4px 0 #003262",gap:"0.2rem" }}>
                      <span style={{ fontSize:"1.5rem",lineHeight:1 }}>{icon}</span>
                      <span style={{ fontSize:"0.6rem",fontWeight:900,color:"#fff",textTransform:"uppercase",letterSpacing:3 }}>{num}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="partner-card" style={{ flex:1,boxShadow:`5px 5px 0 ${accent}` }}>
                    <div className="partner-header">
                      <div className="partner-titles">
                        <div className="partner-model-title">{title}</div>
                        <div className="partner-tagline">{tagline}</div>
                      </div>
                      <div className="partner-budget" style={{ background: accent }}>{budget}</div>
                    </div>
                    <p className="partner-desc">{description}</p>
                    <div className="partner-bottom-bar" style={{ background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STRIPE ── */}
        <div className="nb-stripe" />

        {/* ══════════════════════════════════════
            §5  CORPORATE BENEFITS — dark + swiper
        ══════════════════════════════════════ */}
        <div className="nb-dark">
          <div className="nb-section" style={{ padding:"0 2rem" }}>
            <div ref={benefitReveal.ref} className={`nb-section-head sr-fade ${benefitReveal.isVisible ? "v" : ""}`} style={{ marginBottom:"2.5rem" }}>
              <SectionLabel dark>📦 What You Get</SectionLabel>
              <h2 className="nb-section-title nb-section-title-dark">
                Corporate <span className="hl-orange">Benefits</span>
              </h2>
              <p style={{ marginTop:"0.75rem",fontWeight:700,color:"rgba(255,200,150,.75)",fontSize:"1rem",textAlign:"center",maxWidth:560 }}>
                Beyond compliance — real business value that keeps growing long after the CSR cheque clears.
              </p>
            </div>

            <div className={`sr-scale ${benefitReveal.isVisible ? "v" : ""}`} style={{ position:"relative" }}>
              <button className="swiper-nb-prev" style={{ background:"#FF7F00",border:"3px solid #fff",boxShadow:"3px 3px 0 #fff",color:"#003262" }}>←</button>
              <button className="swiper-nb-next" style={{ background:"#FF7F00",border:"3px solid #fff",boxShadow:"3px 3px 0 #fff",color:"#003262" }}>→</button>

              <Swiper
                modules={[Navigation, Pagination, Keyboard, A11y, Autoplay]}
                spaceBetween={16} slidesPerView={1} speed={800}
                navigation={{ prevEl: ".swiper-nb-prev", nextEl: ".swiper-nb-next" }}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                grabCursor
                autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 16 } }}
                style={{ paddingBottom: "2.5rem", paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              >
                {corporateBenefits.map(({ icon, accent, category, points }) => (
                  <SwiperSlide key={category} style={{ height: "auto" }}>
                    <div className="benefit-card" style={{ boxShadow:`6px 6px 0 ${accent}` }}>
                      <div className="benefit-top-bar" style={{ background: accent }} />
                      <div className="benefit-header">
                        <div className="benefit-icon-box" style={{ background: accent }}>{icon}</div>
                        <div className="benefit-cat">{category}</div>
                      </div>
                      <div className="benefit-points">
                        {points.map((pt, i) => (
                          <div key={i} className="benefit-point">
                            <span className="benefit-bullet" style={{ background: accent }}>{i + 1}</span>
                            <p className="benefit-text">{pt}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            §6  CTA
        ═══════════════════════════════════════ */}
        <section className="nb-cta">
          <div style={{ position:"absolute",top:"-2rem",right:"-2rem",width:128,height:128,background:"#FF7F00",border:"4px solid #003262",transform:"rotate(12deg)",opacity:0.1,pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:"-2rem",left:"-2rem",width:96,height:96,background:"#0B9C2C",transform:"rotate(-12deg)",opacity:0.1,pointerEvents:"none" }} />

          <div ref={ctaReveal.ref} className={`nb-cta-inner sr-fade ${ctaReveal.isVisible ? "v" : ""}`}>
            <div style={{ display:"flex",justifyContent:"center",marginBottom:"1rem" }}>
              <SectionLabel>🚀 Let's Partner</SectionLabel>
            </div>
            <h2 className="nb-cta-title">
              Ready to Build <span className="hl-orange">India's Future?</span>
            </h2>
            <p className="nb-cta-sub">
              Join 120+ companies already partnering with DreamXec to fund student innovation, build authentic brand equity, and create the talent pipeline of tomorrow — starting today.
            </p>
            <div className="tricolor">
              <div style={{ background:"#FF7F00" }} />
              <div style={{ background:"#fff",border:"1px solid #eee" }} />
              <div style={{ background:"#0B9C2C" }} />
            </div>
            <div className="nb-cta-buttons">
              <a href="/contact" className="nb-btn-1">💼 Discuss Partnership Options →</a>
              <a href="/discover-projects" className="nb-btn-2">Browse Projects First</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default CorporateCSRPartnerships;