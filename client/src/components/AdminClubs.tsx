import React, { useEffect, useState } from 'react';
import apiRequest from '../services/api'; // Direct API call for brevity
import { StarDecoration } from './icons';

interface Club {
  id: string;
  name: string;
  college: string;
  presidentEmail: string;
  status: 'ACTIVE' | 'SUSPENDED';
  presidentUser?: {
    name: string;
    email: string;
  };
  _count: {
    members: number;
    campaigns: number;
  };
  createdAt: string;
}

export default function AdminClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    try {
      setLoading(true);
      const res = await apiRequest<{ clubs: Club[] }>('/admin/clubs', { method: 'GET' });
      setClubs(res.data.clubs);
    } catch (error) {
      console.error("Failed to load clubs", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(clubId: string, newStatus: string) {
    if (!window.confirm(`Are you sure you want to set this club to ${newStatus}?`)) return;
    try {
      await apiRequest(`/admin/clubs/${clubId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchClubs(); // Refresh
    } catch (error) {
      alert("Failed to update status");
    }
  }

  const filtered = clubs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-orange-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              Club Management <StarDecoration className="w-8 h-8" color="#F97316" />
            </h1>
            <p className="text-gray-600">Active Chapters: {clubs.length}</p>
          </div>
          <input 
            type="text" 
            placeholder="Search clubs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-3 rounded-lg border-2 border-dreamxec-navy w-64"
          />
        </div>

        <div className="bg-white rounded-xl border-2 border-dreamxec-navy shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-dreamxec-navy text-white">
              <tr>
                <th className="p-4">Club Name</th>
                <th className="p-4">President</th>
                <th className="p-4 text-center">Members</th>
                <th className="p-4 text-center">Campaigns</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
              ) : filtered.map(club => (
                <tr key={club.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold text-dreamxec-navy">{club.name}</div>
                    <div className="text-sm text-gray-500">{club.college}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm">{club.presidentUser?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{club.presidentEmail}</div>
                  </td>
                  <td className="p-4 text-center font-mono">{club._count.members}</td>
                  <td className="p-4 text-center font-mono">{club._count.campaigns}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      club.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {club.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {club.status === 'ACTIVE' ? (
                      <button 
                        onClick={() => handleStatusChange(club.id, 'SUSPENDED')}
                        className="text-red-600 hover:underline text-sm font-bold"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(club.id, 'ACTIVE')}
                        className="text-green-600 hover:underline text-sm font-bold"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}