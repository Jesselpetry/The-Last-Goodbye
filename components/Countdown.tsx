'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
  recipientName: string; // เพิ่ม Prop รับชื่อเพื่อน
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default function Countdown({ targetDate, onComplete, recipientName }: CountdownProps) {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        setIsComplete(true);
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formattedDate = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(targetDate);

  if (!isClient || isComplete) return null;

  return (
    // จัดกลางหน้าจอเป๊ะๆ
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-8 fixed inset-0 z-50">
      
      <div className="flex flex-col items-center max-w-4xl w-full">
        {/* ส่วนหัวแสดงชื่อและข้อความ */}
        <div className="text-center mb-10 md:mb-14 space-y-2">
          <h1 className="text-2xl md:text-4xl font-mali font-bold text-gray-800 drop-shadow-sm">
            จดหมายถึง {recipientName} 💌
          </h1>
          <p className="text-lg md:text-2xl font-mali text-gray-600 animate-pulse">
            ⏳ จะเปิดอ่านได้ในอีก...
          </p>
        </div>
        
        {/* Grid ของเวลานับถอยหลัง */}
        <div className="grid grid-cols-4 gap-3 md:gap-8 w-full max-w-lg md:max-w-2xl px-2">
          <TimeBlock value={timeLeft.days} label="วัน" />
          <TimeBlock value={timeLeft.hours} label="ชั่วโมง" />
          <TimeBlock value={timeLeft.minutes} label="นาที" />
          <TimeBlock value={timeLeft.seconds} label="วินาที" />
        </div>

        {/* วันที่เป้าหมาย */}
        <div className="mt-12 bg-white/90 backdrop-blur px-8 py-4 rounded-full border border-gray-200 shadow-md">
          <p className="text-sm md:text-lg font-mali text-gray-500 text-center">
            เจอกันวันที่: <span className="text-gray-800 font-bold">{formattedDate} น.</span>
          </p>
        </div>
      </div>

    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-white shadow-lg border-b-4 border-gray-300 rounded-2xl w-full aspect-square flex items-center justify-center overflow-hidden mb-3 transition-transform hover:scale-105 duration-300">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 font-mono absolute"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.span className="text-xs md:text-lg font-mali text-gray-700 font-medium">{label}</motion.span>
    </div>
  );
}
