'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createFriend, updateFriend, deleteFriend, getFriendById } from '@/app/actions/admin';
import { Friend, FriendFormData } from '@/lib/types';
import { Plus, Trash2, Lock, User, FileText, Image as ImageIcon, Music, Edit, CheckCircle, X, Calendar, Share2, Download, Eye } from 'lucide-react';
import ShareModal from './ShareModal';
import { BGM_LIST } from '@/lib/bgm-config';
import LetterPreviewModal from '@/components/LetterPreviewModal';
import RichTextEditor from '@/components/RichTextEditor';

interface FriendFormProps {
  friend?: Friend | null;
  onClose: () => void;
  onSuccess: () => void;
}

function FriendForm({ friend, onClose, onSuccess }: FriendFormProps) {
  // Helper to format date for input (YYYY-MM-DDThh:mm)
  const toDateTimeLocal = (dateStr?: string | null) => {
    if (!dateStr) return '2026-02-20T21:00'; // Default target
    try {
      const date = new Date(dateStr);
      // Adjust for timezone offset to show correct local time in input
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().slice(0, 16);
    } catch {
      return '2026-02-20T21:00';
    }
  };

  const [formData, setFormData] = useState<FriendFormData>({
    name: friend?.name || '',
    slug: friend?.slug || '',
    passcode: friend?.passcode || '',
    content: friend?.content || '',
    image_urls: friend?.image_urls || (friend?.image_url ? [friend.image_url] : []),
    spotify_url: friend?.spotify_url || '',
    bgm_url: friend?.bgm_url || '',
    unlock_date: friend?.unlock_date || undefined,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [unlockDateInput, setUnlockDateInput] = useState(toDateTimeLocal(friend?.unlock_date));
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!friend;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Convert local input time to ISO string (UTC)
      const isoUnlockDate = new Date(unlockDateInput).toISOString();
      const submissionData = { ...formData, unlock_date: isoUnlockDate };

      if (isEdit) {
        await updateFriend(friend.id, submissionData);
      } else {
        await createFriend(submissionData);
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

  const addImageUrl = () => {
    if (newImageUrl) {
        setFormData({
            ...formData,
            image_urls: [...(formData.image_urls || []), newImageUrl]
        });
        setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    const newUrls = [...(formData.image_urls || [])];
    newUrls.splice(index, 1);
    setFormData({ ...formData, image_urls: newUrls });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {isEdit ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isEdit ? 'แก้ไขข้อมูลเพื่อน' : 'เพิ่มเพื่อนใหม่'}
            </h2>
            <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors border border-gray-200"
            >
                <Eye className="w-4 h-4" /> Live Preview
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <User className="w-4 h-4" /> ชื่อเพื่อน *
                </label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4" /> รหัสผ่าน 4 หลัก *
                </label>
                <input
                type="text"
                value={formData.passcode}
                onChange={(e) => setFormData({ ...formData, passcode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="1234"
                maxLength={4}
                required
                />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> วันที่เปิดอ่านได้ (Unlock Date)
             </label>
             <input
                type="datetime-local"
                value={unlockDateInput}
                onChange={(e) => setUnlockDateInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
             />
             <p className="text-xs text-gray-500 mt-1">
                เพื่อนจะสามารถเปิดอ่านจดหมายได้หลังจากเวลานี้
             </p>
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="example: john-doe"
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Auto
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              URL: yourdomain.com/{formData.slug || 'slug'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> รูปภาพแห่งความทรงจำ
            </label>

            <div className="space-y-3 mb-3">
                {formData.image_urls?.map((url, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                        <div className="flex-1 flex gap-2 items-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <div className="w-8 h-8 relative rounded overflow-hidden bg-gray-200 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt="" className="object-cover w-full h-full" />
                            </div>
                            <span className="text-sm text-gray-600 truncate flex-1">{url}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                />
                <button
                    type="button"
                    onClick={addImageUrl}
                    disabled={!newImageUrl}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Music className="w-4 h-4" /> Spotify Link (Optional)
            </label>
            <input
                type="url"
                value={formData.spotify_url || ''}
                onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="https://open.spotify.com/track/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Music className="w-4 h-4" /> Background Music
            </label>
            <select
                value={BGM_LIST.find(b => b.url === formData.bgm_url)?.id || 'none'}
                onChange={(e) => {
                    const selected = BGM_LIST.find(b => b.id === e.target.value);
                    setFormData({ ...formData, bgm_url: selected?.url || '' });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all appearance-none bg-white"
            >
                {BGM_LIST.map((bgm) => (
                    <option key={bgm.id} value={bgm.id}>
                        {bgm.name}
                    </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" /> เนื้อหาจดหมาย (Rich Text / Markdown)
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="เขียนจดหมายของคุณที่นี่..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors shadow-lg shadow-gray-200"
            >
              {isLoading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มเพื่อน'}
            </button>
          </div>
        </form>
      </div>

      {showPreview && (
        <LetterPreviewModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            data={formData}
        />
      )}
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
  const createMode = searchParams.get('create');

  const [friends, setFriends] = useState(initialFriends);
  const [showForm, setShowForm] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [shareFriend, setShareFriend] = useState<Friend | null>(null);

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
    } else if (createMode) {
        setTimeout(() => {
            setEditingFriend(null);
            setShowForm(true);
        }, 0);
    }
  }, [editId, createMode]);

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

  const exportToCSV = () => {
    const headers = ['Name', 'Slug', 'Passcode', 'Unlock Date', 'URL'];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    const csvContent = [
      headers.join(','),
      ...friends.map(friend => [
        `"${friend.name}"`,
        `"${friend.slug}"`,
        `"${friend.passcode}"`,
        `"${friend.unlock_date || ''}"`,
        `"${siteUrl}/${friend.slug}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `friends_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการเพื่อน</h1>
          <p className="text-gray-500">เพิ่ม แก้ไข หรือลบข้อมูลเพื่อน ({friends.length} คน)</p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
                <Download className="w-5 h-5" /> Export CSV
            </button>
            <button
            onClick={() => {
                setEditingFriend(null);
                setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
            <Plus className="w-5 h-5" /> เพิ่มเพื่อนใหม่
            </button>
        </div>
      </div>

      {/* Friends Grid */}
      {friends.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-300" />
            </div>
            <p>ยังไม่มีรายชื่อเพื่อน กดปุ่ม &quot;เพิ่มเพื่อนใหม่&quot; เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {friends.map((friend) => (
            <div key={friend.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{friend.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">/{friend.slug}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium ${
                    friend.is_viewed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {friend.is_viewed ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {friend.is_viewed ? 'อ่านแล้ว' : 'ยังไม่เปิด'}
                    </span>
                    <button
                        onClick={() => setShareFriend(friend)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share / Print Card"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-gray-50 p-2 rounded-lg">
                <Lock className="w-4 h-4 text-gray-400" />
                <span>Passcode:</span>
                <code className="font-mono text-gray-900 font-bold">{friend.passcode}</code>
              </div>

              <div className="flex gap-2 border-t border-gray-50 pt-4">
                <button
                  onClick={() => handleEdit(friend)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Edit className="w-4 h-4" /> แก้ไข
                </button>
                {deleteConfirm === friend.id ? (
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={() => handleDelete(friend.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                    >
                      ยืนยัน
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(friend.id)}
                    className="px-3 py-2 text-sm border border-red-100 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
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

      {/* Share Modal */}
      {shareFriend && (
        <ShareModal
            friend={shareFriend}
            onClose={() => setShareFriend(null)}
        />
      )}
    </div>
  );
}
