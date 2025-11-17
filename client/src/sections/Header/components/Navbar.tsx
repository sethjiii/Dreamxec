import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { MobileMenuButton } from "../../../components/MobileMenuButton";
import { DesktopMenu } from "./DesktopMenu";
import type { UserRole } from "../../../types";

interface NavbarProps {
  currentUser?: { name: string; role: UserRole } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar = ({ currentUser, onLogin, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Logo />

        {/* Right side - Navigation and User Actions */}
        <div className="flex items-center gap-6">
          {/* Desktop Menu */}
          <div className="hidden md:flex">
            <DesktopMenu currentUser={currentUser} onLogin={onLogin} />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
          {currentUser && (
            <>
              {/* User Profile - Only for Students */}
              {currentUser.role === 'student' && (
                <button 
                  onClick={() => navigate('/profile')}
                  className="hidden md:flex items-center gap-2 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-xl px-3 py-2 shadow-md hover:bg-dreamxec-cream transition-all"
                >
                  <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-dreamxec-navy font-bold text-sm font-sans">
                      {currentUser.name}
                    </span>
                    <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                      Student
                    </span>
                  </div>
                </button>
              )}
              
              {/* Simple name display for donors/admins */}
              {currentUser.role !== 'student' && (
                <div className="hidden md:flex items-center gap-2 bg-dreamxec-beige border-2 border-dreamxec-navy rounded-xl px-3 py-2 shadow-md">
                  <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-dreamxec-navy font-bold text-sm font-sans">
                      {currentUser.name}
                    </span>
                    <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                      {currentUser.role === 'donor' ? 'Donor' : 'Admin'}
                    </span>
                  </div>
                </div>
              )}
              
              <button
                onClick={onLogout}
                className="bg-dreamxec-cream border-2 border-dreamxec-navy px-4 py-2 rounded-xl font-bold text-dreamxec-navy hover:bg-dreamxec-orange hover:text-white transition-colors font-display shadow-md"
              >
                Logout
              </button>
            </>
          )}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          </div>
        </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-dreamxec-navy shadow-lg rounded-b-2xl">
          <div className="flex flex-col gap-3 p-4">
            {currentUser ? (
              <>
                {/* User Profile Card - Only for Students */}
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-lg mx-2 my-2 hover:bg-dreamxec-cream hover:shadow-pastel-card transition-all w-full text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-dreamxec-navy font-bold text-sm font-sans">
                          {currentUser.name}
                        </span>
                        <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                          Student
                        </span>
                      </div>
                    </div>
                  </button>
                )}

                {/* User Info Display - For Donors/Admins (non-clickable) */}
                {currentUser.role !== 'student' && (
                  <div className="px-4 py-3 bg-dreamxec-beige border-3 border-dreamxec-navy rounded-lg mx-2 my-2 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-dreamxec-orange border-2 border-dreamxec-navy rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-dreamxec-navy font-bold text-sm font-sans">
                          {currentUser.name}
                        </span>
                        <span className="text-dreamxec-navy text-xs opacity-70 font-sans">
                          {currentUser.role === 'donor' ? 'Donor' : 'Admin'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Links */}
                {currentUser.role === 'student' && (
                  <>
                    <a
                      href="/dashboard"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      DASHBOARD
                    </a>
                    <a
                      href="/campaigns"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      CAMPAIGNS
                    </a>
                    <a
                      href="/projects"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      OPPORTUNITIES
                    </a>
                  </>
                )}

                {/* Admin Links */}
                {currentUser.role === 'admin' && (
                  <>
                    <a
                      href="/admin"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      ADMIN DASHBOARD
                    </a>
                    <a
                      href="/campaigns"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      CAMPAIGNS
                    </a>
                  </>
                )}

                {/* Donor Links */}
                {currentUser.role === 'donor' && (
                  <>
                    <a
                      href="/donor/dashboard"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      MY PROJECTS
                    </a>
                    <a
                      href="/campaigns"
                      className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                    >
                      CAMPAIGNS
                    </a>
                  </>
                )}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-2 my-2 bg-dreamxec-orange text-white px-6 py-3 rounded-lg font-bold border-3 border-dreamxec-navy hover:bg-dreamxec-green transition-colors font-display shadow-pastel-saffron"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Guest Links */}
                <a
                  href="/"
                  className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                >
                  HOME
                </a>
                <a
                  href="/campaigns"
                  className="text-left px-4 py-3 text-dreamxec-navy hover:bg-dreamxec-cream hover:text-dreamxec-orange font-bold transition-colors rounded-lg font-display border-2 border-transparent hover:border-dreamxec-navy"
                >
                  CAMPAIGNS
                </a>
                
                {/* Sign In Button for Mobile */}
                <button
                  onClick={() => {
                    onLogin?.();
                    setMobileMenuOpen(false);
                  }}
                  className="mx-2 my-2 bg-dreamxec-orange text-white px-6 py-3 rounded-lg font-bold border-3 border-dreamxec-navy hover:bg-dreamxec-saffron transition-colors font-display shadow-pastel-saffron"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};