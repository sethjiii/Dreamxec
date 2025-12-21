import React, { useEffect, useState } from 'react';
import { getMyDonations, type Donation } from '../services/donationService';

interface Props {
  onClose: () => void;
}

export default function DonationHistoryModal({ onClose }: Props) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const res = await getMyDonations();
        if (res.status === 'success' && res.data?.donations) {
          setDonations(res.data.donations);
        }
      } catch (err) {
        console.error('Failed to load donations', err);
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border-4 border-dreamxec-navy shadow-pastel-card max-w-3xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold font-display text-dreamxec-navy mb-6">
          💝 Donation History
        </h2>

        {loading ? (
          <p className="text-center">Loading donations...</p>
        ) : donations.length === 0 ? (
          <p className="text-center text-lg">No donations yet.</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {donations.map((d) => (
              <div
                key={d._id}
                className="border-3 border-dreamxec-navy rounded-xl p-4 bg-dreamxec-cream"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-dreamxec-navy">
                      ₹{d.amount.toLocaleString()}
                    </p>
                    <p className="text-sm opacity-80">
                      Project: {d.userProject.title}
                    </p>
                    <p className="text-xs opacity-60">
                      {new Date(d.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    {d.anonymous ? 'Anonymous' : 'Public'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="btn-pastel-secondary px-6 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
