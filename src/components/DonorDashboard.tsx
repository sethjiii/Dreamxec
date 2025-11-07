import React, { useState, useEffect } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import { getDonorApplications, updateApplicationStatus, type Application } from '../services/applicationService';

interface DonorDashboardProps {
  donorName: string;
  projectsCount: number;
  onCreateProject: () => void;
  onViewProjects: () => void;
}

// Simple SVG Icons
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M15 9l-6 6M9 9l6 6"/>
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Rejection Modal Component
const RejectionModal = ({ 
  applicationTitle, 
  onClose, 
  onSubmit 
}: { 
  applicationTitle: string; 
  onClose: () => void; 
  onSubmit: (reason: string) => void; 
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason.trim());
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex justify-center items-center p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-tricolor-tag"></div>
        
        <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">
            Reject Application
          </h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-dreamxec-navy hover:scale-110 transition-transform flex-shrink-0"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
          <p className="text-dreamxec-navy text-lg font-sans">
            Please provide a reason for rejecting application for:{' '}
            <span className="font-bold font-display">{applicationTitle}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Insufficient experience, different skill requirements..."
            className="w-full h-32 p-4 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all resize-none"
            required
            autoFocus
          />
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-pastel-secondary px-6 py-3 rounded-lg font-display text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <XCircleIcon className="w-5 h-5" />
              Reject Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DonorDashboard({
  donorName,
  projectsCount,
  onCreateProject,
  onViewProjects,
}: DonorDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'applications'>('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [rejectionInfo, setRejectionInfo] = useState<{ id: string; title: string } | null>(null);

  // Application management functions
  const loadApplications = async () => {
    console.log('DonorDashboard: Loading applications...');
    
    setLoadingApplications(true);
    try {
      const response = await getDonorApplications();
      
      if (response.status === 'success' && response.data) {
        console.log('DonorDashboard: Found applications:', response.data.applications.length);
        setApplications(response.data.applications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('DonorDashboard: Failed to load applications:', error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, status: 'ACCEPTED' | 'REJECTED', rejectionReason?: string) => {
    try {
      const response = await updateApplicationStatus(applicationId, {
        status,
        rejectionReason,
      });
      
      if (response.status === 'success') {
        // Refresh applications
        await loadApplications();
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const handleRejectSubmit = (reason: string) => {
    if (rejectionInfo) {
      const { id } = rejectionInfo;
      setRejectionInfo(null);
      handleApplicationAction(id, 'REJECTED', reason);
    }
  };

  // Load applications when tab is selected
  useEffect(() => {
    if (selectedTab === 'applications') {
      loadApplications();
    }
  }, [selectedTab]);

  const pendingApplicationsCount = applications.filter(app => app.status === 'PENDING').length;
  return (
    <>
      {rejectionInfo && (
        <RejectionModal
          applicationTitle={rejectionInfo.title}
          onClose={() => setRejectionInfo(null)}
          onSubmit={handleRejectSubmit}
        />
      )}
      
      <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <StarDecoration className="absolute top-20 left-4 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 text-dreamxec-saffron opacity-20 animate-spin-slow" />
        <StarDecoration className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 text-dreamxec-green opacity-15 animate-bounce-slow" />
        <StarDecoration className="absolute bottom-32 left-1/4 w-8 h-8 sm:w-10 sm:h-10 text-dreamxec-orange opacity-25" />
        <StarDecoration className="absolute bottom-20 right-1/3 w-10 h-10 sm:w-14 sm:h-14 text-dreamxec-saffron opacity-20 animate-pulse-slow" />
        
        {/* Animated background images */}
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-28.svg"
          alt="Decorative"
          className="absolute top-10 right-4 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 opacity-10 animate-float"
        />
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-30.svg"
          alt="Decorative"
          className="absolute bottom-10 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 opacity-10 animate-float-delayed"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Welcome header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dreamxec-navy font-display mb-2 sm:mb-4 px-2">
            Welcome back, {donorName}! 👋
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-dreamxec-navy font-sans opacity-80 px-4">
            Manage your projects and connect with talented students
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-xl p-2 border-3 sm:border-4 border-dreamxec-navy shadow-pastel-card w-full sm:w-auto">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold font-display text-base sm:text-lg transition-all ${
                  selectedTab === 'overview'
                    ? 'bg-dreamxec-navy text-dreamxec-orange border-2 sm:border-3 border-dreamxec-orange shadow-pastel-orange'
                    : 'text-dreamxec-navy hover:bg-dreamxec-cream hover:scale-105'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('applications')}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold font-display text-base sm:text-lg transition-all ${
                  selectedTab === 'applications'
                    ? 'bg-dreamxec-navy text-dreamxec-orange border-2 sm:border-3 border-dreamxec-orange shadow-pastel-orange'
                    : 'text-dreamxec-navy hover:bg-dreamxec-cream hover:scale-105'
                }`}
              >
                <span className="block sm:inline">Applications</span>
                <span className="block sm:inline sm:ml-1">({pendingApplicationsCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Content Based on Selected Tab */}
        {selectedTab === 'overview' && (
          <>
            {/* Stats card */}
            <div className="mb-8 sm:mb-12 max-w-md mx-auto">
          <div className="card-pastel-offwhite rounded-xl sm:rounded-2xl border-3 sm:border-4 lg:border-5 border-dreamxec-navy p-6 sm:p-8 shadow-pastel-card">
            <div className="card-tricolor-tag"></div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dreamxec-orange font-display mb-2">
                {projectsCount}
              </div>
              <div className="text-lg sm:text-xl text-dreamxec-navy font-sans font-bold">
                {projectsCount === 1 ? 'Project Created' : 'Projects Created'}
              </div>
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Create Project Card */}
          <button
            onClick={onCreateProject}
            className="card-pastel-offwhite rounded-xl sm:rounded-2xl border-3 sm:border-4 lg:border-5 border-dreamxec-navy p-6 sm:p-8 shadow-pastel-card hover:shadow-pastel-saffron hover:scale-105 transition-all duration-300 text-left group"
          >
            <div className="card-tricolor-tag"></div>
            
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-dreamxec-green border-4 border-dreamxec-navy rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-3 text-center">
              Create New Project
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg text-center opacity-80">
              Post a new project opportunity and find talented students to collaborate with
            </p>

            {/* Arrow indicator */}
            <div className="mt-6 flex justify-center">
              <div className="text-dreamxec-orange group-hover:translate-x-2 transition-transform duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* View Projects Card */}
          <button
            onClick={onViewProjects}
            className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-8 shadow-pastel-card hover:shadow-pastel-saffron hover:scale-105 transition-all duration-300 text-left group"
          >
            <div className="card-tricolor-tag"></div>
            
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-dreamxec-orange border-4 border-dreamxec-navy rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-bold text-dreamxec-navy font-display mb-3 text-center">
              View My Projects
            </h2>
            <p className="text-dreamxec-navy font-sans text-lg text-center opacity-80">
              Manage your existing projects and review applications from interested students
            </p>

            {/* Badge with count */}
            {projectsCount > 0 && (
              <div className="mt-4 flex justify-center">
                <div className="bg-dreamxec-saffron border-3 border-dreamxec-navy rounded-full px-4 py-2">
                  <span className="text-dreamxec-navy font-bold font-sans">
                    {projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>
              </div>
            )}

            {/* Arrow indicator */}
            <div className="mt-6 flex justify-center">
              <div className="text-dreamxec-orange group-hover:translate-x-2 transition-transform duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Info section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border-3 border-dreamxec-navy p-8 shadow-pastel-card">
            <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-4 text-center">
              💡 How It Works
            </h3>
            <div className="space-y-4 text-dreamxec-navy font-sans text-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <p><strong>Create a Project:</strong> Define your project requirements, skills needed, and timeline</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <p><strong>Students Apply:</strong> Talented students will review and apply to your projects</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <p><strong>Review Applications:</strong> View student profiles and select the best fit</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <p><strong>Collaborate:</strong> Work together with students to bring your project to life</p>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Applications Section */}
        {selectedTab === 'applications' && (
          <div className="max-w-6xl mx-auto">
            <div className="card-pastel-offwhite rounded-xl sm:rounded-2xl border-3 sm:border-4 lg:border-5 border-dreamxec-navy p-4 sm:p-6 lg:p-8 shadow-pastel-card">
              <div className="card-tricolor-tag"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 mt-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dreamxec-navy font-display">
                  Student Applications
                </h2>
                <div className="flex items-center gap-2 bg-dreamxec-orange px-3 sm:px-4 py-2 rounded-full border-2 sm:border-3 border-dreamxec-navy self-start sm:self-auto">
                  <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white font-bold text-sm sm:text-base lg:text-lg font-display">
                    {pendingApplicationsCount} Pending
                  </span>
                </div>
              </div>

              {loadingApplications ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-dreamxec-navy"></div>
                  <p className="mt-4 text-dreamxec-navy font-sans text-base sm:text-lg">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="bg-dreamxec-cream border-3 sm:border-4 lg:border-5 border-dreamxec-navy w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-pastel-green">
                    <EyeIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-dreamxec-navy" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dreamxec-navy mb-3 font-display">
                    No Applications Yet
                  </h3>
                  <p className="text-dreamxec-navy text-base sm:text-lg lg:text-xl font-sans max-w-md mx-auto px-4">
                    Students haven't applied to your projects yet. Create more projects to attract talented students!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {applications.map((application) => (
                    <div 
                      key={application.id} 
                      className={`bg-white p-4 sm:p-6 rounded-xl border-3 sm:border-4 border-dreamxec-navy shadow-pastel-green ${
                        application.status === 'PENDING' ? 'border-dreamxec-orange' : 
                        application.status === 'ACCEPTED' ? 'border-dreamxec-green' : 'border-red-500'
                      }`}
                    >
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h3 className="text-xl sm:text-2xl font-bold text-dreamxec-navy font-display break-words">
                              {application.user?.name || 'Student Name'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border-2 self-start sm:self-auto ${
                              application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border-green-300' :
                              'bg-red-100 text-red-800 border-red-300'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          
                          <p className="text-base sm:text-lg text-dreamxec-navy opacity-80 font-sans break-all">
                            📧 {application.user?.email || 'student@email.com'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-dreamxec-navy font-display mb-2">
                            Applied for: {application.donorProject?.title || 'Project Title'}
                          </h4>
                          <p className="text-dreamxec-navy font-sans opacity-80 text-sm sm:text-base">
                            {application.donorProject?.organization || 'Organization'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-dreamxec-navy font-display mb-2">Cover Letter:</h4>
                          <p className="text-dreamxec-navy font-sans bg-dreamxec-cream p-3 sm:p-4 rounded-lg border-2 border-dreamxec-navy text-sm sm:text-base break-words">
                            {application.coverLetter}
                          </p>
                        </div>
                        
                        {application.skills && application.skills.length > 0 && (
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-dreamxec-navy font-display mb-2">Skills:</h4>
                            <div className="flex flex-wrap gap-2">
                              {application.skills.map((skill, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-xs sm:text-sm bg-dreamxec-saffron/20 px-2 sm:px-3 py-1 rounded-full border-2 border-dreamxec-saffron font-bold font-display"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs sm:text-sm text-dreamxec-navy opacity-60 font-sans">
                          Applied on: {new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        
                        {application.status === 'REJECTED' && application.rejectionReason && (
                          <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                            <h4 className="text-base sm:text-lg font-bold text-red-800 font-display mb-2">Rejection Reason:</h4>
                            <p className="text-red-700 font-sans text-sm sm:text-base break-words">{application.rejectionReason}</p>
                          </div>
                        )}

                        {application.status === 'PENDING' && (
                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              onClick={() => handleApplicationAction(application.id, 'ACCEPTED')}
                              className="btn-pastel-primary flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-display text-base sm:text-lg"
                            >
                              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              Accept
                            </button>
                            <button
                              onClick={() => setRejectionInfo({ 
                                id: application.id, 
                                title: `${application.user?.name || 'Student'} - ${application.donorProject?.title || 'Project'}` 
                              })}
                              className="bg-red-600 text-white flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-bold border-3 sm:border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-base sm:text-lg"
                            >
                              <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
