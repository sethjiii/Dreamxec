import React, { useEffect, useState } from 'react';
import { getAllUsers, manageUserStatus } from '../services/adminService';
import type { User, AccountStatus } from '../types';
import { StarDecoration } from './icons';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(userId: string, newStatus: AccountStatus) {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      await manageUserStatus(userId, newStatus);
      // Optimistic update
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u));
    } catch (error) {
      alert("Failed to update status");
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-orange-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-dreamxec-navy font-display flex items-center gap-3">
              User Management <StarDecoration className="w-8 h-8" color="#0B9C2C" />
            </h1>
            <p className="text-gray-600">Total Users: {users.length}</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-3 rounded-lg border-2 border-dreamxec-navy w-64 focus:ring-2 focus:ring-dreamxec-orange"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-dreamxec-navy shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-dreamxec-navy text-white">
              <tr>
                <th className="p-4">Name / Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold text-dreamxec-navy">{user.name || 'No Name'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase border border-gray-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      user.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                      user.accountStatus === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                    }`}>
                      {user.accountStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {user.accountStatus === 'ACTIVE' ? (
                      <button 
                        onClick={() => handleStatusChange(user.id, 'BLOCKED')}
                        className="text-red-600 hover:underline text-sm font-bold"
                      >
                        Block User
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                        className="text-green-600 hover:underline text-sm font-bold"
                      >
                        Unblock
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