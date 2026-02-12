"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LetterProps {
  name: string;
  content: string;
  imageUrl?: string | null;
}

export default function Letter({ name, content, imageUrl }: LetterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen p-6 md:p-12 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-mali text-gray-800 mb-2 font-bold">
            ถึง {name}
          </h1>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto" />
        </div>

        {/* Image */}
        {imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-md border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <Image
              src={imageUrl}
              alt={`ภาพของ ${name}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Letter Content Box */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-xl border border-gray-100 relative">
          
          {/* เนื้อหาจดหมาย */}
          <div
            className="font-mali text-lg md:text-xl leading-loose text-gray-700 whitespace-pre-wrap"
            style={{ lineHeight: "2.2" }} // เพิ่มระยะบรรทัดให้อ่านง่ายเหมือนลายมือ
          >
            {content}
          </div>

          {/* --- ส่วนที่เพิ่ม: Timestamp & Signature ขวาล่าง --- */}
          <div className="mt-16 pt-6 border-t border-gray-100 flex flex-col items-end text-right">
            <p className="font-mali text-xl font-bold text-gray-800">
              จาก เจส
            </p>
            <p className="font-mali text-sm text-gray-400 mt-1">
              (ฉัททัณฑ์ เพททริ)
            </p>
          </div>
          {/* ----------------------------------------------- */}

        </div>

        {/* Footer (ข้อความปิดท้ายด้านล่างสุด) */}
        <div className="text-center mt-12 space-y-2 opacity-80">
          <p className="font-mali text-gray-500 text-sm">
            จดหมายฉบับนี้ถูกเขียนขึ้นด้วยความตั้งใจ
          </p>
          <p className="font-mali text-gray-500 text-sm">
            แด่มิตรภาพตลอด 3 ปีที่ผ่านมา 🤍
          </p>
        </div>
      </div>
    </div>
  );
}
