import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { logVisit, getFriendBySlug } from '@/app/actions/tracking';
import FriendPageClient from '@/components/FriendPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FriendPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Get friend data
  const friend = await getFriendBySlug(slug);
  
  if (!friend) {
    notFound();
  }

  // Get headers for logging
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             headerList.get('x-real-ip') || 
             'unknown';
  const userAgent = headerList.get('user-agent') || 'unknown';

  // Fire & Forget - Log the visit without awaiting
  logVisit({ slug, ip, userAgent }).catch(console.error);

  return (
    <FriendPageClient
      slug={slug}
      friendName={friend.name}
      friendContent={friend.content || ''}
      friendImageUrl={friend.image_url}
      isAlreadyViewed={friend.is_viewed}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const friend = await getFriendBySlug(slug);
  
  if (!friend) {
    return {
      title: 'ไม่พบหน้านี้ - The Last Goodbye',
    };
  }

  return {
    title: `จดหมายถึง ${friend.name} - The Last Goodbye`,
    description: 'จดหมายสำหรับคุณโดยเฉพาะ',
  };
}
