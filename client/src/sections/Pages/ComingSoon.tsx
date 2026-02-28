import { useState } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const articles = [
  {
    outlet: "PTI News",
    outletShort: "PTI",
    tier: "National Wire",
    date: "Feb 28, 2026",
    headline: "Crowdfunding Platform Launched to Support Student Research & Innovation",
    summary: "Press Trust of India covers DreamXec's launch as a crowdfunding platform enabling college clubs to raise funds for research and innovation projects across India.",
    url: "https://www.ptinews.com/story/business/crowdfunding-platform-launched-to-support-student-research-innovation/3419744",
    domain: "ptinews.com",
    shadow: "#FF7F00",
  },
  {
    outlet: "The Hindu",
    outletShort: "TH",
    tier: "National Daily",
    date: "Feb 28, 2026",
    headline: "News from the World of Education — February 28, 2026",
    summary: "The Hindu's education desk features DreamXec in its daily education roundup, highlighting the platform's mission to democratise research funding for students.",
    url: "https://www.thehindu.com/education/news-from-the-world-of-education-february-28-2026/article70687301.ece/amp/",
    domain: "thehindu.com",
    shadow: "#0B9C2C",
  },
  {
    outlet: "News18",
    outletShort: "N18",
    tier: "National Digital",
    date: "Feb 28, 2026",
    headline: "Crowdfunding Platform Launched to Support Student Research & Innovation",
    summary: "News18 publishes the PTI wire story on DreamXec, reaching millions of readers across its digital network on National Science Day 2026.",
    url: "https://www.news18.com/agency-feeds/crowdfunding-platform-launched-to-support-student-research-innovation-9934069.html",
    domain: "news18.com",
    shadow: "#FF7F00",
  },
  {
    outlet: "The Week",
    outletShort: "TW",
    tier: "National Magazine",
    date: "Feb 27, 2026",
    headline: "Crowdfunding Platform Launched to Support Student Research & Innovation",
    summary: "The Week carries the national wire story as DreamXec announces its launch, positioning student-led innovation at the centre of India's research ecosystem.",
    url: "https://www.theweek.in/wire-updates/business/2026/02/27/crowdfunding-platform-launched-to-support-student-research-innovation.amp.html",
    domain: "theweek.in",
    shadow: "#0B9C2C",
  },
  {
    outlet: "Prittle Prattle News",
    outletShort: "PPN",
    tier: "EdTech Media",
    date: "Feb 2026",
    headline: "DreamXec on National Science Day — Student Research Funding 2026",
    summary: "Prittle Prattle News features an in-depth profile of DreamXec's launch on National Science Day, covering its vision for Atmanirbhar student innovation.",
    url: "https://www.prittleprattlenews.com/education/dreamxec-national-science-day-student-research-funding-2026/",
    domain: "prittleprattlenews.com",
    shadow: "#000080",
  },
];

const pressKitFiles = [
  {
    label: "Press Release",
    desc: "Official launch press release",
    driveUrl: "https://drive.google.com/file/d/1vvttHpOvqEgMmhL3ofpB-grjnIhVDX0T/view",
    embedId: "1vvttHpOvqEgMmhL3ofpB-grjnIhVDX0T",
    shadow: "#FF7F00",
  },
  {
    label: "Media Kit",
    desc: "Brand assets & fact sheet",
    driveUrl: "https://drive.google.com/file/d/1NSZ4ThLWnkUZ73UfZUoKWOq-moxF7Bvp/view",
    embedId: "1NSZ4ThLWnkUZ73UfZUoKWOq-moxF7Bvp",
    shadow: "#0B9C2C",
  },
  {
    label: "Coverage Deck",
    desc: "Summary of all media mentions",
    driveUrl: "https://drive.google.com/file/d/1WAMB4c9sH9mos92-Yllqy9Dxv1ZJARi_/view",
    embedId: "1WAMB4c9sH9mos92-Yllqy9Dxv1ZJARi_",
    shadow: "#000080",
  },
];

/* ─────────────────────────────────────────────
   ARTICLE CARD — with link preview
───────────────────────────────────────────── */
function ArticleCard({ item }: { item: typeof articles[0] }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white flex flex-col transition-all duration-200 hover:translate-x-[-3px] hover:translate-y-[-3px]"
      style={{ border: '3px solid #000080', boxShadow: `6px 6px 0 ${item.shadow}` }}
    >
      {/* Top stripe */}
      <div className="h-2" style={{ background: item.shadow }} />

      <div className="p-4 sm:p-5 flex flex-col flex-1">

        {/* Outlet row */}
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-9 h-9 flex items-center justify-center font-black text-xs text-white flex-shrink-0"
            style={{ background: '#000080', border: '2px solid #000080' }}
          >
            {item.outletShort.slice(0, 3)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-dreamxec-navy text-xs sm:text-sm uppercase tracking-wide truncate">
              {item.outlet}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest"
                style={{ border: '1.5px solid #FF7F00', background: '#fff7ed', color: '#c2410c' }}
              >
                {item.tier}
              </span>
              <span className="text-[9px] font-bold text-dreamxec-navy/40 uppercase tracking-wide">
                {item.date}
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h4 className="text-sm sm:text-base font-black text-dreamxec-navy uppercase tracking-tight leading-snug mb-2">
          {item.headline}
        </h4>

        {/* Summary — link preview body */}
        <p className="text-xs text-dreamxec-navy/60 font-medium leading-relaxed mb-3 flex-1">
          {item.summary}
        </p>

        {/* Link preview footer — domain bar */}
        <div
          className="flex items-center justify-between px-3 py-2 transition-colors group-hover:bg-dreamxec-navy mt-auto"
          style={{ border: '2px solid #000080' }}
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-dreamxec-navy/40 group-hover:text-white/60 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-[10px] font-bold text-dreamxec-navy/50 group-hover:text-white/60 transition-colors truncate">
              {item.domain}
            </span>
          </div>
          <span className="font-black text-xs text-dreamxec-navy group-hover:text-white transition-all group-hover:translate-x-1 duration-150">
            →
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────
   PDF PREVIEW CARD — always open, full height
───────────────────────────────────────────── */
function PdfCard({ file }: { file: typeof pressKitFiles[0] }) {
  const embedUrl = `https://drive.google.com/file/d/${file.embedId}/preview`;

  return (
    <div
      className="bg-white flex flex-col"
      style={{ border: '3px solid #000080', boxShadow: `6px 6px 0 ${file.shadow}` }}
    >
      {/* Top stripe */}
      <div className="h-2 flex-shrink-0" style={{ background: file.shadow }} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#000080]/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0"
            style={{ background: file.shadow, border: '2px solid #000080' }}
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-black text-dreamxec-navy uppercase tracking-wide">{file.label}</p>
            <p className="text-[10px] text-dreamxec-navy/50 font-medium">{file.desc}</p>
          </div>
        </div>

        <a
          href={file.driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 font-black text-[10px] uppercase tracking-widest text-white transition-all hover:opacity-80"
          style={{ background: '#000080', border: '2px solid #000080', boxShadow: '2px 2px 0 #FF7F00' }}
        >
          Open ↗
        </a>
      </div>

      {/* PDF iframe — large */}
      <div style={{ height: 600 }}>
        <iframe
          src={embedUrl}
          className="w-full h-full"
          title={file.label}
          allow="autoplay"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PressMedia() {
  return (
    <div className="min-h-screen bg-dreamxec-cream">

      {/* ── Decorative shapes ── */}
      <div className="fixed top-28 right-8 pointer-events-none opacity-10">
        <div className="w-14 h-14 border-4 border-dreamxec-orange rotate-12" />
      </div>
      <div className="fixed bottom-40 left-8 pointer-events-none opacity-10">
        <div className="w-10 h-10 bg-dreamxec-green rotate-45" />
      </div>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative bg-dreamxec-navy overflow-hidden" style={{ borderBottom: '5px solid #FF7F00' }}>

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Left tricolor bar */}
        <div className="absolute top-0 left-0 flex flex-col h-full w-2.5">
          <div className="flex-1 bg-[#FF7F00]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#0B9C2C]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16 pl-8 sm:pl-12">

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-white"
            style={{ background: '#FF7F00', border: '2px solid #fff' }}
          >
            📰 Press & Media
          </div>

          <h1 className="font-black uppercase leading-none tracking-tight mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
              In the
            </span>
            <span className="block mt-1 sm:mt-2">
              <span className="relative inline-block">
                <span className="absolute inset-0 translate-x-[5px] translate-y-[5px] sm:translate-x-[7px] sm:translate-y-[7px]" style={{ background: '#0B9C2C' }} aria-hidden />
                <span
                  className="relative z-10 inline-block px-3 sm:px-5 py-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white"
                  style={{ background: '#FF7F00', border: '3px solid #fff', color: '#000080' }}
                >
                  News
                </span>
              </span>
            </span>
          </h1>

          <p className="text-white/60 text-sm sm:text-base font-bold max-w-lg leading-relaxed mt-4">
            DreamXec's launch on National Science Day, Feb 28 2026, was covered by leading national publications.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { n: articles.length, label: 'Media Mentions' },
              { n: '3', label: 'Press Documents' },
              { n: 'PTI', label: 'Wire Coverage' },
            ].map(({ n, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-3 sm:px-4 py-2"
                style={{ border: '2px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)' }}
              >
                <span className="text-xl sm:text-2xl font-black text-dreamxec-orange">{n}</span>
                <span className="text-[10px] sm:text-xs font-black text-white/60 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 md:py-14 space-y-14">

        {/* ══════════════════════════════
            MEDIA COVERAGE
        ══════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="inline-block w-2 h-7 bg-dreamxec-orange" />
            <h2 className="text-xl sm:text-2xl font-black text-dreamxec-navy uppercase tracking-tight">
              Media Coverage
            </h2>
            <span
              className="px-2.5 py-1 text-xs font-black text-white uppercase tracking-wide"
              style={{ background: '#FF7F00', border: '2px solid #000080' }}
            >
              {articles.length} outlets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {articles.map((item, i) => (
              <ArticleCard key={i} item={item} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════
            PRESS KIT / PDF DOCS
        ══════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="inline-block w-2 h-7 bg-[#0B9C2C]" />
            <h2 className="text-xl sm:text-2xl font-black text-dreamxec-navy uppercase tracking-tight">
              Press Documents
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {pressKitFiles.map((file, i) => (
              <PdfCard key={i} file={file} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════
            MEDIA CONTACT
        ══════════════════════════════ */}
        <section>
          <div
            className="bg-white p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{ border: '3px solid #000080', boxShadow: '6px 6px 0 #FF7F00' }}
          >
            {/* Left stripe */}
            <div className="hidden sm:flex flex-col w-2 self-stretch">
              <div className="flex-1 bg-[#FF7F00]" />
              <div className="flex-1 bg-white border-x border-[#000080]/20" />
              <div className="flex-1 bg-[#0B9C2C]" />
            </div>

            <div>
              <p className="text-[10px] font-black text-dreamxec-navy/40 uppercase tracking-widest mb-1">Media Enquiries</p>
              <h3 className="text-lg sm:text-xl font-black text-dreamxec-navy uppercase tracking-tight mb-1">
                For Press & Partnerships
              </h3>
              <p className="text-sm font-bold text-dreamxec-navy/60">
                Reach out for interviews, features, or press kit requests.
              </p>
            </div>

            <a
              href="mailto:press@dreamxec.com"
              className="flex-shrink-0 px-5 py-3 font-black text-white text-xs sm:text-sm uppercase tracking-widest transition-all hover:translate-x-[-1px] hover:translate-y-[-1px]"
              style={{ background: '#000080', border: '2px solid #000080', boxShadow: '4px 4px 0 #FF7F00' }}
            >
              Contact Press Team →
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}