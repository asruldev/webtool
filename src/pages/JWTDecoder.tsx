import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JWTDecoder } from '@/components/JWTDecoder';
import { SEO } from '@/components/SEO';

export default function JWTDecoderPage() {
  return (
    <>
      <SEO 
        title="JWT Decoder - Decode and Verify JSON Web Tokens"
        description="Free online JWT decoder and encoder. Decode, verify, and generate JSON Web Tokens with our secure browser-based tool. No server-side processing."
        keywords="JWT decoder, JWT encoder, JSON Web Token, JWT debugger, JWT validator, JWT generator, free JWT tools"
        url="https://webtool.asrul.dev/jwt-decoder"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              JWT Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Decode, verify, and generate JSON Web Tokens with our secure browser-based tool. 
              All processing happens locally in your browser for maximum security.
            </p>
          </div>

          {/* Main JWT Component */}
          <JWTDecoder />
        </div>
      </main>

      <Footer />
    </>
  );
}
