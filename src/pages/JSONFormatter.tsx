import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JSONFormatter } from '@/components/JSONFormatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function JSONFormatterPage() {
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              JSON Formatter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Format, validate, and beautify your JSON data with our powerful online tool. 
              Free, fast, and secure JSON processing.
            </p>
          </div>

          {/* Main Formatter Component */}
          <JSONFormatter SyntaxHighlighter={SyntaxHighlighter} syntaxStyle={vscDarkPlus} />
        </div>
      </main>

      <Footer />
    </>
  );
}
