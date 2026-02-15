'use client';

import { useState } from 'react';
import { ReplyWithFriend } from '@/lib/types';
import { markReplyAsRead } from '@/app/actions/replies';
import { Mail, MailOpen, User, Lock, Globe, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface NotificationsClientProps {
  initialReplies: ReplyWithFriend[];
}

export default function NotificationsClient({ initialReplies }: NotificationsClientProps) {
  const [replies, setReplies] = useState<ReplyWithFriend[]>(initialReplies);
  const [filter, setFilter] = useState<'all' | 'private' | 'public'>('all');

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setReplies(replies.map(r => r.id === id ? { ...r, is_read: true } : r));
    await markReplyAsRead(id);
  };

  const filteredReplies = replies.filter(reply => {
    if (filter === 'private') return reply.is_private;
    if (filter === 'public') return !reply.is_private;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ข้อความตอบกลับ</h1>
          <p className="text-gray-500">จัดการข้อความทั้งหมดจากเพื่อนๆ ({replies.length})</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit">
            <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                ทั้งหมด
            </button>
            <button
                onClick={() => setFilter('public')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    filter === 'public'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <Globe className="w-4 h-4" /> สาธารณะ
            </button>
            <button
                onClick={() => setFilter('private')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    filter === 'private'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <Lock className="w-4 h-4" /> ส่วนตัว
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReplies.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-gray-300" />
                </div>
                <p>ไม่มีข้อความในหมวดหมู่นี้</p>
            </div>
        ) : (
            filteredReplies.map((reply) => (
                <div
                    key={reply.id}
                    className={`bg-white rounded-xl border p-6 transition-all hover:shadow-md ${
                        !reply.is_read ? 'border-blue-200 shadow-sm ring-1 ring-blue-50' : 'border-gray-100 shadow-sm'
                    }`}
                >
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Meta Info */}
                        <div className="md:w-64 flex-shrink-0 space-y-3">
                             <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded-md border flex items-center gap-1 w-fit ${
                                    reply.is_private
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200'
                                }`}>
                                    {reply.is_private ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                    {reply.is_private ? 'PRIVATE' : 'PUBLIC'}
                                </span>
                                {!reply.is_read && (
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> NEW
                                    </span>
                                )}
                             </div>

                             <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" /> ผู้ส่ง
                                </h3>
                                <p className="font-bold text-gray-900 truncate">
                                    {reply.sender_name || 'ไม่ระบุชื่อ'}
                                </p>
                             </div>

                             <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                                    <MailOpen className="w-3.5 h-3.5" /> จากหน้า
                                </h3>
                                {reply.friends ? (
                                    <Link
                                        href={`/admin/friends?edit=${reply.friends.id}`}
                                        className="text-blue-600 hover:underline text-sm font-medium truncate block"
                                    >
                                        {reply.friends.name}
                                    </Link>
                                ) : (
                                    <span className="text-gray-400 text-sm italic">Unknown Page</span>
                                )}
                             </div>

                             <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(reply.created_at)}
                             </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 relative group">
                            <p className="whitespace-pre-wrap text-gray-700 font-mali leading-relaxed">
                                {reply.content}
                            </p>

                            {!reply.is_read && (
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleMarkAsRead(reply.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-medium text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                    >
                                        <CheckCircle className="w-3 h-3" /> Mark as Read
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
