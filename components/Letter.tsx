'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-mali text-gray-800 mb-2">
            ถึง {name}
          </h1>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto" />
        </div>

        {/* Image */}
        {imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={`ภาพของ ${name}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Letter Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 md:p-10 shadow-lg">
          <div 
            className="font-mali text-lg md:text-xl leading-relaxed text-gray-700 whitespace-pre-wrap"
            style={{ lineHeight: '2' }}
          >
            {content}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            จดหมายนี้เขียนด้วยความรักและความทรงจำ
          </p>
          <p className="font-mali text-gray-600 mt-4 text-lg">
            ด้วยรักและคิดถึงเสมอ 💕
          </p>
        </div>
      </div>
    </div>
  );
}
