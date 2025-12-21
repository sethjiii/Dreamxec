import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function VerifyPresident() {
  const [form, setForm] = useState({
    collegeName: "",
    studentEmail: "",
    studentPhone: "",
    presidentName: "",
    ficName: "",
    ficEmail: "",
    ficPhone: "",
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value);
    });

    if (documentFile) fd.append("document", documentFile);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API}/club-verification/submit`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Verification submitted! Wait for admin approval.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold text-dreamxec-navy mb-6">
        Verify as Club President
      </h1>

      <p className="text-gray-700 mb-6">
        Submit this form only if you are **official President** of your college
        club/society.
      </p>

      {success && (
        <div className="p-4 bg-green-200 border-2 border-green-600 rounded-lg mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="font-semibold">College Name</label>
          <input
            type="text"
            name="collegeName"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Your College Email ID</label>
          <input
            type="email"
            name="studentEmail"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Your Phone No.</label>
          <input
            type="text"
            name="studentPhone"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">President Name</label>
          <input
            type="text"
            name="presidentName"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Faculty Incharge (FIC) Name</label>
          <input
            type="text"
            name="ficName"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">FIC Email</label>
          <input
            type="email"
            name="ficEmail"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">FIC Phone</label>
          <input
            type="text"
            name="ficPhone"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Upload Proof (ID / Appointment Letter)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="w-full"
            onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-dreamxec-orange hover:bg-dreamxec-green text-white font-bold px-6 py-3 rounded-lg border-2 border-dreamxec-navy"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Verification"}
        </button>
      </form>
    </div>
  );
}
