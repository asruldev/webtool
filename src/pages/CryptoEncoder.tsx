import { CryptoEncoder } from '@/components/CryptoEncoder';
import { SEO } from '@/components/SEO';

export default function CryptoEncoderPage() {
  return (
    <>
      <SEO 
        title="Crypto Encoder/Decoder - HMAC, AES, Hash Functions"
        description="Free online crypto encoder and decoder. Encrypt, decrypt, hash, and encode data with HMAC-SHA256, AES, Base64, and more. All processing happens in your browser."
        keywords="crypto encoder, crypto decoder, HMAC SHA256, AES encryption, Base64 encode, hash functions, cryptography tools, free crypto tools"
        url="https://webtool.asrul.dev/crypto-encoder"
      />
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Crypto Encoder/Decoder
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encrypt, decrypt, hash, and encode data with various cryptographic algorithms. 
              All processing happens locally in your browser for maximum security.
            </p>
          </div>

          {/* Main Crypto Component */}
          <CryptoEncoder />
        </div>
      </div>
    </>
  );
}
