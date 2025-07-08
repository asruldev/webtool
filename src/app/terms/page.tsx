import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Terms of Service</h1>
        <p className="mb-8 text-lg text-gray-700 max-w-2xl">Syarat dan ketentuan penggunaan aplikasi Web Tools.</p>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Acceptance</h2>
          <p className="text-gray-700">Dengan menggunakan aplikasi ini, Anda dianggap telah menerima syarat dan ketentuan yang berlaku.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Usage</h2>
          <p className="text-gray-700">Aplikasi ini hanya untuk penggunaan pribadi dan non-komersial. Dilarang menggunakan aplikasi untuk aktivitas ilegal.</p>
        </section>
        <section>
          <h2 className="text-2xl text-gray-700 font-semibold mb-2">Limitation of Liability</h2>
          <p className="text-gray-700">Kami tidak bertanggung jawab atas kerugian atau kerusakan akibat penggunaan aplikasi ini.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
} 