'use client';

import { useState, useEffect, useMemo } from 'react';

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
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

export default function Countdown({ targetDate, onComplete }: CountdownProps) {
  const initialTimeLeft = useMemo(() => calculateTimeLeft(targetDate), [targetDate]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTimeLeft);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
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

  if (isComplete) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl md:text-3xl font-light text-gray-600 mb-8 text-center">
        จดหมายนี้จะเปิดเมื่อ...
      </h1>
      <div className="flex gap-4 md:gap-8">
        <TimeBlock value={timeLeft.days} label="วัน" />
        <TimeBlock value={timeLeft.hours} label="ชั่วโมง" />
        <TimeBlock value={timeLeft.minutes} label="นาที" />
        <TimeBlock value={timeLeft.seconds} label="วินาที" />
      </div>
      <p className="mt-8 text-sm text-gray-400">
        20 กุมภาพันธ์ 2026 เวลา 21:00 น.
      </p>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[100px]">
        <span className="text-3xl md:text-5xl font-mono font-bold text-gray-800">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs md:text-sm text-gray-500">{label}</span>
    </div>
  );
}
