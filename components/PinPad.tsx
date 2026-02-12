'use client';

import { useState } from 'react';

interface PinPadProps {
  onSubmit: (pin: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function PinPad({ onSubmit, isLoading, error }: PinPadProps) {
  const [pin, setPin] = useState<string>('');

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        onSubmit(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-xl md:text-2xl font-light text-gray-600 mb-2 text-center">
        กรุณาใส่รหัสผ่าน
      </h1>
      <p className="text-sm text-gray-400 mb-8">ใส่รหัส 4 หลักเพื่อเปิดจดหมาย</p>
      
      {/* Pin Display */}
      <div className="flex gap-3 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
              pin.length > index
                ? 'bg-gray-800 border-gray-800'
                : 'bg-white border-gray-300'
            }`}
          >
            {pin.length > index && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mb-4 animate-pulse">{error}</p>
      )}

      {/* Loading State */}
      {isLoading && (
        <p className="text-gray-500 text-sm mb-4">กำลังตรวจสอบ...</p>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit.toString())}
            disabled={isLoading || pin.length >= 4}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-md text-2xl font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 text-sm font-medium text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-all disabled:opacity-50"
        >
          ล้าง
        </button>
        <button
          onClick={() => handleDigit('0')}
          disabled={isLoading || pin.length >= 4}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-md text-2xl font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all disabled:opacity-50"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading || pin.length === 0}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 text-sm font-medium text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-all disabled:opacity-50"
        >
          ลบ
        </button>
      </div>
    </div>
  );
}
