import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock types for demonstration
interface User {
  id: string;
  name: string;
  email: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  goalAmount: number;
  currentAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  clubName: string;
  category: string;
  createdAt: Date | string;
  deadline: Date | string;
  // NEW RECOMMENDED FIELDS
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  detailedBudget?: string;
  impactStatement?: string;
  milestones?: Array<{ title: string; description: string; targetDate: string }>;
  updates?: Array<{ date: string; title: string; content: string }>;
  donorCount?: number;
  documents?: Array<{ name: string; url: string }>;
  tags?: string[];
  videoUrl?: string;
  gallery?: string[];
}

interface CampaignDetailsProps {
  currentUser: User | null;
  campaigns: Campaign[];
  onLogin?: () => void;
  onLogout?: () => void;
  onDonate?: (campaignId: string, amount: number) => void;
}

const StarDecoration = ({ className, color }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill={color || "#FF7F00"}>
    <polygon points="50,15 61,40 88,40 67,57 74,82 50,67 26,82 33,57 12,40 39,40" />
  </svg>
);

const Header = ({ currentUser, onLogin, onLogout }: { currentUser: User | null; onLogin?: () => void; onLogout?: () => void }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-dreamxec-cream border-b-4 border-dreamxec-navy shadow-lg">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-dreamxec-navy font-display">DreamXec</h1>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            <span className="text-dreamxec-navy font-sans">{currentUser.name}</span>
            <button onClick={onLogout} className="px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy font-bold">
              Logout
            </button>
          </>
        ) : (
          <button onClick={onLogin} className="px-4 py-2 bg-dreamxec-green text-white rounded-lg border-3 border-dreamxec-navy font-bold">
            Login
          </button>
        )}
      </div>
    </div>
  </header>
);

export default function CampaignDetails({ currentUser, campaigns, onLogin, onLogout, onDonate }: CampaignDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'updates' | 'milestones' | 'budget'>('about');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const findCampaign = () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const foundCampaign = campaigns.find(c => c.id === id);

        if (!foundCampaign) {
          throw new Error('Campaign not found');
        }

        setCampaign(foundCampaign);
      } catch (err) {
        console.error('Failed to find campaign:', err);
        setError('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    findCampaign();
  }, [id, campaigns]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dreamxec-cream">
        <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />
        <div className="flex items-center justify-center min-h-[60vh] mt-20">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-dreamxec-orange border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-dreamxec-navy font-display">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-dreamxec-cream">
        <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />
        <div className="flex items-center justify-center min-h-[60vh] mt-20">
          <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md transform hover:scale-105 transition-transform">
            <div className="card-tricolor-tag"></div>
            <svg className="w-20 h-20 mx-auto mb-4 text-dreamxec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-3xl font-bold text-dreamxec-navy mb-4 font-display">{error || 'Campaign Not Found'}</h2>
            <p className="text-dreamxec-navy font-sans mb-6">
              {error || "The campaign you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-saffron"
            >
              Browse Campaigns
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100);
  const remainingAmount = Math.max(campaign.goalAmount - campaign.currentAmount, 0);
  const daysLeft = Math.max(Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0);

  const handleDonate = () => {
    if (!currentUser) {
      if (onLogin) onLogin();
      else navigate('/auth');
      return;
    }
    setShowDonateModal(true);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(donationAmount);
    if (amount > 0) {
      if (onDonate) {
        onDonate(campaign.id, amount);
      } else {
        console.log('Donate:', campaign.id, amount);
        alert('Donation processing. Please try again later.');
      }
      setShowDonateModal(false);
      setDonationAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      <Header currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />

      {/* Enhanced decorative elements with animation */}
      <div className="absolute top-20 left-10 z-0 opacity-20 pointer-events-none animate-pulse">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 left-1/4 z-0 opacity-15 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}>
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>
      <div className="absolute top-1/2 right-10 z-0 opacity-10 pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}>
        <StarDecoration className="w-14 h-14" color="#FF9933" />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 py-8 mt-20 pb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-dreamxec-navy font-bold font-display hover:text-dreamxec-orange transition-all hover:gap-3 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Campaigns
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image with Gradient Overlay */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card overflow-hidden group">
              <div className="card-tricolor-tag"></div>
              <div className="relative overflow-hidden">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dreamxec-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Campaign Title & Meta Info */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 hover:shadow-pastel-card-lg transition-shadow">
              <div className="card-tricolor-tag"></div>
              <div className="flex items-start justify-between gap-4 mt-4">
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-dreamxec-navy mb-4 font-display leading-tight">
                    {campaign.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-dreamxec-navy">
                    <div className="flex items-center gap-2 bg-dreamxec-cream px-3 py-2 rounded-lg border-2 border-dreamxec-orange">
                      <svg className="w-5 h-5 text-dreamxec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-sans font-semibold">{campaign.clubName}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-dreamxec-cream px-3 py-2 rounded-lg border-2 border-dreamxec-green">
                      <svg className="w-5 h-5 text-dreamxec-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-sans font-semibold">{campaign.category}</span>
                    </div>
                    {campaign.tags && campaign.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {campaign.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-dreamxec-saffron/20 text-dreamxec-navy rounded-full border-2 border-dreamxec-saffron text-sm font-sans font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border-3 font-bold font-display whitespace-nowrap ${campaign.status === 'approved' ? 'bg-dreamxec-green text-white border-dreamxec-navy shadow-pastel-green' :
                  campaign.status === 'pending' ? 'bg-yellow-400 text-dreamxec-navy border-dreamxec-navy' :
                    'bg-red-500 text-white border-dreamxec-navy'
                  }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Organizer Info (NEW) */}
            {campaign.organizerName && (
              <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6">
                <div className="card-tricolor-tag"></div>
                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-dreamxec-navy mb-4 font-display flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Campaign Organizer
                  </h2>
                  <div className="space-y-2">
                    <p className="text-lg text-dreamxec-navy font-sans"><span className="font-bold">Name:</span> {campaign.organizerName}</p>
                    {campaign.organizerEmail && (
                      <p className="text-dreamxec-navy font-sans flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {campaign.organizerEmail}
                      </p>
                    )}
                    {campaign.organizerPhone && (
                      <p className="text-dreamxec-navy font-sans flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {campaign.organizerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tabbed Content Section */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card overflow-hidden">
              <div className="card-tricolor-tag"></div>

              {/* Tabs */}
              <div className="flex border-b-4 border-dreamxec-navy mt-4">
                {[
                  { id: 'about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'updates', label: 'Updates', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                  { id: 'milestones', label: 'Milestones', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'budget', label: 'Budget', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-4 font-bold font-display transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                      ? 'bg-dreamxec-orange text-white border-b-4 border-dreamxec-navy'
                      : 'bg-dreamxec-cream text-dreamxec-navy hover:bg-dreamxec-saffron/20'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h3 className="text-2xl font-bold text-dreamxec-navy mb-4 font-display">About This Campaign</h3>
                      <p className="text-dreamxec-navy font-sans text-lg leading-relaxed whitespace-pre-wrap">
                        {campaign.description}
                      </p>
                    </div>
                    {campaign.impactStatement && (
                      <div className="bg-dreamxec-saffron/10 border-l-4 border-dreamxec-orange p-4 rounded-r-lg">
                        <h4 className="font-bold text-dreamxec-navy mb-2 font-display flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Expected Impact
                        </h4>
                        <p className="text-dreamxec-navy font-sans">{campaign.impactStatement}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="space-y-4 animate-fadeIn">
                    {campaign.updates && campaign.updates.length > 0 ? (
                      campaign.updates.map((update, idx) => (
                        <div key={idx} className="bg-dreamxec-cream p-4 rounded-lg border-3 border-dreamxec-green hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-dreamxec-green rounded-full flex items-center justify-center text-white font-bold shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-dreamxec-navy font-display">{update.title}</h4>
                                <span className="text-sm text-dreamxec-navy/70 font-sans">{update.date}</span>
                              </div>
                              <p className="text-dreamxec-navy font-sans">{update.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-dreamxec-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-dreamxec-navy/70 font-sans">No updates yet. Check back soon!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'milestones' && (
                  <div className="space-y-4 animate-fadeIn">
                    {campaign.milestones && campaign.milestones.length > 0 ? (
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-1 bg-dreamxec-orange"></div>
                        {campaign.milestones.map((milestone, idx) => (
                          <div key={idx} className="relative pl-16 pb-8">
                            <div className="absolute left-3 w-6 h-6 bg-dreamxec-orange rounded-full border-4 border-white shadow-lg"></div>
                            <div className="bg-dreamxec-cream p-4 rounded-lg border-3 border-dreamxec-orange hover:shadow-lg transition-shadow">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-dreamxec-navy font-display">{milestone.title}</h4>
                                <span className="text-sm text-dreamxec-navy/70 font-sans whitespace-nowrap ml-2">{milestone.targetDate}</span>
                              </div>
                              <p className="text-dreamxec-navy font-sans">{milestone.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-dreamxec-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-dreamxec-navy/70 font-sans">No milestones defined yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'budget' && (
                  <div className="space-y-6 animate-fadeIn">
                    {campaign.detailedBudget ? (
                      <div className="bg-dreamxec-cream p-6 rounded-lg border-3 border-dreamxec-green">
                        <h3 className="text-xl font-bold text-dreamxec-navy mb-4 font-display">Budget Breakdown</h3>
                        <p className="text-dreamxec-navy font-sans whitespace-pre-wrap leading-relaxed">{campaign.detailedBudget}</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-dreamxec-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="text-dreamxec-navy/70 font-sans">Detailed budget information not available.</p>
                      </div>
                    )}
                    {campaign.documents && campaign.documents.length > 0 && (
                      <div>
                        <h4 className="font-bold text-dreamxec-navy mb-3 font-display">Supporting Documents</h4>
                        <div className="space-y-2">
                          {campaign.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-dreamxec-navy hover:bg-dreamxec-saffron/10 transition-all group"
                            >
                              <svg className="w-6 h-6 text-dreamxec-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span className="flex-1 text-dreamxec-navy font-sans font-medium">{doc.name}</span>
                              <svg className="w-5 h-5 text-dreamxec-green opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 hover:shadow-pastel-card-lg transition-shadow">
              <div className="card-tricolor-tag"></div>
              <h2 className="text-2xl font-bold text-dreamxec-navy mb-6 font-display mt-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Campaign Timeline
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-dreamxec-cream to-white rounded-lg border-3 border-dreamxec-orange hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-dreamxec-orange rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-dreamxec-navy/70 font-sans font-semibold">Started</p>
                    <p className="text-lg font-bold text-dreamxec-navy font-display">
                      {campaign.createdAt instanceof Date
                        ? campaign.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(campaign.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-dreamxec-cream to-white rounded-lg border-3 border-dreamxec-green hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-dreamxec-green rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-dreamxec-navy/70 font-sans font-semibold">Deadline</p>
                    <p className="text-lg font-bold text-dreamxec-navy font-display">
                      {campaign.deadline instanceof Date
                        ? campaign.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(campaign.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Funding Card */}
          <div className="lg:col-span-1">
            <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 lg:sticky lg:top-24 hover:shadow-pastel-card-lg transition-all">
              <div className="card-tricolor-tag"></div>

              {/* Funding Amount with Animation */}
              <div className="mt-4 mb-6 text-center">
                <p className="text-5xl lg:text-6xl font-bold text-dreamxec-navy mb-2 font-display animate-slideInUp">
                  ₹{campaign.currentAmount.toLocaleString()}
                </p>
                <p className="text-xl text-dreamxec-navy/70 font-sans">
                  raised of <span className="font-bold text-dreamxec-orange">₹{campaign.goalAmount.toLocaleString()}</span>
                </p>
                <p className="text-sm text-dreamxec-navy/60 font-sans mt-2">
                  {campaign.donorCount || 0} supporters
                </p>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="mb-6">
                <div className="relative w-full h-8 bg-dreamxec-cream rounded-full border-4 border-dreamxec-navy overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-dreamxec-green via-dreamxec-saffron to-dreamxec-orange transition-all duration-1000 ease-out flex items-center justify-center"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    {progressPercentage > 15 && (
                      <span className="text-white text-sm font-bold font-display drop-shadow-lg">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  {progressPercentage <= 15 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dreamxec-navy text-sm font-bold font-display">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-gradient-to-br from-dreamxec-cream to-white rounded-lg border-3 border-dreamxec-orange text-center hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-dreamxec-navy font-display">
                    ₹{remainingAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-dreamxec-navy/70 font-sans font-semibold">Remaining</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-dreamxec-cream to-white rounded-lg border-3 border-dreamxec-green text-center hover:scale-105 transition-transform">
                  <p className="text-2xl font-bold text-dreamxec-navy font-display">
                    {daysLeft}
                  </p>
                  <p className="text-xs text-dreamxec-navy/70 font-sans font-semibold">Days Left</p>
                </div>
              </div>

              {/* Donate Button */}
              {campaign.status === 'approved' && (
                <button
                  onClick={handleDonate}
                  className="w-full px-6 py-4 bg-gradient-to-r from-dreamxec-green to-dreamxec-saffron text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display text-xl hover:scale-105 hover:shadow-2xl transition-all shadow-pastel-green flex items-center justify-center gap-2 animate-pulse-slow"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Support This Campaign
                </button>
              )}

              {campaign.status === 'pending' && (
                <div className="w-full px-6 py-4 bg-yellow-100 text-yellow-800 rounded-lg border-4 border-yellow-400 font-bold font-display text-center">
                  Campaign Pending Approval
                </div>
              )}

              {/* Share Section */}
              <div className="mt-6 pt-6 border-t-4 border-dreamxec-navy">
                <p className="text-sm font-bold text-dreamxec-navy mb-3 font-display flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share this campaign
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {/* LinkedIn Share */}
                  <button
                    onClick={() => {
                      const campaignUrl = window.location.href;
                      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    className="flex-1 p-3 bg-[#0A66C2] text-white rounded-lg border-3 border-dreamxec-navy hover:scale-105 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mx-auto"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                    </svg>
                  </button>


                  {/* Facebook */}
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="p-3 bg-blue-600 text-white rounded-lg border-3 border-dreamxec-navy hover:scale-110 hover:-rotate-3 transition-all shadow-lg"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          "Check out this amazing campaign!"
                        )}&url=${encodeURIComponent(window.location.href)}`,
                        "_blank"
                      )
                    }
                    className="p-3 bg-black text-white flex items-center justify-center rounded-lg border-3 border-dreamxec-navy hover:scale-110 hover:rotate-3 transition-all shadow-lg"
                    title="Share on Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ffffff"
                      viewBox="0 0 16 16"
                      height="16"
                      width="16"
                    >
                      <path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Z" />
                    </svg>
                  </button>


                  {/* WhatsApp */}
                  <button
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out this amazing campaign!")}%20${encodeURIComponent(window.location.href)}`, "_blank")}
                    className="p-3 bg-green-600 text-white rounded-lg border-3 border-dreamxec-navy hover:scale-110 hover:-rotate-3 transition-all shadow-lg"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t-4 border-dreamxec-navy">
                <div className="flex items-center gap-2 text-dreamxec-green mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-sans text-dreamxec-navy">Verified Campaign</span>
                </div>
                <div className="flex items-center gap-2 text-dreamxec-orange">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-sans text-dreamxec-navy">Transparent Use of Funds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal - Enhanced */}
      {showDonateModal && (
        <div
          className="fixed inset-0 z-[9999] flex justify-center items-center p-4 animate-fadeIn"
          style={{ backgroundColor: 'rgba(0, 0, 128, 0.85)' }}
          onClick={() => setShowDonateModal(false)}
        >
          <div
            className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-2xl max-w-md w-full p-8 animate-slideInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-tricolor-tag"></div>
            <div className="flex items-center justify-between mb-6 mt-4">
              <h2 className="text-3xl font-bold text-dreamxec-navy font-display flex items-center gap-2">
                <svg className="w-8 h-8 text-dreamxec-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Make a Donation
              </h2>
              <button
                onClick={() => setShowDonateModal(false)}
                className="text-dreamxec-navy hover:text-dreamxec-orange transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDonateSubmit}>
              <div className="mb-6">
                <label className="block text-lg font-bold text-dreamxec-navy mb-3 font-display">
                  Donation Amount (₹)
                </label>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="1"
                  required
                  className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-lg text-xl font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-4 focus:ring-dreamxec-green/30 transition-all"
                />
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-dreamxec-navy mb-3 font-display">Quick Select:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`px-3 py-2 rounded-lg border-3 font-bold font-display transition-all hover:scale-105 ${donationAmount === amount.toString()
                        ? 'bg-dreamxec-orange text-white border-dreamxec-navy shadow-lg'
                        : 'bg-dreamxec-cream text-dreamxec-navy border-dreamxec-orange hover:bg-dreamxec-orange hover:text-white'
                        }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-dreamxec-saffron/10 border-l-4 border-dreamxec-orange p-4 rounded-r-lg mb-6">
                <p className="text-sm text-dreamxec-navy font-sans">
                  <span className="font-bold">Your donation helps:</span> {campaign.title}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-dreamxec-navy rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-dreamxec-green to-dreamxec-saffron text-white rounded-lg border-4 border-dreamxec-navy font-bold font-display hover:scale-105 transition-transform shadow-pastel-green"
                >
                  Donate Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.4s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Custom styles matching your design system */
        .card-pastel-offwhite {
          background-color: #FAF6F1;
        }
        .card-tricolor-tag {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(to right, #FF7F00 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #0B9C2C 66.66%);
        }
        .shadow-pastel-card {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 128, 0.1), 0 2px 4px -1px rgba(0, 0, 128, 0.06);
        }
        .shadow-pastel-card-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 128, 0.15), 0 4px 6px -2px rgba(0, 0, 128, 0.1);
        }
        .shadow-pastel-green {
          box-shadow: 0 4px 14px 0 rgba(11, 156, 44, 0.39);
        }
        .shadow-pastel-saffron {
          box-shadow: 0 4px 14px 0 rgba(255, 127, 0, 0.39);
        }
        .border-5 {
          border-width: 5px;
        }
        .border-3 {
          border-width: 3px;
        }
        .font-display {
          font-family: 'Poppins', sans-serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}