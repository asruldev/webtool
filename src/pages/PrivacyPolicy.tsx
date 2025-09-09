
export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How we handle your data and privacy.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-black">
            <div className="prose max-w-none">
              <h2 className="text-black font-bold">Privacy Policy</h2>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h3 className="text-black font-bold mt-2">Information We Collect</h3>
              <p>We do not collect, store, or transmit any personal data. All processing is done locally in your browser.</p>
              
              <h3 className="text-black font-bold mt-2">How We Use Information</h3>
              <p>Since we don't collect any data, there's no information to use or share.</p>
              
              <h3 className="text-black font-bold mt-2">Data Security</h3>
              <p>Your data never leaves your device. All processing happens locally in your browser.</p>
              
              <h3 className="text-black font-bold mt-2">Contact</h3>
              <p>If you have any questions about this privacy policy, please contact us.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
