import { Footer } from '@/components/Footer';

export default function JSONGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">JSON Guide</h1>
        <p className="mb-8 text-lg text-gray-700 max-w-2xl">Panduan singkat tentang JSON (JavaScript Object Notation), format data ringan yang banyak digunakan untuk pertukaran data.</p>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Apa itu JSON?</h2>
          <p className="text-gray-700">JSON adalah format teks untuk merepresentasikan data terstruktur berdasarkan pasangan key-value. JSON mudah dibaca manusia dan diproses oleh mesin.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Sintaks JSON</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Objek: <code className="bg-gray-100 px-1 rounded">{'{"key": "value"}'}</code></li>
            <li>Array: <code className="bg-gray-100 px-1 rounded">[1, 2, 3]</code></li>
            <li>String harus diapit tanda kutip ganda</li>
            <li>Key harus berupa string</li>
            <li>Tidak boleh ada trailing comma</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Contoh JSON</h2>
          <pre className="bg-gray-100 rounded p-4 text-sm font-mono text-gray-800 overflow-x-auto">{`{
  "name": "Budi",
  "age": 25,
  "hobbies": ["membaca", "coding"]
}`}</pre>
        </section>
        <section>
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Best Practices</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Gunakan struktur yang konsisten</li>
            <li>Selalu validasi JSON sebelum digunakan</li>
            <li>Gunakan key yang deskriptif</li>
            <li>Hindari data duplikat</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
} 