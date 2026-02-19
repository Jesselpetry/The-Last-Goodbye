"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Countdown from "@/components/Countdown";
import PinPad from "@/components/PinPad";
import Letter from "@/components/Letter";
import { verifyPasscode, markAsViewed } from "@/app/actions/tracking";

interface FriendPageClientProps {
  slug: string;
  friendId?: string;
  friendName: string;
  friendContent: string;
  friendImageUrl?: string | null;
  friendImageUrls?: string[] | null;
  friendSpotifyUrl?: string | null;
  friendBgmUrl?: string | null;
  isAlreadyViewed: boolean;
  unlockDate?: string | null;
  timestamp?: string;
}

// Fallback target date: Feb 20, 2026, 21:00 (GMT+7) -> 14:00 UTC
const DEFAULT_TARGET_DATE = new Date("2026-02-20T14:00:00Z");

type Phase = "countdown" | "auth" | "reveal";

export default function FriendPageClient({
  slug,
  friendId,
  friendName,
  friendContent,
  friendImageUrl,
  friendImageUrls,
  friendSpotifyUrl,
  friendBgmUrl,
  isAlreadyViewed,
  unlockDate,
  timestamp,
}: FriendPageClientProps) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const targetDate = useMemo(
    () => (unlockDate ? new Date(unlockDate) : DEFAULT_TARGET_DATE),
    [unlockDate],
  );

  // Check if countdown is complete on mount
  useEffect(() => {
    const now = new Date();
    if (now >= targetDate) {
      setPhase("auth");
    }
  }, [targetDate]);

  const handleCountdownComplete = useCallback(() => {
    setPhase("auth");
  }, []);

  const handlePinSubmit = async (pin: string) => {
    setIsLoading(true);
    setError("");

    try {
      const isValid = await verifyPasscode(slug, pin);

      if (isValid) {
        // Mark as viewed if not already
        if (!isAlreadyViewed) {
          await markAsViewed(slug);
        }
        setPhase("reveal");
      } else {
        setError("รหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      console.error("Error verifying passcode:", err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {phase === "countdown" && (
        <Countdown
          targetDate={targetDate} // Fixed: Use the memoized targetDate
          onComplete={handleCountdownComplete} // Fixed: Use the defined handler
          recipientName={friendName} // Fixed: Use the friendName prop
        />
      )}

      {phase === "auth" && (
        <PinPad
          onSubmit={handlePinSubmit}
          isLoading={isLoading}
          error={error}
          title={`จดหมายถึง ${friendName}`}
          description="กรุณาใส่รหัสผ่าน 4 หลัก"
        />
      )}

      {phase === "reveal" && (
        <Letter
          friendId={friendId}
          name={friendName}
          content={friendContent || "ยังไม่มีเนื้อหาจดหมาย"}
          imageUrl={friendImageUrl}
          imageUrls={friendImageUrls}
          spotifyUrl={friendSpotifyUrl}
          bgmUrl={friendBgmUrl}
          timestamp={timestamp}
        />
      )}
    </div>
  );
}
