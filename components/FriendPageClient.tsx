'use client';

import { useState, useCallback, useEffect } from 'react';
import Countdown from '@/components/Countdown';
import PinPad from '@/components/PinPad';
import Letter from '@/components/Letter';
import { verifyPasscode, markAsViewed } from '@/app/actions/tracking';

interface FriendPageClientProps {
  slug: string;
  friendName: string;
  friendContent: string;
  friendImageUrl: string | null;
  isAlreadyViewed: boolean;
}

// Target date: Feb 20, 2026, 21:00 (GMT+7)
// GMT+7 means 21:00 GMT+7 = 14:00 UTC
const TARGET_DATE = new Date('2026-02-12T14:00:00Z');

type Phase = 'countdown' | 'auth' | 'reveal';

export default function FriendPageClient({
  slug,
  friendName,
  friendContent,
  friendImageUrl,
  isAlreadyViewed,
}: FriendPageClientProps) {
  const [phase, setPhase] = useState<Phase>('countdown');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if countdown is complete on mount
  useEffect(() => {
    const now = new Date();
    if (now >= TARGET_DATE) {
      setPhase('auth');
    }
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setPhase('auth');
  }, []);

  const handlePinSubmit = async (pin: string) => {
    setIsLoading(true);
    setError('');

    try {
      const isValid = await verifyPasscode(slug, pin);
      
      if (isValid) {
        // Mark as viewed if not already
        if (!isAlreadyViewed) {
          await markAsViewed(slug);
        }
        setPhase('reveal');
      } else {
        setError('รหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      console.error('Error verifying passcode:', err);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {phase === 'countdown' && (
        <Countdown
          targetDate={TARGET_DATE}
          onComplete={handleCountdownComplete}
        />
      )}
      
      {phase === 'auth' && (
        <PinPad
          onSubmit={handlePinSubmit}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      {phase === 'reveal' && (
        <Letter
          name={friendName}
          content={friendContent || 'ยังไม่มีเนื้อหาจดหมาย'}
          imageUrl={friendImageUrl}
        />
      )}
    </div>
  );
}
