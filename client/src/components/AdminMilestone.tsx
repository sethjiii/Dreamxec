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
      
      <div className="flex-1 relative min-h-screen p-8 ml-64">
        {/* Decor */}
        <div className="absolute top-10 right-10 opacity-20 pointer-events-none"><StarDecoration className="w-24 h-24" color="#F97316" /></div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
            Milestone Review <StarDecoration className="w-8 h-8" color="#FF7F00" />
          </h1>
          <p className="text-dreamxec-navy/70 mt-2">Verify student proof of work to release campaign funds.</p>
        </div>

        <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse font-bold">Loading milestones...</div>
          ) : milestones.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-dreamxec-navy font-display">All Caught Up!</h3>
              <p className="text-gray-500">No pending milestones to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-dreamxec-navy text-white">
                  <tr>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Milestone</th>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Campaign</th>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Proof</th>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Budget</th>
                    <th className="p-4 text-right font-display tracking-wider uppercase text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {milestones.map((m: any) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-dreamxec-navy">{m.title}</div>
                        <div className="text-xs text-gray-500 font-mono">{m.timeline}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-dreamxec-navy">{m.project?.title}</div>
                        <div className="text-xs text-gray-500">By {m.project?.user?.name}</div>
                      </td>
                      <td className="p-4">
                        {m.proofUrl ? (
                          <a 
                            href={m.proofUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
                          >
                            View Proof <Icons.Link />
                          </a>
                        ) : <span className="text-red-500 text-sm font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">No Proof</span>}
                      </td>
                      <td className="p-4 font-mono font-bold text-green-700">₹{m.budget.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleVerify(m.id, 'APPROVED')}
                            className="p-2 bg-green-100 text-green-700 rounded-lg border-2 border-green-300 hover:bg-green-200 hover:scale-105 transition-transform"
                            title="Approve"
                          >
                            <Icons.Check />
                          </button>
                          <button 
                            onClick={() => handleVerify(m.id, 'REJECTED')}
                            className="p-2 bg-red-100 text-red-700 rounded-lg border-2 border-red-300 hover:bg-red-200 hover:scale-105 transition-transform"
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
  );
}