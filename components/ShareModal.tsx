"use client";

import { useState } from 'react';
import QRCode from "react-qr-code";
import { Friend } from '@/lib/types';
import { X, Printer } from 'lucide-react';

interface ShareModalProps {
  friend: Friend;
  onClose: () => void;
}

export default function ShareModal({ friend, onClose }: ShareModalProps) {
  const [printSize, setPrintSize] = useState<'a4' | '4x6'>('4x6');

  // Use window.location.origin as fallback on client side if env var is missing
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const fullUrl = `${siteUrl}/${friend.slug}`;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "20 ก.พ. 2026 เวลา 21:00 น."; // Default fallback
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + " น.";
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:p-0 print:bg-white print:absolute print:inset-0">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Hide the modal close button and other UI elements */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden relative print-area">
        {/* Header (No Print) */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center no-print">
          <h3 className="font-bold text-gray-900">Digital Card</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content (Printable) */}
        <div className={`p-8 flex flex-col items-center text-center space-y-6 ${printSize === '4x6' ? 'aspect-[2/3]' : ''} bg-white`}>

            <div>
                <h2 className="text-3xl font-bold font-mali text-gray-900 mb-1">{friend.name}</h2>
                <p className="text-gray-500 font-mali text-sm">The Last Goodbye</p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <QRCode value={fullUrl} size={180} />
            </div>

            <div className="space-y-1">
                <p className="text-sm text-gray-500 font-mono">SCAN TO OPEN</p>
                <p className="font-bold text-lg text-gray-800 break-all px-4 leading-tight">
                    {fullUrl.replace(/^https?:\/\//, '')}
                </p>
            </div>

            <div className="w-full border-t border-gray-100 pt-6">
                <div className="flex justify-center gap-8 text-left">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">PASSCODE</p>
                        <p className="text-2xl font-bold font-mono text-gray-900 tracking-widest">{friend.passcode}</p>
                    </div>
                </div>

                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-mali">
                        เปิดอ่านได้วันที่ {formatDate(friend.unlock_date)}
                    </p>
                </div>
            </div>

        </div>

        {/* Footer Actions (No Print) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3 no-print">
            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Print Size:</span>
                <select
                    value={printSize}
                    onChange={(e) => setPrintSize(e.target.value as 'a4' | '4x6')}
                    className="bg-white border border-gray-300 rounded px-2 py-1"
                >
                    <option value="4x6">4x6 Photo (Best)</option>
                    <option value="a4">A4 Full Page</option>
                </select>
            </div>
            <button
                onClick={handlePrint}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
                <Printer className="w-5 h-5" /> Print / Save PDF
            </button>
        </div>
      </div>
    </div>
  );
}
