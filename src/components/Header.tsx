import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Function to get active styles
  const getActiveStyles = (path: string, isRegex = false, isJWT = false, isColor = false) => {
    const active = isActive(path);
    const baseStyles = "transition-colors relative";
    const activeStyles = isRegex 
      ? "text-pink-600 font-semibold" 
      : isJWT
      ? "text-purple-600 font-semibold"
      : isColor
      ? "text-green-600 font-semibold"
      : "text-blue-600 font-semibold";
    const inactiveStyles = isRegex 
      ? "text-gray-700 hover:text-pink-600" 
      : isJWT
      ? "text-gray-700 hover:text-purple-600"
      : isColor
      ? "text-gray-700 hover:text-green-600"
      : "text-gray-700 hover:text-blue-600";
    
    return `${baseStyles} ${active ? activeStyles : inactiveStyles}`;
  };

  // Function to get active indicator
  const getActiveIndicator = (path: string, isRegex = false, isJWT = false, isColor = false) => {
    const active = isActive(path);
    if (!active) return null;
    
    const gradient = isRegex 
      ? "from-pink-600 to-red-600"
      : isJWT
      ? "from-purple-600 to-pink-600"
      : isColor
      ? "from-green-600 to-teal-600"
      : "from-blue-600 to-purple-600";
    
    return (
      <div className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} rounded-full`}></div>
    );
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Web Tools
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getActiveStyles('/')}>
              JSON Formatter
              {getActiveIndicator('/')}
            </Link>
            <Link to="/validator" className={getActiveStyles('/validator')}>
              JSON Validator
              {getActiveIndicator('/validator')}
            </Link>
            <Link to="/tree-view" className={getActiveStyles('/tree-view')}>
              Tree View
              {getActiveIndicator('/tree-view')}
            </Link>
            <Link to="/jwt-decoder" className={getActiveStyles('/jwt-decoder', false, true)}>
              JWT Decoder
              {getActiveIndicator('/jwt-decoder', false, true)}
            </Link>
            <Link to="/regex" className={getActiveStyles('/regex', true)}>
              Regex
              {getActiveIndicator('/regex', true)}
            </Link>
            <Link to="/color-picker" className={getActiveStyles('/color-picker', false, false, true)}>
              Color Picker
              {getActiveIndicator('/color-picker', false, false, true)}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 transition-opacity md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 flex flex-col md:hidden animate-slide-in">
            <button
              className="self-end mb-8 p-2 text-gray-500 hover:text-blue-600"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col space-y-6 text-lg font-medium">
              <Link 
                to="/" 
                className={getActiveStyles('/')} 
                onClick={() => setMobileOpen(false)}
              >
                JSON Formatter
              </Link>
              <Link 
                to="/validator" 
                className={getActiveStyles('/validator')} 
                onClick={() => setMobileOpen(false)}
              >
                JSON Validator
              </Link>
              <Link 
                to="/tree-view" 
                className={getActiveStyles('/tree-view')} 
                onClick={() => setMobileOpen(false)}
              >
                Tree View
              </Link>
              <Link 
                to="/jwt-decoder" 
                className={getActiveStyles('/jwt-decoder', false, true)} 
                onClick={() => setMobileOpen(false)}
              >
                JWT Decoder
              </Link>
              <Link 
                to="/regex" 
                className={getActiveStyles('/regex', true)} 
                onClick={() => setMobileOpen(false)}
              >
                Regex
              </Link>
              <Link 
                to="/color-picker" 
                className={getActiveStyles('/color-picker', false, false, true)} 
                onClick={() => setMobileOpen(false)}
              >
                Color Picker
              </Link>
            </nav>
          </div>
          <style>{`
            .animate-slide-in {
              animation: slideInRight 0.25s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </header>
  );
} 