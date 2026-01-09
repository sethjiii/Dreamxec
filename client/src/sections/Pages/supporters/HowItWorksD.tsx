import { Header } from '../../Header'
import { Footer } from '../../Footer'

const HowItWorksDonors = () => {

    const steps = [
        {
            title: "STEP 1: DISCOVER & RESEARCH",
            text: "Browse projects by category, theme, or creator. Read the project description, watch the team's video, check creator credentials. Read backer comments and mentor feedback (often brutal honesty helps). Spend time. Make sure you genuinely believe in the project and team. Use the \"Follow\" button if you want to track progress without committing yet."
        },
        {
            title: "STEP 2: PLEDGE YOUR SUPPORT",
            text: "Choose your pledge amount (₹100 to ₹1L+). Review what you're supporting: the specific milestone or outcome you're backing. Confirm your contact info. Add an optional note to the creator (many backers share personal stories or encouragement—these mean a lot to young teams)."
        },
        {
            title: "STEP 3: SECURE PAYMENT & CONFIRMATION",
            text: "Pay via UPI, card, or wallet (Razorpay integration). Your pledge is confirmed. You receive a receipt. The project team is notified. You join a community of supporters on that project's backer page. Now watch as the team executes with mentors' guidance."
        },
        {
            title: "STEP 4: TRACK PROGRESS & IMPACT",
            text: "Receive bi-weekly updates from the team via email. See project progress, challenges overcome, milestones hit. Some projects invite backers to virtual progress calls (optional). Once complete, receive final report: what they built, what they learned, what impact they created, and what's next (job placement, patent filing, startup launch, etc.)."
        }
    ]

    const budgetBreakdown = [
        {
            category: "Materials & Supplies",
            amount: "30–40%",
            description: "(components, lab materials, equipment rentals)"
        },
        {
            category: "Team Stipends",
            amount: "20–30%",
            description: "(if students need to take time off internships/part-time jobs)"
        },
        {
            category: "Mentorship Support",
            amount: "5–10%",
            description: "(if bringing in specialized mentors or consultants)"
        },
        {
            category: "Manufacturing/Production",
            amount: "15–25%",
            description: "(if moving from prototype to small-scale production)"
        },
        {
            category: "Platform & Legal",
            amount: "5%",
            description: "(DreamXec fees, insurance, regulatory compliance)"
        }
    ]

    const impactMetrics = [
        {
            title: "Career Outcomes",
            description: "Did the student get a job, internship, or admission to dream school?"
        },
        {
            title: "Innovation Impact",
            description: "Did they file a patent? Publish research? Launch a startup?"
        },
        {
            title: "Social Impact",
            description: "How many people did their project help? What changed in a community?"
        },
        {
            title: "Learning Gains",
            description: "What did they learn? New skills? Confidence boost?"
        }
    ]

    const FAQ = [
        {
            q: "What's the minimum pledge amount?",
            a: "₹100. Even small amounts add up and show the team they have community support."
        },
        {
            q: "Can I change my pledge amount or get a refund?",
            a: "No, since this is a donation refunds will not be possible."
        },
        {
            q: "What if the project doesn't deliver?",
            a: "Research is based on educated hypotheses hence the chances for failure is always there. You may however raise a concern with the DX team for review of a particular project if the milestone report submission does not seem correct. If there is any misappropriation of funds dishonest projects will face removal from the platform as well as downgrading of club rankings and a concern report to the affiliated college."
        },
        {
            q: "Can I contribute anonymously?",
            a: "Yes. Check the \"Anonymous Backer\" option at checkout. The creator won't see your name (though they'll know one anonymous person backed them)."
        },
        {
            q: "How often do projects actually succeed?",
            a: "In research success isn't just about creating a final product but also crossing out ways to how not to approach a problem."
        }
    ]

    return (
        <>
            {/* SEO */}
            <title>How It Works for Donors | DreamXec</title>
            <meta
                name="description"
                content="Support Innovation in 4 Simple Steps. From finding a project to seeing real-world impact. Here's exactly how DreamXec works for supporters."
            />

            <Header />

            <main className="space-y-24 relative self-start box-border caret-transparent w-full py-20">

                {/* Hero */}
                <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
                    <h1 className="text-dreamxec-berkeley-blue text-4xl md:text-7xl font-extrabold">
                        Support Innovation in 4 Simple Steps
                    </h1>
                    <p className="text-dreamxec-navy text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        From finding a project to seeing real-world impact. Here's exactly how DreamXec works for supporters.
                    </p>
                </section>

                {/* Funding Flow */}
                <section className="max-w-7xl mx-auto px-4 space-y-12">
                    <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
                        Funding Flow
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                style={{ animationDelay: `${index * 120}ms` }}
                                className="card-pastel animate-fade-in p-8 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card text-left"
                            >
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-berkeley-blue mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Money Usage Transparency */}
                <section className="max-w-7xl mx-auto px-4 space-y-12">
                    <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
                        Money Usage Transparency
                    </h2>

                    <div className="max-w-6xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-8 text-center">
                            Where Does Your Money Go?
                        </h3>

                        <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto mb-8">
                            Each project specifies a budget breakdown:
                        </p>

                        <div className="space-y-4 mb-8">
                            {budgetBreakdown.map((item, index) => (
                                <div
                                    key={index}
                                    className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h4 className="text-lg md:text-xl font-bold text-dreamxec-berkeley-blue mb-2">
                                                {item.category}
                                            </h4>
                                            <p className="text-dreamxec-navy text-sm md:text-base">
                                                {item.description}
                                            </p>
                                        </div>
                                        <span className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue whitespace-nowrap">
                                            {item.amount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-between gap-8 items-center'>
                            <div className="card-pastel p-6 h-42 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
                                <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                    <span className='font-bold'>You can challenge any project</span> that seems to have unrealistic budget allocations. Our team reviews. If something looks off, we pause the project until it's explained.
                                </p>
                            </div>

                            <div className="card-pastel p-6 h-42 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card ">
                                <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                    <span className='font-bold'>Monthly transparency reports:</span> Projects raising &gt; ₹5L must submit monthly expense reports (itemized). Backers can see receipts. This level of accountability is rare in Indian crowdfunding—we've made it standard.
                                </p>
                            </div>


                        </div>

                    </div>
                </section>

                {/* Impact Tracking */}
                <section className="max-w-7xl mx-auto px-4 space-y-12">
                    <h2 className="text-dreamxec-berkeley-blue text-4xl md:text-6xl font-extrabold text-center">
                        Impact Tracking
                    </h2>

                    <div className="max-w-6xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-dreamxec-berkeley-blue mb-8 text-center">
                            Beyond Money: Measuring Real Change
                        </h3>

                        <p className="text-dreamxec-navy text-base md:text-2xl font-semibold leading-relaxed max-w-7xl mx-auto mb-8">
                            DreamXec doesn't stop at funding. We track what happens after projects launch:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {impactMetrics.map((metric, index) => (
                                <div
                                    key={index}
                                    className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card"
                                >
                                    <h4 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3">
                                        {metric.title}
                                    </h4>
                                    <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed">
                                        {metric.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="card-pastel p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-card">
                            <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed">
                                <span className='font-bold'>You receive outcome reports</span> 6 months, 1 year, and 3 years post-funding. See where your support led. Many of our backers become repeat supporters once they see the real-world impact.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="relative px-4">
                    <div className="relative max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="flex justify-center mb-6">
                                <div className="bg-tricolor-horizontal h-3 w-48 rounded-full"></div>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-dreamxec-berkeley-blue mb-4">
                                Frequently Asked Questions
                            </h2>
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

                                    <h3 className="text-lg font-bold text-dreamxec-navy font-display mb-3">
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



            </main>

            <Footer />
        </>
    )
}

export default HowItWorksDonors