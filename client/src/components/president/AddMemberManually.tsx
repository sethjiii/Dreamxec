import React, { useState } from "react";
import axios from "axios";

export default function AddMemberManually() {
  const [member, setMember] = useState({ name: "", email: "" });
  const API = import.meta.env.VITE_API_URL;

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    const clubId = localStorage.getItem("clubId");

    await axios.post(`${API}/clubs/${clubId}/add-member`, member, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Member added successfully!");
    setMember({ name: "", email: "" });
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-dreamxec-navy mb-6">
        Add Member Manually
      </h1>

      <input
        className="w-full p-3 border mb-4"
        placeholder="Name"
        value={member.name}
        onChange={(e) => setMember({ ...member, name: e.target.value })}
      />

      <input
        className="w-full p-3 border mb-4"
        placeholder="Email"
        value={member.email}
        onChange={(e) => setMember({ ...member, email: e.target.value })}
      />

      <button
        onClick={handleAdd}
        className="mt-4 px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-4 border-dreamxec-navy"
      >
        Add Member
      </button>
    </div>
  );
}
