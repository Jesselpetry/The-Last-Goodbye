'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PinPad from '@/components/PinPad';
import { verifyAdmin } from '@/app/actions/admin';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePinSubmit = async (pin: string) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await verifyAdmin(pin);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'รหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
        console.error(err);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PinPad
      onSubmit={handlePinSubmit}
      isLoading={isLoading}
      error={error}
      title="เข้าสู่ระบบ Admin"
      description="กรุณาใส่ PIN เพื่อดำเนินการต่อ"
    />
  );
}
