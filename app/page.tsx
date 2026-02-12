import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          The Last Goodbye
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          จดหมายลาก่อนสำหรับเพื่อนๆ ที่รักของฉัน
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            เข้าสู่ระบบ Admin
          </Link>
        </div>
        <p className="mt-12 text-sm text-gray-400">
          ถ้าคุณได้รับ QR Code จากฉัน ให้สแกนเพื่อเปิดจดหมายของคุณ 💌
        </p>
      </main>
    </div>
  );
}
