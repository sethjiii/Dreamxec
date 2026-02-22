import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback } from '../services/authService';
import { getProfile } from '../services/profileService';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const completeAuth = async () => {
      try {
        await handleGoogleCallback();

        // Check if profile is complete — redirect to setup if not
        const profileRes = await getProfile();
        if (
          profileRes.status === 'success' &&
          profileRes.data &&
          !profileRes.data.profile.profileComplete
        ) {
          navigate('/profile/setup');
        } else {
          navigate('/');
        }
      } catch (e) {
        console.error(e);
        navigate('/auth');
      }
    };

    completeAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF3]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#000080] border-t-[#FF7F00] rounded-full animate-spin mx-auto mb-4" />
        <p className="font-black text-[#000080] uppercase tracking-widest text-sm">Completing authentication...</p>
      </div>
    </div>
  );
}
