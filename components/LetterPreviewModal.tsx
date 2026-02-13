'use client';

import { X, Smartphone, Monitor } from 'lucide-react';
import { FriendFormData } from '@/lib/types';
import Letter from '@/components/Letter';
import { useState } from 'react';

interface LetterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FriendFormData;
}

export default function LetterPreviewModal({ isOpen, onClose, data }: LetterPreviewModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full h-full max-w-6xl flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-center mb-4 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
               Live Preview
               <span className="text-sm font-normal text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                  {isMobile ? 'Mobile View' : 'Desktop View'}
               </span>
            </h2>
            <div className="flex gap-4">
                <button
                    onClick={() => setIsMobile(!isMobile)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    {isMobile ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    {isMobile ? 'Desktop' : 'Mobile'}
                </button>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-8 h-8" />
                </button>
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 bg-[#FDFBF7] rounded-xl overflow-hidden shadow-2xl relative flex justify-center">
             <div className={`h-full overflow-y-auto w-full ${isMobile ? 'max-w-[375px] border-x border-gray-200 shadow-xl' : ''} bg-[#FDFBF7] transition-all duration-300 custom-scrollbar`}>
                <Letter
                    name={data.name || 'ตัวอย่าง ชื่อเพื่อน'}
                    content={data.content || 'ตัวอย่างเนื้อหาจดหมาย...'}
                    imageUrls={data.image_urls}
                    spotifyUrl={data.spotify_url}
                    bgmUrl={data.bgm_url}
                    isPreview={true}
                />
             </div>
         </div>
      </div>
    </div>
  );
}
