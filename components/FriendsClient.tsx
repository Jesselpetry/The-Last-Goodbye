'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createFriend, updateFriend, deleteFriend, getFriendById } from '@/app/actions/admin';
import { Friend, FriendFormData } from '@/lib/types';

interface FriendFormProps {
  friend?: Friend | null;
  onClose: () => void;
  onSuccess: () => void;
}

function FriendForm({ friend, onClose, onSuccess }: FriendFormProps) {
  const [formData, setFormData] = useState<FriendFormData>({
    name: friend?.name || '',
    slug: friend?.slug || '',
    passcode: friend?.passcode || '',
    content: friend?.content || '',
    image_url: friend?.image_url || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!friend;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isEdit) {
        await updateFriend(friend.id, formData);
      } else {
        await createFriend(formData);
      }
      onSuccess();
    } catch (err) {
      console.error('Error creating/updating friend:', err);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {isEdit ? '✏️ แก้ไขข้อมูลเพื่อน' : '➕ เพิ่มเพื่อนใหม่'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อเพื่อน *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="example: john-doe"
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                สร้างอัตโนมัติ
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              URL จะเป็น: yourdomain.com/{formData.slug || 'slug'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่าน 4 หลัก *
            </label>
            <input
              type="text"
              value={formData.passcode}
              onChange={(e) => setFormData({ ...formData, passcode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="1234"
              maxLength={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL รูปภาพ (ไม่บังคับ)
            </label>
            <input
              type="url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เนื้อหาจดหมาย
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent font-mali"
              rows={10}
              placeholder="เขียนจดหมายของคุณที่นี่..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {isLoading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มเพื่อน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FriendsClientProps {
  initialFriends: Friend[];
}

export default function FriendsClient({ initialFriends }: FriendsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [friends, setFriends] = useState(initialFriends);
  const [showForm, setShowForm] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      const loadFriend = async () => {
        const friend = await getFriendById(editId);
        if (friend) {
          setEditingFriend(friend);
          setShowForm(true);
        }
      };
      loadFriend();
    }
  }, [editId]);

  const handleSuccess = () => {
    setShowForm(false);
    setEditingFriend(null);
    router.push('/admin/friends');
    router.refresh();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingFriend(null);
    router.push('/admin/friends');
  };

  const handleDelete = async (id: string) => {
    const success = await deleteFriend(id);
    if (success) {
      setFriends(friends.filter(f => f.id !== id));
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (friend: Friend) => {
    setEditingFriend(friend);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">จัดการเพื่อน</h1>
          <p className="text-gray-600">เพิ่ม แก้ไข หรือลบข้อมูลเพื่อน</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          ➕ เพิ่มเพื่อนใหม่
        </button>
      </div>

      {/* Friends Grid */}
      {friends.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          ยังไม่มีรายชื่อเพื่อน กดปุ่ม &quot;เพิ่มเพื่อนใหม่&quot; เพื่อเริ่มต้น
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div key={friend.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{friend.name}</h3>
                  <code className="text-xs text-gray-500">/{friend.slug}</code>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  friend.is_viewed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {friend.is_viewed ? '✅ อ่านแล้ว' : '🔒 ยังไม่เปิด'}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                รหัสผ่าน: <code className="bg-gray-100 px-2 py-0.5 rounded">{friend.passcode}</code>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(friend)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ✏️ แก้ไข
                </button>
                {deleteConfirm === friend.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(friend.id)}
                      className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      ยืนยัน
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(friend.id)}
                    className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    🗑️ ลบ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <FriendForm
          friend={editingFriend}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
