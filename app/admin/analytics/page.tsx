import Link from 'next/link';
import { getAllVisitLogs, getAllFriends, getVisitLogs } from '@/app/actions/admin';

export const dynamic = 'force-dynamic';

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function DeviceIcon({ type }: { type: string | null }) {
  if (type === 'mobile') {
    return <span title="Mobile">📱</span>;
  } else if (type === 'tablet') {
    return <span title="Tablet">📲</span>;
  }
  return <span title="Desktop">💻</span>;
}

function getBrowserEmoji(browser: string | null) {
  if (!browser) return '🌐';
  const lower = browser.toLowerCase();
  if (lower.includes('line')) return '💬';
  if (lower.includes('instagram')) return '📷';
  if (lower.includes('facebook')) return '👤';
  if (lower.includes('twitter')) return '🐦';
  if (lower.includes('chrome')) return '🌐';
  if (lower.includes('safari')) return '🧭';
  if (lower.includes('firefox')) return '🦊';
  return '🌐';
}

interface PageProps {
  searchParams: Promise<{ friend?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const friendId = params.friend;
  
  const friends = await getAllFriends();
  
  let logs;
  let selectedFriend = null;
  
  if (friendId) {
    logs = await getVisitLogs(friendId);
    selectedFriend = friends.find(f => f.id === friendId);
  } else {
    const allLogs = await getAllVisitLogs();
    logs = allLogs;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">🕵️ Spy Logs / Analytics</h1>
        <p className="text-gray-600">
          ดูว่าใครสแกน QR Code ของคุณบ้าง เมื่อไหร่ และใช้อุปกรณ์อะไร
        </p>
      </div>

      {/* Filter by Friend */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          กรองตามเพื่อน:
        </label>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/analytics"
            className={`px-3 py-1 rounded-full text-sm ${
              !friendId ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ทั้งหมด
          </Link>
          {friends.map((friend) => (
            <Link
              key={friend.id}
              href={`/admin/analytics?friend=${friend.id}`}
              className={`px-3 py-1 rounded-full text-sm ${
                friendId === friend.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {friend.name}
            </Link>
          ))}
        </div>
      </div>

      {selectedFriend && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            กำลังดู logs ของ <strong>{selectedFriend.name}</strong> ({selectedFriend.visit_count} ครั้ง)
          </p>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            📝 Visit Timeline ({logs.length} รายการ)
          </h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            ยังไม่มีการสแกนใดๆ
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เวลา
                  </th>
                  {!friendId && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เพื่อน
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อุปกรณ์
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Browser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(log.visited_at)}
                      </div>
                    </td>
                    {!friendId && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {(log as unknown as { friends: { name: string } }).friends?.name || 'Unknown'}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <DeviceIcon type={log.device_type} />
                        <span className="text-sm text-gray-700">
                          {log.device_model || log.device_type || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{getBrowserEmoji(log.browser)}</span>
                        <span className="text-sm text-gray-700">{log.browser || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{log.os || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {log.ip_address || 'Unknown'}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-3">💡 เคล็ดลับในการอ่าน Logs</h3>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>
            <strong>💬 Line / 📷 Instagram:</strong> หมายถึงเพื่อนสแกนผ่านแอป Line/IG โดยตรง ไม่ได้เปิด browser ภายนอก
          </li>
          <li>
            <strong>📱 Mobile vs 💻 Desktop:</strong> ถ้าขึ้น Mobile แสดงว่าสแกนผ่านมือถือ
          </li>
          <li>
            <strong>IP Address:</strong> ถ้าเพื่อนใช้ 4G/5G IP อาจเปลี่ยนไปเรื่อยๆ ถ้าใช้ Wi-Fi บ้านจะนิ่งกว่า
          </li>
          <li>
            <strong>เวลา:</strong> แสดงตามเวลาประเทศไทย (GMT+7)
          </li>
        </ul>
      </div>
    </div>
  );
}
