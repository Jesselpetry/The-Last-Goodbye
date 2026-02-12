"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

interface LetterProps {
  name: string;
  content: string;
  imageUrl?: string | null;
  createdAt?: string; // รับค่าวันที่มาด้วย (ถ้ามี)
}

export default function Letter({
  name,
  content,
  imageUrl,
  createdAt,
}: LetterProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    // เปลี่ยน background เป็นสีครีมอ่อนๆ ให้เข้ากับธีมกระดาษ/ซองจดหมาย
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {/* --- STATE 1: ยังไม่เปิด (แสดงซองจดหมาย) --- */}
        {!isOpened ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 100,
              scale: 0.8,
              transition: { duration: 0.5 },
            }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpened(true)} // คลิกเพื่อเปิด
            className="cursor-pointer z-10 relative group"
          >
            {/* รูปซองจดหมาย (ใช้ CSS วาดง่ายๆ หรือแทนด้วย SVG สวยๆ ก็ได้) */}
            <div className="w-[320px] h-[220px] bg-[#F2E8C9] border-2 border-[#E6D5A7] rounded-lg shadow-xl relative flex flex-col items-center justify-center overflow-hidden">
              {/* ลายเส้นฝาซอง */}
              <div className="absolute top-0 left-0 w-full h-0 border-l-[160px] border-r-[160px] border-t-[110px] border-l-transparent border-r-transparent border-t-[#EBDCB5] drop-shadow-sm origin-top z-20 group-hover:rotate-x-12 transition-transform"></div>

              {/* สแตมป์หัวใจ */}
              <div className="absolute top-24 z-30 bg-red-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm rotate-12 text-xl">
                💌
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-12">
              <p className="font-mali text-black text-lg animate-pulse">
              แตะเพื่อเปิดจดหมายถึง
              </p>
              <p className="font-mali text-gray-600 text-lg animate-pulse">
                {name}
              </p>
            </div>
          </motion.div>
        ) : (
          /* --- STATE 2: เปิดแล้ว (แสดงเนื้อหาตาม Reference เดิม) --- */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto w-full z-10 relative"
          >
            {/* Header - เด้งลงมา */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center mb-8 mt-8"
            >
              <h1 className="text-3xl md:text-4xl font-mali text-gray-800 mb-2 font-bold">
                ถึง {name}
              </h1>
              <div className="w-16 h-0.5 bg-gray-300 mx-auto" />
            </motion.div>

            {/* Image - เด้งป๊อปอัพขึ้นมาเหมือนโพลารอยด์ */}
            {imageUrl && (
              <motion.div
                initial={{ scale: 0, rotate: -5 }}
                animate={{ scale: 1, rotate: 2 }}
                transition={{
                  delay: 0.7,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="mb-8 rounded-xl overflow-hidden shadow-lg border-[6px] border-white w-full max-w-xs mx-auto aspect-[4/3] sm:aspect-square relative bg-gray-100"
              >
                <Image
                  src={imageUrl}
                  alt={`ภาพของ ${name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 384px"
                  priority
                />
              </motion.div>
            )}

            {/* Letter Content Box - สไลด์ขึ้นมาจากข้างล่าง */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-md border border-gray-50 relative"
            >
              {/* เนื้อหาจดหมาย */}
              <div
                className="font-mali text-lg md:text-xl leading-loose text-gray-700 whitespace-pre-wrap"
                style={{ lineHeight: "2.2" }}
              >
                {content}
              </div>

              {/* Signature */}
              <div className="mt-16 pt-6 border-t border-gray-100 flex flex-col items-end text-right">
                <p className="font-mali text-xl font-bold text-gray-800">
                  จาก เจส
                </p>
                <p className="font-mali text-sm text-gray-400 mt-1">
                  (ฉัททัณฑ์ เพททริ)
                </p>
                {/* ถ้าอยากใส่วันที่ที่มุมนี้ด้วย ก็เอา comment ออกได้เลยครับ */}
                {/* {createdAt && (
                    <p className="font-mali text-xs text-gray-300 mt-1">{createdAt}</p>
                )} */}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center mt-12 space-y-2 opacity-80"
            >
              <p className="font-mali text-gray-500 text-sm">
                จดหมายฉบับนี้ถูกเขียนขึ้นด้วยความตั้งใจ
              </p>
              <p className="font-mali text-gray-500 text-sm">
                แด่มิตรภาพตลอด 3 ปีที่ผ่านมา 🤍
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
