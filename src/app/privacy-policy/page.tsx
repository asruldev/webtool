import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Privacy Policy</h1>
        <p className="mb-8 text-lg text-gray-700 max-w-2xl">Kebijakan privasi untuk penggunaan aplikasi Web Tools.</p>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Data Collection</h2>
          <p className="text-gray-700">Kami tidak mengumpulkan data pribadi pengguna. Semua proses dilakukan di sisi client.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Usage</h2>
          <p className="text-gray-700">Aplikasi ini hanya digunakan untuk memformat, memvalidasi, dan mengonversi data JSON serta regex. Tidak ada data yang disimpan di server.</p>
        </section>
        <section>
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Contact</h2>
          <p className="text-gray-700">Jika ada pertanyaan, silakan hubungi <a href="mailto:talkasrul@gmail.com" className="text-blue-600 underline">talkasrul@gmail.com</a>.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
} 