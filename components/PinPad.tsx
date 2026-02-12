'use client';

import { useState } from 'react';
import { Lock, Delete, Eraser } from 'lucide-react';

interface PinPadProps {
  onSubmit: (pin: string) => void;
  isLoading?: boolean;
  error?: string;
  title?: string;
  description?: string;
}

export default function PinPad({
  onSubmit,
  isLoading,
  error,
  title = "กรุณาใส่รหัสผ่าน",
  description = "ใส่รหัส 4 หลักเพื่อเข้าถึง"
}: PinPadProps) {
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
      <div className="mb-6 bg-gray-100 p-4 rounded-full">
        <Lock className="w-8 h-8 text-gray-600" />
      </div>
      <h1 className="text-xl md:text-2xl font-medium text-gray-800 mb-2 text-center">
        {title}
      </h1>
      <p className="text-sm text-gray-500 mb-8">{description}</p>
      
      {/* Pin Display */}
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
              pin.length > index
                ? 'bg-gray-800 border-gray-800'
                : 'bg-white border-gray-200'
            }`}
          >
            {pin.length > index && (
              <div className="w-3 h-3 bg-white rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mb-6 animate-pulse bg-red-50 px-4 py-2 rounded-lg">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          กำลังตรวจสอบ...
        </div>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit.toString())}
            disabled={isLoading || pin.length >= 4}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm border border-gray-100 text-2xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleClear}
          disabled={isLoading || pin.length === 0}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
        >
          <Eraser className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleDigit('0')}
          disabled={isLoading || pin.length >= 4}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm border border-gray-100 text-2xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading || pin.length === 0}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
