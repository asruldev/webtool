export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Web Tools
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Free online JSON formatter, validator, and converter. Format your JSON data with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">JSON Formatter</a></li>
              <li><a href="/validator" className="text-gray-600 hover:text-blue-600 transition-colors">JSON Validator</a></li>

              <li><a href="/tree-view" className="text-gray-600 hover:text-blue-600 transition-colors">Tree View</a></li>
              <li><a href="/regex" className="text-gray-600 hover:text-blue-600 transition-colors">Regex</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/json-guide" className="text-gray-600 hover:text-blue-600 transition-colors">JSON Guide</a></li>
              <li><a href="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="/regex-guide" className="text-gray-600 hover:text-blue-600 transition-colors">Regex Guide</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2025 Web Tools. Built with React and Vite.</p>
          <p className="mt-2 text-xs text-gray-400 italic">by Asrul Harahap</p>
        </div>
      </div>
    </footer>
  );
} 