import { StringChecker } from '@/components/StringChecker';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export default function StringCheckerPage() {
  return (
    <>
      <SEO 
        title="String Checker - Compare & Analyze Text Differences"
        description="Free online string comparison tool. Compare two strings, highlight differences, and analyze text statistics including character count, word count, and reading time."
        keywords="string checker, text comparison, string diff, text analyzer, character count, word count, reading time, text statistics"
        url="https://webtool.asrul.dev/string-checker"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              String Checker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compare two strings, highlight differences, and analyze comprehensive text statistics. 
              Perfect for content review and text analysis.
            </p>
          </div>

          {/* Main String Checker Component */}
          <StringChecker />
        </div>
      </main>

      <Footer />
    </>
  );
}
