import { Footer } from '@/components/Footer';

export default function RegexGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Regex Guide</h1>
        <p className="mb-8 text-lg text-gray-700 max-w-2xl">Panduan singkat tentang Regular Expression (Regex) untuk pencocokan pola string di JavaScript/TypeScript.</p>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Apa itu Regex?</h2>
          <p className="text-gray-700">Regex adalah pola yang digunakan untuk mencari dan memanipulasi string berdasarkan aturan tertentu.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Sintaks Dasar</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li><code className="bg-gray-100 px-1 rounded">.</code> : Satu karakter apa saja</li>
            <li><code className="bg-gray-100 px-1 rounded">\d</code> : Digit (0-9)</li>
            <li><code className="bg-gray-100 px-1 rounded">\w</code> : Karakter kata (a-z, A-Z, 0-9, _)</li>
            <li><code className="bg-gray-100 px-1 rounded">+</code> : Satu atau lebih</li>
            <li><code className="bg-gray-100 px-1 rounded">*</code> : Nol atau lebih</li>
            <li><code className="bg-gray-100 px-1 rounded">^</code> : Awal string</li>
            <li><code className="bg-gray-100 px-1 rounded">$</code> : Akhir string</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Contoh Pola Regex</h2>
          <pre className="bg-gray-100 rounded p-4 text-sm font-mono text-gray-800 overflow-x-auto">{`Email: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\nWebsite: ^(https?:\\/\\/)?([\\w-]+\\.)+[a-zA-Z]{2,}(\\/\\S*)?$\nNo HP Indo: ^(\\+62|62|0)8[1-9][0-9]{6,9}$`}</pre>
        </section>
        <section>
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Tips</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Selalu uji regex dengan berbagai contoh string</li>
            <li>Gunakan flag <code className="bg-gray-100 px-1 rounded">g</code>, <code className="bg-gray-100 px-1 rounded">i</code> sesuai kebutuhan</li>
            <li>Hati-hati dengan greedy vs lazy quantifier</li>
            <li>Gunakan tool visualisasi regex untuk belajar</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
} 