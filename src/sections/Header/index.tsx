import { Navbar } from "./components/Navbar";
import type { UserRole } from "../../types";

interface HeaderProps {
  currentUser?: { name: string; role: UserRole } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ currentUser, onLogin, onLogout }: HeaderProps) => {
  return (
    <header className="bg-transparent z-50 sticky top-0">
  <div className="max-w-[1500px] mx-auto px-6">
    <div className="bg-white border-4 border-dreamxec-navy rounded-2xl shadow-pastel-saffron my-2">
      <Navbar currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />
    </div>
  </div>
</header>

  );
};

