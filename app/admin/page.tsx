import Link from 'next/link';
import { getAllFriends } from '@/app/actions/admin';
import { Mail, MailOpen, Lock, Plus, Activity, Edit, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

function StatusBadge({ status }: { status: string }) {
  const styles = {
    viewed: 'bg-green-100 text-green-800',
    scanned: 'bg-yellow-100 text-yellow-800',
    locked: 'bg-gray-100 text-gray-800',
  };

  const icons = {
    viewed: <MailOpen className="w-3 h-3" />,
    scanned: <Eye className="w-3 h-3" />,
    locked: <Lock className="w-3 h-3" />,
  };

  const labels = {
    viewed: 'เปิดอ่านแล้ว',
    scanned: 'สแกนแล้ว',
    locked: 'ยังไม่เปิด',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 w-fit ${styles[status as keyof typeof styles]}`}>
      {icons[status as keyof typeof icons]}
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">ภาพรวมของจดหมายทั้งหมด</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 font-medium">จดหมายทั้งหมด</div>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 font-medium">เปิดอ่านแล้ว</div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <MailOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.viewed}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 font-medium">สแกนแล้ว (รอเปิด)</div>
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-600">{stats.scanned}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 font-medium">ยังไม่มีใครสแกน</div>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                <Lock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-600">{stats.locked}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Link
          href="/admin/friends?create=true"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มเพื่อนใหม่</span>
        </Link>
        <Link
          href="/admin/analytics"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Activity className="w-4 h-4" />
          <span>ดู Spy Logs</span>
        </Link>
      </div>

      {/* Friends Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">รายชื่อเพื่อน</h2>
        </div>
        
        {friends.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-gray-300" />
            </div>
            <p>ยังไม่มีรายชื่อเพื่อน</p>
            <Link href="/admin/friends" className="text-blue-600 hover:underline">
              เพิ่มเพื่อนใหม่
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ชื่อ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    จำนวนสแกน
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {friends.map((friend) => (
                  <tr key={friend.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{friend.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">/</span>
                        <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            {friend.slug}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={friend.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {friend.visit_count} ครั้ง
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/analytics?friend=${friend.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Logs"
                        >
                          <Activity className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/friends?edit=${friend.id}`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
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
