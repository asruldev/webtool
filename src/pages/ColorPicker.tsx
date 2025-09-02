import { ColorPicker } from '@/components/ColorPicker';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export default function ColorPickerPage() {
  return (
    <>
      <SEO 
        title="Color Picker - Free Online Color Tool & Converter"
        description="Free online color picker and converter. Pick colors, convert between HEX, RGB, HSL formats, and generate color palettes. No registration required."
        keywords="color picker, color converter, hex to rgb, rgb to hex, hsl converter, color palette, free color tools"
        url="https://webtool.asrul.dev/color-picker"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Color Picker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pick, convert, and copy colors in various formats. Generate color palettes and explore color variations.
            </p>
          </div>

          {/* Main Color Picker Component */}
          <ColorPicker />
        </div>
      </main>

      <Footer />
    </>
  );
}
