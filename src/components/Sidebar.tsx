import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  // Clear search when sidebar is closed
  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  // Function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Function to get active styles
  const getActiveStyles = (path: string, isRegex = false, isJWT = false, isColor = false, isString = false, isCrypto = false) => {
    const active = isActive(path);
    const baseStyles = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative";
    const activeStyles = isRegex 
      ? "bg-pink-50 text-pink-600 font-semibold border-l-4 border-pink-600 shadow-sm" 
      : isJWT
      ? "bg-purple-50 text-purple-600 font-semibold border-l-4 border-purple-600 shadow-sm"
      : isColor
      ? "bg-green-50 text-green-600 font-semibold border-l-4 border-green-600 shadow-sm"
      : isString
      ? "bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-600 shadow-sm"
      : isCrypto
      ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600 shadow-sm"
      : "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600 shadow-sm";
    const inactiveStyles = "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm";
    
    return `${baseStyles} ${active ? activeStyles : inactiveStyles}`;
  };

  // Function to get icon
  const getIcon = (path: string) => {
    switch (path) {
      case '/':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case '/validator':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case '/tree-view':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
        );
      case '/jwt-decoder':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        );
      case '/regex':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case '/color-picker':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      case '/string-checker':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case '/crypto-encoder':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  const menuItems = [
    { path: '/', label: 'JSON Formatter', keywords: ['json', 'formatter', 'beautify', 'minify'] },
    { path: '/validator', label: 'JSON Validator', keywords: ['json', 'validator', 'validate', 'check', 'syntax'] },
    { path: '/tree-view', label: 'Tree View', keywords: ['json', 'tree', 'view', 'visualize', 'structure'] },
    { path: '/jwt-decoder', label: 'JWT Decoder', keywords: ['jwt', 'decoder', 'token', 'decode', 'verify'], isJWT: true },
    { path: '/regex', label: 'Regex Tester', keywords: ['regex', 'regular', 'expression', 'test', 'pattern'], isRegex: true },
    { path: '/color-picker', label: 'Color Picker', keywords: ['color', 'picker', 'hex', 'rgb', 'hsl', 'converter'], isColor: true },
    { path: '/string-checker', label: 'String Checker', keywords: ['string', 'checker', 'compare', 'diff', 'text'], isString: true },
    { path: '/crypto-encoder', label: 'Crypto Encoder', keywords: ['crypto', 'encoder', 'decoder', 'hmac', 'sha256', 'aes', 'encrypt', 'decrypt'], isCrypto: true },
  ];

  // Filter menu items based on search term
  const filteredMenuItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return menuItems;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return menuItems.filter(item => 
      item.label.toLowerCase().includes(searchLower) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  }, [searchTerm]);

  // Function to highlight search terms in text
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) {
      return text;
    }
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="w-64 h-full flex flex-col bg-white border-r border-gray-200">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">          
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-sm text-gray-900 shadow-sm transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="search-clear-btn absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors duration-200"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getActiveStyles(item.path, item.isRegex, item.isJWT, item.isColor, item.isString, item.isCrypto)}
                  onClick={handleClose}
                >
                  {getIcon(item.path)}
                  <span className="text-sm font-medium">
                    {highlightText(item.label, searchTerm)}
                  </span>
                </Link>
              ))
            ) : (
              <div className="search-no-results px-4 py-8 text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No tools found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="text-xs text-gray-500 text-center">
            <p className="font-medium">© 2025 Web Tools</p>
            <div className="mt-3 space-y-2">
              <Link 
                to="/privacy-policy" 
                className="block hover:text-blue-600 transition-colors duration-200 hover:underline"
                onClick={onClose}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="block hover:text-blue-600 transition-colors duration-200 hover:underline"
                onClick={onClose}
              >
                Terms of Service
              </Link>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-400 italic">by Asrul Harahap</p>
            </div>
          </div>
        </div>
    </div>
  );
}
