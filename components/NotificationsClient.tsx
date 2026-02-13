'use client';

import { useState } from 'react';
import { ReplyWithFriend } from '@/lib/types';
import { markReplyAsRead } from '@/app/actions/replies';
import { CheckCircle, MessageSquare, User, Clock, Check } from 'lucide-react';
import Link from 'next/link';

interface NotificationsClientProps {
  initialReplies: ReplyWithFriend[];
}

export default function NotificationsClient({ initialReplies }: NotificationsClientProps) {
  const [replies, setReplies] = useState<ReplyWithFriend[]>(initialReplies);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    setLoadingId(id);
    const success = await markReplyAsRead(id);
    if (success) {
      setReplies(prev => prev.map(r => r.id === id ? { ...r, is_read: true } : r));
    }
    setLoadingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: '2-digit',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = replies.filter(r => !r.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-gray-900" />
            ข้อความตอบกลับ
          </h1>
          <p className="text-gray-500 mt-1">
            ทั้งหมด {replies.length} ข้อความ ({unreadCount} ยังไม่อ่าน)
          </p>
        </div>
      </div>

      {replies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <p>ยังไม่มีข้อความตอบกลับจากเพื่อนๆ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className={`bg-white rounded-2xl p-6 transition-all border ${
                reply.is_read ? 'border-gray-100 shadow-sm' : 'border-blue-100 shadow-md ring-1 ring-blue-50'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar / Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    reply.is_read ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {reply.sender_name || reply.friends?.name || 'ไม่ระบุชื่อ'}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                         ถึง: {reply.friends?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(reply.created_at)}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 font-mali leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                     <Link
                        href={`/admin/friends?edit=${reply.friend_id}`}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                     >
                        ดูข้อมูลเพื่อน
                     </Link>
                     {!reply.is_read ? (
                        <button
                          onClick={() => handleMarkAsRead(reply.id)}
                          disabled={loadingId === reply.id}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                        >
                          {loadingId === reply.id ? 'Loading...' : (
                             <>
                               <Check className="w-4 h-4" /> ทำเครื่องหมายว่าอ่านแล้ว
                             </>
                          )}
                        </button>
                     ) : (
                        <span className="flex items-center gap-1 text-sm text-green-600 font-medium px-3 py-1 bg-green-50 rounded-lg">
                           <CheckCircle className="w-4 h-4" /> อ่านแล้ว
                        </span>
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
