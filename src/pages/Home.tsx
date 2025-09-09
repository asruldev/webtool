
import { JSONFormatter } from '@/components/JSONFormatter';
import { SEO } from '@/components/SEO';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'prismjs/components/prism-json';

export default function Home() {
  return (
    <>
      <SEO 
        title="JSON Formatter - Free Online JSON Beautifier & Minifier"
        description="Free online JSON formatter and beautifier. Format, validate, and minify your JSON data with our powerful tool. No registration required, instant results."
        keywords="JSON formatter, JSON beautifier, JSON minifier, format JSON, beautify JSON, JSON validator, free JSON tools"
        url="https://webtool.asrul.dev/"
      />
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              JSON Formatter
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Format, validate, and beautify your JSON data with our powerful online tool. 
              Free, fast, and secure JSON processing.
            </p>
          </div>

          {/* Main Formatter Component */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <JSONFormatter SyntaxHighlighter={SyntaxHighlighter} syntaxStyle={vscDarkPlus} />
          </div>
        </div>
      </div>
    </>
  );
}
