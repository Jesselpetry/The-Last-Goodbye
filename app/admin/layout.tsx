import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-semibold text-gray-800">
                📝 Admin Panel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/friends"
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                จัดการเพื่อน
              </Link>
              <Link
                href="/admin/analytics"
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
              >
                📊 Analytics
              </Link>
              <Link
                href="/"
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ← กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
