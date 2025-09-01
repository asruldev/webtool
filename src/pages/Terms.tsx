import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Terms and conditions for using our web tools.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose max-w-none text-black">
              <h2 className="text-black font-bold">Terms of Service</h2>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h3 className="text-black font-bold mt-2">Acceptance of Terms</h3>
              <p>By using this website, you agree to these terms of service.</p>
              
              <h3 className="text-black font-bold mt-2">Use of Service</h3>
              <p>This service is provided "as is" for educational and development purposes. We make no guarantees about accuracy or reliability.</p>
              
              <h3 className="text-black font-bold mt-2">No Warranty</h3>
              <p>The service is provided without any warranty. Use at your own risk.</p>
              
              <h3 className="text-black font-bold mt-2">Limitation of Liability</h3>
              <p>We are not liable for any damages arising from the use of this service.</p>
              
              <h3 className="text-black font-bold mt-2">Changes to Terms</h3>
              <p>We reserve the right to modify these terms at any time.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
