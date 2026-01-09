import { Header } from '../../Header/index'
import { Footer } from '../../Footer/index'

const StartAProject = () => {

  const columns = [
    {
      title: "Step 1: Create Your Project",
      text: "Write a compelling project description, set your funding goal (₹5K–₹50L), upload your video/ppt pitch, and explain project milestones and impact vision."
    },
    {
      title: "Step 2: Campaign & Community",
      text: "Launch your campaign. Supporters pledge funds. Mentors guide your execution. Build momentum with updates and milestone celebrations."
    },
    {
      title: "Step 3: Deliver Impact",
      text: "Once funded, execute with mentor support. Track outcomes (internships, jobs, patents, social impact) and celebrate success."
    }
  ]


  const FAQ = [
    {
      q: "How long does the campaign run?",
      a: "30 to 60 days. You choose the duration and goal. If you reach your goal before deadline, great—celebrate early. If not, you can extend by 30 days."
    },
    {
      q: "What happens if I don't reach my funding goal?",
      a: "With flexible funding enabled (which DreamXec supports), you keep whatever you raised. If all-or-nothing, funds are returned to backers. No penalties to you."
    },
    {
      q: "Can I have multiple projects running?",
      a: "Yes! A club can have multiple research projects. You must report milestones on time. Strong milestone delivery builds donor trust and helps raise funds for future stages."
    },
    {
      q: "How do clubs with challenges get supported?",
      a: "Clubs showing delivery receive higher visibility, while those facing challenges are actively supported by the DreamXec team to move forward."
    },
    {
      q: "What does the project lifecycle look like?",
      a: "List your projects → Outline milestones → Raise funds → Start → Execute → Share outcomes → Raise funds for the next stage of research."
    },
    {
      q: "How do I use platform features like the mentor marketplace?",
      a: "Post your project → select mentor matches → weekly mentorship calls begin immediately, even before your campaign launches."
    }
  ]

  return (
    <>
      {/* SEO */}
      <title>Start a Project | DreamXec</title>
      <meta
        name="description"
        content="Turn your innovation into reality with DreamXec. Get funded, mentored, and supported to launch your student project."
      />

      <Header />

      <main className="space-y-24 relative self-start box-border caret-transparent w-full py-20">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
            Turn Your Innovation Into Reality
          </h1>
          <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto">
            Get funded. Get mentored. Make an impact. Launch your next big idea
            with DreamXec—India's fastest growing student innovation platform.
          </p>
        </section>

        {/* What is DreamXec */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <h2 className="text-dreamxec-berkeley-blue text-center text-4xl md:text-7xl font-extrabold mb-8">
            What is DreamXec for Innovators?
          </h2>
          <p className="text-dreamxec-navy text-sm md:text-xl leading-relaxed ">
            DreamXec is a crowdfunding platform designed specifically for student
            innovators like you. Whether you're building a research project,
            developing a tech solution, creating a social enterprise, or launching
            a startup idea—DreamXec connects you with funding, mentors, and a
            community of believers. We aim to help at least 500+ student projects
            in 2026 and transform ideas into impact. Your idea doesn't need venture
            capital backing; it needs DreamXec backing.
          </p>
        </section>

        {/* Why DreamXec – Whiteboard Cards */}
        <section className="max-w-7xl mx-auto px-4 text-center space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col, index) => (
              <div
                key={index}
                style={{ animationDelay: `${200 + index * 150}ms` }}
                className="card-whiteboard animate-fade-in"
              >
                <div className="whiteboard-content pt-14"> 
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 p-2">
                    {col.title}
                  </h3>
                  <p className="text-xs text-left md:text-sm lg:text-base text-slate-600 leading-relaxed p-2">
                    {col.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* What You Get */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            What You Get
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <h3 className="text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                Funding (₹5K–₹50L)
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-dreamxec-navy leading-relaxed">
                Access capital from passionate supporters. No interference in the research
                process—you own the journey completely!.
              </p>
            </div>

            <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <h3 className="text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                Mentorship (Expert Guidance)
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-dreamxec-navy leading-relaxed">
                Paired with 1,000+ mentors across engineering, business, social impact,
                product with weekly guidance calls.
              </p>
            </div>

            <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
              <h3 className="text-2xl font-bold text-dreamxec-berkeley-blue mb-2">
                Exposure (Build Your Network)
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-dreamxec-navy leading-relaxed">
                Featured on platform homepage, media coverage for standout projects,
                and LinkedIn visibility for your team.
              </p>
            </div>
          </div>
        </section>


        {/* Eligibility Snapshot */}
        <section className="max-w-7xl mx-auto px-4 space-y-12">
          <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
            Eligibility Snapshot
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Who Can Apply */}
            <div className="card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-4">
                Who Can Apply
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-base md:text-lg">
                <li>• Currently enrolled in an Indian college/university</li>
                <li>• Team of 1–6 members (mix of backgrounds welcome)</li>
                <li>• Project in ideation, prototype, or execution stage</li>
                <li>• Any field: tech, biotech, defence, education, environment, art, social sciences etc.</li>
              </ul>
            </div>

            {/* What Doesn't Qualify */}
            <div className="card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-4">
                What Doesn&apos;t Qualify
              </h3>
              <ul className="space-y-2 text-dreamxec-navy text-base md:text-lg">
                <li>• Personal expenses</li>
                <li>• Projects violating laws or ethical standards</li>
              </ul>
            </div>
          </div>
        </section>


        {/* Success Metrics – CriteriaGrid Theme */}
        <section className="w-full  px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 mt-[10%] gap-8 max-w-6xl mx-auto">

            {/* Section Header */}
            <span className="col-span-1 md:col-span-2 text-center text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold mb-8">
              <h2>What would our ‘success’ look like!</h2>
            </span>

            {[
              "Fund 500+ projects in 2026",
              "Target to raise minimum of ₹10 crore",
              "Engage 1,000+ mentors",
              "Achieve minimum of 70% success rate for projects reaching their funding goal",
              "Strengthen meaningful connections among academia, industry and goverment rasing the employment opportunities and the employability"
            ].map((item, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 100}ms` }}
                className="card-glass animate-fade-in flex items-center p-6"
              >
                {/* Left Side: Text */}
                <div className="w-full pr-4">
                  <h2 className="text-2xl font-bold text-dreamxec-gray-250 mb-2">
                    ✅ {item}
                  </h2>
                </div>
              </div>
            ))}

          </div>
        </section>



        {/* FAQ Section */}
        <section className="relative py-16 px-4">
          <div className="relative max-w-7xl mx-auto">

            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="bg-tricolor-horizontal h-3 w-48 rounded-full"></div>
              </div>

              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-berkeley-blue mb-4">
                Frequently Asked Questions
              </h2>

              <p className="text-lg md:text-xl text-dreamxec-berkeley-blue font-sans max-w-3xl mx-auto leading-relaxed">
                Everything you need to know before launching your project on DreamXec
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {FAQ.map((item, index) => (
                <div
                  key={index}
                  className="card-pastel-offwhite rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-tricolor-tag"></div>

                  <h3 className="text-xl font-bold text-dreamxec-navy font-display mb-3">
                    Q: {item.q}
                  </h3>

                  <p className="text-dreamxec-orange font-sans text-sm md:text-base leading-relaxed bg-dreamxec-cream px-4 py-3 rounded-lg">
                    A: {item.a}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>



        {/* CTA Section */}
        <section className="flex  items-center justify-center gap-6 ">

          {/* Pill-style CTA: Primary */}
          <a href="/signup" className="flex justify-center">
            <div className="relative self-start caret-transparent">
              <div className="card-pastel px-10 py-4 rounded-full hover:scale-105 transition-transform">
                <h2 className="text-dreamxec-navy text-base md:text-xl font-sans font-bold leading-tight text-center whitespace-nowrap">
                  <span className="">🚀 Start Your Project</span>
                </h2>
              </div>
            </div>
          </a>

          {/* Pill-style CTA: Secondary */}
          <a href="/innovators/success-stories" className="flex justify-center">
            <div className="relative self-start caret-transparent">
              <div className="card-pastel-offwhite px-10 py-4 rounded-full hover:scale-105 transition-transform">
                <h2 className="text-dreamxec-berkeley-blue text-sm md:text-lg font-sans font-bold leading-tight text-center whitespace-nowrap">
                  Explore Success Stories
                </h2>
              </div>
            </div>
          </a>

        </section>




      </main>

      <Footer />
    </>
  )
}

export default StartAProject
