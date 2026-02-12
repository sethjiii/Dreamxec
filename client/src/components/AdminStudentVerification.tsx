import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getStudentVerifications, approveStudentVerification, rejectStudentVerification } from '../services/adminService';
import { StarDecoration } from './icons';

// Icons
const Icons = {
  Doc: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  WhatsApp: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c1.067.592 2.074.938 2.8.938 3.183 0 5.768-2.586 5.769-5.766.001-3.181-2.585-5.767-5.773-5.767zm6.265 8.632c-.373.917-1.796 1.774-2.803 1.774-1.008 0-2.095-.517-3.413-1.832-1.318-1.318-1.833-2.406-1.833-3.413 0-1.007.857-2.43 1.774-2.803 1.155-.47 2.372-.642 3.473-.642 1.101 0 2.318.172 3.473.642.917.373 1.774 1.796 1.774 2.803 0 1.007-.517 2.095-1.833 3.413-1.318 1.318-2.406 1.833-3.413 1.833-.628 0-1.258-.236-1.832-.642-.574.406-1.204.642-1.832.642z"/></svg>,
};

export default function AdminStudentVerifications() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('VERIFIED'); // Default to showing history or pending? Let's show ALL or pending

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Pass 'VERIFIED' or 'PENDING' or empty for all
      const res = await getStudentVerifications(filter === 'ALL' ? '' : filter);
      setVerifications(res.data.verifications);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!window.confirm(`Are you sure you want to ${action} this student?`)) return;
    try {
      if (action === 'approve') {
        await approveStudentVerification(id);
      } else {
        await rejectStudentVerification(id);
      }
      loadData(); // Refresh
    } catch (error) {
      alert("Action failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      <div className="flex-1 relative min-h-screen p-8 ml-64">
        {/* Decor */}
        <div className="absolute top-12 left-12 opacity-10 pointer-events-none"><StarDecoration className="w-32 h-32" color="#0B9C2C" /></div>

        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              Student Verifications <StarDecoration className="w-8 h-8" color="#FF7F00" />
            </h1>
            <p className="text-dreamxec-navy/70 mt-2">Review student IDs and verification payments.</p>
          </div>
          
          {/* Filter Toggle */}
          <div className="flex bg-white rounded-lg p-1 border-2 border-dreamxec-navy/10">
            {['VERIFIED', 'PENDING', 'REJECTED', 'ALL'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md font-bold text-xs transition-all ${
                  filter === status 
                    ? 'bg-dreamxec-navy text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse font-bold">Loading data...</div>
          ) : verifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-dreamxec-navy font-display">No Records Found</h3>
              <p className="text-gray-500">No student verifications match this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-dreamxec-navy text-white">
                  <tr>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Student</th>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Contact</th>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Document</th>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Payment</th>
                    <th className="p-4 font-display tracking-wider uppercase text-sm">Status</th>
                    <th className="p-4 text-right font-display tracking-wider uppercase text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {verifications.map((v: any) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-dreamxec-navy">{v.fullName}</div>
                        <div className="text-xs text-gray-500">{v.studentEmail}</div>
                        <div className="text-xs text-blue-600 font-mono">{v.officialEmail}</div>
                      </td>
                      <td className="p-4 text-sm font-mono">
                        <div className="flex items-center gap-1">
                          <Icons.WhatsApp /> {v.mobileNumber}
                        </div>
                      </td>
                      <td className="p-4">
                        <a 
                          href={v.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1 bg-dreamxec-cream border border-dreamxec-orange rounded-full text-xs font-bold text-dreamxec-orange hover:bg-dreamxec-orange hover:text-white transition-colors"
                        >
                          <Icons.Doc /> {v.docType}
                        </a>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-mono text-gray-500">ID: {v.razorpayPaymentId}</div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">PAID</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                          v.status === 'VERIFIED' ? 'bg-green-100 text-green-700 border-green-200' :
                          v.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {v.status === 'PENDING' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleAction(v.id, 'approve')}
                              className="p-2 bg-green-100 text-green-700 rounded-lg border-2 border-green-300 hover:bg-green-200"
                              title="Approve"
                            >
                              <Icons.Check />
                            </button>
                            <button 
                              onClick={() => handleAction(v.id, 'reject')}
                              className="p-2 bg-red-100 text-red-700 rounded-lg border-2 border-red-300 hover:bg-red-200"
                              title="Reject"
                            >
                              <Icons.X />
                            </button>
                          </div>
                        )}
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