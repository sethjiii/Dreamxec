import React, { useState } from 'react';
import { CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid'; // Optional: npm i @heroicons/react

interface ProfileHeaderProps {
  completion: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ completion, emailVerified, phoneVerified, createdAt }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Profile Picture Circle */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-inner overflow-hidden bg-gray-100 flex items-center justify-center">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-xs text-center px-2">No Photo</span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>

        {/* Info & Stats */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-gray-800">Profile Status</h3>
            <div className="flex gap-2">
              {emailVerified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Email Verified
                </span>
              )}
              {phoneVerified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Phone Verified
                </span>
              )}
            </div>
          </div>

          {/* Completion Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>{completion}% Complete</span>
            <span className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" /> Joined {createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;