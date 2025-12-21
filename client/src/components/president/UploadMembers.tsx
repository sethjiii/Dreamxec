import React, { useState } from "react";
import axios from "axios";

export default function UploadMembers() {
  const [file, setFile] = useState<File | null>(null);
  const API = import.meta.env.VITE_API_URL;

  const handleUpload = async () => {
    if (!file) return alert("Upload CSV first");

    const token = localStorage.getItem("token");
    const clubId = localStorage.getItem("clubId");

    const formData = new FormData();
    formData.append("membersFile", file);

    await axios.post(`${API}/clubs/${clubId}/upload-members`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Members uploaded successfully!");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-dreamxec-navy mb-6">
        Upload Members CSV
      </h1>

      <input type="file" onChange={(e) => setFile(e.target.files![0])} />

      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-3 bg-dreamxec-orange text-white rounded-lg border-4 border-dreamxec-navy"
      >
        Upload
      </button>
    </div>
  );
}
