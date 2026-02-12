import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAdminDonations, getAdminWithdrawals, processWithdrawal } from '../services/adminService';
import { StarDecoration } from './icons';

// Icons
const Icons = {
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
};

export default function AdminFinancials() {
  const [activeTab, setActiveTab] = useState<'donations' | 'withdrawals'>('donations');
  const [donations, setDonations] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'donations') {
        const res = await getAdminDonations();
        setDonations(res.data.donations);
      } else {
        const res = await getAdminWithdrawals('pending');
        setWithdrawals(res.data.withdrawals);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (id: string, action: 'approved' | 'rejected') => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;
    try {
      await processWithdrawal(id, action);
      fetchData(); // Refresh list
    } catch (error) {
      alert("Action failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      <div className="flex-1 relative min-h-screen p-8 ml-64">
        {/* Background Decor */}
        <div className="absolute top-10 left-10 opacity-10 pointer-events-none"><StarDecoration className="w-24 h-24" color="#0B9C2C" /></div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
            Financials <StarDecoration className="w-8 h-8" color="#0B9C2C" />
          </h1>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setActiveTab('donations')}
              className={`px-6 py-2 rounded-lg font-bold transition-all border-2 ${activeTab === 'donations' ? 'bg-dreamxec-navy text-white border-dreamxec-navy' : 'bg-white text-dreamxec-navy border-dreamxec-navy hover:bg-dreamxec-navy/10'}`}
            >
              Donation Log
            </button>
            <button 
              onClick={() => setActiveTab('withdrawals')}
              className={`px-6 py-2 rounded-lg font-bold transition-all border-2 ${activeTab === 'withdrawals' ? 'bg-dreamxec-navy text-white border-dreamxec-navy' : 'bg-white text-dreamxec-navy border-dreamxec-navy hover:bg-dreamxec-navy/10'}`}
            >
              Withdrawal Requests 
              {withdrawals.length > 0 && <span className="ml-2 bg-dreamxec-orange text-white px-2 py-0.5 rounded-full text-xs">{withdrawals.length}</span>}
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
          
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse font-bold">Loading records...</div>
          ) : activeTab === 'donations' ? (
            // --- DONATIONS TABLE ---
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy">
                  <tr>
                    <th className="p-4 font-bold text-dreamxec-navy uppercase text-sm">Donor</th>
                    <th className="p-4 font-bold text-dreamxec-navy uppercase text-sm">Campaign</th>
                    <th className="p-4 font-bold text-dreamxec-navy uppercase text-sm">Amount</th>
                    <th className="p-4 font-bold text-dreamxec-navy uppercase text-sm">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.map((d: any) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-bold text-dreamxec-navy">{d.donor?.name || d.user?.name || d.guestName || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{d.donor?.email || d.user?.email || d.guestEmail}</div>
                      </td>
                      <td className="p-4 text-sm">{d.userProject?.title}</td>
                      <td className="p-4 font-mono font-bold text-green-600">₹{d.amount.toLocaleString()}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {donations.length === 0 && <tr><td colSpan={4} className="p-8 text-center">No donations found.</td></tr>}
                </tbody>
              </table>
            </div>
          ) : (
            // --- WITHDRAWALS TABLE ---
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy">
                  <tr>
                    <th className="p-4 font-bold text-dreamxec-navy uppercase text-sm">Campaign / User</th>
                    <th className="p-4 font-bold text-dreamxec-navy uppercase text-sm">Amount</th>
                    <th className="p-4 font-bold text-dreamxec-navy uppercase text-sm">Bank Details</th>
                    <th className="p-4 text-right font-bold text-dreamxec-navy uppercase text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withdrawals.map((w: any) => (
                    <tr key={w.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-bold text-dreamxec-navy">{w.userProject?.title}</div>
                        <div className="text-xs text-gray-500">By {w.userProject?.user?.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono font-bold text-xl text-dreamxec-navy">₹{w.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Raised: ₹{w.userProject?.amountRaised.toLocaleString()}</div>
                      </td>
                      <td className="p-4 text-sm font-mono">
                        {w.userProject?.bankAccount ? (
                          <>
                            <div className="font-bold">{w.userProject.bankAccount.bankName}</div>
                            <div>AC: {w.userProject.bankAccount.accountNumber}</div>
                            <div>IFSC: {w.userProject.bankAccount.ifscCode}</div>
                          </>
                        ) : <span className="text-red-500">No Bank Linked</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleWithdrawalAction(w.id, 'approved')}
                            className="p-2 bg-green-100 text-green-700 rounded-lg border-2 border-green-300 hover:bg-green-200"
                            title="Approve Payout"
                          >
                            <Icons.Check />
                          </button>
                          <button 
                            onClick={() => handleWithdrawalAction(w.id, 'rejected')}
                            className="p-2 bg-red-100 text-red-700 rounded-lg border-2 border-red-300 hover:bg-red-200"
                            title="Reject Request"
                          >
                            <Icons.X />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {withdrawals.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-500">No pending withdrawal requests.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}