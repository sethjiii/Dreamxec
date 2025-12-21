import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PresidentMembers() {
  const [members, setMembers] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const clubId = localStorage.getItem("clubId");
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API}/clubs/${clubId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMembers(res.data.data);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-dreamxec-navy mb-6">
        Club Members
      </h1>

      <table className="w-full border border-dreamxec-navy">
        <thead>
          <tr className="bg-dreamxec-navy text-white">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m: any) => (
            <tr key={m.id} className="border">
              <td className="p-3 border">{m.name}</td>
              <td className="p-3 border">{m.email}</td>
              <td className="p-3 border">
                {m.verified ? "Verified ✔" : "Pending ⏱"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
