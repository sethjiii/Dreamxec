// import React, { useState } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;

// export default function VerifyPresident() {
//   const [form, setForm] = useState({
//     collegeName: "",
//     studentEmail: "",
//     studentPhone: "",
//     presidentName: "",
//     ficName: "",
//     ficEmail: "",
//     ficPhone: "",
//   });

//   const [documentFile, setDocumentFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     const fd = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       fd.append(key, value);
//     });

//     if (documentFile) fd.append("document", documentFile);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.post(`${API}/club-verification/submit`, fd, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setSuccess("Verification submitted! Wait for admin approval.");
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Something went wrong");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-2xl mx-auto py-10 px-5">
//       <h1 className="text-4xl font-bold text-dreamxec-navy mb-6">
//         Verify as Club President
//       </h1>

//       <p className="text-gray-700 mb-6">
//         Submit this form only if you are **official President** of your college
//         club/society.
//       </p>

//       {success && (
//         <div className="p-4 bg-green-200 border-2 border-green-600 rounded-lg mb-6">
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">

//         <div>
//           <label className="font-semibold">College Name</label>
//           <input
//             type="text"
//             name="collegeName"
//             className="w-full p-3 border rounded-lg"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="font-semibold">Your College Email ID</label>
//           <input
//             type="email"
//             name="studentEmail"
//             className="w-full p-3 border rounded-lg"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="font-semibold">Your Phone No.</label>
//           <input
//             type="text"
//             name="studentPhone"
//             className="w-full p-3 border rounded-lg"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="font-semibold">President Name</label>
//           <input
//             type="text"
//             name="presidentName"
//             className="w-full p-3 border rounded-lg"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="font-semibold">Faculty Incharge (FIC) Name</label>
//           <input
//             type="text"
//             name="ficName"
//             className="w-full p-3 border rounded-lg"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="font-semibold">FIC Email</label>
//           <input
//             type="email"
//             name="ficEmail"
//             className="w-full p-3 border rounded-lg"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="font-semibold">FIC Phone</label>
//           <input
//             type="text"
//             name="ficPhone"
//             className="w-full p-3 border rounded-lg"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="font-semibold">Upload Proof (ID / Appointment Letter)</label>
//           <input
//             type="file"
//             accept="image/*,application/pdf"
//             className="w-full"
//             onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-dreamxec-orange hover:bg-dreamxec-green text-white font-bold px-6 py-3 rounded-lg border-2 border-dreamxec-navy"
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit Verification"}
//         </button>
//       </form>
//     </div>
//   );
// }



import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function VerifyPresident() {
  // -----------------------
  // EXISTING FORM STATE
  // -----------------------
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

  // -----------------------
  // CLUB DETAILS
  // -----------------------
  const [club, setClub] = useState({
    clubName: "",
    clubDescription: "",
    clubInstagram: "",
    clubLinkedIn: "",
    clubYouTube: "",
  });

  // -----------------------
  // ALUMNI ENDORSEMENT
  // -----------------------
  const [alumni, setAlumni] = useState([
    { name: "", phone: "", socialProfile: "" },
  ]);

  // -----------------------
  // UI STATE
  // -----------------------
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // -----------------------
  // HANDLERS
  // -----------------------
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClubChange = (e: any) => {
    setClub({ ...club, [e.target.name]: e.target.value });
  };

  const addAlumni = () => {
    setAlumni([...alumni, { name: "", phone: "", socialProfile: "" }]);
  };

  const removeAlumni = (index: number) => {
    if (alumni.length === 1) return;
    setAlumni(alumni.filter((_, i) => i !== index));
  };

  const updateAlumni = (index: number, field: string, value: string) => {
    const updated = [...alumni];
    updated[index] = { ...updated[index], [field]: value };
    setAlumni(updated);
  };

  // -----------------------
  // SUBMIT
  // -----------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value);
    });

    Object.entries(club).forEach(([key, value]) => {
      fd.append(key, value);
    });

    fd.append("alumni", JSON.stringify(alumni));

    if (documentFile) {
      fd.append("document", documentFile);
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API}/club-verification/verify-president`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        "Your DreamXec profile has been sent for club & president verification."
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  // -----------------------
  // RENDER
  // -----------------------
  return (
    <div className="max-w-2xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold text-dreamxec-navy mb-4">
        Verify as Club President
      </h1>

      <p className="text-gray-700 mb-8">
        Please fill all sections carefully. This information will be reviewed by
        the DreamXec team for club & president verification.
      </p>

      {success && (
        <div className="p-4 bg-green-200 border-2 border-green-600 rounded-lg mb-6">
          {success}
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ================= SECTION 1 ================= */}
          <section className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-dreamxec-navy">
              1. President & College Details
            </h2>

            <input
              name="collegeName"
              placeholder="College Name"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="studentEmail"
              placeholder="Your College Email"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleChange}
              required
            />

            <input
              name="studentPhone"
              placeholder="Your Phone Number"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleChange}
              required
            />

            <input
              name="presidentName"
              placeholder="President Name"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleChange}
              required
            />

            <input
              name="ficName"
              placeholder="Faculty Incharge (FIC) Name"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="ficEmail"
              placeholder="FIC Email"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleChange}
              required
            />

            <input
              name="ficPhone"
              placeholder="FIC Phone"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setDocumentFile(e.target.files?.[0] || null)
              }
              required
            />
          </section>

          {/* ================= SECTION 2 ================= */}
          <section className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-dreamxec-navy">
              2. Club Details
            </h2>

            <input
              name="clubName"
              placeholder="Club Name"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleClubChange}
              required
            />

            <textarea
              name="clubDescription"
              placeholder="Describe your club (minimum 30 characters)"
              className="w-full p-3 border rounded-lg"
              rows={4}
              onChange={handleClubChange}
              required
            />

            <input
              name="clubInstagram"
              placeholder="Instagram URL"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleClubChange}
              required
            />

            <input
              name="clubLinkedIn"
              placeholder="LinkedIn URL (optional)"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleClubChange}
            />

            <input
              name="clubYouTube"
              placeholder="YouTube URL (optional)"
              className="w-full p-3 border rounded-lg"
              style={{ caretColor: "black" }}
              onChange={handleClubChange}
            />
          </section>

          {/* ================= SECTION 3 ================= */}
          <section className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-dreamxec-navy">
              3. Alumni Endorsement
            </h2>

            {alumni.map((a, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <input
                  placeholder="Alumni Name"
                  value={a.name}
                  className="w-full p-3 border rounded-lg"
                  style={{ caretColor: "black" }}
                  onChange={(e) =>
                    updateAlumni(i, "name", e.target.value)
                  }
                  required
                />

                <input
                  placeholder="Phone Number"
                  value={a.phone}
                  className="w-full p-3 border rounded-lg"
                  style={{ caretColor: "black" }}
                  onChange={(e) =>
                    updateAlumni(i, "phone", e.target.value)
                  }
                  required
                />

                <input
                  placeholder="LinkedIn / Instagram (optional)"
                  value={a.socialProfile}
                  className="w-full p-3 border rounded-lg"
                  style={{ caretColor: "black" }}
                  onChange={(e) =>
                    updateAlumni(i, "socialProfile", e.target.value)
                  }
                />

                {alumni.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAlumni(i)}
                    className="text-red-600 text-sm"
                  >
                    Remove Alumni
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addAlumni}
              className="text-dreamxec-orange font-semibold"
            >
              + Add Alumni
            </button>
          </section>

          {/* ================= SUBMIT ================= */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-dreamxec-green text-white px-8 py-3 rounded-lg"
            >
              {loading ? "Submitting..." : "Submit Verification"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
