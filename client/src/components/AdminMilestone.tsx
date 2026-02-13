import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getPendingMilestones, verifyMilestone } from '../services/adminService';
import { StarDecoration } from './icons';

// Icons
const Icons = {
  Link: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
};

export default function AdminMilestones() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getPendingMilestones();
      setMilestones(res.data.milestones);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const feedback = status === 'REJECTED' ? prompt("Enter feedback for rejection:") : '';
    if (status === 'REJECTED' && !feedback) return;

    if (!window.confirm(`Are you sure you want to ${status} this milestone?`)) return;

    try {
      await verifyMilestone(id, status, feedback || undefined);
      loadData(); // Refresh list
    } catch (error) {
      alert("Action failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      {/* Main Content Area - Fluid full width layout */}
      <div className="flex-1 relative min-h-screen w-full px-6 lg:px-10 py-8">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-10 right-10 z-0 opacity-20 pointer-events-none">
          <StarDecoration className="w-24 h-24" color="#F97316" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              Milestone Review <StarDecoration className="w-8 h-8 hidden sm:block" color="#FF7F00" />
            </h1>
            <p className="text-gray-600 mt-2 font-sans text-lg">Verify student proof of work to release campaign funds.</p>
          </div>

          <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse font-bold font-display text-xl">Loading milestones...</div>
            ) : milestones.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-dreamxec-navy font-display">All Caught Up!</h3>
                <p className="text-gray-500 font-sans mt-2">No pending milestones to review.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy/20">
                    <tr>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Milestone</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Campaign</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Proof</th>
                      <th className="p-5 font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Budget</th>
                      <th className="p-5 text-right font-bold tracking-wider font-display uppercase text-sm text-dreamxec-navy">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {milestones.map((m: any) => (
                      <tr key={m.id} className="hover:bg-dreamxec-cream/50 transition-colors">
                        <td className="p-5">
                          <div className="font-bold text-dreamxec-navy text-lg font-display">{m.title}</div>
                          <div className="text-sm text-gray-500 font-mono mt-1">{m.timeline}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-sm text-dreamxec-navy">{m.project?.title}</div>
                          <div className="text-sm text-gray-500 mt-1">By {m.project?.user?.name}</div>
                        </td>
                        <td className="p-5">
                          {m.proofUrl ? (
                            <a 
                              href={m.proofUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-blue-300 rounded-full text-xs font-bold text-blue-600 shadow-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              View Proof <Icons.Link />
                            </a>
                          ) : (
                            <span className="text-red-500 text-xs font-bold bg-red-50 px-3 py-1.5 rounded-full border border-red-200 shadow-sm">
                              No Proof
                            </span>
                          )}
                        </td>
                        <td className="p-5 font-mono font-bold text-green-700 text-lg">₹{m.budget.toLocaleString()}</td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-3 items-center">
                            <button 
                              onClick={() => handleVerify(m.id, 'APPROVED')}
                              className="p-2.5 bg-green-50 text-green-700 rounded-lg border-2 border-green-200 shadow-sm hover:bg-green-100 hover:scale-105 transition-transform"
                              title="Approve"
                            >
                              <Icons.Check />
                            </button>
                            <button 
                              onClick={() => handleVerify(m.id, 'REJECTED')}
                              className="p-2.5 bg-red-50 text-red-700 rounded-lg border-2 border-red-200 shadow-sm hover:bg-red-100 hover:scale-105 transition-transform"
                              title="Reject"
                            >
                              <Icons.X />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}