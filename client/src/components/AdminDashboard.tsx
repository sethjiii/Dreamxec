// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { Campaign, Project } from '../types';
// import { getDashboardStats, type DashboardStats } from '../services/adminService';
// import { StarDecoration } from './icons/StarDecoration';

// // --- Icons ---
// const ClockIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="10" />
//     <path d="M12 6v6l4 2" />
//   </svg>
// );

// const CheckCircleIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="10" />
//     <path d="M9 12l2 2 4-4" />
//   </svg>
// );

// const XCircleIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="12" cy="12" r="10" />
//     <path d="M15 9l-6 6M9 9l6 6" />
//   </svg>
// );

// const EyeIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const SendIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
//   </svg>
// );

// const AlertTriangleIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
//     <line x1="12" y1="9" x2="12" y2="13" />
//     <line x1="12" y1="17" x2="12.01" y2="17" />
//   </svg>
// );

// const TrendingUpIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
//     <polyline points="17 6 23 6 23 12" />
//   </svg>
// );

// const UsersIcon = ({ className }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

// interface AdminDashboardProps {
//   pendingCampaigns: Campaign[];
//   allCampaigns?: Campaign[];
//   pendingProjects?: Project[];
//   allProjects?: Project[];
//   onApprove: (id: string) => void;
//   onReject: (id: string, reason: string) => void;
//   onApproveProject?: (id: string) => void;
//   onRejectProject?: (id: string, reason: string) => void;
// }

// // --- Modals ---

// const CampaignDetailModal = ({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) => {
//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex justify-center items-center p-4"
//       style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
//       onClick={handleBackdropClick}
//     >
//       <div
//         className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="card-tricolor-tag"></div>
//         <div className="p-6 sm:p-8 mt-4">
//           <div className="flex justify-between items-start mb-6">
//             <div className="flex-1">
//               <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-2 font-display">
//                 {campaign.title}
//               </h2>
//               <p className="text-lg sm:text-xl text-dreamxec-navy opacity-80 font-sans">
//                 By {campaign.club?.name} - {campaign.club?.college}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="btn-pastel-secondary p-3 rounded-lg hover:scale-110 transition-transform flex-shrink-0 ml-4"
//             >
//               <XCircleIcon className="w-6 h-6" />
//             </button>
//           </div>

//           <img
//             src={campaign.imageUrl}
//             alt={campaign.title}
//             className="w-full h-72 object-cover rounded-lg border-4 border-dreamxec-navy shadow-pastel-saffron mb-6"
//           />

//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
//             <span className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">
//               Goal: ₹{campaign.goalAmount.toLocaleString()}
//             </span>
//             <span className="text-base sm:text-lg text-dreamxec-navy opacity-80 font-sans">
//               Submitted: {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           <div className="space-y-3">
//             <h3 className="text-2xl font-bold text-dreamxec-navy font-display flex items-center gap-2">
//               Description
//               <StarDecoration className="w-6 h-6" color="#FF7F00" />
//             </h3>
//             <div className="p-4 bg-white rounded-lg border-3 border-dreamxec-green">
//               <p className="text-dreamxec-navy text-lg whitespace-pre-wrap font-sans leading-relaxed">
//                 {campaign.description}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const RejectionModal = ({
//   campaignTitle,
//   onClose,
//   onSubmit,
// }: {
//   campaignTitle: string;
//   onClose: () => void;
//   onSubmit: (reason: string) => void;
// }) => {
//   const [reason, setReason] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (reason.trim()) onSubmit(reason);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[10000] flex justify-center items-center p-4"
//       style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full p-6 sm:p-8 relative">
//         <div className="card-tricolor-tag"></div>
//         <div className="flex justify-between items-center mb-6 mt-4">
//           <h2 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">
//             Reject Campaign
//           </h2>
//           <button onClick={onClose} className="text-dreamxec-navy hover:scale-110 transition-transform">
//             <XCircleIcon className="w-6 h-6" />
//           </button>
//         </div>
//         <div className="mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
//           <p className="text-dreamxec-navy text-lg font-sans">
//             Please provide a reason for rejecting: <span className="font-bold font-display">{campaignTitle}</span>
//           </p>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             placeholder="e.g., Incomplete description, inappropriate content..."
//             className="w-full h-32 p-4 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange transition-all resize-none"
//             required
//             autoFocus
//           />
//           <div className="mt-6 flex justify-end gap-3">
//             <button type="button" onClick={onClose} className="btn-pastel-secondary px-6 py-3 rounded-lg font-display text-lg">
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!reason.trim()}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg disabled:opacity-50"
//             >
//               <SendIcon className="w-5 h-5" /> Submit Rejection
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- Sub-Component: Stat Card ---
// function StatCard({ label, value, icon, color, isMoney }: any) {
//   const borderColor = {
//     blue: 'border-blue-400',
//     purple: 'border-purple-400',
//     orange: 'border-orange-400',
//     green: 'border-dreamxec-green',
//   }[color as string] || 'border-dreamxec-navy';

//   const bgColor = {
//     blue: 'bg-blue-50',
//     purple: 'bg-purple-50',
//     orange: 'bg-orange-50',
//     green: 'bg-green-50',
//   }[color as string] || 'bg-white';

//   return (
//     <div className={`card-pastel rounded-xl p-5 hover:scale-105 transition-transform ${bgColor} border-3 ${borderColor}`}>
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-sm font-bold text-dreamxec-navy opacity-70 uppercase tracking-wide">{label}</p>
//         <div className="p-2 rounded-lg bg-white border-2 border-dreamxec-navy shadow-sm">
//           {icon}
//         </div>
//       </div>
//       <p className={`text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display ${isMoney ? 'tracking-tight' : ''}`}>
//         {value}
//       </p>
//     </div>
//   );
// }


// // --- Main Component ---

// export default function AdminDashboard({
//   pendingCampaigns,
//   allCampaigns,
//   pendingProjects = [],
//   allProjects = [],
//   onApprove,
//   onReject,
//   onApproveProject,
//   onRejectProject,
// }: AdminDashboardProps) {
//   const navigate = useNavigate();
//   const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
//   const [rejectionInfo, setRejectionInfo] = useState<{ id: string; title: string } | null>(null);
//   const [rejectionProjectInfo, setRejectionProjectInfo] = useState<{ id: string; title: string } | null>(null);

//   // Stats State
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loadingStats, setLoadingStats] = useState(true);

//   useEffect(() => {
//     loadStats();
//   }, []);

//   async function loadStats() {
//     try {
//       setLoadingStats(true);
//       const res = await getDashboardStats();
//       if (res && res.data) {
//         setStats(res.data);
//       }
//     } catch (error) {
//       console.error("Failed to load global admin stats", error);
//     } finally {
//       setLoadingStats(false);
//     }
//   }

//   // Handlers
//   const handleRejectClick = (id: string, title: string) => setRejectionInfo({ id, title });
//   const handleRejectSubmit = (reason: string) => {
//     if (rejectionInfo) {
//       onReject(rejectionInfo.id, reason);
//       setRejectionInfo(null);
//     }
//   };
//   const handleRejectProjectSubmit = (reason: string) => {
//     if (rejectionProjectInfo && onRejectProject) {
//       onRejectProject(rejectionProjectInfo.id, reason);
//       setRejectionProjectInfo(null);
//     }
//   };

//   const totalCampaignsCount = allCampaigns?.length || 0;

//   return (
//     <>
//       {selectedCampaign && <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />}
//       {rejectionInfo && <RejectionModal campaignTitle={rejectionInfo.title} onClose={() => setRejectionInfo(null)} onSubmit={handleRejectSubmit} />}
//       {rejectionProjectInfo && <RejectionModal campaignTitle={rejectionProjectInfo.title} onClose={() => setRejectionProjectInfo(null)} onSubmit={handleRejectProjectSubmit} />}

//       <div className="min-h-screen relative overflow-hidden bg-orange-50/30">
        
//         {/* Decorative Stars */}
//         <div className="absolute top-20 left-10 z-0 opacity-20 pointer-events-none"><StarDecoration className="w-16 h-16" color="#FF7F00" /></div>
//         <div className="absolute top-40 right-20 z-0 opacity-20 pointer-events-none"><StarDecoration className="w-12 h-12" color="#0B9C2C" /></div>
//         <div className="absolute bottom-32 left-1/4 z-0 opacity-15 pointer-events-none"><StarDecoration className="w-20 h-20" color="#000080" /></div>

//         {/* --- Header Section --- */}
//         <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
//           <div className="card-tricolor-tag"></div>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <div className="flex items-center gap-4 mb-2">
//                   <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dreamxec-orange font-display">
//                     Command Center
//                   </h1>
//                   <StarDecoration className="w-10 h-10 hidden sm:block" color="#FF7F00" />
//                 </div>
//                 <p className="text-dreamxec-cream text-lg sm:text-xl font-sans opacity-90">
//                   Global Admin Dashboard & Overview
//                 </p>
//               </div>
//               <button 
//                 onClick={loadStats} 
//                 className="px-4 py-2 bg-white/10 text-white rounded-lg border-2 border-white/20 hover:bg-white/20 transition-colors text-sm font-bold"
//               >
//                 Refresh Data
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
//           {/* --- TOP SECTION: KPI & ATTENTION GRID --- */}
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            
//             {/* Left Column: Attention Panel */}
//             <div className="lg:col-span-1 space-y-6">
//               <div className="bg-white rounded-xl border-4 border-red-500 shadow-pastel-navy p-6 relative overflow-hidden">
//                 <div className="absolute top-0 left-0 w-full h-3 bg-red-500"></div>
//                 <h2 className="text-2xl font-bold text-dreamxec-navy font-display mb-4 flex items-center gap-2">
//                   <AlertTriangleIcon className="w-7 h-7 text-red-600" />
//                   Attention
//                 </h2>
                
//                 {loadingStats ? (
//                    <div className="animate-pulse space-y-3">
//                      <div className="h-20 bg-gray-200 rounded"></div>
//                      <div className="h-20 bg-gray-200 rounded"></div>
//                    </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
//                       <p className="text-xs font-bold text-gray-500 uppercase">Pending &gt; 7 Days</p>
//                       <p className="text-3xl font-bold text-red-600 mt-1">{stats?.attention?.slaBreaches || 0}</p>
//                       <p className="text-xs text-red-800 mt-1 font-bold">SLA Risk</p>
//                     </div>

//                     <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
//                       <p className="text-xs font-bold text-gray-500 uppercase">Frozen Campaigns</p>
//                       <p className="text-3xl font-bold text-dreamxec-navy mt-1">{stats?.attention?.frozenCampaigns || 0}</p>
//                       <p className="text-xs text-gray-600 mt-1">Inactive 30+ days</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Column: KPIs */}
//             <div className="lg:col-span-3">
//               {/* High Level Stats */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//                 <StatCard 
//                   label="Total Users" 
//                   value={loadingStats ? "..." : stats?.kpi.totalUsers} 
//                   icon={<UsersIcon className="w-6 h-6 text-blue-600" />}
//                   color="blue"
//                 />
//                 <StatCard 
//                   label="Total Donors" 
//                   value={loadingStats ? "..." : stats?.kpi.totalDonors} 
//                   icon={<UsersIcon className="w-6 h-6 text-purple-600" />}
//                   color="purple"
//                 />
//                 <StatCard 
//                   label="Total Clubs" 
//                   value={loadingStats ? "..." : stats?.kpi.totalClubs} 
//                   icon={<StarDecoration className="w-6 h-6" color="#FF7F00" />}
//                   color="orange"
//                 />
//                 <StatCard 
//                   label="Total Donations" 
//                   value={loadingStats ? "..." : `₹${stats?.kpi.totalDonations.toLocaleString()}`} 
//                   icon={<TrendingUpIcon className="w-6 h-6 text-green-600" />}
//                   color="green"
//                   isMoney
//                 />
//               </div>

//               {/* Campaign Overview & Workload */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
//                 {/* Campaign Status */}
//                 <div className="bg-white rounded-xl border-3 border-dreamxec-navy shadow-pastel-card p-6 col-span-2">
//                   <h3 className="text-xl font-bold text-dreamxec-navy font-display mb-6">Campaign Health</h3>
//                   <div className="grid grid-cols-3 gap-4 text-center">
//                     <div className="p-4 bg-green-50 rounded-lg border-2 border-green-100">
//                       <p className="text-3xl font-bold text-green-600">{loadingStats ? "-" : stats?.kpi.campaigns.APPROVED}</p>
//                       <p className="text-xs font-bold text-dreamxec-navy opacity-70 mt-1 uppercase">Active</p>
//                     </div>
//                     <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-100">
//                       <p className="text-3xl font-bold text-orange-600">{loadingStats ? "-" : stats?.kpi.campaigns.PENDING}</p>
//                       <p className="text-xs font-bold text-dreamxec-navy opacity-70 mt-1 uppercase">Pending</p>
//                     </div>
//                     <div className="p-4 bg-red-50 rounded-lg border-2 border-red-100">
//                       <p className="text-3xl font-bold text-red-600">{loadingStats ? "-" : stats?.kpi.campaigns.REJECTED}</p>
//                       <p className="text-xs font-bold text-dreamxec-navy opacity-70 mt-1 uppercase">Rejected</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Workload */}
//                 <div className="bg-white rounded-xl border-3 border-dreamxec-navy shadow-pastel-card p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-xl font-bold text-dreamxec-navy font-display">Workload</h3>
//                     <ClockIcon className="w-6 h-6 text-dreamxec-orange" />
//                   </div>
                  
//                   <div className="mb-6">
//                     <p className="text-5xl font-bold text-dreamxec-navy mb-1">
//                       {loadingStats ? "-" : stats?.kpi.pendingApprovals}
//                     </p>
//                     <p className="text-sm text-gray-500 font-bold">Pending Actions</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* --- Navigation / Quick Actions Row --- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//              <div 
//                onClick={() => navigate("/admin/verifications")}
//                className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group bg-white border-3 border-dreamxec-navy shadow-pastel-saffron"
//              >
//                <div className="flex items-center justify-between mb-3">
//                  <p className="text-dreamxec-navy text-lg font-bold font-display group-hover:text-dreamxec-orange transition-colors">
//                    Club Verifications
//                  </p>
//                  <div className="bg-white border-2 border-dreamxec-navy rounded-full w-12 h-12 flex items-center justify-center">
//                    <CheckCircleIcon className="w-6 h-6 text-dreamxec-navy group-hover:text-dreamxec-orange" />
//                  </div>
//                </div>
//                <p className="text-dreamxec-navy opacity-70 font-sans">Review student president requests</p>
//              </div>

//              <div 
//                onClick={() => navigate("/admin/referrals")}
//                className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group bg-white border-3 border-dreamxec-navy shadow-pastel-green"
//              >
//                <div className="flex items-center justify-between mb-3">
//                  <p className="text-dreamxec-navy text-lg font-bold font-display group-hover:text-dreamxec-green transition-colors">
//                    Club Referrals
//                  </p>
//                  <div className="bg-white border-2 border-dreamxec-navy rounded-full w-12 h-12 flex items-center justify-center">
//                    <SendIcon className="w-6 h-6 text-dreamxec-navy group-hover:text-dreamxec-green" />
//                  </div>
//                </div>
//                <p className="text-dreamxec-navy opacity-70 font-sans">View referral submissions</p>
//              </div>
//           </div>

//           {/* --- MIDDLE SECTION: ACTION TABLES --- */}
          
//           {/* 1. Pending Campaigns */}
//           <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-12">
//             <div className="card-tricolor-tag"></div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
//               <div className="flex items-center gap-3">
//                 <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">
//                   Pending Campaigns
//                 </h2>
//                 <div className="flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy">
//                   <ClockIcon className="w-5 h-5" />
//                   <span className="font-bold font-display text-lg">{pendingCampaigns.length}</span>
//                 </div>
//               </div>
//             </div>

//             {pendingCampaigns.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-pastel-green">
//                   <CheckCircleIcon className="w-12 h-12 text-dreamxec-green" />
//                 </div>
//                 <h3 className="text-3xl font-bold text-dreamxec-navy mb-3 font-display">All caught up!</h3>
//                 <p className="text-dreamxec-navy text-xl font-sans opacity-70">No pending campaigns to review.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b-4 border-dreamxec-navy">
//                       <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Campaign Details</th>
//                       <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">Goal</th>
//                       <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">Submitted</th>
//                       <th className="text-right py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {pendingCampaigns.map((campaign) => (
//                       <tr key={campaign.id} className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors">
//                         <td className="py-4 px-4">
//                           <div className="flex items-start gap-4">
//                             <img src={campaign.imageUrl} alt={campaign.title} className="w-24 h-24 rounded-lg object-cover border-3 border-dreamxec-navy shadow-pastel-saffron flex-shrink-0" />
//                             <div className="min-w-0">
//                               <p className="font-bold text-dreamxec-navy mb-1 text-xl font-display">{campaign.title}</p>
//                               <p className="text-dreamxec-navy opacity-80 mb-1 font-sans">{campaign.club?.name} - {campaign.club?.college}</p>
//                               <p className="text-sm text-dreamxec-navy opacity-70 line-clamp-2 font-sans">{campaign.description}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 text-dreamxec-navy font-bold text-xl font-display hidden md:table-cell">₹{campaign.goalAmount.toLocaleString()}</td>
//                         <td className="py-4 px-4 text-dreamxec-navy text-base font-sans hidden lg:table-cell">
//                           {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="flex items-center justify-end gap-2">
//                             <button onClick={() => setSelectedCampaign(campaign)} className="p-2 bg-dreamxec-gray-100 text-dreamxec-navy rounded-lg border-3 border-dreamxec-navy hover:scale-110 transition-transform"><EyeIcon className="w-5 h-5" /></button>
//                             <button onClick={() => onApprove(campaign.id)} className="px-4 py-2 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display">Approve</button>
//                             <button onClick={() => handleRejectClick(campaign.id, campaign.title)} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display">Reject</button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* 2. Pending Projects Section */}
//           {pendingProjects.length > 0 && (
//             <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-12">
//               <div className="card-tricolor-tag"></div>
//               <div className="flex items-center gap-4 mb-8 mt-4">
//                 <h2 className="text-4xl font-bold text-dreamxec-navy font-display">Pending Donor Projects</h2>
//                 <div className="flex items-center gap-2 bg-dreamxec-orange px-4 py-2 rounded-full border-3 border-dreamxec-navy">
//                   <ClockIcon className="w-6 h-6 text-white" />
//                   <span className="text-white font-bold text-lg font-display">{pendingProjects.length}</span>
//                 </div>
//               </div>
//               <div className="space-y-6">
//                 {pendingProjects.map((project) => (
//                   <div key={project.id} className="bg-white p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-green">
//                     <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//                       <div className="flex-1">
//                         <h3 className="text-3xl font-bold text-dreamxec-navy mb-2 font-display">{project.title}</h3>
//                         <p className="text-lg text-dreamxec-navy opacity-80 font-sans mb-3">By {project.companyName}</p>
//                         <p className="text-base text-dreamxec-navy font-sans mb-4 line-clamp-3">{project.description}</p>
//                         <div className="flex flex-wrap gap-2 mb-3">
//                           <span className="text-sm bg-dreamxec-cream px-3 py-1 rounded-full border-2 border-dreamxec-navy font-sans">
//                             ⏱ Timeline: {project.timeline.startDate.toLocaleDateString()} - {project.timeline.endDate.toLocaleDateString()}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-3 min-w-[160px]">
//                         <button onClick={() => onApproveProject && onApproveProject(project.id)} className="btn-pastel-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-display text-lg"><CheckCircleIcon className="w-5 h-5" /> Approve</button>
//                         <button onClick={() => setRejectionProjectInfo({ id: project.id, title: project.title })} className="bg-red-600 text-white inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg"><XCircleIcon className="w-5 h-5" /> Reject</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* 3. All Projects Section */}
//           <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card">
//             <div className="card-tricolor-tag"></div>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 mt-4">
//               <div className="flex items-center gap-3">
//                 <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">All Projects</h2>
//                 <StarDecoration className="w-8 h-8" color="#0B9C2C" />
//               </div>
//               <div className="text-lg text-dreamxec-navy font-sans">Showing all {totalCampaignsCount} projects</div>
//             </div>

//             {(!allCampaigns || allCampaigns.length === 0) ? (
//               <div className="text-center py-16">
//                 <p className="text-dreamxec-navy text-2xl font-sans">No projects found.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b-4 border-dreamxec-navy">
//                       <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Title</th>
//                       <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">Owner</th>
//                       <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">Created</th>
//                       <th className="text-right py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {allCampaigns!.map((campaign: Campaign) => (
//                       <tr key={campaign.id} className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors cursor-pointer" onClick={() => setSelectedCampaign(campaign)}>
//                         <td className="py-4 px-4">
//                           <div className="flex items-center gap-4">
//                             <img src={campaign.imageUrl} alt={campaign.title} className="w-20 h-12 object-cover rounded-lg border-3 border-dreamxec-navy flex-shrink-0" />
//                             <div className="min-w-0">
//                               <p className="font-bold text-dreamxec-navy mb-1 text-lg font-display">{campaign.title}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 text-dreamxec-navy font-bold text-lg font-display hidden md:table-cell">{campaign.club?.name || 'N/A'}</td>
//                         <td className="py-4 px-4 text-dreamxec-navy text-base font-sans hidden lg:table-cell">
//                           {campaign.createdAt instanceof Date ? campaign.createdAt.toLocaleDateString() : new Date(campaign.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="py-4 px-4 text-right">
//                           <span className={`inline-flex items-center px-4 py-2 rounded-lg text-base font-bold border-3 border-dreamxec-navy font-display ${campaign.status === 'approved' ? 'bg-dreamxec-green text-white' : campaign.status === 'pending' ? 'bg-dreamxec-orange text-white' : 'bg-red-600 text-white'}`}>
//                             {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { 
  getDashboardStats, 
  getAllProjects, 
  verifyUserProject, 
  verifyDonorProject
} from '../services/adminService';
import type { Campaign, Project, DashboardStats } from '../types';
import { StarDecoration } from './icons/StarDecoration';

// --- Icons ---
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
);
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
);
const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);

// --- Modals ---
const CampaignDetailModal = ({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }} onClick={onClose}>
      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-3xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="card-tricolor-tag"></div>
        <div className="p-6 sm:p-8 mt-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy mb-2 font-display">{campaign.title}</h2>
              <p className="text-lg sm:text-xl text-dreamxec-navy opacity-80 font-sans">By {campaign.club?.name || 'Individual'}</p>
            </div>
            <button onClick={onClose} className="btn-pastel-secondary p-3 rounded-lg hover:scale-110 transition-transform flex-shrink-0 ml-4"><XCircleIcon className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-dreamxec-cream rounded-lg border-3 border-dreamxec-orange">
            <span className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
            <span className="text-base sm:text-lg text-dreamxec-navy opacity-80 font-sans">Submitted: {new Date(campaign.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-dreamxec-navy font-display flex items-center gap-2">Description <StarDecoration className="w-6 h-6" color="#FF7F00" /></h3>
            <div className="p-4 bg-white rounded-lg border-3 border-dreamxec-green">
              <p className="text-dreamxec-navy text-lg whitespace-pre-wrap font-sans leading-relaxed">{campaign.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RejectionModal = ({ campaignTitle, onClose, onSubmit }: { campaignTitle: string; onClose: () => void; onSubmit: (reason: string) => void; }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-[10000] flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(0, 0, 128, 0.8)' }} onClick={onClose}>
      <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card max-w-md w-full p-6 sm:p-8 relative" onClick={(e) => e.stopPropagation()}>
        <div className="card-tricolor-tag"></div>
        <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-dreamxec-navy font-display">Reject Campaign</h2>
          <button onClick={onClose} className="text-dreamxec-navy hover:scale-110 transition-transform flex-shrink-0"><XCircleIcon className="w-6 h-6" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if(reason.trim()) onSubmit(reason); }}>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection..." className="w-full h-32 p-4 border-4 border-dreamxec-navy rounded-lg text-lg font-sans bg-white focus:outline-none focus:border-dreamxec-orange" required autoFocus />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-pastel-secondary px-6 py-3 rounded-lg font-display text-lg">Cancel</button>
            <button type="submit" disabled={!reason.trim()} className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold border-4 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display text-lg"><SendIcon className="w-5 h-5" /> Submit Rejection</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- KPI Stat Card ---
const KPIStatCard = ({ label, value, icon, color }: any) => (
  <div className="card-pastel bg-white rounded-xl p-5 flex items-center gap-4 hover:scale-105 transition-transform border-3 border-dreamxec-navy shadow-sm">
    <div className={`p-3 rounded-full border-2 border-dreamxec-navy ${color === 'blue' ? 'bg-blue-50 text-blue-700' : color === 'purple' ? 'bg-purple-50 text-purple-700' : color === 'orange' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-dreamxec-navy font-display">{value}</p>
    </div>
  </div>
);

// --- Main Component ---

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userProjects, setUserProjects] = useState<Campaign[]>([]);
  const [donorProjects, setDonorProjects] = useState<Project[]>([]);
  
  // Modals
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [rejectionInfo, setRejectionInfo] = useState<{ id: string; title: string; type: 'user' | 'donor' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [statsRes, projectsRes] = await Promise.all([
        getDashboardStats(),
        getAllProjects({ limit: 100 })
      ]);
      setStats(statsRes.data);
      setUserProjects(projectsRes.data.userProjects.data);
      setDonorProjects(projectsRes.data.donorProjects.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id: string, type: 'user' | 'donor') => {
    if(!window.confirm("Approve this project?")) return;
    try {
      if (type === 'user') await verifyUserProject(id, { status: 'APPROVED' });
      else await verifyDonorProject(id, { status: 'APPROVED' });
      fetchData();
    } catch (e) { alert("Action failed"); }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!rejectionInfo) return;
    try {
      if (rejectionInfo.type === 'user') await verifyUserProject(rejectionInfo.id, { status: 'REJECTED', reason });
      else await verifyDonorProject(rejectionInfo.id, { status: 'REJECTED', reason });
      setRejectionInfo(null);
      fetchData();
    } catch (e) { alert("Action failed"); }
  };

  if (loading || !stats) return <div className="flex h-screen items-center justify-center bg-transparent"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-dreamxec-navy"></div></div>;

  // Derived Data
  const pendingCampaigns = userProjects.filter(p => p.status === 'PENDING');
  const pendingDonorProjects = donorProjects.filter(p => p.status === 'PENDING');
  const approvedCount = stats.kpi.campaigns.APPROVED;
  const totalSubmissions = stats.kpi.campaigns.total;

  return (
    <div className="flex min-h-screen bg-transparent relative">
      
      {/* 1. Collapsible Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 relative min-h-screen">
        
        {/* Modals */}
        {selectedCampaign && <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />}
        {rejectionInfo && <RejectionModal campaignTitle={rejectionInfo.title} onClose={() => setRejectionInfo(null)} onSubmit={handleRejectSubmit} />}

        {/* Decorative Stars (Preserved) */}
        <div className="absolute top-20 left-10 z-0 opacity-20 pointer-events-none"><StarDecoration className="w-16 h-16" color="#FF7F00" /></div>
        <div className="absolute top-40 right-20 z-0 opacity-20 pointer-events-none"><StarDecoration className="w-12 h-12" color="#0B9C2C" /></div>
        <div className="absolute bottom-32 left-1/4 z-0 opacity-15 pointer-events-none"><StarDecoration className="w-20 h-20" color="#000080" /></div>

        {/* Header Section */}
        <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
          <div className="card-tricolor-tag"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-dreamxec-orange font-display flex items-center gap-3">
                  Admin Dashboard <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
                </h1>
                <p className="text-dreamxec-cream text-xl font-sans mt-2">
                  Overview & Command Center
                </p>
              </div>
              <button onClick={fetchData} className="bg-white/10 text-white px-4 py-2 rounded-lg border-2 border-white/20 hover:bg-white/20 transition-all font-bold">
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-8 py-8 relative z-10 pb-24">
          
          {/* 1. Global KPIs Row (Added as requested) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPIStatCard label="Total Users" value={stats.kpi.totalUsers} icon={<UsersIcon className="w-6 h-6" />} color="blue" />
            <KPIStatCard label="Total Donors" value={stats.kpi.totalDonors} icon={<UsersIcon className="w-6 h-6" />} color="purple" />
            <KPIStatCard label="Active Clubs" value={stats.kpi.totalClubs} icon={<StarDecoration className="w-6 h-6" />} color="orange" />
            <KPIStatCard label="Total Raised" value={`₹${stats.kpi.totalDonations.toLocaleString()}`} icon={<TrendingUpIcon className="w-6 h-6" />} color="green" />
          </div>

          {/* 2. System Alerts Panel */}
          {(stats.attention.slaBreaches > 0 || stats.attention.frozenCampaigns > 0) && (
            <div className="mb-8 bg-white border-4 border-red-500 rounded-xl p-6 shadow-pastel-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
              <h3 className="text-2xl font-bold text-dreamxec-navy font-display mb-4 flex items-center gap-2">
                <AlertIcon className="w-8 h-8 text-red-600" /> System Alerts
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                {stats.attention.slaBreaches > 0 && (
                  <div className="bg-red-50 px-6 py-4 rounded-lg border-2 border-red-200 flex-1">
                    <p className="text-red-800 font-bold text-lg">{stats.attention.slaBreaches} SLA Breaches</p>
                    <p className="text-sm text-red-600">Pending &gt; 7 days</p>
                  </div>
                )}
                {stats.attention.frozenCampaigns > 0 && (
                  <div className="bg-orange-50 px-6 py-4 rounded-lg border-2 border-orange-200 flex-1">
                    <p className="text-dreamxec-navy font-bold text-lg">{stats.attention.frozenCampaigns} Frozen Campaigns</p>
                    <p className="text-sm text-gray-600">Inactive &gt; 30 days</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Original Design Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {/* Pending Campaigns */}
            <div className="card-pastel rounded-xl p-6 card-pastel-tilt-left hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Pending Campaigns</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
                  <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{pendingCampaigns.length}</p>
              <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
            </div>

            {/* Pending Projects */}
            <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Pending Projects</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-saffron">
                  <ClockIcon className="w-8 h-8 text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{pendingDonorProjects.length}</p>
              <div className="mt-2 h-1 bg-dreamxec-orange rounded"></div>
            </div>

            {/* Total Approved */}
            <div className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Total Approved</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-green">
                  <CheckCircleIcon className="w-8 h-8 text-dreamxec-green" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{approvedCount}</p>
              <div className="mt-2 h-1 bg-dreamxec-green rounded"></div>
            </div>

            {/* Total Submissions */}
            <div className="card-pastel rounded-xl p-6 card-pastel-tilt-right hover:scale-105 transition-transform bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display">Total Submissions</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-14 h-14 flex items-center justify-center shadow-pastel-navy">
                  <EyeIcon className="w-8 h-8 text-dreamxec-navy" />
                </div>
              </div>
              <p className="text-5xl font-bold text-dreamxec-navy font-display">{totalSubmissions}</p>
              <div className="mt-2 h-1 bg-gradient-to-r from-dreamxec-orange via-white to-dreamxec-green rounded"></div>
            </div>
          </div>

          {/* 4. Quick Links Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div onClick={() => navigate("/admin/verifications")} className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display group-hover:text-dreamxec-orange transition-colors">Club Verifications</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-12 h-12 flex items-center justify-center shadow-pastel-saffron group-hover:shadow-pastel-orange">
                  <CheckCircleIcon className="w-6 h-6 text-dreamxec-navy group-hover:text-dreamxec-orange" />
                </div>
              </div>
              <p className="text-xl font-bold text-dreamxec-navy opacity-70 font-sans mt-2">Manage Requests →</p>
            </div>

            <div onClick={() => navigate("/admin/referrals")} className="card-pastel rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-dreamxec-navy text-lg font-bold font-display group-hover:text-dreamxec-green transition-colors">Club Referrals</p>
                <div className="bg-white border-4 border-dreamxec-navy rounded-full w-12 h-12 flex items-center justify-center shadow-pastel-green group-hover:shadow-pastel-green">
                  <SendIcon className="w-6 h-6 text-dreamxec-navy group-hover:text-dreamxec-green" />
                </div>
              </div>
              <p className="text-xl font-bold text-dreamxec-navy opacity-70 font-sans mt-2">View Referrals →</p>
            </div>
          </div>

          {/* 5. Pending Campaigns Table */}
          <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-8 bg-[#FAFAF8]">
            <div className="card-tricolor-tag"></div>
            <div className="flex items-center gap-3 mb-8 mt-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-dreamxec-navy font-display">Pending Campaigns</h2>
              <div className="flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-dreamxec-navy">
                <ClockIcon className="w-5 h-5" />
                <span className="font-bold font-display text-lg">{pendingCampaigns.length} Awaiting</span>
              </div>
            </div>

            {pendingCampaigns.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-dreamxec-cream border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-pastel-green"><CheckCircleIcon className="w-12 h-12 text-dreamxec-green" /></div>
                <h3 className="text-3xl font-bold text-dreamxec-navy mb-3 font-display">All caught up!</h3>
                <p className="text-dreamxec-navy text-xl font-sans">No pending campaigns to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-dreamxec-navy">
                      <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Details</th>
                      <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden md:table-cell">Goal</th>
                      <th className="text-left py-4 px-4 text-lg font-bold text-dreamxec-navy font-display hidden lg:table-cell">Date</th>
                      <th className="text-right py-4 px-4 text-lg font-bold text-dreamxec-navy font-display">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCampaigns.map((c) => (
                      <tr key={c.id} className="border-b-3 border-dreamxec-gray-200 hover:bg-dreamxec-cream transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-bold text-dreamxec-navy text-xl font-display">{c.title}</p>
                          <p className="text-dreamxec-navy opacity-80 font-sans">{c.club?.name}</p>
                        </td>
                        <td className="py-4 px-4 text-dreamxec-navy font-bold text-xl font-display hidden md:table-cell">₹{c.goalAmount.toLocaleString()}</td>
                        <td className="py-4 px-4 text-dreamxec-navy hidden lg:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4 flex justify-end gap-2">
                          <button onClick={() => setSelectedCampaign(c)} className="p-2 bg-dreamxec-gray-100 rounded-lg border-3 border-dreamxec-navy hover:scale-110 transition-transform"><EyeIcon className="w-5 h-5" /></button>
                          <button onClick={() => handleApprove(c.id, 'user')} className="px-3 py-2 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display"><CheckCircleIcon className="w-5 h-5" /></button>
                          <button onClick={() => setRejectionInfo({ id: c.id, title: c.title, type: 'user' })} className="px-3 py-2 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display"><XCircleIcon className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 6. Pending Donor Projects Section */}
          {pendingDonorProjects.length > 0 && (
            <div className="card-pastel-offwhite rounded-xl p-6 sm:p-8 border-5 border-dreamxec-navy shadow-pastel-card mb-8 bg-[#FAFAF8]">
              <div className="card-tricolor-tag"></div>
              <div className="flex items-center gap-4 mb-8 mt-4">
                <h2 className="text-4xl font-bold text-dreamxec-navy font-display">Pending Donor Projects</h2>
                <div className="flex items-center gap-2 bg-dreamxec-orange px-4 py-2 rounded-full border-3 border-dreamxec-navy text-white font-bold text-lg">{pendingDonorProjects.length}</div>
              </div>
              <div className="space-y-6">
                {pendingDonorProjects.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-xl border-4 border-dreamxec-navy shadow-pastel-green flex flex-col lg:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-bold text-dreamxec-navy font-display">{p.title}</h3>
                      <p className="text-lg text-dreamxec-navy opacity-80 font-sans">By {p.donor?.organizationName || 'Donor'}</p>
                      <p className="mt-2 text-dreamxec-navy font-sans line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <button onClick={() => handleApprove(p.id, 'donor')} className="px-4 py-3 bg-dreamxec-green text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-green hover:scale-105 transition-transform font-display flex items-center justify-center gap-2"><CheckCircleIcon className="w-5 h-5" /> Approve</button>
                      <button onClick={() => setRejectionInfo({ id: p.id, title: p.title, type: 'donor' })} className="px-4 py-3 bg-red-600 text-white rounded-lg font-bold border-3 border-dreamxec-navy shadow-pastel-navy hover:scale-105 transition-transform font-display flex items-center justify-center gap-2"><XCircleIcon className="w-5 h-5" /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}