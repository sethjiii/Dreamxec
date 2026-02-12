import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAuditLogs } from '../services/adminService';
import { StarDecoration } from './icons';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('ALL');
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  useEffect(() => {
    fetchLogs();
  }, [page, filterType]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs(page, 20, filterType === 'ALL' ? undefined : filterType);
      setLogs(res.data.logs);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('REJECT') || action.includes('BLOCK')) return 'text-red-600 bg-red-50 border-red-200';
    if (action.includes('APPROVE') || action.includes('VERIFY')) return 'text-green-600 bg-green-50 border-green-200';
    if (action.includes('WITHDRAWAL')) return 'text-purple-600 bg-purple-50 border-purple-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <AdminSidebar />
      
      <div className="flex-1 relative min-h-screen p-8 ml-64">
        <div className="absolute top-10 left-10 opacity-10 pointer-events-none"><StarDecoration className="w-24 h-24" color="#000080" /></div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              System Activity <StarDecoration className="w-8 h-8" color="#FF7F00" />
            </h1>
            <p className="text-dreamxec-navy/70 mt-2">Audit trail of all administrative actions.</p>
          </div>

          <div className="flex gap-2">
            {['ALL', 'User', 'Project', 'Milestone', 'Withdrawal'].map(type => (
              <button
                key={type}
                onClick={() => { setFilterType(type); setPage(1); }}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all border-2 ${
                  filterType === type 
                    ? 'bg-dreamxec-navy text-white border-dreamxec-navy' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-dreamxec-navy'
                }`}
              >
                {type === 'ALL' ? 'All Logs' : type + 's'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border-4 border-dreamxec-navy shadow-pastel-card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 animate-pulse font-bold">Loading activity logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No activity recorded yet.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-dreamxec-cream border-b-2 border-dreamxec-navy">
                    <tr>
                      <th className="p-4 font-display tracking-wider uppercase text-sm">Action</th>
                      <th className="p-4 font-display tracking-wider uppercase text-sm">Entity</th>
                      <th className="p-4 font-display tracking-wider uppercase text-sm">Performed By</th>
                      <th className="p-4 font-display tracking-wider uppercase text-sm">Details</th>
                      <th className="p-4 font-display tracking-wider uppercase text-sm text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-gray-50 text-sm">
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getActionColor(log.action)}`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-dreamxec-navy">{log.entityType}</div>
                          <div className="text-xs font-mono text-gray-400">{log.entityId.slice(-6)}...</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-700">{log.admin?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{log.admin?.email}</div>
                        </td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">
                          {log.details ? JSON.stringify(log.details) : '-'}
                        </td>
                        <td className="p-4 text-right font-mono text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-xs font-bold"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-gray-500">Page {page} of {pagination.totalPages}</span>
                <button 
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-xs font-bold"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}