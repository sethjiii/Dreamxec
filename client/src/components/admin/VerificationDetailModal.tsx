import React from "react";

type Verification = {
  id: string;
  collegeName: string;
  studentEmail?: string | null;
  studentPhone?: string | null;
  presidentName?: string | null;
  ficName?: string | null;
  ficEmail?: string | null;
  ficPhone?: string | null;
  docUrl?: string | null;
  status: string;
  createdAt: string;
  userId?: string | null;
};

export default function VerificationDetailModal({
  verification,
  onClose,
  onApprove,
  onReject,
}: {
  verification: Verification;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}) {
  const handleApprove = async () => {
    await onApprove(verification.id);
  };

  const handleReject = async () => {
    const reason = window.prompt("Enter rejection reason (optional):", "");
    if (reason !== null) {
      await onReject(verification.id, reason);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-auto">
        <div className="p-6 border-b flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{verification.collegeName}</h2>
            <p className="text-sm text-gray-500">Verification ID: {verification.id}</p>
            <p className="text-sm text-gray-600 mt-2">Status: {verification.status}</p>
            <p className="text-sm text-gray-500">Submitted: {new Date(verification.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">College</h3>
              <p>{verification.collegeName}</p>
            </div>

            <div>
              <h3 className="font-semibold">President</h3>
              <p>{verification.presidentName ?? "—"}</p>
              <p className="text-sm text-gray-500">{verification.studentEmail ?? "—"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Faculty</h3>
              <p>{verification.ficName ?? "—"}</p>
              <p className="text-sm text-gray-500">{verification.ficEmail ?? "—"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>{verification.studentPhone ?? "—"}</p>
              <p>{verification.ficPhone ?? "—"}</p>
            </div>
          </section>

          {verification.docUrl && (
            <div className="mt-6">
              <h4 className="font-semibold">Uploaded Document</h4>
              <div className="mt-2">
                <a
                  href={verification.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-dreamxec-navy underline"
                >
                  View uploaded document
                </a>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>

            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(verification, null, 2));
                alert("Verification JSON copied to clipboard");
              }}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Copy JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
