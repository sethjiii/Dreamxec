import { useState } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import { Header } from '../sections/Header';
import type { User } from '../types';
import RegistrationForm from './donor';
import StudentRegistration from './student';
const BankIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <path d="M12 7h.01M12 11h.01M12 15h.01" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  upiId?: string;
}

interface UserProfileProps {
  user: User;
  onBack: () => void;
  onUpdateBankDetails?: (details: BankDetails) => void;
  onLogout?: () => void;
}

export default function UserProfile({ user, onBack, onUpdateBankDetails, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-20 left-10 z-0 opacity-20">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Header */}
      <Header currentUser={user} onLogout={onLogout} />

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-dreamxec-green border-4 border-dreamxec-navy rounded-xl px-6 py-4 shadow-pastel-green flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-white" />
            <span className="text-white font-bold font-display text-lg">Bank details saved successfully!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-4 border-dreamxec-navy hover:scale-105 transition-transform font-display font-bold shadow-pastel-saffron"
        >
          <span>←</span>
          Back to Dashboard
        </button>
        {/*new UI*/}
        {isEditing && (user.role === 'donor') ? <RegistrationForm /> : <StudentRegistration />}

        {/* Info Card */}
        <div className="mt-6 card-pastel rounded-xl p-4 border-4 border-dreamxec-navy shadow-pastel-saffron">
          <div className="flex items-start gap-3">
            <div className="icon-pastel-container w-10 h-10 p-2 flex-shrink-0">
              <span className="text-dreamxec-saffron text-xl">🔒</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-dreamxec-navy font-display">
                Secure & Encrypted
              </h3>
              <p className="text-dreamxec-navy font-sans text-sm leading-relaxed">
                Your bank details are encrypted and stored securely. We never share your financial information with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
