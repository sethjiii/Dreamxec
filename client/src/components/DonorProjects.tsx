import { useState, useEffect } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import type { Project } from '../types';
import { getProjectApplications, type Application } from '../services/applicationService';

interface DonorProjectsProps {
  projects: Project[];
  onBack: () => void;
  onUpdateApplicationStatus: (
    projectId: string,
    applicationId: string,
    status: 'accepted' | 'rejected'
  ) => void;
}

export default function DonorProjects({
  projects,
  onBack,
  onUpdateApplicationStatus,
}: DonorProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [projectApplications, setProjectApplications] = useState<{ [projectId: string]: Application[] }>({});
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

  // Load applications for each project
  useEffect(() => {
    const loadApplicationsForProjects = async () => {
      if (isLoadingApplications) return; // Prevent multiple calls
      
      console.log('Loading applications for projects:', projects.length);
      setIsLoadingApplications(true);
      
      for (const project of projects) {
        console.log(`Checking project ${project.id}, status: ${project.status}`);
        
        if (project.status === 'approved' && !projectApplications[project.id]) {
          try {
            const response = await getProjectApplications(project.id);
            
            if (response.status === 'success' && response.data) {
              console.log(`Found ${response.data.applications.length} applications for project ${project.id}`);
              setProjectApplications(prev => ({
                ...prev,
                [project.id]: response.data!.applications
              }));
            } else {
              console.log(`No applications found for project ${project.id}`);
              setProjectApplications(prev => ({
                ...prev,
                [project.id]: []
              }));
            }
          } catch (error) {
            console.error(`Failed to load applications for project ${project.id}:`, error);
            setProjectApplications(prev => ({
              ...prev,
              [project.id]: []
            }));
          }
        }
      }
      setIsLoadingApplications(false); // Reset loading state
    };

    if (projects.length > 0 && !isLoadingApplications) {
      loadApplicationsForProjects();
    }
  }, [projects, isLoadingApplications]); // Include isLoadingApplications in dependencies

  const handleViewApplications = (project: Project) => {
    setSelectedProject(project);
    setShowApplicationsModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationsModal(false);
    setSelectedProject(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <StarDecoration className="absolute top-20 left-4 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 text-dreamxec-saffron opacity-20 animate-spin-slow" />
        <StarDecoration className="absolute top-40 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 text-dreamxec-green opacity-15 animate-bounce-slow" />
        <StarDecoration className="absolute bottom-32 left-1/4 w-8 h-8 sm:w-10 sm:h-10 text-dreamxec-orange opacity-25" />
        
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
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 text-dreamxec-navy font-bold font-sans text-sm sm:text-base lg:text-lg hover:text-dreamxec-orange transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dreamxec-navy font-display mb-2 sm:mb-4 px-2">
            My Projects 📋
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-dreamxec-navy font-sans opacity-80 px-4 max-w-4xl mx-auto">
            Manage your projects and review student applications
          </p>
        </div>

        {/* Projects grid */}
        {projects.length === 0 ? (
          <div className="card-pastel-offwhite rounded-2xl border-4 sm:border-5 border-dreamxec-navy p-6 sm:p-8 md:p-12 shadow-pastel-card text-center max-w-2xl mx-auto">
            <div className="card-tricolor-tag"></div>
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4">📝</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dreamxec-navy font-display mb-4">
              No Projects Yet
            </h2>
            <p className="text-dreamxec-navy font-sans text-base sm:text-lg mb-6">
              You haven't created any projects yet. Start by creating your first project!
            </p>
            <button
              onClick={onBack}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-dreamxec-green border-3 sm:border-4 border-dreamxec-navy rounded-xl font-bold text-white text-base sm:text-lg font-display hover:bg-dreamxec-orange hover:scale-105 transition-all shadow-pastel-saffron"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => {
              const applications = projectApplications[project.id] || project.interestedUsers || [];
              const pendingCount = applications.filter(
                (app: any) => (app.status === 'PENDING' || app.status === 'pending')
              ).length;
              const acceptedCount = applications.filter(
                (app: any) => (app.status === 'ACCEPTED' || app.status === 'accepted')
              ).length;

              return (
                <div
                  key={project.id}
                  className="card-pastel-offwhite rounded-xl sm:rounded-2xl border-3 sm:border-4 lg:border-5 border-dreamxec-navy p-4 sm:p-5 lg:p-6 shadow-pastel-card hover:shadow-pastel-saffron transition-all duration-300"
                >
                  <div className="card-tricolor-tag"></div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    {project.status === 'pending' && (
                      <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-dreamxec-saffron border-2 sm:border-3 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold">
                        ⏳ Pending Approval
                      </span>
                    )}
                    {project.status === 'rejected' && (
                      <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-red-400 border-2 sm:border-3 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold">
                        ❌ Rejected
                      </span>
                    )}
                    {project.status === 'approved' && (
                      <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-dreamxec-green border-2 sm:border-3 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold">
                        ✅ Approved
                      </span>
                    )}
                  </div>

                  {/* Project info */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-dreamxec-navy font-display mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-dreamxec-orange font-bold font-sans mb-3 text-sm sm:text-base break-words">
                    {project.companyName}
                  </p>
                  <p className="text-dreamxec-navy font-sans mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>

                  {/* Rejection Reason (if rejected) */}
                  {project.status === 'rejected' && project.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-100 border-3 border-red-500 rounded-xl">
                      <p className="text-red-700 font-sans text-sm">
                        <strong>Rejection Reason:</strong> {project.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {project.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-dreamxec-cream border-1 sm:border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.skillsRequired.length > 3 && (
                        <span className="px-2 sm:px-3 py-1 bg-dreamxec-beige border-1 sm:border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold">
                          +{project.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-4 text-dreamxec-navy font-sans text-xs sm:text-sm">
                    <p className="break-words">
                      <strong>Timeline:</strong> {formatDate(project.timeline.startDate)} -{' '}
                      {formatDate(project.timeline.endDate)}
                    </p>
                  </div>

                  {/* Applications stats - Only show for approved projects */}
                  {project.status === 'approved' && (
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-dreamxec-saffron/30 border-2 border-dreamxec-navy rounded-lg p-2 sm:p-3 text-center min-w-0">
                        <div className="text-base sm:text-lg md:text-2xl font-bold text-dreamxec-navy font-display">
                          {pendingCount}
                        </div>
                        <div className="text-xs sm:text-sm text-dreamxec-navy font-sans font-bold">
                          Pending
                        </div>
                      </div>
                      <div className="flex-1 bg-dreamxec-green/30 border-2 border-dreamxec-navy rounded-lg p-2 sm:p-3 text-center min-w-0">
                        <div className="text-base sm:text-lg md:text-2xl font-bold text-dreamxec-navy font-display">
                          {acceptedCount}
                        </div>
                        <div className="text-xs sm:text-sm text-dreamxec-navy font-sans font-bold">
                          Accepted
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action button based on status */}
                  {project.status === 'approved' ? (
                    <button
                      onClick={() => handleViewApplications(project)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dreamxec-orange border-2 sm:border-3 border-dreamxec-navy rounded-xl font-bold text-white font-display hover:bg-dreamxec-green hover:scale-105 transition-all shadow-pastel-card text-sm sm:text-base"
                    >
                      View Interested Students ({applications.length})
                    </button>
                  ) : project.status === 'pending' ? (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dreamxec-saffron/30 border-2 sm:border-3 border-dreamxec-navy rounded-xl text-center">
                      <p className="text-dreamxec-navy font-sans font-bold text-sm sm:text-base">
                        ⏳ Waiting for admin approval
                      </p>
                    </div>
                  ) : (
                    <div className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-red-100 border-2 sm:border-3 border-dreamxec-navy rounded-xl text-center">
                      <p className="text-red-700 font-sans font-bold text-sm sm:text-base">
                        ❌ Project rejected
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Applications Modal */}
      {showApplicationsModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center">
          <div className="w-full h-full sm:w-auto sm:h-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl sm:max-h-[90vh] sm:m-4 card-pastel-offwhite rounded-none sm:rounded-2xl border-0 sm:border-3 md:border-5 border-dreamxec-navy shadow-pastel-saffron flex flex-col">
            <div className="card-tricolor-tag"></div>
            
            {/* Modal header */}
            <div className="flex-shrink-0 p-4 border-b-2 sm:border-b-4 border-dreamxec-navy bg-dreamxec-beige">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-dreamxec-navy font-display mb-1 break-words leading-tight">
                    {selectedProject.title}
                  </h2>
                  <p className="text-dreamxec-orange font-bold font-sans text-sm sm:text-base break-words">
                    {selectedProject.companyName}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-dreamxec-navy hover:text-dreamxec-orange transition-colors flex-shrink-0 p-2 -m-2"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Applications list - scrollable content */}
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
                const applications = projectApplications[selectedProject.id] || [];
                console.log(`Modal for project ${selectedProject.id}: Found ${applications.length} applications`, applications);
                return applications.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-4">👥</div>
                    <p className="text-dreamxec-navy font-sans text-base sm:text-lg px-4">
                      No applications yet. Students will appear here once they apply.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                    <div
                      key={application.id}
                      className={`border-2 sm:border-3 rounded-xl p-4 ${
                        application.status === 'ACCEPTED'
                          ? 'bg-dreamxec-green/10 border-dreamxec-green'
                          : application.status === 'REJECTED'
                          ? 'bg-red-50 border-red-400'
                          : 'bg-white border-dreamxec-navy'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg sm:text-xl font-bold text-dreamxec-navy font-display break-words">
                              {application.user?.name || 'Unknown User'}
                            </h4>
                            <p className="text-dreamxec-navy font-sans text-sm opacity-70 break-all">
                              {application.user?.email || 'No email'}
                            </p>
                            <p className="text-dreamxec-navy font-sans text-xs opacity-60 mt-1">
                              Applied on {formatDate(new Date(application.createdAt))}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {application.status === 'PENDING' ? (
                              <span className="inline-block px-3 py-1 bg-dreamxec-saffron border-2 border-dreamxec-navy rounded-full text-dreamxec-navy font-sans text-xs sm:text-sm font-bold">
                                Pending
                              </span>
                            ) : application.status === 'ACCEPTED' ? (
                              <span className="inline-block px-3 py-1 bg-dreamxec-green border-2 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold">
                                Accepted
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 bg-red-500 border-2 border-dreamxec-navy rounded-full text-white font-sans text-xs sm:text-sm font-bold">
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-dreamxec-navy font-sans text-sm sm:text-base">
                              <strong className="block sm:inline">Cover Letter:</strong>
                              <span className="block sm:inline sm:ml-1 break-words">{application.coverLetter}</span>
                            </p>
                          </div>
                          {application.skills && application.skills.length > 0 && (
                            <div>
                              <p className="text-dreamxec-navy font-sans text-sm sm:text-base">
                                <strong className="block sm:inline">Skills:</strong>
                                <span className="block sm:inline sm:ml-1 break-words">{application.skills.join(', ')}</span>
                              </p>
                            </div>
                          )}
                        </div>

                        {application.status === 'PENDING' && (
                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              onClick={() =>
                                onUpdateApplicationStatus(
                                  selectedProject.id,
                                  application.id,
                                  'accepted'
                                )
                              }
                              className="flex-1 px-4 py-3 bg-dreamxec-green border-2 border-dreamxec-navy rounded-lg font-bold text-white font-display hover:scale-105 transition-all text-sm sm:text-base"
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={() =>
                                onUpdateApplicationStatus(
                                  selectedProject.id,
                                  application.id,
                                  'rejected'
                                )
                              }
                              className="flex-1 px-4 py-3 bg-red-500 border-2 border-dreamxec-navy rounded-lg font-bold text-white font-display hover:scale-105 transition-all text-sm sm:text-base"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                );
              })()}
            </div>

            {/* Modal footer */}
            <div className="flex-shrink-0 p-4 border-t-2 sm:border-t-4 border-dreamxec-navy bg-dreamxec-beige">
              <button
                onClick={handleCloseModal}
                className="w-full px-4 py-3 bg-dreamxec-cream border-2 sm:border-3 border-dreamxec-navy rounded-xl font-bold text-dreamxec-navy font-display hover:bg-dreamxec-orange hover:text-white transition-all text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
