import dxLogo from '../assets/dx-logo-2.png';

export const Logo = () => {
  return (
    <a
      href="/"
      className="flex items-center text-dreamxec-navy hover:opacity-80 transition-opacity"
    >
      {/* DreamXec Logo Image */}
      <img 
        src={dxLogo} 
        alt="DreamXec Logo" 
        className="h-10 w-auto object-contain"
      />
    </a>
  );
};
