import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Web Tools
              </span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
              Free online JSON formatter, validator, JWT decoder, and regex tester. Format your data with ease and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Tools</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">JSON Formatter</Link></li>
              <li><Link to="/validator" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">JSON Validator</Link></li>
              <li><Link to="/tree-view" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">Tree View</Link></li>
              <li><Link to="/jwt-decoder" className="text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:underline font-medium">JWT Decoder</Link></li>
              <li><Link to="/regex" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">Regex</Link></li>
              <li><Link to="/color-picker" className="text-gray-600 hover:text-green-600 transition-colors duration-200 hover:underline font-medium">Color Picker</Link></li>
              <li><Link to="/string-checker" className="text-gray-600 hover:text-orange-600 transition-colors duration-200 hover:underline font-medium">String Checker</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/json-guide" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">JSON Guide</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">Terms of Service</Link></li>
              <li><Link to="/regex-guide" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:underline font-medium">Regex Guide</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-gray-600 font-medium">&copy; 2025 Web Tools. Built with React and Vite.</p>
              <p className="mt-1 text-sm text-gray-500 italic">by Asrul Harahap</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">Made with ❤️ for developers</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 