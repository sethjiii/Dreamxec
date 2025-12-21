import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReferClub() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clubName: "",
    collegeName: "",
    presidentEmail: "",
    presidentPhone: "",
    presidentName: "",
    ficName: "",
    ficEmail: "",
    ficPhone: "",
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // JWT

      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (documentFile) {
        data.append("document", documentFile);
      }

      await axios.post(`${API_BASE}/club-referral/refer`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Referral submitted successfully!");
      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit referral.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 border-4 border-dreamxec-navy">
        <h1 className="text-3xl font-bold text-dreamxec-navy mb-6">
          Refer Your Club
        </h1>
        <p className="text-gray-600 mb-6">
          Submit your club details so DreamXec can verify the president and faculty in-charge.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* College Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">College Name</label>
            <input
              name="collegeName"
              value={form.collegeName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>
          {/* Club Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">Club Name</label>
            <input
              name="clubName"
              value={form.clubName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>
          {/* Student Email */}
          <div>
            <label className="font-bold text-dreamxec-navy">President College Email</label>
            <input
              name="presidentEmail"
              type="email"
              value={form.presidentEmail}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Student Phone */}
          <div>
            <label className="font-bold text-dreamxec-navy">President Phone Number</label>
            <input
              name="presidentPhone"
              value={form.presidentPhone}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* President Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">Club President Name</label>
            <input
              name="presidentName"
              value={form.presidentName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Faculty In-Charge Name */}
          <div>
            <label className="font-bold text-dreamxec-navy">Faculty In-Charge Name</label>
            <input
              name="ficName"
              value={form.ficName}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Faculty Email */}
          <div>
            <label className="font-bold text-dreamxec-navy">Faculty Email</label>
            <input
              name="ficEmail"
              type="email"
              value={form.ficEmail}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Faculty Phone */}
          <div>
            <label className="font-bold text-dreamxec-navy">Faculty Phone</label>
            <input
              name="ficPhone"
              value={form.ficPhone}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border-2 border-dreamxec-navy rounded-lg"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="font-bold text-dreamxec-navy">Upload Proof Document (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="w-full mt-2"
              onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dreamxec-orange text-white font-bold p-4 rounded-lg border-4 border-dreamxec-navy hover:bg-orange-600 transition"
          >
            {loading ? "Submitting..." : "Submit Referral"}
          </button>

        </form>

      </div>
    </div>
  );
}
