import Link from 'next/link';
import { getAllFriends } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';

function StatusBadge({ status }: { status: string }) {
  const styles = {
    viewed: 'bg-green-100 text-green-800',
    scanned: 'bg-yellow-100 text-yellow-800',
    locked: 'bg-gray-100 text-gray-800',
  };

  const labels = {
    viewed: '✅ เปิดอ่านแล้ว',
    scanned: '👀 สแกนแล้ว แต่ยังไม่เปิด',
    locked: '🔒 ยังไม่มีใครสแกน',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}

export default async function AdminDashboard() {
  const friends = await getAllFriends();

  const stats = {
    total: friends.length,
    viewed: friends.filter(f => f.status === 'viewed').length,
    scanned: friends.filter(f => f.status === 'scanned').length,
    locked: friends.filter(f => f.status === 'locked').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">ภาพรวมของจดหมายทั้งหมด</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500">จดหมายทั้งหมด</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-green-600">{stats.viewed}</div>
          <div className="text-sm text-gray-500">เปิดอ่านแล้ว</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-yellow-600">{stats.scanned}</div>
          <div className="text-sm text-gray-500">สแกนแล้ว (รอเปิด)</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-gray-600">{stats.locked}</div>
          <div className="text-sm text-gray-500">ยังไม่มีใครสแกน</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Link
          href="/admin/friends"
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ➕ เพิ่มเพื่อนใหม่
        </Link>
        <Link
          href="/admin/analytics"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          📊 ดู Spy Logs
        </Link>
      </div>

      {/* Friends Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">รายชื่อเพื่อน</h2>
        </div>
        
        {friends.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            ยังไม่มีรายชื่อเพื่อน{' '}
            <Link href="/admin/friends" className="text-blue-600 hover:underline">
              เพิ่มเพื่อนใหม่
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวนสแกน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {friends.map((friend) => (
                  <tr key={friend.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{friend.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        /{friend.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={friend.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {friend.visit_count} ครั้ง
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/analytics?friend=${friend.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          📊 Logs
                        </Link>
                        <Link
                          href={`/admin/friends?edit=${friend.id}`}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ✏️ แก้ไข
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
